import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';

test('source checkout stays private; npm publication uses the staged distribution', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  expect(pkg.private).toBe(true);
  expect(pkg.scripts.publish).toBeUndefined();
  expect(pkg.scripts['package:npm']).toBe('bun run scripts/release/npm.ts');
});
