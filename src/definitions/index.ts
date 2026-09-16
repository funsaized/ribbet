import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { parseDocument } from 'yaml';
import { z } from 'zod';
import { inferenceSchema, configPath } from '../config/index.ts';
import { builtins, types } from '../catalog/index.ts';
import { RibbitError, isJson } from '../engine/records/index.ts';
import { validateJson } from '../build/schema/index.ts';
import type { Invocation } from '../engine/runtime/index.ts';

export const definitionSchema = z.strictObject({
  apiVersion: z.literal('ribbit/v1'),
  kind: z.literal('Command'),
  name: z.string().regex(/^[a-z][a-z0-9-]*$/),
  type: z.string(),
  typeVersion: z.string(),
  action: z.string(),
  config: z.record(z.string(), z.unknown()).default({}),
  defaults: z.record(z.string(), z.unknown()).default({}),
  inference: inferenceSchema.optional(),
});

export async function yamlFile(path: string): Promise<any> {
  let text: string;

  try {
    text = await readFile(path, 'utf8');
  } catch {
    throw new RibbitError(7, 'Cannot read YAML file', path);
  }
  if (Buffer.byteLength(text) > 1024 * 1024) throw new RibbitError(6, 'YAML document exceeds 1 MiB');
  const doc = parseDocument(text, { uniqueKeys: true });

  if (doc.errors.length || doc.warnings.length) throw new RibbitError(2, 'Malformed YAML or duplicate keys', path);
  try {
    const result = doc.toJS({ maxAliasCount: 100 });

    if (!isJson(result)) throw new Error();

    return result;
  } catch {
    throw new RibbitError(2, 'Invalid YAML values or aliases', path);
  }
}

export async function definitions(
  cwd = process.cwd(),
): Promise<{ scope: string; path: string; value: z.infer<typeof definitionSchema> }[]> {
  const result: { scope: string; path: string; value: z.infer<typeof definitionSchema> }[] = [];

  for (const [scope, dir] of [
    ['global', join(dirname(configPath()), 'commands')],
    ['project', join(cwd, 'commands')],
  ]) {
    let files: string[];

    try {
      files = await readdir(dir);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') continue;
      throw new RibbitError(7, 'Cannot list command definitions', dir);
    }
    for (const name of files.filter((f) => /\.ya?ml$/.test(f)).toSorted()) {
      const path = join(dir, name),
        parsed = definitionSchema.safeParse(await yamlFile(path));

      if (!parsed.success) throw new RibbitError(2, parsed.error.message, path);
      if (
        Object.hasOwn(builtins, parsed.data.name) ||
        result.some((d) => d.scope === scope && d.value.name === parsed.data.name)
      )
        throw new RibbitError(2, 'Duplicate or reserved definition name', path);
      result.push({ scope, path, value: parsed.data });
    }
  }

  return result;
}

export async function resolveInvocation(name: string, cwd = process.cwd()): Promise<Invocation> {
  if (Object.hasOwn(builtins, name)) return { name, manifest: builtins[name], action: 'run', args: {}, config: {} };
  const matches = (await definitions(cwd)).filter(
    (d) => name === d.value.name || name === `${d.scope}:${d.value.name}`,
  );

  if (matches.length !== 1)
    throw new RibbitError(
      2,
      matches.length ? 'Ambiguous definition; use project:NAME or global:NAME' : 'Unknown command or definition',
    );
  const definition = matches[0].value,
    manifest = (await types()).find((t) => t.type === definition.type && t.version === definition.typeVersion);

  if (!manifest || !manifest.actions[definition.action])
    throw new RibbitError(3, 'Definition type/version/action is not installed');
  const config = validateJson(manifest.config, definition.config, 'config');

  // Defaults may be partial; supplied values and unknown keys are still validated.
  validateJson({ ...manifest.actions[definition.action].args, required: [] }, definition.defaults, 'defaults');

  return {
    name,
    manifest,
    action: definition.action,
    args: definition.defaults,
    config,
    inference: definition.inference,
  };
}
