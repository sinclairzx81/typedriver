<div align='center'>

<h1>TypeDriver</h1>

<p>Integration Driver for High Performance Runtime Validation</p>

<img src="typedriver.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/typedriver.svg)](https://badge.fury.io/js/typedriver)
[![Downloads](https://img.shields.io/npm/dm/typedriver.svg)](https://www.npmjs.com/package/typedriver)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Test](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml)

</div>

## Install

```bash
$ npm install typedriver
```

## Example

```typescript
import { compile } from 'typedriver'

const Vec3 = compile(`{
  x: number,
  y: number,
  z: number
}`)

const normal = Vec3.parse({
  x: 0, 
  y: 1,
  z: 0
})
```

## Overview

TypeDriver is a runtime type system and integration driver for web frameworks that require both type inference and validation support for TypeScript, Json Schema and Standard Schema. It includes a high performance Json Schema validation compiler, integrated TypeScript engine, and seamless integration support for Standard Schema libraries.

TypeDriver has compilation support for Json Schema Drafts 3 through to 2020-12.

License MIT

## Contents

- [Overview](#Overview)
- [Framework](#Framework)
- [Compile](#Compile)
  - [Check](#Check)
  - [Parse](#Parse)
  - [Errors](#VaErrorslidator)
- [Static](#Static)
- [Reflect](#Schema)
- [Contribute](#Contribute)

## Framework

TypeDriver is designed specifically for framework developers who need to develop systems to host multiple type safe libraries on framework interfaces. It offers a simple infrastructure to connect type inference and validation to the framework, and is unopinionated with regards to framework design.

[Typescript](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YyAoEoAiBTAzgSwOYB2qYSZ5FcyADgPbYAuAFAOTAsA0oA3sqKACNaAEwCeALlAADXv34APSYQCuAWwGYAThz5yJoFeq065oAF5K1GzboC+U5La5NNmAI7KcDAJSgAvAB8PLoAxrSEjDyg8lyiXGagtv6grh5eAHRCYqBoDKLUmODYAIYAZpgAhI7eyCQQlA2N8HUAYprFqpgA7rSaANZ1TUPDyLiqdJoMUXkFoADKDMUMuCFcYeO4ADaYiaClmrSqoCwzmMKauABuWiy1mPITU7iEDFqlxSE7AEq0yq8A8tRluFsAAeABCIlEoHur0IwmwoGUhD6hFoXUIyWRqPRhCCskEUMkkLEjmQ90eoFOoB+f0wAGFiptNgIPn1QQAFJYACxh8jhCNAjAuhHwXEBwIifIFiNpAKBuBBQT8oCYuhc7k8jEk3CRmk2ki5DG5XCy+gWSxWoIlioiAG0WGaWABdIK2XyBUCXWi4YTIGoU3pTUrIkKS0B0RicnnSzDwxHC55i0BhCJTG0g2Pxmm-eWS7BcXSM5mskJ9ZJyhlMlls6PG8UKpXIAJMag8w08ri0RsRSQZiJraulvqSYs1su+AmpyJmgD6lyZvqWvWS62oW0wTG7+YdTudNX4uREtEk6TPoDG1G2nReKVzO02tHwKzJQA) | [Json Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YyAoEoAiBTAzgSwOYB2qYSZ5FcyADgPbYAuAFAOTAsA0oA3sqKACNaAEwCeALh59+oBqOqZJLWgIBWmAMYNO0-gCdMARwCuuA8MkBtFgA9OoFqPssAXiwC6HXaGp7aCvQZcHEleGRkbUNl5RQdCYwBbAUw9FlAAXy9w-gkeaIUleKSUtMzvfhcouQK4xOTUjKyZdOkWzNAmAxMcBgBKUABeAD4pfg1aQkY8my5RLhcMwdAu4x6AOiExUDRqzHBsAEMAM0wAQmR03uQSCEo7+-gbgDE9A4TMAHdaPQBrG4eAYDkLgEnRAnldqAAMoMA5BDRccag3AAG0wiyOfgSDl2wj0uAAbiVrpgbGCGKBcIQGCkjgcNOiAEq0Yw0gDy1CCE2wAB4AEIiUSgUk0wjCbCgYyEH6EWgfQhLKUyuWEEZhQSCyQCsQXZCk8n5JksmkAYQOKJRAnpPx5AAU4QALYU2UXi0CMfGEfBcDlcybO10S5mszC+3DckYDDrSTpGVaMKLGPQoyT2hgOribXIwuG4DQ8sPc6xZjwjS6DEYE2i4YTIK7674Uo5SrThhV0Rh2x0BzBiiUeqne0DjSYUwv+kW9t3B9mctvYLjSM0Wq0aH5LGeYZeW61d9M+ucR5BDJjUR2px1cfx+7CSccL4fmndryTb1c-frqkdTLMAfQJ5o1nC3xLEi1CopgTDXvOxaCh4Vz8DsIi0JIaxoZSoJou81LLMa6IorQ+B5rqQA) | [Standard Schema](https://www.typescriptlang.org/play/?target=99&module=7#code/PTAEFpK6dv4YyAoEoAiBTAzgSwOYB2qYSZ5FcyuAtgA4D2ATgC6gBUoAhtqAF6gAZkwY1QAcj4MAJuOTJG2FgApxwcQBpQAb2ShQAIxkBPAFz8AdAwMArTAGMVu-foAe5vhcIBXGgcxMygCUGnouZpY+fgHBoS78Hl6+-oEhYQC+QcjpWspMmACO3jgsQaAAvAB8OmH2DIRKOqCuWsZaAukVoPlFJRZG0sagaCzGdJjg2FyCmACE2VkkEJQrq-BLAGJMXDSYAO7MANZLa6dn1PTMbNqgo+OgAMosXCy49lp19LgANpigncJRBI7phpExcAA3AJyZCYVyMVigXCEFgBQRcex-ABKDG8qIA8nRXvVsAAeABCJlAcNRhGkvG8hEOhAYe0IXUZzNZhGqzkMJnMlMG2Vh8KutzG2NxqIAwlxvt8DBjDqSAAovAAW1NctPpoCU4MI+C0hOJDW1ut4OLxmFNuBJ1XKoGUYTyhWKSnMN28TG+5nVLA1WgGESeLzepLtJIA2uIQ+IALrVTIVaoQhi4aTILJwhFsQSMxz29mKFhqzUWzB03gG5HG0B1BpsKPmmlVvXWglE4vYLRhOUKpX2Q5dTuYAeK5XlwMm7sO5CVZR0TX+zVaBhzhrmFu9hvyyfD8wToeHMp8xuNEMAfQh8szL2YXU+dB+mGUG7N2Fj8YTWX0IxkBhzAsECkXoX5dhRbppT+b4GHwN4RSAA)

```typescript
post('/', {
  body: `{
    x: number,
    y: number,
    z: number
  }`
}, (request) => {
  const { x, y, z } = request.body // type-safe!
})
```

The above design is achieved in a few lines of code.

```typescript
import { type Static, compile } from 'typedriver'

export interface RouteOptions<Body extends unknown = unknown> {
  body: Body
}
export type RouteCallback<Path extends string, Options extends RouteOptions> = (
  (request: { url: Path, body: Static<Options['body']> }) => void
)
export function post<Path extends string, const Options extends RouteOptions, 
  Callback = RouteCallback<Path, Options>
>(path: Path, options: Options, callback: Callback) {
  const body_validator = compile(options['body'])
  // todo: ... implement route logic
}
```


## Compile

TypeDriver consists of a singular compile(...) function that accepts either a TypeScript, Json Schema and Standard Schema definition and returns an optimized Validator.

```typescript
import { compile } from 'typedriver'
```

Pass TypeScript definitions via strings. | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4A1LMhjQAzHAC8KNGExYAFAAMErOHAAeALjicAriABGzFXApbdBo6oBeZvYaitcCgJSq37j56-ef7gPR+Ujz8gsJQIlp8AIYYwDRRYQA8AHSpADSIxr7ZObluAW6a2nbMaVl5FZX5gaqmxRZQZVXNlQXWtg1NLd3ZBbgAfOxcvHCQ3MAwwBCcEnACQqLJYFFQ3PJIxkUADF11AIxdNnBbjs5AA)

```typescript
const Vec3 = compile(`{
  x: number
  y: number
  z: number
}`)
```

... or Json Schema | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4A1LMhjQAzHAC8KNGExYAFEjhLlK1WtUB6DVJ79BwqCIBccPgEMMwGmYMAeAHSOANIlZLK1E6QgAjAFb6pC7qIaFhWsoAHiacAK4gPsxObnBQWACOscBpNCYA2qSRQWQUxaQAXqQAusFhdXARShQx8YlQyUpgxNSwwFjcJor1w+HaSuUtCcwpStGIcB5YXnFTLHi1I6ERuAB8M3DN84vLrcyk6-sTR1RLZCtt57gpT7gAlOxcvHCQ3MAwwBBOBJTPpRPYwGYoNx5EgUnMAAwdA4mACMSKu8NYbyAA)

```typescript
const Vec3 = compile({ 
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' }
  }
})
```

... or libraries that implement Standard Schema | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV0SWOAKjgEMAznABehYiDIiINNq1QA7QfABqWZDGgBmOAF4UaMJiwAKEQDoIAIwBW6mCaRxnL12+cB6DwaWr72gC44FX4MYBp+TSgAHnM4gBpEVmcADyCLBQBXECtmEwBKRPdiktK3Lxc0uCyc5njkuAp08xrcqAKisq7uuArnJurstvrnEWbWvMKe6dK+0SCJqFZcfPyZ9Y3e71wAPnZFZThIQWAYYAgFPWD-KC1zMH4oQVMkBqqABhHGoIBGL7G4O9lvkgA)

```typescript
import * as z from 'zod'

const Vec3 = compile(z.object({ 
  x: z.number(),  
  y: z.number(), 
  z: z.number(), 
}))
```


## Validator

The compile(...) function returns Validator instances to Check, Parse and report Errors for JavaScript values.

### Check

The check(...) returns a boolean result.

```typescript
// Vec3.check(value: unknown): value is Vec3

if(Vec3.check(value)) {

  const { x, y, z } = value // safe
}
```

### Parse

The parse(...) function returns if valid, otherwise throws.

```typescript
// Vec3.parse(value: unknown): Vec3

const { x, y, z } = Vec3.parse(value)                 
```

### Errors

The errors(...) function returns diagnostics (use only after failed check)

```typescript
// Vec3.errors(value: unknown): object[]

const errors = Vec3.errors(value)              
```

## Static

The Static type that can infer TypeScript, Json Schema and Standard Schema | [Example](https://www.typescriptlang.org/play/?target=99&module=7#code/JYWwDg9gTgLgBAbzjAnmApnAyjAhjYAYzgF84AzKCEOAclQwBMpgA3dKWgKC4Hpe4ASQB25DsjToAzhSo1cAGwXIAFsGEBzKQEIeDTAEE4AXmx4ChADwADJFzhwAHgC44wgK4gARhwA09uBRXD28-AIAvYM8fKC4SawA+PUk4ACETM3wiSwQA-VdaCC8AK3RCGFp-Byh0AEd3YBrGVwBtWkdKuhRO2nDaAF0quDAqDFhgaVdchwcXRAkMApCY2lIhhyD5-LpljlWSdbhIrckl6L21gJI4pK5QSFg4ACo4XBlw2Wo6cIhGbi5CBBhFJ4ABhDLhAB0RVK5QAFNMnK4obsoHCAJRDTYo85ozERZGQ1EY-wkdFcfRwcGmHBZKz6CDkKm3IA)

```typescript
import { type Static } from 'typedriver'

// Infer types from all things!

type A = Static<`{ 
  x: number,
  y: number,
  z: number
}`>

type B = Static<{
  type: 'object',
  required: ['x', 'y', 'z'],
  properties: {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },
  }
}>

import * as z from 'zod'

const C = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
})
type C = Static<typeof C>


```

## Reflect

Validators can reflect back a Json Schema representation if the underlying type supports it. This is true for all TypeScript and Json Schema source types. Reflect can be used for OpenAPI metadata publishing, or RPC systems that need to publish Json based IDL (interface definition language) to remote callers. Validators provide two functions for this.

```typescript
import { compile, type Static } from 'typedriver'

const validator = compile(...)

validator.isJsonSchema()    // Returns true if the validator can be converted to 
                            // Json Schema. This is true when the validator was 
                            // compiled with Json Schema or TypeScript, but false 
                            // if it was compiled with Standard Schema.

validator.toJsonSchema()    // Returns the Json Schema for the validator. If the 
                            // validator was compiled with Standard Schema, an 
                            // empty {} is returned to indicate an unknown 
                            // runtime schema.
```
The source type used for compilation can also be returned via

```typescript
validator.schema()          // will return the schematic used for compile.
```

## Contribute

TypeDriver is open to community contribution. Please ensure you submit an issue before submitting a pull request. This project prefers open community discussion before accepting new features.
