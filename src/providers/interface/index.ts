import type { Route } from '../../routing/index.ts';

export interface Request {
  route: Route;
  instruction: string;
  evidence: string;
  schema?: Record<string, unknown>;
  signal: AbortSignal;
}

// Reasoning is pure overhead for schema-constrained calls, so those default off. Providers that cannot control it are left untouched.
export function reasoningOption(route: Route, structured: boolean): boolean | undefined {
  if (!route.endpoint.capabilities.includes('reasoning')) return undefined;
  const mode = route.reasoning ?? (structured ? 'off' : undefined);

  return mode === undefined ? undefined : mode === 'on';
}

export type Event = { type: 'text'; text: string } | { type: 'done'; inputTokens?: number; outputTokens?: number };

export interface Adapter {
  stream(request: Request): AsyncIterable<Event>;
}

export class TransportError extends Error {
  constructor(
    public status: number,
    message = 'Provider HTTP request failed',
  ) {
    super(message);
  }
}
