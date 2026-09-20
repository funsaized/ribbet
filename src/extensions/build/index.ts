import { pathToFileURL } from 'node:url';
import { readFile, mkdtemp, rm, realpath } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { manifest, type Manifest } from '../../sdk/manifest/index.ts';
import { RibbitError } from '../../engine/records/index.ts';
import { sourceDigest, activate } from '../install/index.ts';

declare const RIBBIT_COMPILED: boolean;

const root =
  process.env.RIBBIT_SDK_HOME ??
  (typeof RIBBIT_COMPILED !== 'undefined' && RIBBIT_COMPILED
    ? resolve(dirname(process.execPath), 'lib')
    : resolve(import.meta.dir, '../../..'));

export async function checkExtension(source: string): Promise<{ manifest: Manifest; code: Uint8Array }> {
  source = await realpath(source);
  const entry = join(source, 'index.ts');
  const ts: typeof import('typescript') = await import(
    pathToFileURL(join(root, 'node_modules/typescript/lib/typescript.js')).href
  );
  const options: import('typescript').CompilerOptions = {
    strict: true,
    noEmit: true,
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    skipLibCheck: true,
    types: ['node', 'bun'],
    typeRoots: [join(root, 'node_modules/@types')],
    paths: { '@ribbit/sdk': [join(root, 'src/sdk/index.ts')], zod: [join(root, 'node_modules/zod/index.d.ts')] },
  };
  const host = ts.createCompilerHost(options);

  host.getDefaultLibFileName = () => join(root, 'node_modules/typescript/lib/lib.es2023.full.d.ts');
  const program = ts.createProgram([entry], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length)
    throw new RibbitError(
      2,
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => source,
        getCanonicalFileName: (x) => x,
        getNewLine: () => '\n',
      }),
    );
  const temp = await mkdtemp(join(tmpdir(), 'ribbit-extension-'));

  try {
    const build = await Bun.build({
      entrypoints: [entry],
      outdir: temp,
      naming: 'extension.mjs',
      target: 'bun',
      format: 'esm',
      plugins: [
        {
          name: 'ribbit-sdk',
          setup(builder) {
            builder.onResolve({ filter: /^@ribbit\/sdk$/ }, () => ({ path: join(root, 'src/sdk/index.ts') }));
            builder.onResolve({ filter: /^zod$/ }, () => ({ path: join(root, 'node_modules/zod/index.js') }));
            builder.onResolve({ filter: /^https?:/ }, () => {
              throw new Error('Remote imports are not supported');
            });
          },
        },
      ],
    });

    if (!build.success) throw new RibbitError(5, 'Extension build failed');
    const module = await import(pathToFileURL(join(temp, 'extension.mjs')).href);
    const command = module.default;

    if (
      !command ||
      !command.actions ||
      !command.config ||
      !/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(command.type) ||
      !/^\d+\.\d+\.\d+$/.test(command.version)
    )
      throw new RibbitError(2, 'Extension must default-export defineCommand result');
    if (command.type.startsWith('@ribbit/')) throw new RibbitError(2, 'The @ribbit scope is reserved for built-ins');
    const dependencies: Record<string, string> = { '@ribbit/sdk': '0.1.0', zod: '4.1.13' };

    try {
      const pkg = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));

      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
        if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version))
          throw new RibbitError(2, 'Extension dependencies must use exact versions');
        dependencies[name] = version;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }

    return {
      manifest: manifest(command, await sourceDigest(source), dependencies),
      code: await readFile(join(temp, 'extension.mjs')),
    };
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

export async function addExtension(source: string, home?: string) {
  const built = await checkExtension(source);

  return activate(source, built.code, built.manifest, home);
}
