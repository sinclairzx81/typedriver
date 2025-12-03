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

import { StandardJSONSchemaV1 } from '../../_standard/standard-schema.ts'
import { Guard } from 'typebox/guard'

function AsOpenAPI3_0(input: StandardJSONSchemaV1): Record<string, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'openapi-3.0' })
  } catch {
    return undefined
  }
}
function AsDraft7(input: StandardJSONSchemaV1): Record<string, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'draft-07' })
  } catch {
    return undefined
  }
}
function AsDraft2020_12(input: StandardJSONSchemaV1): Record<string, unknown> | undefined {
  try {
    return input['~standard'].jsonSchema.input({ target: 'draft-2020-12' })
  } catch {
    return undefined
  }
}
// Why doesn't the api provide a discovery mechanism?
export function ResolveJsonSchema(input: StandardJSONSchemaV1): Record<string, unknown> {
  const jsonschema = AsDraft2020_12(input) ?? AsDraft7(input) ?? AsOpenAPI3_0(input)
  if(Guard.IsUndefined(jsonschema)) throw Error(`Vendor '${input['~standard'].vendor}' advertised itself as a Standard JSON Schema but failed to produce a schematic. Submit an issue with the vendor.`)
  return jsonschema
}