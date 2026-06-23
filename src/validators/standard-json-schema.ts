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

import { Guard } from 'typebox/guard'
import { System } from 'typebox/system'
import { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import { type TValidator, type TErrorOptions, type TErrorResult, resolveErrorOptions } from '../validator.ts'
import { ParseError, errorToIssue, normalError } from '../errors/index.ts'
import { Validator as TBValidator } from 'typebox/schema'

type StandardJsonSchemaType = StandardJSONSchemaV1 & StandardSchemaV1

// ----------------------------------------------------------------
// Validator
// ----------------------------------------------------------------
export class StandardJsonSchemaValidator<Type extends unknown = unknown> implements TValidator<Type> {
  readonly _validator: TBValidator
  readonly _jsonSchema: Record<PropertyKey, unknown>
  readonly _schema: StandardJsonSchemaType
  constructor(schema: StandardJsonSchemaType) {
    this._schema = schema
    this._jsonSchema = TryJsonSchema(this._schema)
    this._validator = new TBValidator({}, this._jsonSchema)
  }
  public toType(): unknown {
    return this._schema
  }
  public isJsonSchema(): boolean {
    return true
  }
  public toJsonSchema(): Record<PropertyKey, unknown> {
    return this._jsonSchema
  }
  public isAccelerated(): boolean {
    return this._validator.IsAccelerated()
  }
  public check(value: unknown): value is Type {
    return this._validator.Check(value)
  }
  public parse(value: unknown): Type {
    if (!this._validator.Check(value)) throw new ParseError(value, this.errors(value))
    return value as never
  }
  public errors<Options extends Partial<TErrorOptions>>(value: unknown, options?: Options): TErrorResult<Options> {
    const config = resolveErrorOptions(options)
    System.Locale.Set(System.Locale[config.locale])
    const [_, errors] = this._validator.Errors(value)
    return (config.format === 'standard-schema'
      ? errors.map(error => errorToIssue(normalError(error)))
      : errors.map(error => normalError(error))
    ) as never
  }
}
// ----------------------------------------------------------------
// Specification Resolvers
// ----------------------------------------------------------------
function TryJsonSchema(input: StandardJSONSchemaV1): Record<PropertyKey, unknown> {
  const jsonschema = TryDraft202012(input) ?? TryDraft7(input) ?? TryOpenAPI30(input)
  if (Guard.IsUndefined(jsonschema)) throw Error(`Vendor '${input['~standard'].vendor}' advertised itself as a Standard JSON Schema but failed to produce a schematic. Submit an issue with the vendor.`)
  return jsonschema
}
function TryOpenAPI30(input: StandardJSONSchemaV1): Record<PropertyKey, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'openapi-3.0' })
  } catch {
    return undefined
  }
}
function TryDraft7(input: StandardJSONSchemaV1): Record<PropertyKey, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'draft-07' })
  } catch {
    return undefined
  }
}
function TryDraft202012(input: StandardJSONSchemaV1): Record<PropertyKey, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'draft-2020-12' })
  } catch {
    return undefined
  }
}
