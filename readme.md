<div align='center'>

<h1>TypeDriver</h1>

<p>Unified Runtime Validation and Inference Driver for TypeScript</p>

<img src="typedriver.png" />

<br />
<br />

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Test](https://github.com/sinclairzx81/universal-schema/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/universal-schema/actions/workflows/build.yml)

</div>


## Example

Compile, Infer and Parse

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

// Infer

type Vector3 = Static<typeof Vector3>               // type Vector3 = {
                                                    //   x: number,
                                                    //   y: number,
                                                    //   z: number
                                                    // }

// Parse

const position = Vector3.parse({                    // const position: {
  x: 0,                                             //   x: number,
  y: 1,                                             //   y: number,
  z: 0                                              //   z: number
})                                                  // } = ...
```

## Overview

TypeDriver is a unified runtime validation and inference system for Json Schema, Standard Schema and Runtime TypeScript. It is designed for framework integration and offers simple JSON Schema and Standard Schema integration using a common Validation interface.

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

Use the compile function can compile TypeScript types ...

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

... or Json Schema schematics

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

... or libraries that implement Standard Schema.

```typescript
import * z from 'zod'

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

TypeDriver provides a single inference type called `Static<T>` that can infer types from Validator instances.

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

Validator instances provide access to internal schematics if required. They also provide support for Validator to JSON Schema translation in some cases, with fallbacks for manual JSON Schema transformation if required.

```typescript
import { compile, type Static } from 'typedriver'

const validator = compile(...)

validator.isJsonSchema()    // Returns true if the Validator can be converted to 
                            // JSON Schema. This will be true for the validator 
                            // was compiled with JSON Schema or Typescript, but 
                            // will be false if the validator was compiled with 
                            // Standard Schema.

validator.asJsonSchema()    // Returns the Json Schema for the validator. If the 
                            // Validator was compiled with Standard Schema, an 
                            // empty {} will be returned which is used to indicate 
                            // an unknown runtime schema.

validator.schema()          // Returns the schema that was passed to compile. This 
                            // can be used to manually transform if isJsonSchema()
                            // returns false.
```

## Contribute

TypeDriver is open to community contribution. Please ensure you submit an issue before submitting a pull request. This project prefers open community discussion before accepting new features.