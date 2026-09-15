import { test, expect } from 'bun:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadDotenv } from '../../src/config/index.ts';

test('project .env supplies variables, never overrides the real environment, and tolerates absence', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ribbit-dotenv-'));
  const file = join(dir, '.env');

  delete process.env['RIBBIT_DOTENV_NEW'];
  writeFileSync(file, 'RIBBIT_DOTENV_NEW=from-file\n');
  loadDotenv(file);
  expect(process.env['RIBBIT_DOTENV_NEW']).toBe('from-file');

  process.env['RIBBIT_DOTENV_EXISTING'] = 'from-real-env';
  writeFileSync(file, 'RIBBIT_DOTENV_EXISTING=from-file\n');
  loadDotenv(file);
  expect(process.env['RIBBIT_DOTENV_EXISTING']).toBe('from-real-env');

  expect(() => loadDotenv(join(dir, 'missing.env'))).not.toThrow();

  rmSync(dir, { recursive: true, force: true });
  delete process.env['RIBBIT_DOTENV_NEW'];
  delete process.env['RIBBIT_DOTENV_EXISTING'];
});
