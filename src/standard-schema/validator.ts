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

import { StandardSchemaV1 } from '../_standard/standard-schema.ts'
import { ParseError, UnknownError } from '../errors.ts'
import { Validator } from '../validator.ts'

export class StandardSchemaValidator<Input extends StandardSchemaV1,
  Output extends unknown = StandardSchemaV1.InferOutput<Input>
> extends Validator<Input, Output> {
  constructor(private readonly input: Input) {
    super()
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
  public override  isJsonSchema(): boolean {
    return false
  }
  public override  toJsonSchema(): unknown {
    return {}
  }
  // ----------------------------------------------------------------
  // Accelerated
  // ----------------------------------------------------------------
  public override isAccelerated(): boolean {
    return false
  }
  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------
  public override check(value: unknown): value is Output {
    const result = this.input['~standard'].validate(value)
    return !('issues' in result)
  }
  public override  parse(value: unknown): Output {
    const result = this.input['~standard'].validate(value)
    if ('issues' in result) throw new ParseError(result.issues as never || [])
    if ('value' in result) return result.value as never
    throw new UnknownError('Invalid result')
  }
  public override  errors(value: unknown): object[] {
    const result = this.input['~standard'].validate(value)
    if ('issues' in result) return result.issues as object[] || []
    return []
  }
}
