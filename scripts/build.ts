import { mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
const proc = Bun.spawn(['bun', 'build', 'src/cli/main.ts', '--compile', '--outfile', 'dist/ribbit'], { stdout: 'inherit', stderr: 'inherit' });
if (await proc.exited !== 0) process.exit(1);
