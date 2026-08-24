#!/usr/bin/env bash
# grab-arm.sh — relentless, polite retry loop for an Oracle Cloud Always Free A1 (ARM) instance.
#
# Strategy:
#   1. Bootstraps VCN + subnet + internet access if the tenancy has none.
#   2. Cycles through every Availability Domain in the home region.
#   3. Retries "Out of host capacity" forever with jittered backoff (never hammers).
#   4. On success: waits for RUNNING, prints public IP, exits 0.
#
# Usage (non-blocking):
#   nohup scripts/oci/grab-arm.sh > /tmp/opencode/arm-hunt.log 2>&1 &
#
# Env overrides:
#   OCPUS=2 MEMORY_GB=12 RETRY_SECONDS=300 SHAPE=VM.Standard.A1.Flex PROFILE=DEFAULT
set -uo pipefail

# 2026-08-24: Oracle cut Free-tier A1 limits to 2 OCPU / 12 GB — these ARE the max now.
OCPUS="${OCPUS:-2}"
MEMORY_GB="${MEMORY_GB:-12}"
SHAPE="${SHAPE:-VM.Standard.A1.Flex}"
RETRY_SECONDS="${RETRY_SECONDS:-420}"         # 7 min between full rounds (429-safe)
PROFILE="${PROFILE:-DEFAULT}"
OS_NAME="Canonical Ubuntu"
OS_VER="24.04"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="${SCRIPT_DIR}/hunt.pid"
IP_FILE="${SCRIPT_DIR}/arm-instance-ip.txt"
CLOUD_INIT="${SCRIPT_DIR}/cloud-init.yaml"

log() { echo "[$(date '+%F %T')] $*"; }

# PID file for status/restart tooling (never pkill-grep again)
echo $$ > "$PID_FILE"
trap 'rm -f "$PID_FILE"' EXIT

OCI="oci --profile $PROFILE"

# Free-tier tenancy has no child compartments — the root (tenancy) OCID is the compartment.
COMPARTMENT_OCID=$(awk -F= '/^tenancy=/{print $2}' "${HOME}/.oci/config" | tr -d ' ')
if [ -z "${COMPARTMENT_OCID}" ]; then
  log "FATAL: could not resolve tenancy OCID from ~/.oci/config"; exit 1
fi
log "Compartment: ${COMPARTMENT_OCID}"

REGION=$($OCI iam region-subscription list --query 'data[0]."region-name"' --raw-output)
log "Home region: ${REGION}"
export OCI_CLI_REGION="${REGION}"   # force all calls into the home region

ADS=$($OCI iam availability-domain list --all | python3 -c \
  "import json,sys; print('\n'.join(ad['name'] for ad in json.load(sys.stdin)['data']))")
readarray -t AD_LIST <<< "$ADS"
log "Availability domains: ${AD_LIST[*]}"

# ── Pick latest Ubuntu 24.04 ARM image ────────────────────────────────────────
IMAGE_OCID=$($OCI compute image list --compartment-id "$COMPARTMENT_OCID" \
  --operating-system "$OS_NAME" --operating-system-version "$OS_VER" \
  --shape "$SHAPE" --sort-by TIMECREATED --sort-order DESC --all \
  --query 'data[0].id' --raw-output)
case "${IMAGE_OCID}" in
  ocid1.image.*) log "Image: ${IMAGE_OCID}" ;;
  *)
    log "FATAL: no Ubuntu ${OS_VER} image found for ${SHAPE} (got: ${IMAGE_OCID:-<empty>})"
    exit 1 ;;
esac

# ── Bootstrap networking (find-or-create) ────────────────────────────────────
SUBNET_OCID=$($OCI network subnet list --compartment-id "$COMPARTMENT_OCID" --all \
  --query 'data[0].id' --raw-output 2>/dev/null || true)

