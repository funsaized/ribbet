import assert from 'node:assert/strict';
import { z } from '../../spikes/runtime/node_modules/zod/index.js';

const schema = z.strictObject({ count: z.number().int().min(1).default(1), suffix: z.string().optional() });
const exported = z.toJSONSchema(schema);

assert.equal(exported.additionalProperties, false);
assert.equal(exported.properties.count.default, 1);
assert.equal(exported.properties.count.minimum, 1);
assert.throws(() => z.toJSONSchema(z.string().transform(value => value.length)));
assert.throws(() => schema.parse({ other: 1 }));
console.log('Schema contract checks passed');
