import { spawn } from 'bun';
const commands = [
  ['ci', '--ignore-scripts', '--no-audit', '--no-fund'],
  ...[
    'check',
    'lint',
    'format:check',
    'test:unit',
    'test:cli',
    'test:consumer',
    'test:conformance',
    'build',
    'package:smoke',
    'test:release',
    'test:docs',
  ].map((name) => ['run', name]),
];

for (const args of commands) {
  const child = spawn(['npm', ...args], { stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' });
  const code = await child.exited;

  if (code !== 0) process.exit(code);
}
