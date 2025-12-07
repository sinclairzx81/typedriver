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
import type { StandardSchemaV1 } from '../_standard/standard-schema.ts'
import type { TStandardSchemaError } from '../validator.ts'

// ------------------------------------------------------------------
// Normal: Segments
// ------------------------------------------------------------------
function isSegmentObjectWithKey(segment: StandardSchemaV1.PathSegment): segment is { key: Exclude<PropertyKey, symbol>  } {
  return Guard.IsObject(segment) && Guard.HasPropertyKey(segment, 'key') && (
    Guard.IsBigInt(segment.key)
    || Guard.IsBoolean(segment.key)
    || Guard.IsString(segment.key)
    || Guard.IsNumber(segment.key)
  )
}
function normalizeSegment(segment: StandardSchemaV1.PathSegment): string {
  return isSegmentObjectWithKey(segment) ? `${segment.key}` : `${segment}`
}
function normalizeSegments(segments: StandardSchemaV1.PathSegment[]): string[] {
  return segments.map(normalizeSegment)
}
// ------------------------------------------------------------------
// Resolve
// ------------------------------------------------------------------
function resolveSegments(issue: StandardSchemaV1.Issue): StandardSchemaV1.PathSegment[] {
  return (
    Guard.HasPropertyKey(issue, 'path') && Guard.IsArray(issue.path) 
      ? issue.path 
      : []
    ) as StandardSchemaV1.PathSegment[]
}
/** (Internal) Normalize a StandardSchemaV1.Issue as TStandardSchemaError. */
export function normalIssue(issue: StandardSchemaV1.Issue): TStandardSchemaError {
  const segments = resolveSegments(issue)
  return ({ path: normalizeSegments(segments) , message: issue.message })
}
