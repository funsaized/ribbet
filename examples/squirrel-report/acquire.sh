#!/usr/bin/env bash
set -euo pipefail
# Fetch ordered pages; a subsequent update can change rows between pages. Freeze the result before analysis.
out=${1:?usage: acquire.sh OUTPUT.json}
tmp=$(mktemp)
part=$(mktemp)
next=$(mktemp)
trap 'rm -f "$tmp" "$part" "$next"' EXIT
printf '[]' > "$tmp"
for offset in 0 1000 2000 3000 4000 5000; do
  curl --fail --silent --show-error --max-time 30 --max-filesize 4194304 --get 'https://data.cityofnewyork.us/resource/vfnx-vebw.json' \
    --data-urlencode '$order=:id' --data-urlencode '$limit=1000' --data-urlencode "\$offset=$offset" > "$part"
  if (( $(wc -c < "$part") > 4194304 || $(wc -c < "$tmp") > 16777216 )); then
    printf 'Snapshot exceeds acquisition byte limit\n' >&2
    exit 6
  fi
  count=$(jq 'length' "$part")
  jq -s '.[0] + .[1]' "$tmp" "$part" > "$next"
  mv "$next" "$tmp"
  if (( count < 1000 )); then
    mv "$tmp" "$out"
    if command -v sha256sum >/dev/null; then sha256sum "$out"; else shasum -a 256 "$out"; fi
    exit 0
  fi
done
printf 'Dataset exceeded six pages; no complete snapshot saved\n' >&2
exit 6
