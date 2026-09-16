import { test, expect } from 'bun:test';

test('development help and usage keep diagnostic channels separate', async () => {
  const p = Bun.spawn(['bun', 'src/cli/main.ts', 'unknown'], { stdout: 'pipe', stderr: 'pipe' });

  expect(await p.exited).toBe(2);
  expect(await new Response(p.stdout).text()).toBe('');
  expect(await new Response(p.stderr).text()).toContain('Unknown command or definition');
});
