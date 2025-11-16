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

import { Validator as TBValidator } from 'typebox/compile'
import { AssertError, ParseError } from '../errors.ts'
import { Validator } from '../validator.ts'
import Type from 'typebox'

export class JsonSchemaValidator<Input extends Type.TSchema, 
  Output extends unknown = Type.Static<Input>
> extends Validator<Input, Output> {
  private readonly validator: TBValidator<{}, Input>
  constructor(private readonly input: Input) {
    super()
    this.validator = new TBValidator({}, input)
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
  public isJsonSchema(): boolean {
    return true
  }
  public asJsonSchema(): unknown {
    return this.input
  }
  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------
  public override assert(value: unknown): asserts value is Output {
    if (!this.validator.Check(value)) throw new AssertError(this.errors(value))
  }
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
