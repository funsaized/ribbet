#!/usr/bin/env bash
# Private runner entry point; never uploads artifacts or publishes packages.
set -euo pipefail
npm ci --ignore-scripts --no-audit --no-fund
npm run check
npm run test:unit
npm run test:cli
npm run test:consumer
npm run test:conformance
npm run build
npm run package:smoke
npm run test:docs
