'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

async function install(root = __dirname, options = {}) {
  const platform = process.platform === 'win32' ? 'windows' : process.platform;
  const target = `${platform}-${process.arch}`;
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'platforms.json'), 'utf8'));
  const asset = manifest.targets[target];

  if (!asset) throw new Error(`Unsupported platform ${target}; see https://github.com/funsaized/ribbet/releases`);
  const executable = platform === 'windows' ? 'ribbit.exe' : 'ribbit';
  const installed = path.join(root, 'native');
  const binary = path.join(installed, executable);

  try {
    const digest = crypto
      .createHash('sha256')
      .update(await fs.readFile(binary))
      .digest('hex');

    if (digest === asset.binarySha256) return binary;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const name = `ribbit-${manifest.version}-${target}`;
  const url = `https://github.com/funsaized/ribbet/releases/download/v${manifest.version}/${name}.tar.gz`;
  const temporary = await fs.mkdtemp(path.join(root, '.ribbit-install-'));

  try {
    console.error(`ribbit: installing ${target} from GitHub Releases`);
    const response = await (options.fetch || globalThis.fetch)(url, { signal: AbortSignal.timeout(120000) });

    if (!response.ok) throw new Error(`Release download failed (HTTP ${response.status})`);
    const bytes = Buffer.from(await response.arrayBuffer());

    if (crypto.createHash('sha256').update(bytes).digest('hex') !== asset.sha256)
      throw new Error('Release checksum mismatch; installation refused');
    const archive = path.join(temporary, 'release.tar.gz');

    await fs.writeFile(archive, bytes);
    const unpack = spawnSync('tar', ['-xzf', archive, '-C', temporary, `${name}/${executable}`, `${name}/lib`], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 120000,
    });

    if (unpack.error || unpack.status !== 0) throw new Error('Cannot extract release archive; install tar and retry');
    const extracted = path.join(temporary, name);
    const digest = crypto
      .createHash('sha256')
      .update(await fs.readFile(path.join(extracted, executable)))
      .digest('hex');

    if (digest !== asset.binarySha256) throw new Error('Native executable checksum mismatch');
    if (process.platform !== 'win32') await fs.chmod(path.join(extracted, executable), 0o755);
    await fs.rm(installed, { recursive: true, force: true, maxRetries: 5 });
    await fs.rename(extracted, installed);

    return binary;
  } finally {
    await fs.rm(temporary, { recursive: true, force: true, maxRetries: 5 });
  }
}

module.exports = { install };
if (require.main === module) {
  install().catch((error) => {
    console.error(`ribbit: ${error.message}. Retry with npm rebuild or use the native GitHub release archive.`);
    process.exitCode = 1;
  });
}
