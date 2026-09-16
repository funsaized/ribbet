import { z } from 'zod';
import { Budget } from '../execution/index.ts';
import { RibbitError } from '../records/index.ts';
import { type Adapter, TransportError } from '../../providers/interface/index.ts';
import type { Route } from '../../routing/index.ts';
import { schemaToJson } from '../../sdk/manifest/index.ts';

export { schemaToJson };

export class ManagedInference {
  repairs = 0;
  retries = 0;
  constructor(
    readonly adapter: Adapter,
    readonly route: Route,
    readonly budget: Budget,
  ) {}
  private preflight(instruction: string, evidence: string, object = false, schema?: Record<string, unknown>) {
    this.budget.check();
    if (!this.route.endpoint.capabilities.includes(object ? 'object' : 'text'))
      throw new RibbitError(3, 'Requested inference capability unavailable');
    const bytes =
      Buffer.byteLength(instruction) +
      Buffer.byteLength(evidence) +
      Buffer.byteLength(schema ? JSON.stringify(schema) : '');

    if (bytes > this.budget.limits.maxBytes) throw new RibbitError(6, 'Inference input byte limit exceeded');
    // Conservative UTF-8 byte upper bound avoids pretending model tokenization is known.
    if (
      this.route.endpoint.contextTokens &&
      bytes + (this.route.maxOutputTokens ?? 1024) > this.route.endpoint.contextTokens
    )
      throw new RibbitError(6, 'Conservative context bound exceeded; reduce evidence or configure model limits');
  }
  private async attempt(
    instruction: string,
    evidence: string,
    schema?: Record<string, unknown>,
    emit?: (text: string) => Promise<void>,
  ): Promise<string> {
    this.preflight(instruction, evidence, !!schema, schema);
    let text = '';

    for (let retry = 0; ; retry++) {
      try {
        return await this.budget.request(async (signal) => {
          let done = false;

          try {
            for await (const event of this.adapter.stream({
              route: this.route,
              instruction,
              evidence,
              schema,
              signal,
            })) {
              this.budget.check();
              if (signal.aborted) throw signal.reason;
              if (done) throw new RibbitError(4, 'Provider emitted data after completion');
              if (event.type === 'text') {
                if (typeof event.text !== 'string') throw new RibbitError(4, 'Invalid provider text');
                if (Buffer.byteLength(text) + Buffer.byteLength(event.text) > this.budget.limits.maxBytes)
                  throw new RibbitError(6, 'Inference output byte limit exceeded');
                text += event.text;
                if (emit) await emit(event.text);
              } else {
                done = true;
                if (event.inputTokens === undefined || event.outputTokens === undefined)
                  this.budget.usageUnknown = true;
                for (const count of [event.inputTokens, event.outputTokens])
                  if (count !== undefined) this.budget.charge('tokens', count);
              }
            }
            if (!done) throw new RibbitError(4, 'Truncated provider stream: missing completion');

            return text;
          } finally {
            if (!done) this.budget.usageUnknown = true;
          }
        }, this.route.timeout);
      } catch (error) {
        if (error instanceof TransportError) {
          if (text.length === 0 && retry < 1 && (error.status === 429 || error.status >= 500)) {
            this.retries++;
            this.budget.retries++;
            continue;
          }
          throw new RibbitError(
            [400, 401, 403, 404, 422].includes(error.status) ? 3 : 4,
            `Provider HTTP ${error.status}; check endpoint, model, credentials and schema capabilities`,
          );
        }
        if (error instanceof RibbitError) throw error;
        throw new RibbitError(4, 'Provider transport failed (details redacted)');
      }
    }
  }
  async text(instruction: string, evidence: string) {
    this.preflight(instruction, evidence);

    return this.attempt(instruction, evidence);
  }
  async object<T>(instruction: string, evidence: string, schema: z.ZodType<T>): Promise<T> {
    const exported = schemaToJson(schema);

    this.preflight(instruction, evidence, true);
    for (let repair = 0; repair <= 1; repair++) {
      const text = await this.attempt(
        instruction +
          (repair ? '\nPrevious output failed validation. Return only JSON matching the supplied schema.' : ''),
        evidence,
        exported,
      );
      let value: unknown;

      try {
        value = JSON.parse(text);
      } catch {
        value = undefined;
      }
      const result = schema.safeParse(value);

      if (result.success) return result.data;
      if (repair === 0) {
        this.repairs++;
        this.budget.repairs++;
        continue;
      }
    }
    throw new RibbitError(4, 'Structured inference failed validation after one repair');
  }
  async *stream(instruction: string, evidence: string): AsyncGenerator<string> {
    this.preflight(instruction, evidence);
    if (!this.route.endpoint.capabilities.includes('stream'))
      throw new RibbitError(3, 'Streaming capability unavailable');
    // One-slot handoff applies backpressure without buffering an entire response.
    let slot: { text: string; acknowledge: () => void } | undefined;
    let finished = false,
      failure: unknown;
    let wake: (() => void) | undefined;
    let pendingAck: (() => void) | undefined;
    const worker = this.attempt(
      instruction,
      evidence,
      undefined,
      (text) =>
        new Promise<void>((resolve) => {
          slot = { text, acknowledge: resolve };
          wake?.();
        }),
    )
      .catch((error) => {
        failure = error;
      })
      .finally(() => {
        finished = true;
        wake?.();
      });

    try {
      // eslint-disable-next-line no-unmodified-loop-condition -- `finished` is set asynchronously by the worker
      while (!finished || slot) {
        if (!slot)
          await new Promise<void>((resolve) => {
            wake = resolve;
            if (finished || slot) resolve();
          });
        if (slot) {
          const item = slot;

          slot = undefined;
          pendingAck = item.acknowledge;
          yield item.text;
          item.acknowledge();
          pendingAck = undefined;
        }
      }
      if (failure) throw failure;
    } finally {
      if (!finished) this.budget.controller.abort(new RibbitError(130, 'Inference consumer closed'));
      pendingAck?.();
      slot?.acknowledge();
      await worker;
    }
  }
}
