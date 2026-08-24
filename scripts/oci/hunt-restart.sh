#!/usr/bin/env bash
# hunt-restart.sh — safe restart of the ARM hunt (no pkill-grep footguns).
# Prefers the systemd user service; falls back to setsid+nohup.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG="${SCRIPT_DIR}/hunt.log"

# If we already won, restarting is a no-op
if [ -s "${SCRIPT_DIR}/arm-instance-ip.txt" ]; then
  echo "Instance already won: $(cat "${SCRIPT_DIR}/arm-instance-ip.txt") — no restart needed."
  exit 0
fi

if systemctl --user list-unit-files desisaga-hunt.service 2>/dev/null | grep -q desisaga-hunt; then
  systemctl --user restart desisaga-hunt.service
  echo "Restarted via systemd (auto-heal: crash → auto-restart, reboot → starts at login)."
else
  # Belt & braces fallback: kill any stragglers by PID file, relaunch detached
  if [ -f "${SCRIPT_DIR}/hunt.pid" ]; then
    OLD=$(cat "${SCRIPT_DIR}/hunt.pid")
    kill "$OLD" 2>/dev/null && sleep 2
  fi
  export PATH="$HOME/.local/bin:$PATH"
  (setsid nohup "${SCRIPT_DIR}/grab-arm.sh" >> "$LOG" 2>&1 &)
  echo "Restarted via nohup (systemd unit not found)."
fi

sleep 3
exec "${SCRIPT_DIR}/hunt-status.sh"
