import { Assert } from 'test'
import { compile, type Static } from 'typedriver'

const Test = Assert.Context('Validator.JsonSchema')
import { Behaviors } from './~behaviors.ts'
import { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'

const StandardJsonSchema = <const Schema extends Record<string, unknown>>(schema: Schema): StandardSchemaV1<Static<Schema>> & StandardJSONSchemaV1 => ({
  ...schema,
  '~standard': {
    version: 1,
    vendor: 'json-schema',
    validate: () => { },
    jsonSchema: {
      input: () => schema,
      output: () => schema
    }
  }
} as never)
// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const X = StandardJsonSchema({ type: 'string' })
  const T = compile(X)
  Assert.IsEqual(X, T.schema())
})
// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
Test('Should JsonSchema 1', () => {
  const T = compile(StandardJsonSchema({ type: 'string' }))
  Assert.IsTrue(T.isJsonSchema())
})
Test('Should JsonSchema 2', () => {
  const T = compile(StandardJsonSchema({ type: 'string' }))
  Assert.IsEqual(T.toJsonSchema(), { type: 'string' })
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', () => {
  const T = compile(StandardJsonSchema({ type: 'string' }))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<string, T>(true)

  Behaviors(T, ['hello'], [null])
})
Test('Should Check 2', () => {
  const T = compile(StandardJsonSchema({
    type: 'object',
    required: ['x', 'y', 'z'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    }
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z: number
  }>(true)

  Behaviors(T, [{ x: 1, y: 2, z: 3 }], [null])
})
Test('Should Check 3', () => {
  const T = compile(StandardJsonSchema({
    type: 'object',
    required: ['x', 'y'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    }
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z?: number
  }>(true)

  Behaviors(T, [{ x: 1, y: 2, z: 3 }, { x: 1, y: 2 }], [null])
})
Test('Should Check 4', () => {
  const T = compile(StandardJsonSchema({
    type: 'array',
    items: { type: 'number' }
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number[]>(true)

  Behaviors(T, [[1, 2, 3]], [[1, 2, null], null])
})
Test('Should Check 5', () => {
  const T = compile(StandardJsonSchema({
    type: 'array',
    minItems: 2,
    maxItems: 2,
    items: [{ type: 'number' }, { type: 'boolean' }]
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, [number, boolean]>(true)

  Behaviors(T, [[1, true]], [[true, true], null])
})
Test('Should Check 6', () => {
  const T = compile(StandardJsonSchema({
    anyOf: [{
      type: 'number'
    }, {
      type: 'string'
    }]
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number | string>(true)
  Behaviors(T, ['hello', 1], [null])
})
