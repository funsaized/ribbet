import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { parseDocument } from 'yaml';
import { z } from 'zod';
import { RibbitError } from '../engine/records/index.ts';
const endpoint = z.string().superRefine((value, ctx) => {
  try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error(); }
  catch { ctx.addIssue({ code: 'custom', message: 'Endpoint must be HTTP(S) without credentials, query or fragment' }); }
});
export const inferenceSchema = z.strictObject({ profile: z.string().optional(), provider: z.string().optional(), model: z.string().min(1).optional(), temperature: z.number().finite().min(0).optional(), maxOutputTokens: z.number().int().positive().optional(), timeout: z.number().int().positive().optional(), reasoning: z.enum(['off', 'on']).optional() });
export const providerSchema = z.strictObject({ type: z.enum(['ollama', 'openai-compatible']), baseUrl: endpoint, apiKeyEnv: z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/).optional(), defaultModel: z.string().min(1).optional(), models: z.array(z.string()).optional(), contextTokens: z.number().int().positive().optional(), capabilities: z.array(z.enum(['text', 'stream', 'object', 'temperature', 'maxOutputTokens', 'reasoning'])).default(['text']) });
const profileSchema = inferenceSchema.omit({ profile: true }).required({ provider: true, model: true });
export const configSchema = z.strictObject({ schemaVersion: z.literal(1).default(1), providers: z.record(z.string(), providerSchema).default({}), profiles: z.record(z.string(), profileSchema).default({}), default: inferenceSchema.default({}), routes: z.record(z.string(), inferenceSchema).default({}) });
export type Inference = z.infer<typeof inferenceSchema>;
export type Provider = z.infer<typeof providerSchema>;
export type Config = z.infer<typeof configSchema>;
export const configPath = () => join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'ribbit', 'config.yaml');
export async function loadConfig(path = configPath()): Promise<Config> {
  let source: string;
  try { source = await readFile(path, 'utf8'); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return configSchema.parse({}); throw new RibbitError(7, 'Cannot read configuration'); }
  const doc = parseDocument(source, { uniqueKeys: true });
  if (doc.errors.length) throw new RibbitError(3, 'Invalid YAML configuration');
  try { return configSchema.parse(doc.toJS({ maxAliasCount: 100 })); }
  catch { throw new RibbitError(3, 'Invalid configuration schema; inspect provider/profile fields (values redacted)'); }
}
export async function loadProjectInference(path: string): Promise<Inference> {
  let source: string;
  try { source = await readFile(path, 'utf8'); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {}; throw new RibbitError(7, 'Cannot read project configuration'); }
  const doc = parseDocument(source, { uniqueKeys: true });
  if (doc.errors.length) throw new RibbitError(3, 'Invalid project YAML');
  try { return z.strictObject({ apiVersion: z.literal('ribbit/v1'), inference: inferenceSchema.default({}) }).parse(doc.toJS({ maxAliasCount: 100 })).inference; }
  catch { throw new RibbitError(3, 'Invalid project configuration'); }
}
