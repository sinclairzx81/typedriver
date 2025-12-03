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

import Type from 'typebox'
import { type StandardSchemaV1, type StandardJSONSchemaV1 } from './_standard/standard-schema.ts'
import { IsJsonSchema, IsStandardSchemaV1, IsStandardJsonSchemaV1, IsTypeScript } from './guard/index.ts'
import { JsonSchemaValidator } from './validators/json-schema/validator.ts'
import { StandardJsonSchemaValidator } from './validators/standard-json-schema/validator.ts'
import { StandardSchemaValidator } from './validators/standard-schema/validator.ts'
import { TypeScriptValidator } from './validators/typescript/validator.ts'
import { Validator } from './validator.ts'

// ------------------------------------------------------------------
// Standard Json Schema
// ------------------------------------------------------------------
type TFromStandardSchema<Input extends StandardSchemaV1, 
  Output extends unknown = StandardSchemaV1.InferInput<Input>, 
  Result extends Validator = Validator<Input, Output>
> = Result
function FromStandardSchema<Schema extends StandardSchemaV1>(schema: Schema): TFromStandardSchema<Schema> {
  return new StandardSchemaValidator(schema)
}
// ------------------------------------------------------------------
// Standard Schema
// ------------------------------------------------------------------
type TFromStandardJsonSchema<Input extends StandardSchemaV1 & StandardJSONSchemaV1, 
  Output extends unknown = StandardSchemaV1.InferInput<Input>, 
  Result extends Validator = Validator<Input, Output>
> = Result
function FromStandardJsonSchema<Schema extends StandardSchemaV1 & StandardJSONSchemaV1>(schema: Schema): TFromStandardSchema<Schema> {
  return new StandardJsonSchemaValidator(schema)
}
// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
type TFromJsonSchema<Input extends Type.TSchema, 
  Output extends unknown = Type.Static<Input>, 
  Result extends Validator = Validator<Input, Output>
> = Result
function FromJsonSchema<Schema extends Type.TSchema>(schema: Schema): TFromJsonSchema<Schema> {
  return new JsonSchemaValidator(schema)
}
// ------------------------------------------------------------------
// TypeScript
// ------------------------------------------------------------------
type TFromTypeScript<Input extends string, 
  Schema extends Type.TSchema = Type.TScript<{}, Input>, 
  Output extends unknown = Type.Static<Schema>, 
  Result extends Validator = Validator<Input, Output>
> = Result
function FromTypeScript<Script extends string>(script: Script): TFromTypeScript<Script> {
  return new TypeScriptValidator(script)
}
// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
/** Compiles a schema into a typed Validator */
export type TCompile<Schema extends unknown> = (
  Schema extends string ? TFromTypeScript<Schema> : 
  Schema extends StandardSchemaV1 ? (
    Schema extends StandardJSONSchemaV1
      ? TFromStandardJsonSchema<Schema>
      : TFromStandardSchema<Schema> 
  ) : 
  Schema extends Type.TSchema ? TFromJsonSchema<Schema> : 
  TFromJsonSchema<{}>
)
/** Compiles a schema into a typed Validator */
export function compile<const Schema extends unknown>(schema: Schema): TCompile<Schema> {
  return (
    IsTypeScript(schema) ? FromTypeScript(schema) : 
    IsStandardSchemaV1(schema) ? (
      IsStandardJsonSchemaV1(schema)
        ? FromStandardJsonSchema(schema) 
        : FromStandardSchema(schema) 
    ) : 
    IsJsonSchema(schema) ? FromJsonSchema(schema) : 
    FromJsonSchema({})
  ) as never
}
