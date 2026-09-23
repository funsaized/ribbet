import { spawn } from 'bun';

const commands = [
  ['install', '--frozen-lockfile', '--ignore-scripts'],
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
  const child = spawn(['bun', ...args], { stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' });
  const code = await child.exited;

  if (code !== 0) process.exit(code);
}
