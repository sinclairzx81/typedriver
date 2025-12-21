/*--------------------------------------------------------------------------

TypeDriver

The MIT License (MIT)

Copyright (c) 2025 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// deno-fmt-ignore-file

import { type TSchema, type TScript, type Static as TStatic } from 'typebox'
import { type StandardSchemaV1 } from '@standard-schema/spec'
import { type Validator } from './validator.ts'

// ------------------------------------------------------------------
// StaticValidator
// ------------------------------------------------------------------
type StaticValidator<_Input extends unknown, Output extends unknown> = (
  Output
)
// ------------------------------------------------------------------
// StaticTypeScript
// ------------------------------------------------------------------
type StaticTypeScript<Input extends string,
  Schema extends TSchema = TScript<{}, Input>,
  Output extends unknown = TStatic<Schema>
> = Output
// ------------------------------------------------------------------
// StaticStandardSchema
// ------------------------------------------------------------------
type StaticStandardSchema<Input extends StandardSchemaV1,
  Output extends unknown = StandardSchemaV1.InferOutput<Input>
> = Output
// ------------------------------------------------------------------
// StaticJsonSchema
// ------------------------------------------------------------------
type StaticJsonSchema<Input extends TSchema,
  Output extends unknown = TStatic<Input>
> = Output
// ------------------------------------------------------------------
// Infers a TypeScript Type from Json Schema, Standard Schema or TypeScript DSL
// ------------------------------------------------------------------
type StaticInput<Input extends unknown> = (
  Input extends Validator<infer Input extends unknown, infer Output extends unknown> ? StaticValidator<Input, Output> :
  Input extends string ? StaticTypeScript<Input> :
  Input extends StandardSchemaV1 ? StaticStandardSchema<Input> :
  Input extends TSchema ? StaticJsonSchema<Input> :
  unknown
)
// ------------------------------------------------------------------
// Infers a TypeScript Type from Json Schema, Standard Schema or TypeScript DSL
// ------------------------------------------------------------------
export type Static<Input, Output = StaticInput<Input>> = Output