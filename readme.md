<div align='center'>

<h1>TypeDriver</h1>

<p>Integration Driver for Runtime Type Systems</p>

<img src="typedriver.png" />

<br />
<br />

[![npm version](https://badge.fury.io/js/typedriver.svg)](https://badge.fury.io/js/typedriver)
[![Downloads](https://img.shields.io/npm/dm/typedriver.svg)](https://www.npmjs.com/package/typedriver)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Test](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typedriver/actions/workflows/build.yml)

</div>


## Example

Compile, Infer and Parse | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApgGjjATzCzgGUYBDGYZOAXzgDMo04ByQ4gEymADcsUNgChhAejFwAwmjCYso1ADsAzvABqWZDGgBmOAF4Us+QAoABgmFw4ADwBccJQFcQAI0HW4BRy-eebAC9fVw8oYTpzAEobWLj4hMSk5PiJY1UNLR0oXUd1CgxgLipoAB4AOkrELxTauvq4tJsHJ1DBHBqGru7GyRsfVv8oDp7Rnqa4YMGwzrG55LS6AD5RNIBJJUZPYU4STW09QzJKamRS3YhGOH3s3SWutN3rrMOjK3mPhb67EKGRz4BvViAz8YX+gMBEymoICEMhkjoq0kAAUKFAVAphMo1HBICpgNQIEojjc9OUwGiMaYkGM0tj4HiCcAiY53j84AAGPBw8bfFow4ZeAYARm5PIe3xBbUFQUcHPFvNi0OlERiCtpCKOlXKQA)

```typescript
import { compile, type Static } from 'typedriver'

// Compile

const Vector3 = compile(`{
  x: number
  y: number
  z: number
}`)                                                 // const Vector3: Validator<... {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }>

// Parse

const position = Vector3.parse({                    // const position: {
  x: 0,                                             //   x: number,
  y: 1,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```

## Overview

TypeDriver is a unified runtime validation and inference system for Json Schema, Standard Schema, and runtime TypeScript. It is designed for framework integration and offers simple Json Schema and Standard Schema integration using a common validation interface.

License MIT

## Contents

- [Overview](#Overview)
- [Compile](#Compile)
- [Validator](#Validator)
  - [Assert](#Assert)
  - [Check](#Check)
  - [Parse](#Parse)
  - [Errors](#VaErrorslidator)
- [Static](#Static)
- [Schema](#Schema)
- [Contribute](#Contribute)

## Compile

TypeDriver provides a single compile(...) function that accepts Json Schema, Standard Schema or TypeScript definition (expressed as a string). The function returns a Validator instance that can be used to check, parse and assert values.

```typescript
import { compile } from 'typedriver'
```

Use the compile function to compile TypeScript types | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4A1LMhjQAzHAC8KNGExYAFAAMErOHAAeALjicAriABGzFXApbdBo6oBeZvYaitcCgJSq37j56-ef7gPR+Ujz8gsJQIlp8AIYYwDRRYQA8AHSpADSIxr7ZObluAW6a2nbMaVl5FZX5gaqmxRZQZVXNlQXWtg1NLd3ZBbgAfOxcvHCQ3MAwwBCcEnACQqLJYFFQ3PJIxkUADF11AIxdNnBbjs5AA)

```typescript
const Vector3 = compile(`{
  x: number
  y: number
  z: number
}`)                                                // const Vector3: Validator<..., {
                                                   //   x: number,
                                                   //   y: number,
                                                   //   z: number,
                                                   // }>
```

... or Json Schema schematics | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV1AOwGd4A1LMhjQAzHAC8KNGExYAFEjhLlK1WtUB6DVJ79BwqCIBccPgEMMwGmYMAeAHSOANIlZLK1E6QgAjAFb6pC7qIaFhWsoAHiacAK4gPsxObnBQWACOscBpNCYA2qSRQWQUxaQAXqQAusFhdXARShQx8YlQyUpgxNSwwFjcJor1w+HaSuUtCcwpStGIcB5YXnFTLHi1I6ERuAB8M3DN84vLrcyk6-sTR1RLZCtt57gpT7gAlOxcvHCQ3MAwwBBOBJTPpRPYwGYoNx5EgUnMAAwdA4mACMSKu8NYbyAA)

```typescript
const Vector3 = compile({                           // const Vector3: Validator<..., {
  type: 'object',                                   //   x: number,
  required: ['x', 'y', 'z'],                        //   y: number,
  properties: {                                     //   z: number
    x: { type: 'number' },                          // }>
    y: { type: 'number' },
    z: { type: 'number' }
  }
})
```

... or libraries that implement Standard Schema | [Example](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgYwuYAbApnAvnAMyjTgHIYBPMLAEymADcspSAoV0SWOAKjgEMAznABehYiDIiINNq1QA7QfABqWZDGgBmOAF4UaMJiwAKEQDoIAIwBW6mCaRxnL12+cB6DwaWr72gC44FX4MYBp+TSgAHnM4gBpEVmcADyCLBQBXECtmEwBKRPdiktK3Lxc0uCyc5njkuAp08xrcqAKisq7uuArnJurstvrnEWbWvMKe6dK+0SCJqFZcfPyZ9Y3e71wAPnZFZThIQWAYYAgFPWD-KC1zMH4oQVMkBqqABhHGoIBGL7G4O9lvkgA)

```typescript
import * as z from 'zod'

const Vector3 = compile(z.object({                  // const Vector3: Validator<..., {
  x: z.number(),                                    //   x: number,
  y: z.number(),                                    //   y: number,
  z: z.number(),                                    //   z: number
}))                                                 // }>
```

## Validator

Validators contain functions to assert, parse and check JavaScript values.

### Assert

The assert(...) function will throw if the value is invalid.

```typescript
// Vector3.assert(value: unknown): asserts value is Vector3

Vector3.assert(value)                               
```

### Check

The check(...) returns a safe boolean result.

```typescript
// Vector3.check(value: unknown): value is Vector3

if(Vector3.check(value)) {

  const { x, y, z } = value // safe
}
```

### Parse

The parse(...) function checks and returns a value and throws on error.

```typescript
// Vector3.parse(value: unknown): Vector3

const { x, y, z } = Vector3.parse(value)                 
```

### Errors

The errors(...) function returns validation errors for a value.

```typescript
// Vector3.errors(value: unknown): object[]

const errors = Vector3.errors(value)              
```

## Static

TypeDriver provides a unified inference type called `Static<T>` that can infer types from Validator instances as well as Json Schema, Standard Schema or TypeScript syntax. The following infers a Validator.

```typescript
import { compile, type Static } from 'typedriver'

const Vector = compile(`{ 
  x: number,
  y: number,
  z: number
}`)

type Vector = Static<typeof Vector>                 // type Vector = {
                                                    //   x: number
                                                    //   y: number
                                                    //   z: number
                                                    // }
```

## Schema

Validator instances provide access to internal schematics if required. They also provide support for Validator to Json Schema translation in some cases, with fallbacks for manual Json Schema transformation if required.

```typescript
import { compile, type Static } from 'typedriver'

const validator = compile(...)


validator.isJsonSchema()    // Returns true if the validator can be converted to 
                            // Json Schema. This is true when the validator was 
                            // compiled with Json Schema or TypeScript, but false 
                            // if it was compiled with Standard Schema.

validator.asJsonSchema()    // Returns the Json Schema for the validator. If the 
                            // validator was compiled with Standard Schema, an 
                            // empty {} is returned to indicate an unknown 
                            // runtime schema.

validator.schema()          // Returns the schema that was passed to compile. This 
                            // can be used to manually transform the schema if 
                            // isJsonSchema() returns false.
```

## Contribute

TypeDriver is open to community contribution. Please ensure you submit an issue before submitting a pull request. This project prefers open community discussion before accepting new features.
