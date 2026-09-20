import { mkdir, readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';

export const targets = ['linux-x64', 'linux-arm64', 'darwin-x64', 'darwin-arm64', 'windows-x64', 'windows-arm64'];

export async function prepareNpm(name: string, artifacts: string, stage: string, selected = targets) {
  if (!/^@[a-z0-9_.-]+\/ribbit$/.test(name)) throw new Error('Use the authorized npm account scope: @ACCOUNT/ribbit');
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const files = await readdir(artifacts, { recursive: true });
  const manifest: any = { version: pkg.version, targets: {} };

  for (const target of selected) {
    const filename = `ribbit-${pkg.version}-${target}.tar.gz`;
    const candidates = files.filter((file) => file.replaceAll('\\', '/').split('/').at(-1) === filename);

    if (candidates.length !== 1) throw new Error(`Expected exactly one verified archive for ${target}`);
    const archive = join(artifacts, candidates[0]);
    const digest = createHash('sha256')
      .update(await readFile(archive))
      .digest('hex');

    if ((await readFile(`${archive}.sha256`, 'utf8')).split(' ')[0] !== digest)
      throw new Error(`Checksum mismatch: ${target}`);
    const child = Bun.spawn(['tar', '-xOf', archive, `${filename.slice(0, -7)}/BUILD.json`], {
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const [out, err, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);

    if (code !== 0) throw new Error(err);
    const metadata = JSON.parse(out);

    if (metadata.version !== pkg.version || metadata.target !== target)
      throw new Error(`Wrong archive metadata: ${target}`);
    if (manifest.revision && manifest.revision !== metadata.revision)
      throw new Error('Archives have different revisions');
    manifest.revision = metadata.revision;
    manifest.targets[target] = { sha256: digest, binarySha256: metadata.binarySha256 };
  }
  await rm(stage, { recursive: true, force: true });
  await mkdir(stage, { recursive: true });
  for (const file of ['install.cjs', 'bin.cjs']) await cp(`npm/${file}`, join(stage, file));
  await cp('LICENSE', join(stage, 'LICENSE'));
  await writeFile(join(stage, 'platforms.json'), JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(
    join(stage, 'package.json'),
    JSON.stringify(
      {
        name,
        version: pkg.version,
        description: pkg.description,
        license: pkg.license,
        author: pkg.author,
        repository: pkg.repository,
        homepage: pkg.homepage,
        bugs: pkg.bugs,
        engines: { node: '>=20' },
        bin: { ribbit: 'bin.cjs' },
        files: ['bin.cjs', 'install.cjs', 'platforms.json', 'LICENSE', 'README.md'],
        scripts: { postinstall: 'node install.cjs' },
        publishConfig: { access: 'public', tag: 'alpha', registry: 'https://registry.npmjs.org/' },
      },
      null,
      2,
    ) + '\n',
  );
  await writeFile(
    join(stage, 'README.md'),
    `# Ribbit\n\nComposable semantic shell commands for local models, stronger models, and agent harnesses.\n\n\`npm install -g ${name}@alpha\`\n\nRun \`ribbit --help\`. Requires Node.js >=20 and tar. Installation downloads the matching native archive from [GitHub Releases](https://github.com/funsaized/ribbet/releases/tag/v${pkg.version}), verifies the SHA-256 pinned in this package, and keeps the executable beside its extension support files. No model weights are downloaded. With lifecycle scripts disabled, the first invocation performs installation.\n\nNative targets: Linux glibc, macOS, and Windows on x64/ARM64. Interactive picking additionally requires fzf >=0.74.3; Windows console interaction remains unverified.\n\nThis is an experimental alpha. See the [documentation](https://github.com/funsaized/ribbet#readme), [model evidence](https://github.com/funsaized/ribbet/blob/main/docs/models.md), and [security policy](https://github.com/funsaized/ribbet/security/policy). Uninstall with \`npm uninstall -g ${name}\`; user configuration and installed extensions are preserved.\n`,
  );

  return manifest;
}

if (import.meta.main) {
  const [name, artifacts = 'dist/releases'] = process.argv.slice(2);

  if (!name) throw new Error('Usage: npm run package:npm -- @ACCOUNT/ribbit PATH_TO_NATIVE_ARTIFACTS');
  await prepareNpm(name, resolve(artifacts), resolve('dist/npm'));
  const child = Bun.spawn(['npm', 'pack', '--ignore-scripts', '--pack-destination', resolve('dist/releases')], {
    cwd: resolve('dist/npm'),
    stdout: 'inherit',
    stderr: 'inherit',
  });

  if ((await child.exited) !== 0) process.exit(1);
}
