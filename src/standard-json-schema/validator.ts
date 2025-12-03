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

import { StandardJSONSchemaV1, StandardSchemaV1 } from '../_standard/standard-schema.ts'
import { ParseError } from '../errors.ts'
import { Validator } from '../validator.ts'
import { Validator as TBValidator } from 'typebox/compile'
import { ResolveJsonSchema } from './resolve.ts'

/**
 * High-performance Json Schema validator that uses library-specific
 * inference mechanisms. The validator assumes the source library
 * produces accurate schematics that encode the runtime
 * representations of its types.
 *
 * Note:
 *
 * Standard JSON Schema does not advertise which Draft versions it
 * supports, and the resolver is using try/catch resolution. This
 * should be brought up in RFC feedback.
 */
export class StandardJsonSchemaValidator<Input extends StandardJSONSchemaV1 & StandardSchemaV1, 
  Output extends unknown = StandardSchemaV1.InferOutput<Input>
> extends Validator<Input, Output> {
  private readonly validator: TBValidator<{}, Record<string, unknown>>
  constructor(private readonly input: Input) {
    super()
    const schema = ResolveJsonSchema(input)
    this.validator = new TBValidator({}, schema)
  }
  // ----------------------------------------------------------------
  // Accelerated
  // ----------------------------------------------------------------
  public override accelerated(): boolean {
    return this.validator.IsEvaluated()
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
  // Validation
  // ----------------------------------------------------------------
  public override check(value: unknown): value is Output {
    return this.validator.Check(value)
  }
  public override parse(value: unknown): Output {
    if (!this.validator.Check(value)) throw new ParseError(this.errors(value))
    return value as never
  }
  public override errors(value: unknown): object[] {
    return this.validator.Errors(value)
  }
}
