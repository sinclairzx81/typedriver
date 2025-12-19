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

import { System } from 'typebox/system'
import { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import { Validator, type TErrorOptions, type TErrorResult, resolveErrorOptions } from '../../validator.ts'
import { ParseError, errorToIssue, normalError } from '../../errors/index.ts'
import { Validator as TBValidator } from 'typebox/compile'
import { resolveJsonSchema } from './resolve.ts'

export class StandardJsonSchemaValidator<Input extends StandardJSONSchemaV1 & StandardSchemaV1, 
  Output extends unknown = StandardSchemaV1.InferOutput<Input>
> extends Validator<Input, Output> {
  private readonly validator: TBValidator<{}, Record<string, unknown>>
  constructor(private readonly input: Input) {
    super()
    const schema = resolveJsonSchema(input)
    this.validator = new TBValidator({}, schema)
  }
  // ----------------------------------------------------------------
  // Schema
  // ----------------------------------------------------------------
  public override schema(): Input {
    return this.input
  }
  // ----------------------------------------------------------------
  // Json Schema
  // ----------------------------------------------------------------
  public override isJsonSchema(): boolean {
    return true
  }
  public override toJsonSchema(): unknown {
    return this.validator.Type()
  }
  // ----------------------------------------------------------------
  // Acceleration
  // ----------------------------------------------------------------
  public override isAccelerated(): boolean {
    return this.validator.IsEvaluated()
  }
  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------
  public override check(value: unknown): value is Output {
    return this.validator.Check(value)
  }
  public override parse(value: unknown): Output {
    if (!this.validator.Check(value)) throw new ParseError(value, this.errors(value))
    return value as never
  }
  public override errors<Options extends Partial<TErrorOptions>>(value: unknown, options?: Options): TErrorResult<Options> {
    const config = resolveErrorOptions(options)
    System.Locale.Set(System.Locale[config.locale])
    const errors = this.validator.Errors(value)
    return (config.format === 'standard-schema'
      ? errors.map(error => errorToIssue(normalError(error)))
      : errors.map(error => normalError(error))
    ) as never
  }
}
