import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';

test('private package never enables publishing', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

  expect(pkg.private).toBe(true);
  expect(pkg.scripts.publish).toBeUndefined();
});
