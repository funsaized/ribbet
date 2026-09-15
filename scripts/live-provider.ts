import { z } from 'zod';
import { configSchema, loadDotenv } from '../src/config/index.ts';
import { resolveRoute } from '../src/routing/index.ts';
import { Budget } from '../src/engine/execution/index.ts';
import { ManagedInference } from '../src/engine/inference/index.ts';
import { OllamaAdapter } from '../src/providers/ollama/index.ts';
import { CompatibleAdapter } from '../src/providers/openai-compatible/index.ts';
const type = process.argv[2];
if (!['ollama', 'compatible'].includes(type)) throw new Error('Specify ollama or compatible');
loadDotenv();
const baseUrl = process.env.RIBBIT_TEST_BASE_URL;
const model = process.env.RIBBIT_TEST_MODEL;
if (!baseUrl || !model) { console.error('Live smoke requires RIBBIT_TEST_BASE_URL and RIBBIT_TEST_MODEL; no request sent.'); process.exit(3); }
const config = configSchema.parse({ providers: { test: { type: type === 'ollama' ? 'ollama' : 'openai-compatible', baseUrl, defaultModel: model, apiKeyEnv: process.env.RIBBIT_TEST_API_KEY_ENV, capabilities: ['text', 'stream', 'object', 'maxOutputTokens'] } }, default: { provider: 'test', maxOutputTokens: 4096 } });
const route = resolveRoute(config, {});
const budget = new Budget({ maxRequests: 4 });
const adapter = type === 'ollama' ? new OllamaAdapter() : new CompatibleAdapter();
const llm = new ManagedInference(adapter, route, budget);
const started = performance.now();
try {
  const models = await adapter.models(route.endpoint, budget.signal);
  if (!models.includes(model)) throw new Error('Configured smoke model not returned by model discovery');
  const text = await llm.text('Respond with the single word OK. This is a protocol smoke test.', 'Respond OK.');
  if (!text.trim()) throw new Error('Empty text output');
  const object = await llm.object('Return a JSON object with ok equal to true. This is a protocol smoke test.', 'The check succeeded.', z.strictObject({ ok: z.literal(true) }));
  console.log(JSON.stringify({ schemaVersion: 1, platform: process.platform, runtime: Bun.version, type, model, modelDiscovered: true, text, object, requests: budget.requests, repairs: llm.repairs, retries: llm.retries, tokens: budget.tokens, usageUnknown: budget.usageUnknown, elapsedMs: performance.now() - started, pass: true }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ schemaVersion: 1, type, model, requests: budget.requests, repairs: llm.repairs, elapsedMs: performance.now() - started, pass: false, error: error instanceof Error ? error.message : 'Unknown failure' }, null, 2));
  process.exitCode = 1;
} finally { budget.close(); }
