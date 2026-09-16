import assert from 'node:assert/strict';
import { resolve } from 'node:path';
const binary = resolve('dist/ribbit');
for (const [name, args, input, expected] of [
  ['first lines', ['take', '2', '--input', 'lines', '--output', 'jsonl'], 'one\ntwo\nthree\n', '"one"\n"two"\n'],
  [
    'typed flow',
    ['flow', 'run', '--input', 'jsonl', '--output', 'jsonl', '--', 'select', 'name', '::', 'take', '1'],
    '{"name":"Ada"}\n',
    '{"name":"Ada"}\n',
  ],
  [
    'JSON application envelope',
    ['render', '--as', 'json', '--input', 'jsonl'],
    '{"id":"app","value":7,"annotations":{}}\n',
    '[{"id":"app","value":7,"annotations":{}}]\n',
  ],
] as const) {
  const p = Bun.spawn([binary, ...args], { stdin: new Blob([input]), stdout: 'pipe', stderr: 'pipe' });
  const [out, err, code] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text(), p.exited]);
  assert.equal(code, 0, err);
  assert.equal(out, expected, name);
}
const help = Bun.spawn([binary, 'commands', 'list', '--json'], { stdout: 'pipe' });
assert.equal(JSON.parse(await new Response(help.stdout).text()).commands.length, 22);
assert.equal(await help.exited, 0);
console.log('Packaged deterministic documentation examples passed; live examples remain separate');
