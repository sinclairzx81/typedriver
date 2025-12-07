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

// ------------------------------------------------------------------
// TErrorFormat
// ------------------------------------------------------------------
export type TErrorFormat = 'json-schema' | 'standard-schema'

// ------------------------------------------------------------------
// TJsonSchemaError
// ------------------------------------------------------------------
export interface TJsonSchemaError {
  keyword: string
  schemaPath: string
  instancePath: string
  params: object
  message: string
}
// ------------------------------------------------------------------
// TStandardSchemaError
// ------------------------------------------------------------------
export interface TStandardSchemaError {
  path: string[]
  message: string
}
// ------------------------------------------------------------------
// TErrorLocale
// ------------------------------------------------------------------
const Locale = System.Locale

export type TErrorLocale = (
  Exclude<keyof typeof Locale, 'Get' | 'Set' | 'Reset'> & ({} & string)
)
// ------------------------------------------------------------------
// TErrorOptions
// ------------------------------------------------------------------
/** Internal */
export function resolveErrorOptions(options?: Partial<TErrorOptions>): TErrorOptions {
  const defaults: TErrorOptions = {  format: 'json-schema', locale: 'en_US' }
  const resolved: Partial<TErrorOptions> = options ?? {  }
  return { ...defaults, ...resolved }
}
export interface TErrorOptions {
  /** Specifies the error format. Default: `json-schema` */
  format: TErrorFormat
  /** Specifies the error format. Default: `en_US` */
  locale: TErrorLocale
}
// ------------------------------------------------------------------
// TErrorResult
// ------------------------------------------------------------------
export type TErrorResult<Options extends Partial<TErrorOptions>> = (
  Options['format'] extends 'standard-schema' 
    ? TStandardSchemaError[] 
    : TJsonSchemaError[]
)
// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
/** Abstract Base for all Validator types. */
export abstract class Validator<Input extends unknown = unknown, Output extends unknown = unknown> {
  /** Returns the schema used to construct this validator */
  public abstract schema(): Input
  /** Checks a value matches the given schema */
  public abstract check(value: unknown): value is Output
  /** Parses a value and throws if invalid */
  public abstract parse(value: unknown): Output
  /** Returns errors for the given value */
  public abstract errors<Options extends Partial<TErrorOptions>>(value: unknown, options?: Options): TErrorResult<Options>
  /** True if the validator has a Json Schema representation */
  public abstract isJsonSchema(): boolean
  /** Return the validator Json Schema representation. */
  public abstract toJsonSchema(): unknown
  /** Returns true if this validator is JIT accelerated */
  public abstract isAccelerated(): boolean
}
