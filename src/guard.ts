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
import Guard from 'typebox/guard'
import Type from 'typebox'

// ------------------------------------------------------------------
// IsStandardSchemaV1
// ------------------------------------------------------------------
function IsStandardSchemaV1Props(value: unknown) {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, 'version') &&
    Guard.HasPropertyKey(value, 'vendor') &&
    Guard.HasPropertyKey(value, 'validate') &&
    (
      Guard.IsEqual(value.version, '1') || // spec
      Guard.IsEqual(value.version, 1) // arktype
    ) &&
    Guard.IsString(value.vendor) &&
    Guard.IsFunction(value.validate)
}
function IsTypicalStandardSchemaV1(value: unknown): value is StandardSchemaV1 {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, '~standard') &&
    IsStandardSchemaV1Props(value['~standard'])
}
// ArkType
function IsNonTypicalStandardSchemaV1(value: unknown): value is StandardSchemaV1 {
  return Guard.IsFunction(value) &&
    !Guard.IsUndefined((value as never)['~standard']) &&
    IsStandardSchemaV1Props((value as never)['~standard'])
}
export function IsStandardSchemaV1(value: unknown): value is StandardSchemaV1 {
  return IsTypicalStandardSchemaV1(value) ||
    IsNonTypicalStandardSchemaV1(value)
}
// ------------------------------------------------------------------
// IsJsonSchema
// ------------------------------------------------------------------
export function IsJsonSchema(value: unknown): value is Type.TSchema {
  return !IsStandardSchemaV1(value) && Guard.IsObjectNotArray(value)
}
// ------------------------------------------------------------------
// IsTypeScript
// ------------------------------------------------------------------
export function IsTypeScript(value: unknown): value is string {
  return Guard.IsString(value)
}
