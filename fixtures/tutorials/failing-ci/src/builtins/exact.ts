105 |       for await (const r of input as AsyncIterable<RecordValue>) {
106 |         const value = {};
107 |
108 |         for (const { destination, source } of paths) {
109 |           assign(value, destination, recordField(r, source, a.missing));
110 |           if (Buffer.byteLength(JSON.stringify(value)) > ctx.budget.limits.maxBytes)
111 |             throw new RibbitError(6, 'Projection exceeds byte limit');
112 |         }
113 |         yield { id: r.id, value };
114 |       }
115 |     },