if [ -z "${SUBNET_OCID}" ] || [ "${SUBNET_OCID}" = "null" ]; then
  log "No subnet found — creating VCN stack…"
  VCN_ID=$($OCI network vcn create --compartment-id "$COMPARTMENT_OCID" \
    --display-name desisaga-vcn --cidr-blocks '["10.0.0.0/16"]' --dns-label desisagavcn \
    --query 'data.id' --raw-output)
  IGW_ID=$($OCI network internet-gateway create --compartment-id "$COMPARTMENT_OCID" \
    --vcn-id "$VCN_ID" --display-name desisaga-igw --is-enabled true \
    --query 'data.id' --raw-output)
  # Update the VCN's DEFAULT route table (not the VCN OCID!) with the internet route.
  RT_ID=$($OCI network vcn get --vcn-id "$VCN_ID" \
    --query 'data."default-route-table-id"' --raw-output)
  $OCI network route-table update --rt-id "$RT_ID" \
    --route-rules "[{\"destination\":\"0.0.0.0/0\",\"destinationType\":\"CIDR_BLOCK\",\"networkEntityId\":\"${IGW_ID}\"}]" > /dev/null
  SUBNET_OCID=$($OCI network subnet create --compartment-id "$COMPARTMENT_OCID" \
    --vcn-id "$VCN_ID" --display-name desisaga-public --cidr-block 10.0.1.0/24 \
    --query 'data.id' --raw-output)
  log "Created VCN ${VCN_ID} + subnet ${SUBNET_OCID} + IGW + default route"
else
  log "Reusing existing subnet ${SUBNET_OCID}"
  # Guard against the "brick instance" trap: subnet must have a 0.0.0.0/0 route.
  RT_CHECK=$($OCI network subnet get --subnet-id "$SUBNET_OCID" \
    --query 'data."route-table-id"' --raw-output 2>/dev/null || true)
  if [ -n "${RT_CHECK}" ] && [ "${RT_CHECK}" != "null" ]; then
    HAS_ROUTE=$($OCI network route-table get --rt-id "$RT_CHECK" \
      --query 'length(data."route-rules"[?destination==`0.0.0.0/0`])' --raw-output 2>/dev/null || echo 0)
    [ "${HAS_ROUTE:-0}" -ge 1 ] 2>/dev/null || log "⚠️  WARNING: subnet route table has no 0.0.0.0/0 route — instance would be unreachable!"
  fi
fi

SSH_KEY_PATH="${HOME}/.ssh/id_ed25519.pub"

