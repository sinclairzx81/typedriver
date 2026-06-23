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

Compile TypeScript Definitions into High Performance Validators

```typescript
import compile from 'typedriver'

const Vector = compile(`{
  x: number
  y: number
  z: number
}`)

const value = Vector.parse(data)                    // const value: {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // } = ...
```

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script)


## Overview

TypeDriver is a runtime type system that compiles TypeScript, JSON Schema and Standard Schema definitions into high performance validators. It works by transforming definitions into a common Type IR then uses JIT compilation to produce a uniform high performance validator.

TypeDriver is designed to use the inference performance provided by TypeScript 7 native compiler as well as to promote validation using established industry specifications, specifically JSON Schema. It can be used either as a standalone validator or integrated into REST and RPC services to help validate data received over the wire.

License MIT

## Contents

- [Compile](#Compile)
- [Validate](#Validate)
- [Static](#Static)
- [Script](#Script)
- [Reflect](#Reflect)
- [Integrate](#Integrate)
- [Benchmarks](#Benchmarks)
- [Compression](#Compression)
- [Contribute](#Contribute)


## Compile

[TypeScript](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoAqBPADgUwMoDGATgJbYAuqYStd9D4ypAttgPbEWgDeoh7NqQA2uUAF9QAM2KDQAcgo5cAEzIA3XMXnJkAgHYBnbgDVchCpwDMoALz9B2EbgAUAAx7JQoAB4AuUH0AVxYAIy0AGi9QTADgsMjogC84kPDiZHE3AEpdFXNhAENiMQNjUHVC4SDcAKD9AGt9dgB3fV0y7g5DUgpSdn07UDMLawA6bGLDV0rq3GzvRaXFtE7Qbt7+-QDPZb39g8OjpbRvf0C0xOPrm5vTmNSE4ijb17eTsG8Ui6fo9--rmhJPYxqCgA) | [JSON Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoBSBnA9gO1AMoDGAFgKYC2AhqmEvQ40+MgJYUAO2ATgC6gBvUEWydWAGzKgAvqABm3UaADkvAJ4cyAE26sAbmW7LkyEbkz8AamSK8eAZlABeYaI4SyACgHJQodZoAXCrYAEYAVja8ygA0vqDcZACOAK6siVrBANrKAB6xKmoFygBeygC6cX4cipp8rGSYwT5+frnN-hpkwcq4KRShhsoyVa1qHQHdKn0DQyPxfiUTXT0zg0Yy8dLI0gCUJlo24lSJrub8elTiKVMpuADWuNgA7rgmZhagXJisvKx4zlA1lsDgAdBwTpgvJdrmRdq0EYi0B9+N9fv9cM0Foicbi8fiCaA0G1gmtDKNCZSqYTiaBxqAydwKdSWayiWBFqT+utsWy+QS0LIXKCRUA) | [Standard Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YpAoEoDKAXAhgOwCbYBO+GAxgBYCmAttgFygBaA9vqmEl9z7+MgEsaABxZFMoMixECANlVAAzItNAByTAE9hVfEQEA3KkTXJBIsRIBeSlTXVW2p5FNwBnCQDUqZTGIDMoAC8ktLCclQAFFYAdCwARgBWPpiRAN7IoKAAHoyxuACuNPHGkQCUADSZoJp5MYXFpZXVVnUNJUTlVQC+ZWVm+D6yxAquHqAG2LIFVIwFuADWuCwA7rhmYxKibgKYAiy4waDevgExwsRuUZPTVGVZD48PaJug27v7uIwZT79--wDAY80FlcqB2sYqkDoTCYSCaowIUQobDUWjnmAsq1wUUOtV0QToWhukcYmSgA)

TypeDriver exports a single compile(...) function that accepts any TypeScript, JSON Schema, or Standard Schema definition. The function will immediately JIT compile the definition into an high-performance validator instance. If the environment does not support JIT (such as Cloudflare), TypeDriver will automatically fallback to dynamic checking.

```typescript
import compile from 'typedriver'
```

### TypeScript

```typescript
const User = compile(`{
  name: string
}`)
```

### JSON Schema

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

### Standard Schema

```typescript
const User = compile(z.object({
  name: z.string(),
}))
```


## Validate

TypeDriver validators provide 3 validation functions.


### Parse

Use parse for check-and-return, otherwise throw

```typescript
const { x, y, z } = Vector.parse(data)
```

### Check

Use check for fast boolean result

```typescript
if(Vector.check(data)) {
  const { x, y, z } = data      
}
```

### Errors

Use errors to get diagnostics after a failed check

```typescript
const errors = Vector.errors(data, {
  format: 'standard-schema',                         // (default) 'json-schema'
  locale: 'ko_KR'                                    // (default) 'en_US'
})
console.log(errors)
```

## Static

Examples: [TypeScript](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKC4cwBU4AXmx4ChADwADJK1wAbAK7oAXHAB2ikACMOpKQD44xk6bNwA9BeRoBwxF3NPnL128vXjcpao1bdUI7uwSHuVqRAA) | [JSON Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKC4cwBU4AXmx4ChADxI4M2XPkLF8gPTLkaAcMRcZfAFx0IAIwBW6QjFoAaJbbuLVs1rgA2AV3QGAdm5BGOOnBQ6ACObsDBjAYA2rTO7ui0ALo29mkqaiSBYFQYsMDoAM4GCIEy8R4lcGWy+nQ+fhy01XJZMlkkAHxAA) | [Standard Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKFEljgBeFKjVoCIjbl0IQAdgGd4AFTgBeQQDoIAIwBW6QjAAUSOGfMXLXM61wAbAK7oAXJtkOQ2jkYCUcLiQ+XFwMmCrqOPhEADyhEORwSgB8lqlp6XAA9JnIaGFqiP4ZxSWlxdnmto4ucO6eHEVlTc0ZFSRAA)

TypeDriver has unified type inference for TypeScript, JSON Schema, and Standard Schema. Use the `Static<T>` type to derive a static TypeScript type from any runtime type definition.

### TypeScript

```typescript
import { type Static } from 'typedriver'

type T = Static<`{ value: number }`>                // type T = {
                                                    //   value: number
                                                    // }
```

### JSON Schema

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

### Standard Schema

```typescript
import { type Static } from 'typedriver'

const T = z.object({                
  value: z.number() 
})

type T = Static<typeof T>                           // type T = { 
                                                    //   value: number 
                                                    // }
```


## Script

[Options](https://www.typescriptlang.org/play/?target=99&module=7#code/FASwtgDg9gTgLgAgN4IMZUiANgUwQXwQDMYMEByOATwhwBMYQA3HGc4YdAOwGdEA1HKjiwEAXjQYI2HAAoABkmAIEADwBcCLgFcwAI1YIA7iDgALZAjAgu4XZoAMAGisBDVXbCaAjASfKEKk0dfUMTc0trWzB7BGc3DxivBF98YEJwiyUVOhweVEYIOBAoLk1yACYAEQRBYVEAFRocdnx5AEoObh4oXAA6LCgAc1k6kRg+kQApHq4AZVQzHDBXWXb2lU2t7c2Ael3kAJ3jk9Oz0-3N6lpyqD0AKyE4cn9zt-ePhEuVGBwAR20IF+dE0AG0KKoXhQqOQEABdV6fJHIlTfBAQUi0eAgPKabIognvNEqDSWI6EinHYlXZrlEIGNgucmUlmog47KKeRxM1m8tnHFaJWK+Zl8wnU-CIsWU6lBMnSlnUlTXHB03QMqGihVIpVWGxcuJS7Uo3WCg0i43i9mbNKWgloyVau3nNG5fKFYqlcrVWpPRrNdjO5GXNJAA) | [Referential](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4AVAII06WbtzgBeOAAMErOHF5QsWGAC5FMepwDm8lMEoalwXftQBXTlorGtpvbmkcIPfgFVuzSTLkLOAIYgWHbaegpYIAGYoQ76AcLKYhoAJAiCiaLcuKxOLm5wfAAKxDQWyPBSsvrANLFm-kEhmmH6YPTIzZwWIABGzLnOXLyFAPJQNN5VfnAWXlCp6Z7MOQrtEGUV3IvFpeUwuADaALqD7MPw45NQPqjo2AAUfFfMAJQKH58KAPTfKK4jF4LQoANQCGFqARg0AAPDMvgjEUjkR9fh85swNPCUTjcZ80Z9AsF6joANz6PGUnEEj6RaIYEnkqnM5E0hQJETJRAUlm8n5-BFKFTqFoOJl8iVsj7IQy2UW6cUS3lShSWaxQOUmBU8pVUqW4RW6vUCvCGo14mnrTYwbbc83MqVE5pask6+0oqW1Rlu91IqXtYCdDTdPrMM2+v0mo7HcMRhFo3AAPlYQA) | [Generics](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4BxLJ2bBkcALxwAPABU4WAB4xBNbnF71OAcwB8ACmkAuONICU47XAAGSVnDjyjAEgTTcAGji24FJy-ytcSzgAQ1UuXnZw+GkANSxkGGhxOAEhemRdUk4AVxAAI2ZSMzsS0rKSgHoKlAgeaLiE6CNrT3K29o7OrqqShzgc-OY3Ly7RsbGeux9+3IKoEfHFpcrqwOTLADoty0ja3jgGxKhk1HRsfUPoYuW4HqiD+KOjWOCMYBpgo8kEBZu-zsm9iMAzmv3+4LKgOmA2YYIh8J6uG0rCAA) | [Programmable](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4AVAGpZkMaHAC8cAAYJWcOAA8AXHE4BXEACNmcuBRXqtO+QC8DG7VFa4p7Lrzh8AsgEMw1GhOkASBIOGiUPhYCjBYnDTciLrKcMCcBMxwABoANLr6cQlJAJrppirxiVBwAFrWcAD8cADaaXB5ZQC6cAZYTFC2HBA88K7utF6o6NgAFM5uHgCU8rNz8wsA9IsoPQ79HiqCLhjANC6BADw1ugtn5xeXF8uzhpapcKdXzy-PN-J3zA9Pr79-8u9VBZjP9Qb8bk0AHxAA)

TypeDriver has full compile and type inference support for TypeScript definitions encoded in strings. 

### Options

Use the `with` keyword to augment types with data constraints and annotations. 

```typescript
const Vector = compile(`{
  x: number with { minimum: 0, maximum: 1 },
  y: number with { minimum: 0, maximum: 1 }
} with {
  description: '2D Vector Type'
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
                                                   //   description: '2D Vector Type'
                                                   // }
```

### Referential

Referential types can be modelled in the following way.

```typescript
const TAddress = `{
  street: string
  city: string
  country: string
}`
const TUser = `{
  name: string
  email: string
  address: ${TAddress}
}`
const TProduct = `{
  id: string
  name: string
  price: number
}`
const TOrder = `{
  user: ${TUser}
  products: ${TProduct}[]
}`

const Order = compile(TOrder)           // const Order: TValidator<{
                                        //   user: {
                                        //     name: string;
                                        //     email: string;
                                        //     address: {
                                        //       street: string;
                                        //       city: string;
                                        //       country: string;
                                        //     };
                                        //   };
                                        //   products: {
                                        //     name: string;
                                        //     id: string;
                                        //     price: number;
                                        //   }[];
                                        // }>
```

### Generics

Generic types can be created the following way

```typescript
const Generic = <T extends string>(T: T) => `{ 
  x: ${T}, 
  y: ${T} 
}` as const

const TVector = Generic('number')                  // const TVector: `{ 
                                                   //   x: number,
                                                   //   y: number
                                                   // }` = `...`

const Vector = compile(TVector)                    // const Vector: TValidator<{
                                                   //   x: number
                                                   //   y: numer
                                                   // }>
```

## Programmable

Programmable Mapped and Conditional types are supported.

```typescript
const TVector = `{
  x: number
  y: number
  z: number
}`

const TMapped = `${TVector} extends {
  x: infer X,
  y: infer Y,
  z: infer Z
} ? [X, Y, Z] : never`

const Mapped = compile(TMapped)                    // const Mapped: TValidator<[
                                                   //   number, 
                                                   //   number, 
                                                   //   number
                                                   // ]>
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

TypeDriver is designed for framework integration. The following is a starter script for a runtime and static type-safe function that is able to accept any TypeScript, JSON Schema or Standard Schema definition.

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