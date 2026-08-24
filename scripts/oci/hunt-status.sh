#!/usr/bin/env bash
# hunt-status.sh — single-line JSON status of the ARM hunt. Read by the Omarchy
# bar plugin (dilipm.hunt) and safe to run by hand.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="${SCRIPT_DIR}/hunt.log"
PID_FILE="${SCRIPT_DIR}/hunt.pid"
IP_FILE="${SCRIPT_DIR}/arm-instance-ip.txt"

STATE="stopped"
PID=""
ROUNDS=0
DENIALS=0
THROTTLES=0
IP=""
SSH_OK=false
LAST_AGE=-1
ETA=-1

# rounds = highest "Round N" seen (fresh log counts)
if [ -f "$LOG" ]; then
  R=$(grep -oE "Round [0-9]+" "$LOG" | tail -1 | awk '{print $2}')
  [ -n "${R:-}" ] && ROUNDS=$((10#$R))
  DENIALS=$(grep -c "no ARM capacity yet" "$LOG" || true)
  THROTTLES=$(grep -c "throttled by Oracle" "$LOG" || true)
  LAST_AGE=$(( $(date +%s) - $(stat -c %Y "$LOG") ))
  # ETA from the last "Sleeping Ns" line
  SLEEPING=$(grep -oE "Sleeping [0-9]+s" "$LOG" | tail -1 | grep -oE "[0-9]+")
  if [ -n "${SLEEPING:-}" ]; then
    ETA=$(( 10#$SLEEPING - LAST_AGE )); [ "$ETA" -lt 0 ] && ETA=0
  fi
fi

# live process?
if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  STATE="hunting"
  PID=$(cat "$PID_FILE")
fi

# victory?
if [ -f "$IP_FILE" ]; then
  CANDIDATE=$(tr -d '[:space:]' < "$IP_FILE")
  if [ -n "$CANDIDATE" ]; then
    IP="$CANDIDATE"
    STATE="won"
    # hunt exits after winning; keep state even if PID gone
    if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null && grep -q "SSH reachable" "$LOG"; then
      SSH_OK=true
    elif grep -q "SSH reachable" "$LOG"; then
      SSH_OK=true
    fi
  fi
fi

printf '{"state":"%s","pid":%s,"rounds":%d,"denials":%d,"throttles":%d,"last_age_sec":%d,"eta_sec":%d,"ip":"%s","ssh_ok":%s}\n' \
  "$STATE" "${PID:-null}" "$ROUNDS" "$DENIALS" "$THROTTLES" "$LAST_AGE" "$ETA" "$IP" "$SSH_OK"
