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

import { type TSchema } from 'typebox'
import { type StandardSchemaV1 } from '@standard-schema/spec'
import { type Static } from './static.ts'

import { IsJsonSchema, IsStandardSchemaV1, IsStandardJsonSchemaV1, IsTypeScript } from './guard/index.ts'
import { JsonSchemaValidator } from './validators/json-schema/validator.ts'
import { StandardJsonSchemaValidator } from './validators/standard-json-schema/validator.ts'
import { StandardSchemaValidator } from './validators/standard-schema/validator.ts'
import { TypeScriptValidator } from './validators/typescript/validator.ts'
import { Validator } from './validator.ts'

// ------------------------------------------------------------------
// Validators
// ------------------------------------------------------------------
function CreateStandardSchemaV1Validator<Schema extends StandardSchemaV1>(input: Schema): Validator {
  return IsStandardJsonSchemaV1(input) ? new StandardJsonSchemaValidator(input) : new StandardSchemaValidator(input)
}
function CreateJsonSchemaValidator<Schema extends TSchema>(input: Schema): Validator {
  return new JsonSchemaValidator(input)
}
function CreateTypeScriptValidator<Script extends string>(input: Script): Validator {
  return new TypeScriptValidator(input)
}
// ------------------------------------------------------------------
// Compile
// ------------------------------------------------------------------
/** Compiles a schema into a typed Validator */
export type TCompile<Input, Output extends unknown = Static<Input>,
  Result extends Validator<Input, Output> = Validator<Input, Output>
> = Result
/** Compiles a schema into a typed Validator */
export function compile<const Input, Output extends Validator = TCompile<Input>>(input: Input): Output {
  return (
    IsTypeScript(input) ? CreateTypeScriptValidator(input) :
    IsStandardSchemaV1(input) ? CreateStandardSchemaV1Validator(input) :
    IsJsonSchema(input) ? CreateJsonSchemaValidator(input) :
    CreateJsonSchemaValidator({})
  ) as never
}
