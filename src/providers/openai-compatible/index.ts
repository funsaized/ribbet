import { type Adapter, type Event, type Request } from '../interface/index.ts';
import { send, responseLines, responseJson, eventJson, type Fetcher } from '../http/index.ts';
import { RibbitError } from '../../engine/records/index.ts';
import type { Provider } from '../../config/index.ts';
export class CompatibleAdapter implements Adapter {
  constructor(private fetcher: Fetcher = fetch) {}
  async models(provider: Provider, signal: AbortSignal): Promise<string[]> {
    const value = await responseJson(await send(provider, '/models', signal, undefined, this.fetcher), signal);
    if (!Array.isArray(value.data) || value.data.some((m: any) => typeof m.id !== 'string')) throw new RibbitError(4, 'Invalid model list');
    return value.data.map((m: any) => m.id);
  }
  async *stream(request: Request): AsyncGenerator<Event> {
    const { route, signal } = request;
    const body = { model: route.model, messages: [{ role: 'system', content: request.instruction }, { role: 'user', content: request.evidence }], stream: true,
      ...(route.temperature === undefined ? {} : { temperature: route.temperature }), ...(route.maxOutputTokens === undefined ? {} : { max_tokens: route.maxOutputTokens }),
      ...(request.schema ? { response_format: { type: 'json_schema', json_schema: { name: 'ribbit_result', strict: true, schema: request.schema } } } : {}) };
    const response = await send(route.endpoint, '/chat/completions', signal, body, this.fetcher);
    let data: string[] = [], stopped = false, done = false, usage: { inputTokens?: number; outputTokens?: number } = {};
    function parseEvent(payload: string): Event[] {
      if (done) throw new RibbitError(4, 'Compatible endpoint emitted data after completion');
      if (payload === '[DONE]') { if (!stopped) throw new RibbitError(4, 'Missing normal finish reason'); done = true; return [{ type: 'done', ...usage }]; }
      const value = eventJson(payload);
      if (value.error || !Array.isArray(value.choices)) throw new RibbitError(4, 'Invalid compatible endpoint event');
      if (value.usage) usage = { inputTokens: value.usage.prompt_tokens, outputTokens: value.usage.completion_tokens };
      if (value.choices.length === 0 && value.usage) return [];
      if (value.choices.length !== 1) throw new RibbitError(4, 'Expected one choice');
      const choice = value.choices[0], delta = choice.delta;
      if (!delta || delta.refusal || delta.tool_calls || delta.function_call) throw new RibbitError(4, 'Provider refusal or unsupported tool/function call');
      if (stopped && delta.content) throw new RibbitError(4, 'Text after finish reason');
      if (choice.finish_reason !== null && choice.finish_reason !== undefined) {
        if (choice.finish_reason !== 'stop') throw new RibbitError(4, 'Provider output truncated or stopped abnormally');
        stopped = true;
      }
      if (delta.content !== undefined && delta.content !== null && typeof delta.content !== 'string') throw new RibbitError(4, 'Invalid text delta');
      return typeof delta.content === 'string' && delta.content ? [{ type: 'text', text: delta.content }] : [];
    }
    for await (const line of responseLines(response, signal)) {
      if (!line) { if (data.length) { yield* parseEvent(data.join('\n')); data = []; } }
      else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
      else if (!line.startsWith(':') && !/^(event|id|retry):/.test(line)) throw new RibbitError(4, 'Malformed SSE field');
    }
    if (data.length) yield* parseEvent(data.join('\n'));
    if (!done) throw new RibbitError(4, 'Truncated compatible SSE stream');
  }
}
