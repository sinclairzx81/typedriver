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
import { StandardSchemaV1 } from '../_standard/standard-schema.ts'
import { TStandardSchemaError, TJsonSchemaError } from '../validator.ts'

// ------------------------------------------------------------------
// Escape
// ------------------------------------------------------------------
function escapeKey(segment: string): string {
  return `${segment}`.replace(/~/g, '~0').replace(/\//g, '~1')
}
// ------------------------------------------------------------------
// Json Pointer
// ------------------------------------------------------------------
function pathToJsonPointer(path: string[]): string {
  const keys = path.map(escapeKey)
  return `#/${keys.join('/')}`
}
// ------------------------------------------------------------------
// IssueToError
// ------------------------------------------------------------------
/** (Internal) Transform TStandardSchemaError to TJsonSchemaError */
export function issueToError(issue: TStandardSchemaError): TJsonSchemaError {
  const instancePath = pathToJsonPointer(issue.path) 
  return {
    instancePath,
    schemaPath: '#',
    keyword: 'type',
    message: issue.message,
    params: { type: 'standard-schema' }
  }
}
