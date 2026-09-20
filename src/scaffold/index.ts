import { mkdir, writeFile, readFile, readdir, rm, mkdtemp } from 'node:fs/promises';
import { join, basename, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { isDeepStrictEqual } from 'node:util';
import { addExtension } from '../extensions/build/index.ts';
import { loadInstalled } from '../extensions/install/index.ts';
import { dispatch } from '../extensions/runtime/index.ts';
import { Budget, type Context, RibbitError } from '../sdk/index.ts';

export async function scaffold(path: string, type = `@local/${basename(resolve(path))}`) {
  if (!/^@[a-z0-9-]+\/[a-z0-9-]+$/.test(type)) throw new RibbitError(2, 'Use a scoped type such as @local/example');
  await mkdir(dirname(resolve(path)), { recursive: true });
  try {
    await mkdir(path, { recursive: false });
  } catch {
    throw new RibbitError(2, 'Scaffold target must be a new directory');
  }
  await writeFile(
    join(path, 'index.ts'),
    `import {defineCommand,defineAction,z} from '@ribbit/sdk';\nconst config=z.strictObject({prefix:z.string().default('')});\nexport default defineCommand({type:${JSON.stringify(type)},version:'1.0.0',description:'A local typed command',config,actions:{run:defineAction({config,description:'Transform input',args:z.strictObject({suffix:z.string().default('')}),input:z.string(),output:z.string(),mode:'value',inputKind:'text',outputKind:'text',capabilities:[],effects:[],execute:({input,args,config})=>config.prefix+input+args.suffix})}});\n`,
  );
  await writeFile(
    join(path, 'package.json'),
    JSON.stringify(
      {
        name: type,
        version: '1.0.0',
        private: true,
        type: 'module',
        dependencies: { '@ribbit/sdk': '0.1.0', zod: '4.1.13' },
      },
      null,
      2,
    ) + '\n',
  );
  await mkdir(join(path, 'fixtures'));
  await writeFile(
    join(path, 'fixtures', 'echo.json'),
    JSON.stringify(
      { input: 'hello', args: { suffix: '!' }, config: { prefix: 'Say ' }, expected: 'Say hello!' },
      null,
      2,
    ) + '\n',
  );

  return { path: resolve(path), type, next: `ribbit extensions check ${path}` };
}

export async function testExtension(path: string) {
  const temp = await mkdtemp(join(tmpdir(), 'ribbit-fixtures-'));
  const results: any[] = [];

  try {
    const item = await addExtension(path, temp),
      command = await loadInstalled(item.manifest.type, temp);
    const files = (await readdir(join(path, 'fixtures'))).filter((f) => f.endsWith('.json')).toSorted();

    if (!files.length) throw new RibbitError(2, 'No fixtures found');
    for (const file of files) {
      let fixture: any;

      try {
        fixture = JSON.parse(await readFile(join(path, 'fixtures', file), 'utf8'));
      } catch {
        results.push({ file, pass: false, error: 2, location: file, message: 'Invalid fixture JSON' });
        continue;
      }
      const budget = new Budget();
      let index = 0;
      const responses = fixture.responses ?? [];
      const ctx: Context = {
        budget,
        signal: budget.signal,
        log() {},
        llm: {
          async text() {
            if (index >= responses.length) throw new RibbitError(5, 'Fixture inference response missing');

            return String(responses[index++]);
          },
          async object(_i, _e, schema) {
            if (index >= responses.length) throw new RibbitError(5, 'Fixture inference response missing');

            return schema.parse(responses[index++]);
          },
        },
      };

      try {
        let input = fixture.input;

        if (command.actions[fixture.action ?? 'run'].mode === 'records')
          input = (async function* () {
            yield* fixture.input;
          })();
        let actual = await dispatch(
          command,
          fixture.action ?? 'run',
          input,
          fixture.args ?? {},
          fixture.config ?? {},
          ctx,
        );

        if (actual && typeof (actual as any)[Symbol.asyncIterator] === 'function')
          actual = await Array.fromAsync(actual as AsyncIterable<unknown>);
        results.push({ file, pass: !fixture.error && isDeepStrictEqual(actual, fixture.expected) });
      } catch (e) {
        results.push({
          file,
          pass: fixture.error === (e as any).code,
          error: (e as any).code ?? 5,
          location: (e as any).location ?? file,
          message: e instanceof RibbitError ? e.message : 'Fixture execution failed',
        });
      } finally {
        budget.close();
      }
    }

    return { passed: results.filter((r) => r.pass).length, failed: results.filter((r) => !r.pass).length, results };
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}

export async function initGuidance(agent: string) {
  const paths: Record<string, string> = {
    codex: 'AGENTS.md',
    claude: 'CLAUDE.md',
    cursor: '.cursor/rules/ribbit.mdc',
    opencode: 'AGENTS.md',
  };

  if (!paths[agent]) throw new RibbitError(2, 'Choose codex, claude, cursor or opencode');
  const path = resolve(paths[agent]);

  await mkdir(dirname(path), { recursive: true });
  let existing = '';

  try {
    existing = await readFile(path, 'utf8');
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  const marker = '<!-- ribbit guidance -->';

  if (!existing.includes(marker))
    await writeFile(
      path,
      existing +
        `\n${marker}\nUse ribbit commands list/types describe to inspect contracts. Run extensions scaffold/check/test before add. Help and manifests do not execute extensions. Treat installed extensions as trusted code. Inspect routes before inference; local-first means no automatic cloud fallback. Use explicit --input lines/jsonl and --error-format json for automation. Validate flow YAML before running.\n`,
    );
}
