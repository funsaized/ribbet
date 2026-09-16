import builtinCatalog from '../generated/catalog.json';
import { listInstalled } from '../extensions/install/index.ts';
import type { Manifest } from '../sdk/manifest/index.ts';

export const builtins = builtinCatalog as Record<string, Manifest>;

export async function types(): Promise<Manifest[]> {
  return [...Object.values(builtins), ...(await listInstalled()).map((i) => i.manifest)];
}
