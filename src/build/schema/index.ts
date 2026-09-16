import type Ajv2020 from 'ajv/dist/2020.js';
import * as compiled from '../../generated/validators.ts';
import { hash, stable } from '../../sdk/manifest/index.ts';
import { RibbitError, isJson } from '../../engine/records/index.ts';
import type { JsonSchema } from '../../sdk/manifest/index.ts';

let ajv: Ajv2020 | undefined;

function compiler() {
  return (ajv ??= new (require('ajv/dist/2020.js').default)({ allErrors: true, useDefaults: true, strict: false }));
}

const cache = new WeakMap<object, ReturnType<Ajv2020['compile']>>();

export function validateJson(schema: JsonSchema, value: unknown, location = 'args', code = 2): any {
  if (!isJson(value)) throw new RibbitError(code, 'Expected finite JSON', location);
  let validator = cache.get(schema) ?? (compiled as Record<string, any>)['v' + hash(stable(schema))];

  try {
    if (!validator) {
      validator = compiler().compile(schema);
      cache.set(schema, validator);
    }
  } catch {
    throw new RibbitError(2, 'Unsupported or invalid JSON Schema', location);
  }
  const copy = structuredClone(value);

  if (!validator(copy))
    throw new RibbitError(
      code,
      validator.errors?.map((e: any) => `${e.instancePath || location} ${e.message}`).join('; ') ??
        'Schema validation failed',
      location,
    );

  return copy;
}

export function validateExternalSchema(schema: unknown): asserts schema is JsonSchema {
  const allowed = new Set([
    '$schema',
    '$id',
    '$defs',
    '$ref',
    'type',
    'properties',
    'required',
    'additionalProperties',
    'items',
    'enum',
    'const',
    'anyOf',
    'oneOf',
    'allOf',
    'minItems',
    'maxItems',
    'minLength',
    'maxLength',
    'pattern',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'multipleOf',
    'description',
    'title',
    'default',
    'examples',
  ]);
  const seen = new Set<unknown>();

  function visit(node: any, depth = 0) {
    if (depth > 32 || !node || typeof node !== 'object' || Array.isArray(node) || seen.has(node))
      throw new RibbitError(2, 'Unsupported recursive or invalid schema');
    seen.add(node);
    for (const key of Object.keys(node))
      if (!allowed.has(key)) throw new RibbitError(2, `Unsupported schema keyword: ${key}`);
    if (node.$ref !== undefined)
      throw new RibbitError(2, 'External extraction schemas must be self-contained without $ref');
    for (const child of Object.values(node.properties ?? {})) visit(child, depth + 1);
    for (const child of Object.values(node.$defs ?? {})) visit(child, depth + 1);
    if (node.items) visit(node.items, depth + 1);
    for (const key of ['anyOf', 'oneOf', 'allOf']) for (const child of node[key] ?? []) visit(child, depth + 1);
    if (typeof node.additionalProperties === 'object') visit(node.additionalProperties, depth + 1);
    seen.delete(node);
  }

  visit(schema);
  try {
    compiler().compile(schema as object);
  } catch {
    throw new RibbitError(2, 'Invalid JSON Schema');
  }
}

import { z } from 'zod';

export function schemaToZod(schema: JsonSchema): z.ZodType<any> {
  validateExternalSchema(schema);

  function convert(s: JsonSchema): z.ZodType<any> {
    let result: z.ZodType<any>;

    if (s.const !== undefined) {
      if (s.const !== null && !['string', 'number', 'boolean'].includes(typeof s.const))
        throw new RibbitError(2, 'Only scalar const schemas are supported');

      return z.literal(s.const);
    }
    if (s.enum) {
      if (!s.enum.length || s.enum.some((v: any) => v !== null && !['string', 'number', 'boolean'].includes(typeof v)))
        throw new RibbitError(2, 'Only nonempty scalar enums supported');

      return z.union(s.enum.map((v: any) => z.literal(v)));
    }
    if (s.anyOf) return z.union(s.anyOf.map(convert));
    if (s.oneOf || s.allOf) throw new RibbitError(2, 'Use anyOf for schema unions');
    if (Array.isArray(s.type)) return z.union(s.type.map((type: string) => convert({ ...s, type })));
    switch (s.type) {
      case 'string': {
        let x = z.string();

        if (s.minLength !== undefined) x = x.min(s.minLength);
        if (s.maxLength !== undefined) x = x.max(s.maxLength);
        if (s.pattern) x = x.regex(new RegExp(s.pattern));
        result = x;
        break;
      }
      case 'number':
      case 'integer': {
        let x = z.number();

        if (s.type === 'integer') x = x.int();
        if (s.minimum !== undefined) x = x.min(s.minimum);
        if (s.maximum !== undefined) x = x.max(s.maximum);
        if (s.exclusiveMinimum !== undefined) x = x.gt(s.exclusiveMinimum);
        if (s.exclusiveMaximum !== undefined) x = x.lt(s.exclusiveMaximum);
        if (s.multipleOf !== undefined) x = x.multipleOf(s.multipleOf);
        result = x;
        break;
      }
      case 'boolean':
        result = z.boolean();
        break;
      case 'null':
        result = z.null();
        break;
      case 'array': {
        if (!s.items) throw new RibbitError(2, 'Array schema requires items');
        let x = z.array(convert(s.items));

        if (s.minItems !== undefined) x = x.min(s.minItems);
        if (s.maxItems !== undefined) x = x.max(s.maxItems);
        result = x;
        break;
      }
      case 'object': {
        if (s.additionalProperties !== false)
          throw new RibbitError(2, 'Extraction object schemas must set additionalProperties:false');
        const properties: Record<string, z.ZodType> = {};

        for (const [key, value] of Object.entries(s.properties ?? {})) {
          let property = convert(value as JsonSchema);

          if (!(s.required ?? []).includes(key)) property = property.optional();
          properties[key] = property;
        }
        result = z.strictObject(properties);
        break;
      }
      default:
        throw new RibbitError(2, 'Schema requires a supported type, enum, const or anyOf');
    }
    if (s.default !== undefined) result = result.default(s.default);

    return result;
  }

  return convert(schema);
}
