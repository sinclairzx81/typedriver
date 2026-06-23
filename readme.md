<div align='center'>

<h1>TypeDriver</h1>

<p>A Runtime TypeScript Validation Engine</p>

<img src="typedriver.svg" />

<br />
<br />

[![npm version](https://badge.fury.io/js/typedriver.svg)](https://badge.fury.io/js/typedriver)
[![Downloads](https://img.shields.io/npm/dm/typedriver.svg)](https://www.npmjs.com/package/typedriver)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Test](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml)

</div>

## Install

```bash
$ npm install typedriver --save
```

## Usage

[TypeScript](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoAqBPADgUwMoDGATgJbYAuqYStd9D4ypAttgPbEWgDeoh7NqQA2uUAF9QAM2KDQAcgo5cAEzIA3XMXnJkAgHYBnbgDVchCpwDMoALz9B2EbgAUAAx7JQoAB4AuUH0AVxYAIy0AGi9QTADgsMjogC84kPDiZHE3AEpdFXNhAENiMQNjUHVC4SDcAKD9AGt9dgB3fV0y7g5DUgpSdn07UDMLawA6bGLDV0rq3GzvRaXFtE7Qbt7+-QDPZb39g8OjpbRvf0C0xOPrm5vTmNSE4ijb17eTsG8Ui6fo9--rmhJPYxqCgA) | [JSON Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoBSBnA9gO1AMoDGAFgKYC2AhqmEvQ40+MgJYUAO2ATgC6gBvUEWydWAGzKgAvqABm3UaADkvAJ4cyAE26sAbmW7LkyEbkz8AamSK8eAZlABeYaI4SyACgHJQodZoAXCrYAEYAVja8ygA0vqDcZACOAK6siVrBANrKAB6xKmoFygBeygC6cX4cipp8rGSYwT5+frnN-hpkwcq4KRShhsoyVa1qHQHdKn0DQyPxfiUTXT0zg0Yy8dLI0gCUJlo24lSJrub8elTiKVMpuADWuNgA7rgmZhagXJisvKx4zlA1lsDgAdBwTpgvJdrmRdq0EYi0B9+N9fv9cM0Foicbi8fiCaA0G1gmtDKNCZSqYTiaBxqAydwKdSWayiWBFqT+utsWy+QS0LIXKCRUA) | [Standard Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoDKAXAhgOwCbYBO+GAxgBYCmAttgFygBaA9vqmEl9z7+MgEsaABxZFMoMixECANlVAAzItNAByTAE9hVfEQEA3KkTXJBIsRIBeSlTXVW2p5FNwBnCQDUqZTGIDMoAC8ktLCclQAFFYAdCwARgBWPpiRAN7IoKAAHoyxuACuNPHGkQCUADSZoJp5MYXFpZXVVnUNJUTlVQC+ZWVm+D6yxAquHqAG2LIFVIwFuADWuCwA7rhmYxKibgKYAiy4waDevgExwsRuUZPTVGVZD48PaJug27v7uIwZT79--wDAY80FlcqB2sYqkDoTCYSCaowIUQobDUWjnmAsq1wUUOtV0QToWhukcYmSgA)

```typescript
import compile from 'typedriver'

const Vector = compile(`{
  x: number,
  y: number,
  z: number
}`)

const value = Vector.parse(data)                    // const value: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```

Syntax highlighting available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script)

## Overview

TypeDriver is a runtime validation engine built with a micro TypeScript DSL engine capable of accepting TypeScript string definitions, JSON Schema, and Standard Schema libraries through a single `compile()` call. Type definitions get JIT compiled through JSON Schema into a high-performance runtime validator, enabling uniform high-throughput validation across multiple ecosystem libraries and schema formats.

TypeDriver can be used as a standalone validator, or integrated into REST and RPC services to help validate data received over the wire.

License MIT

## Contents

- [Compile](#Compile)
- [Validate](#Validate)
- [Options](#Constraints)
- [Static](#Static)
- [Reflect](#Reflect)
- [Integrate](#Integrate)
- [Benchmarks](#Benchmarks)
- [Compression](#Compression)
- [Contribute](#Contribute)


## Compile

TypeDriver consists of a single `compile(...)` function that accepts TypeScript string definitions, plain JSON Schema schematics, or Standard Schema library types. TypeDriver will compile the type definition into a high-performance validator via JSON Schema translation.

**TypeScript**

```typescript
const User = compile(`{
  name: string
}`)
```

**JSON Schema**

```typescript
const User = compile({
  type: 'object',
  required: ['name'],
  properties: {
    name: { 
      type: 'string' 
    }
  }
})
```

**Standard Schema**
```typescript
const User = compile(z.object({
  name: z.string(),
}))
```


## Validate

TypeDriver validators contain the methods `parse`, `check`, and `errors`. Use `check` when you need a boolean. Use `errors` after a failed `check` to retrieve structured diagnostics, or `parse` for a Zod-like check-and-return or throw.

```typescript
const Vector = compile(`{
  x: number
  y: number
  z: number
}`)

const data = { x: 1, y: 2, z: 3 }

// Parse
const result = Vector.parse(data)

// Check
if(Vector.check(data)) {
  const { x, y, z } = data      
}

// Errors
const errors = Vector.errors(data, {
  format: 'standard-schema',                         // (optional) 'json-schema'
  locale: 'ko_KR'                                    // (optional)
})
console.log(errors)
```

## Options

TypeDriver supports extended TypeScript syntax for assigning data constraints to types. Use the `with` keyword to augment a type with JSON Schema constraints or other user-defined annotations.

```typescript
const Vector = compile(`{
  x: number with { minimum: 0, maximum: 1 },
  y: number with { minimum: 0, maximum: 1 }
} with {
  description: 'Vector2D',
  additionalProperties: false 
}`)

console.log(Vector.toJsonSchema())                 // {
                                                   //   type: 'object',
                                                   //   required: [ 'x', 'y' ],
                                                   //   properties: {
                                                   //     x: { 
                                                   //       type: 'number', 
                                                   //       minimum: 0, 
                                                   //       maximum: 1 
                                                   //     },
                                                   //     y: { 
                                                   //       type: 'number', 
                                                   //       minimum: 0,
                                                   //       maximum: 1 
                                                   //     }
                                                   //   },
                                                   //   description: 'Vector2D',
                                                   //   additionalProperties: false
                                                   // }
```

## Static

Examples: [TypeScript](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKC4cwBU4AXmx4ChADwADJK1wAbAK7oAXHAB2ikACMOpKQD44xk6bNwA9BeRoBwxF3NPnL128vXjcpao1bdUI7uwSHuVqRAA) | [JSON Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKC4cwBU4AXmx4ChADxI4M2XPkLF8gPTLkaAcMRcZfAFx0IAIwBW6QjFoAaJbbuLVs1rgA2AV3QGAdm5BGOOnBQ6ACObsDBjAYA2rTO7ui0ALo29mkqaiSBYFQYsMDoAM4GCIEy8R4lcGWy+nQ+fhy01XJZMlkkAHxAA) | [Standard Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKFEljgBeFKjVoCIjbl0IQAdgGd4AFTgBeQQDoIAIwBW6QjAAUSOGfMXLXM61wAbAK7oAXJtkOQ2jkYCUcLiQ+XFwMmCrqOPhEADyhEORwSgB8lqlp6XAA9JnIaGFqiP4ZxSWlxdnmto4ucO6eHEVlTc0ZFSRAA)

TypeDriver has unified type inference for TypeScript, JSON Schema, and Standard Schema definitions. Use the `Static<T>` type to derive a TypeScript type from a runtime definition.

**TypeScript**

```typescript
import { type Static } from 'typedriver'

type T = Static<`{ value: number }`>                // type T = {
                                                    //   value: number
                                                    // }
```

**JSON Schema**

```typescript
import { type Static } from 'typedriver'

type T = Static<{                                  // type T = {
  type: 'object',                                  //   value: number
  required: ['value'],                             // }
  properties: {
    value: { 
      type: 'number' 
    }
  }
}>
```

**Standard Schema**

```typescript
import { type Static } from 'typedriver'
import z from 'zod'

const T = z.object({                
  value: z.number() 
})

type T = Static<typeof T>                           // type T = { 
                                                    //   value: number 
                                                    // }
```

## Reflect

TypeDriver internally represents TypeScript using JSON Schema as a runtime IR for types. Compiled validators provide a `toJsonSchema()` function that returns the JSON Schema representation. This can be passed on to form builders and other metadata tooling.

```typescript
import compile from 'typedriver'

const validator = compile(`{ x: number }`)

validator.isJsonSchema()                            // Returns true if the compiled type
                                                    // supports JSON Schema transform. This
                                                    // is true for TypeScript, JSON Schema,
                                                    // and library implementations of 
                                                    // Standard JSON Schema.

validator.toJsonSchema()                            // Returns JSON Schema or an empty 
                                                    // schema {} if not supported.
```

The original source type used for compilation can also be retrieved via:

```typescript
validator.toType()                                  // Returns the original type or
                                                    // schema used for compilation.
```



## Integrate

Examples: [Input / Output Validated Function](https://www.typescriptlang.org/play/?target=99&module=7&ssl=37&ssc=58&pln=1&pc=1#code/JYWwDg9gTgLgBAYwuYAbApgGjgbzjATzHTgGUYBDGYBOAXzgDMpk4ByQ4gEymADd0UNgChhAejFwAwhVSoARhQQBrYegAekWPiIkAKjLmKVAHmFw4ASQB2YAK7wNMdNa4BnOHevLrEAO7W2OZwAPIO9o7qzq4eXj7+1sIAfHAAvHAAFHyydugAXFa2DgCUaSlhMBGiEnAAYl4I1BDWoWBN1m5qmtDwnPohbcDNbmYWNhFwTi7unt6+AWmz8QGYwRUTUzFL8y3pcTurKek4wcBFMAD8BeMOqxYQ4Q5XoY8wwnTikvXWjUMttUoYNACF0tPBGA12nUGiYkB14AN2h5NjM9Ii-m47oUNlFprE5glFuQqDQTOjhgBtNhnCJsAC6SSx6wck1xW32hPSxOoCDJg0pbAelQc9MZwUMCiUylZ0VREuMyhMNxg2GZMCOcAMsklpmVqteSWSGQg-I6BXJHWwEJ+BXlUuKtu1CtwwThbngNJZ6SQKAwxtNbipnpg9NKruG8CFE29yDAaHQ-qRVKjIrpxXD8MQTqliyyOXy2wSpVSKWC91eADowBQoG4E9aEBlg1Wa3W86hcqUKB5rOgBFBiumLFB0DA7FAWghsyo4N24L3++9qpJlXBJGq4AA1WTALhUdBcOAAQS4h++v2awjd8Aop8W54yJwswYKAAM8BQCtY7CB5IJsPIX4-n+UD0K+2BrpIei6KQCC8G02IsgAIugjBnMA7TBCmMAFHgfQFGw36-oIbD0BY5EUZBcAAFKkCEAByZAIAAFugIAUC8wrwChaHWBhfzvNgj6zgB9DFikHEANRwPI6aiNecDZB2JDpLeXDCZ+cAAIwAQUABMYmUTUClKbkiwAMxwEAA)

TypeDriver is designed for framework integration, making it easy to accept TypeScript, JSON Schema, and Standard Schema on receiving interfaces such as routes and RPC endpoints. Framework design varies from application to application, but the following is a starter that creates a runtime and statically type-safe function.

```typescript
import compile, { type Static } from 'typedriver'

// Callback
export type TCallback<
  Input extends unknown, 
  Output extends unknown
> = (value: Input) => Output

// Function Options
export type TOptions<
  Input extends unknown = unknown,
  Output extends unknown = unknown,
> = {
  input?: Input,
  output?: Output
}
// Function Factory
export function Func<const Options extends TOptions,
  Input extends unknown = Static<Options['input']>,
  Output extends unknown = Static<Options['output']>,
  Callback extends TCallback<Input, Output> = TCallback<Input, Output>
>(options: Options, func: Callback): Callback {
  const input = compile(options['input']) 
  const output = compile(options['output'])
  const callback = (value: unknown) => 
    output.parse(func(input.parse(value) as never))
  return callback as never
}

// Input/Output Validated Add Function
const add = Func({
  input: `{ a: number, b: number }`,  // TypeScript Input Definition
  output: { type: 'number' }          // JSON Schema Output Definition
}, ({ a, b }) => a + b)


const value = add({ a: 1, b: 2 })     // const value = 3 
```


## Benchmarks

TypeDriver uses TypeBox for validation, which is known for high performance and specification compliance. By transforming Standard Schema libraries that support JSON Schema, validation performance can be improved by several orders of magnitude. TypeDriver gives JSON Schema-supporting libraries the same performance characteristics as TypeBox.

Libraries marked as accelerated expose their JSON Schema representation, allowing TypeDriver to bypass the library's own validation logic and run validation directly through TypeBox instead.

```bash
┌────────────┬────────────┬─────────────┬────────────────┬───────────────┬──────────────┐
│ (idx)      │ iterations │ accelerated │ standard (...) │ compile (...) │ performance  │
├────────────┼────────────┼─────────────┼────────────────┼───────────────┼──────────────┤
│ typescript │ 16000000   │ true        │ "     28 ms"   │ "     29 ms"  │ "    0.97 ×" │
│ jsonschema │ 16000000   │ true        │ "     30 ms"   │ "     30 ms"  │ "    1.02 ×" │
│ zod        │ 16000000   │ true        │ "    612 ms"   │ "     29 ms"  │ "   21.10 ×" │
│ arktype    │ 16000000   │ true        │ "    530 ms"   │ "     27 ms"  │ "   19.32 ×" │
│ valibot    │ 16000000   │ true        │ "   4103 ms"   │ "     30 ms"  │ "  134.98 ×" │
└────────────┴────────────┴─────────────┴────────────────┴───────────────┴──────────────┘

Last Run: Tue Jun 23 2026
```

## Compression

TypeDriver is intended to be a server-side technology for high-throughput systems, but can also be used in browser environments. The library compresses to around 50kb gzipped.

```bash
$ deno task metrics
```

Compression Rates
```bash
┌───────┬─────────────────────────┬─────────────┬─────────────┬────────────┐
│ (idx) │ path                    │ bundled     │ minified    │ gzipped    │
├───────┼─────────────────────────┼─────────────┼─────────────┼────────────┤
│     0 │ "./task/metrics/all.ts" │ "519.58 KB" │ "266.53 KB" │ "51.99 KB" │
└───────┴─────────────────────────┴─────────────┴─────────────┴────────────┘
```

## Contribute

TypeDriver is open to community contribution. Please ensure you submit an issue before submitting a pull request. This project prefers open community discussion before accepting new features.