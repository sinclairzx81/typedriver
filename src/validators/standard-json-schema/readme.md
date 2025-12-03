## Standard JSON Schema

General recommendations for the Standard JSON Schema specification.

---

## Schema Resolution

> Different tooling requires different versions of JSON Schema. Currently there is a divide in the ecosystem between "draft-07" and "draft-2020-12". Library authors that implement this spec are encouraged to implement as many formats as is practical, which a special emphasis on "draft-07" and "draft-2020-12". Supporting multiple formats is not required to implement the spec; it is entirely on a best-effort basis.

The current interface doesn't provide a way to query for generation targets. A caller needs to [test for each specification](https://github.com/sinclairzx81/typedriver/blob/main/src/validators/standard-json-schema/resolve.ts#L57) in turn using try/catch resolution. This can be resolved with a 'supported' property.

```typescript
{
  '~standard': {
    jsonSchema: {
      supported: [                // recommendation
        'draft-2020-12',
        'draft-7',
      ],
      input: (options: { target: string }) => { ... },
      output: (options: { target: string }) => { ... }, 
    }
  }
}
```
---

## Non-Json-Instances

JSON Schema supports superset schematics which some libraries target (TypeBox being one). A super for JavaScript might include support for `unknown`, `symbol`, `void`,  as well as other non-representable types (such as Date). There are provisions made for this in the specification. 

https://json-schema.org/draft/2020-12/json-schema-core#name-non-json-instances

> It is possible to use JSON Schema with a superset of the JSON Schema data model, where an instance may be outside any of the six JSON data types. In this case, annotations still apply; but most validation keywords will not be useful, as they will always pass or always fail. A custom vocabulary may define support for a superset of the core data model. The schema itself may only be expressible in this superset; for example, to make use of the "const" keyword.

Again, a query mechanism that advertises generation targets would be useful, with a convention of `data-model/superset` used to specify the semantics used by the generation target.

```typescript
{
  '~standard': {
    jsonSchema: {
      supported: [
        'draft-next/typescript',  // convention: data-model/superset
        'draft-2020-12/typebox',  // convention: data-model/superset
        'draft-2020-12',
        'draft-7',
      ],
      input: (options: { target: string }) => { ... },
      output: (options: { target: string }) => { ... }, 
    }
  }
}
```