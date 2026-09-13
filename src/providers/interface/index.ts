import type { Route } from '../../routing/index.ts';
export interface Request { route: Route; instruction: string; evidence: string; schema?: Record<string, unknown>; signal: AbortSignal; }
export type Event = { type: 'text'; text: string } | { type: 'done'; inputTokens?: number; outputTokens?: number };
export interface Adapter { stream(request: Request): AsyncIterable<Event>; }
export class TransportError extends Error {
  constructor(public status: number, message = 'Provider HTTP request failed') { super(message); }
}