# ── The hunt ──────────────────────────────────────────────────────────────────
ROUND=0
while true; do
  ROUND=$((ROUND + 1))
  for AD in "${AD_LIST[@]}"; do
    # Skip an already-successful hunt
    EXISTING=$($OCI compute instance list --compartment-id "$COMPARTMENT_OCID" --all \
      --lifecycle-state RUNNING \
      --query "data[?\"availability-domain\"=='${AD}' && \"display-name\"=='desisaga-arm'].id" \
      --raw-output 2>/dev/null || true)
    if [ -n "${EXISTING}" ] && [ "${EXISTING}" != "[]" ] && [ "${EXISTING}" != "" ]; then
      log "Instance already running in ${AD}: ${EXISTING}"
      exit 0
    fi

    log "Round ${ROUND} · trying ${AD} (${OCPUS} OCPU / ${MEMORY_GB} GB)…"
    OUT=$(mktemp); ERR=$(mktemp)
    LAUNCH_ARGS=(--availability-domain "$AD" \
        --compartment-id "$COMPARTMENT_OCID" \
        --shape "$SHAPE" \
        --shape-config "{\"ocpus\":${OCPUS},\"memoryInGBs\":${MEMORY_GB}}" \
        --image-id "$IMAGE_OCID" \
        --subnet-id "$SUBNET_OCID" \
        --assign-public-ip true \
        --display-name desisaga-arm \
        --ssh-authorized-keys-file "$SSH_KEY_PATH")
    # cloud-init opens OS-level firewall at first boot (anti-brick)
    if [ -f "$CLOUD_INIT" ]; then
      LAUNCH_ARGS+=(--user-data-file "$CLOUD_INIT")
    fi
    if $OCI compute instance launch "${LAUNCH_ARGS[@]}" > "$OUT" 2>"$ERR"; then
      log "🎉 LAUNCHED in ${AD}!"
      # Prefer the OCID straight from the launch response (listing can lag behind).
      INSTANCE_OCID=$(python3 -c \
        "import json; d=json.load(open('${OUT}')); print(d.get('id') or d['data']['id'])" 2>/dev/null || true)
      if [ -z "${INSTANCE_OCID}" ]; then
        INSTANCE_OCID=$($OCI compute instance list --compartment-id "$COMPARTMENT_OCID" \
          --display-name desisaga-arm --all \
          --query 'data[0].id' --raw-output)
      fi
      log "Instance: ${INSTANCE_OCID}"
      log "Waiting for RUNNING state…"
      for _ in 1 2 3 4 5 6 7 8 9 10 11 12; do
        sleep 15
        STATE=$($OCI compute instance get --instance-id "$INSTANCE_OCID" \
          --query 'data."lifecycle-state"' --raw-output 2>/dev/null || echo "?")
        [ "$STATE" = "RUNNING" ] && break
        log "  state: ${STATE}…"
      done
      PUBLIC_IP=""
      for _ in 1 2 3 4 5; do
        PUBLIC_IP=$($OCI compute instance list-vnics --compartment-id "$COMPARTMENT_OCID" \
          --instance-id "$INSTANCE_OCID" --query 'data[0]."public-ip"' --raw-output 2>/dev/null || true)
        [ -n "${PUBLIC_IP}" ] && [ "${PUBLIC_IP}" != "null" ] && break
        log "  waiting for public IP…"; sleep 10
      done
      log "PUBLIC IP: ${PUBLIC_IP}"
      echo "$PUBLIC_IP" > "$IP_FILE"
      # Reachability probe — never celebrate a bricked instance
      SSH_OK=0
      for _ in 1 2 3 4 5 6 7 8 9 10; do
        if timeout 5 bash -c "exec 3<>/dev/tcp/${PUBLIC_IP}/22" 2>/dev/null; then SSH_OK=1; break; fi
        log "  probing SSH on ${PUBLIC_IP}:22 (attempt ${_})…"; sleep 15
      done
      if [ "$SSH_OK" = "1" ]; then
        log "✅ SSH reachable — instance is genuinely alive."
        SSH_MSG="SSH OK — ready for kamal setup"
      else
        log "⚠️  SSH not reachable yet (cloud-init may still be running) — verify manually."
        SSH_MSG="SSH not confirmed — check iptables/cloud-init"
      fi
      command -v notify-send >/dev/null 2>&1 && \
        notify-send -u critical "🎉 desisaga ARM instance UP" "IP: ${PUBLIC_IP} — ${SSH_MSG}"
      rm -f "$ERR" "$OUT"
      exit 0
    fi

    if grep -qi "out of host capacity\|notavailable\|internal server error" "$ERR"; then
      log "  ${AD}: no ARM capacity yet."
    elif grep -qi "TooManyRequests\|429" "$ERR"; then
      log "  ${AD}: throttled by Oracle (429) — backing off."
    elif grep -qi "LimitExceeded\|QuotaExceeded\|NotAuthorizedOrNotFound" "$ERR"; then
      log "  ${AD}: HARD BLOCK — $(grep -oi 'Service limit[^.]*\|Out of host capacity[^.]*\|NotAuthorized[^.]*' "$ERR" | head -1)"
      grep -i "limit\|quota" "$ERR" | head -2 | sed 's/^/      /'
    else
      log "  ${AD}: unexpected error — $(grep -o '"code": "[^"]*"\|"message": "[^"]*"\|"status": [0-9]*' "$ERR" | tr '\n' ' ')"
    fi
    rm -f "$ERR" "$OUT"
    # Anti-throttle: small gap between AD attempts within a round
    if [ "$AD" != "${AD_LIST[-1]}" ]; then
      AD_GAP=$((30 + RANDOM % 30))
      sleep "$AD_GAP"
    fi
  done

  # Anti-block: every 8th round takes a long human-like break (10–20 min)
  if [ $((ROUND % 8)) -eq 0 ]; then
    LONG_PAUSE=$((600 + RANDOM % 600))
    log "Humanizing pause: ${LONG_PAUSE}s (round ${ROUND})…"
    sleep "$LONG_PAUSE"
  fi

  SLEEP=$((RETRY_SECONDS + RANDOM % 90))   # jitter so we never look like abuse
  log "Sleeping ${SLEEP}s before round $((ROUND + 1))…"
  sleep "$SLEEP"
done
