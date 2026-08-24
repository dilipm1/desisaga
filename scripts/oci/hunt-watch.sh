#!/usr/bin/env bash
# hunt-watch.sh — status + restart instructions + live tail of the ARM hunt.
# Opened by the Omarchy bar widget click (dilipm.hunt).
set -uo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "══════════════ desisaga · Oracle ARM Hunt ══════════════"
"$DIR/hunt-status.sh"
echo
echo "Controls:"
echo "  restart → $DIR/hunt-restart.sh"
echo "           (or) systemctl --user restart desisaga-hunt"
echo "  stop    → systemctl --user stop desisaga-hunt"
echo "  status  → $DIR/hunt-status.sh"
echo "══════════════ live log (Ctrl+C or close to exit) ══════════════"
tail -n 25 -f "$DIR/hunt.log"
