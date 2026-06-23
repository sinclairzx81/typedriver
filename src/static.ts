/*--------------------------------------------------------------------------

TypeDriver

The MIT License (MIT)

Copyright (c) 2025-2026 Haydn Paterson

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

// deno-lint-ignore-file ban-types
// deno-fmt-ignore-file

import { type TSchema, type TScript, type Static as TStatic } from 'typebox'
import { type StandardSchemaV1 } from '@standard-schema/spec'
import { type TValidator } from './validator.ts'

// ------------------------------------------------------------------
// StaticValidator
// ------------------------------------------------------------------
type StaticValidator<Type extends unknown> = Type

// ------------------------------------------------------------------
// StaticTypeScript
// ------------------------------------------------------------------
type StaticTypeScript<Type extends string,
  Schema extends TSchema = TScript<{}, Type>,
  Output extends unknown = TStatic<Schema>
> = Output

// ------------------------------------------------------------------
// StaticStandardSchema
// ------------------------------------------------------------------
type StaticStandardSchema<Type extends StandardSchemaV1,
  Output extends unknown = StandardSchemaV1.InferOutput<Type>
> = Output

// ------------------------------------------------------------------
// StaticJsonSchema
// ------------------------------------------------------------------
type StaticJsonSchema<Type extends TSchema,
  Output extends unknown = TStatic<Type>
> = Output

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type StaticType<Type extends unknown> = (
  Type extends TValidator<infer Type extends unknown> ? StaticValidator<Type> :
  Type extends string ? StaticTypeScript<Type> :
  Type extends StandardSchemaV1 ? StaticStandardSchema<Type> :
  Type extends TSchema ? StaticJsonSchema<Type> :
  unknown
)

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
/** Infers a static type from a runtime type definition */
export type Static<Schema, Type = StaticType<Schema>> = Type