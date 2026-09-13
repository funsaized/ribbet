#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist/install
./node_modules/.bin/tsc -p tsconfig.json
bun build extension.ts --target=node --format=esm --outfile=dist/install/extension.mjs
bun build main.ts --target=node --format=esm --outfile=dist/install/main.mjs
node dist/install/main.mjs check dist/install
bun build main.ts --compile --outfile=dist/install/ribbit-bun
# An installed Node launcher declares its runtime requirement explicitly.
cat > dist/install/ribbit-node <<'LAUNCHER'
#!/usr/bin/env sh
exec node "$(dirname "$0")/main.mjs" "$@"
LAUNCHER
chmod +x dist/install/ribbit-node
