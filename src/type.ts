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

import { Script, type TSchema, type TScript, type Static } from 'typebox'
import { type StandardSchemaV1 } from '@standard-schema/spec'

import { IsJsonSchema, IsStandardSchemaV1, IsStandardJsonSchemaV1, IsTypeScript } from './guard/index.ts'
import { JsonSchemaValidator } from './validators/json-schema.ts'
import { StandardJsonSchemaValidator } from './validators/standard-json-schema.ts'
import { StandardSchemaValidator } from './validators/standard-schema.ts'
import { TValidator } from './validator.ts'

// ------------------------------------------------------------------
// StandardSchema
// ------------------------------------------------------------------
type TFromStandardSchema<Schema extends StandardSchemaV1,
  Type extends unknown = StandardSchemaV1.InferInput<Schema>,
  Result extends TValidator = TValidator<Type>
> = Result
function FromStandardSchema<Schema extends StandardSchemaV1>(schema: Schema): TFromStandardSchema<Schema> {
  return IsStandardJsonSchemaV1(schema) ? new StandardJsonSchemaValidator(schema) : new StandardSchemaValidator(schema) 
}

// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
type TFromJsonSchema<Schema extends TSchema,
  Type extends unknown = Static<Schema>,
  Result extends TValidator = TValidator<Type>
> = Result
function FromJsonSchema<Schema extends TSchema>(schema: Schema): TFromJsonSchema<Schema> {
  return new JsonSchemaValidator(schema, schema as Record<PropertyKey, unknown>) as never
}

// ------------------------------------------------------------------
// TypeScript
// ------------------------------------------------------------------
type TFromTypeScript<Script extends string,
  Schema extends TSchema = TScript<{}, Script>,
  Type extends unknown = Static<Schema>,
  Result extends TValidator = TValidator<Type>
> = Result
function FromTypeScript<Script extends string>(script: Script): TFromTypeScript<Script> {
  const schema = Script({}, script)
  return new JsonSchemaValidator(script, schema as Record<PropertyKey, unknown>)
}

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Compiles a type definition into a high performance Validator */
export type TType<Type extends unknown, Result extends TValidator = (
  Type extends string ? TFromTypeScript<Type> :
  Type extends StandardSchemaV1 ? TFromStandardSchema<Type> :
  Type extends TSchema ? TFromJsonSchema<Type> :
  TFromJsonSchema<{}>
)> = Result
/** Compiles a type definition into a high performance Validator */
export function type<const Type extends unknown>(type: Type): TType<Type> {
  return (
    IsTypeScript(type) ? FromTypeScript(type) :
    IsStandardSchemaV1(type) ? FromStandardSchema(type) :
    IsJsonSchema(type) ? FromJsonSchema(type) :
    FromJsonSchema({})
  ) as never
}
