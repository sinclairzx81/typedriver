import { Assert } from 'test'
import { Guard } from 'typebox/guard'
import { compile } from 'typedriver'

const Test = Assert.Context('Validator.Errors.JsonSchema')
import { StandardJsonSchema } from '../reference.ts'
import * as z from 'zod'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
// JsonSchema
Test('Should Error 1', () => {
  const T = compile({ type: 'string' })
  const E = T.errors(1, { format: 'json-schema' })
  Assert.IsEqual(E.length, 1)
  Assert.IsTrue(Guard.HasPropertyKey(E[0], 'keyword'))
})
// TypeScript
Test('Should Error 2', () => {
  const T = compile('string')
  const E = T.errors(1, { format: 'json-schema' })
  Assert.IsEqual(E.length, 1)
  Assert.IsTrue(Guard.HasPropertyKey(E[0], 'keyword'))
})
// Standard Schema
Test('Should Error 3', () => {
  const T = compile(z.string())
  const E = T.errors(1, { format: 'json-schema' })
  Assert.IsEqual(E.length, 1)
  Assert.IsTrue(Guard.HasPropertyKey(E[0], 'keyword'))
})
// Standard JSON Schema
Test('Should Error 4', () => {
  const T = compile(StandardJsonSchema({ type: 'string' }))
  const E = T.errors(1, { format: 'json-schema' })
  Assert.IsEqual(E.length, 1)
  Assert.IsTrue(Guard.HasPropertyKey(E[0], 'keyword'))
})
