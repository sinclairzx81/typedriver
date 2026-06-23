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

import { StandardSchemaV1 } from '@standard-schema/spec'
import { ParseError, UnknownError, issueToError, normalIssue } from '../errors/index.ts'
import { type TValidator, type TErrorOptions, type TErrorResult, resolveErrorOptions } from '../validator.ts'

// ----------------------------------------------------------------
// Validator
// ----------------------------------------------------------------
export class StandardSchemaValidator<Type extends unknown = unknown> implements TValidator<Type> {
  readonly _schema: StandardSchemaV1
  constructor(schema: StandardSchemaV1) {
    this._schema = schema
  }
  public toType(): unknown {
    return this._schema
  }
  public isJsonSchema(): boolean {
    return false
  }
  public toJsonSchema(): Record<PropertyKey, unknown> {
    return {}
  }
  public isAccelerated(): boolean {
    return false
  }
  public check(value: unknown): value is Type {
    const result = this._schema['~standard'].validate(value)
    return !('issues' in result)
  }
  public parse(value: unknown): Type {
    const result = this._schema['~standard'].validate(value)
    if ('issues' in result) throw new ParseError(value, result.issues as never ?? [])
    if ('value' in result) return result.value as never
    throw new UnknownError('Invalid result')
  }
  public errors<Options extends Partial<TErrorOptions>>(value: unknown, options?: Options): TErrorResult<Options> {
    const result = this._schema['~standard'].validate(value)
    const issues = (('issues' in result) ? result.issues : []) as StandardSchemaV1.Issue[]
    const config = resolveErrorOptions(options)
    return (config.format === 'json-schema'
      ? issues.map(issue => issueToError(normalIssue(issue)))
      : issues.map(issue => normalIssue(issue))
    ) as never
  }
}
