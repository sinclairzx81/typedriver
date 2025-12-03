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

import { StandardSchemaV1, StandardJSONSchemaV1 } from '../_standard/standard-schema.ts'
import Guard from 'typebox/guard'

function IsStandardJsonSchemaConverter(value: unknown) {
  return Guard.IsObject(value) 
    && Guard.HasPropertyKey(value, 'input')
    && Guard.HasPropertyKey(value, 'output')
}
function IsStandardJsonSchemaV1Props(value: unknown) {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, 'version') &&
    Guard.HasPropertyKey(value, 'vendor') &&
    Guard.HasPropertyKey(value, 'jsonSchema') &&
    (
      Guard.IsEqual(value.version, '1') || // spec
      Guard.IsEqual(value.version, 1) // arktype
    ) &&
    Guard.IsString(value.vendor) &&
    IsStandardJsonSchemaConverter(value.jsonSchema)
}
function IsTypicalStandardJsonSchemaV1(value: unknown): value is StandardSchemaV1 & StandardJSONSchemaV1 {
  return Guard.IsObject(value) &&
    !Guard.IsUndefined((value as never)['~standard']) &&
    IsStandardJsonSchemaV1Props(value['~standard'])
}
// ArkType (Obviously)
function IsNonTypicalStandardJsonSchemaV1(value: unknown): value is StandardSchemaV1 & StandardJSONSchemaV1 {
  return Guard.IsFunction(value) &&
    !Guard.IsUndefined((value as never)['~standard']) &&
    IsStandardJsonSchemaV1Props((value as never)['~standard'])
}
export function IsStandardJsonSchemaV1(value: unknown): value is StandardSchemaV1 & StandardJSONSchemaV1 {
  return IsTypicalStandardJsonSchemaV1(value) ||
    IsNonTypicalStandardJsonSchemaV1(value)
}