import { RibbitError } from '../../engine/records/index.ts';
import { TransportError } from '../interface/index.ts';
import type { Provider } from '../../config/index.ts';
export type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
export async function send(
  provider: Provider,
  path: string,
  signal: AbortSignal,
  body?: unknown,
  fetcher: Fetcher = fetch,
): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (provider.apiKeyEnv) {
    const key = process.env[provider.apiKeyEnv];
    if (!key) throw new RibbitError(3, 'Configured API key environment variable is missing');
    headers.Authorization = `Bearer ${key}`;
  }
  let response: Response;
  try {
    response = await fetcher(provider.baseUrl.replace(/\/$/, '') + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      redirect: 'error',
    });
  } catch {
    if (signal.aborted) throw signal.reason;
    throw new RibbitError(3, 'Provider endpoint unreachable (details redacted)');
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new TransportError(response.status);
  }
  return response;
}
export async function* responseLines(
  response: Response,
  signal: AbortSignal,
  maxBytes = 8 * 1024 * 1024,
): AsyncGenerator<string> {
  if (!response.body) throw new RibbitError(4, 'Missing response body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let pending = '',
    total = 0;
  try {
    for (;;) {
      if (signal.aborted) throw signal.reason;
      const { done, value } = await reader.read();
      if (done) {
        pending += decoder.decode();
        break;
      }
      total += value.byteLength;
      if (total > maxBytes) throw new RibbitError(6, 'Provider response exceeds byte limit');
      pending += decoder.decode(value, { stream: true });
      let end: number;
      while ((end = pending.indexOf('\n')) !== -1) {
        yield pending.slice(0, end).replace(/\r$/, '');
        pending = pending.slice(end + 1);
      }
    }
    if (pending) yield pending.replace(/\r$/, '');
  } catch (error) {
    if (signal.aborted) throw signal.reason;
    if (error instanceof RibbitError) throw error;
    throw new RibbitError(4, 'Malformed or interrupted provider response');
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
export function eventJson(text: string): any {
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw new RibbitError(4, 'Malformed provider event JSON');
  }
}
export async function responseJson(response: Response, signal: AbortSignal): Promise<any> {
  const parts = [];
  for await (const line of responseLines(response, signal)) parts.push(line);
  return eventJson(parts.join('\n'));
}
