import { type Adapter, type Event, type Request, reasoningOption } from '../interface/index.ts';
import { send, responseLines, responseJson, eventJson, type Fetcher } from '../http/index.ts';
import { RibbitError } from '../../engine/records/index.ts';
import type { Provider } from '../../config/index.ts';

export class OllamaAdapter implements Adapter {
  constructor(private fetcher: Fetcher = fetch) {}
  async models(provider: Provider, signal: AbortSignal): Promise<string[]> {
    const value = await responseJson(await send(provider, '/api/tags', signal, undefined, this.fetcher), signal);

    if (!Array.isArray(value.models) || value.models.some((m: any) => typeof m.name !== 'string'))
      throw new RibbitError(4, 'Invalid model list');

    return value.models.map((m: any) => m.name);
  }
  async *stream(request: Request): AsyncGenerator<Event> {
    const { route, signal } = request;
    const options = {
      ...(route.temperature !== undefined ? { temperature: route.temperature } : {}),
      ...(route.maxOutputTokens !== undefined ? { num_predict: route.maxOutputTokens } : {}),
    };
    const think = reasoningOption(route, request.schema !== undefined);
    const response = await send(
      route.endpoint,
      '/api/chat',
      signal,
      {
        model: route.model,
        messages: [
          { role: 'system', content: request.instruction },
          { role: 'user', content: request.evidence },
        ],
        stream: true,
        ...(request.schema ? { format: request.schema } : {}),
        ...(think === undefined ? {} : { think }),
        options,
      },
      this.fetcher,
    );
    let done = false;

    for await (const line of responseLines(response, signal)) {
      if (!line) continue;
      if (done) throw new RibbitError(4, 'Ollama emitted data after completion');
      const value = eventJson(line);

      if (value.error || value.message?.tool_calls?.length || value.message?.refusal)
        throw new RibbitError(4, 'Provider returned an error, refusal or unsupported tool call');
      if (typeof value.message?.content !== 'string' || typeof value.done !== 'boolean')
        throw new RibbitError(4, 'Malformed Ollama stream event');
      if (value.message.content) yield { type: 'text', text: value.message.content };
      if (value.done) {
        if (value.done_reason && value.done_reason !== 'stop')
          throw new RibbitError(4, 'Ollama output did not finish normally');
        done = true;
        yield { type: 'done', inputTokens: value.prompt_eval_count, outputTokens: value.eval_count };
      }
    }
    if (!done) throw new RibbitError(4, 'Truncated Ollama stream');
  }
}
