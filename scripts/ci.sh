#!/usr/bin/env bash
# Compatibility entry point. Native CI uses the portable TypeScript runner.
set -euo pipefail
exec bun run scripts/verify.ts
