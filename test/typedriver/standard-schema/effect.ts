import { Assert } from 'test'
import { compile, type Static } from 'typedriver'

const Test = Assert.Context('Validator.StandardSchema.Effect')
import { Behaviors } from '../behaviors.ts'
import { Schema } from 'effect'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const X = Schema.standardSchemaV1(Schema.String)
  const T = compile(X)
  Assert.IsEqual(X, T.schema())
})
// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
Test('Should JsonSchema 1', () => {
  const T = compile(Schema.standardSchemaV1(Schema.String))
  Assert.IsFalse(T.isJsonSchema())
})
Test('Should JsonSchema 2', () => {
  const T = compile(Schema.standardSchemaV1(Schema.String))
  Assert.IsEqual(T.toJsonSchema(), {})
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', () => {
  const T = compile(Schema.standardSchemaV1(Schema.String))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<string, T>(true)

  Behaviors(T, ['hello'], [null])
})
Test('Should Check 2', () => {
  const T = compile(Schema.standardSchemaV1(Schema.Struct({
    x: Schema.Number,
    y: Schema.Number,
    z: Schema.Number
  })))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    readonly x: number
    readonly y: number
    readonly z: number
  }>(true)
  Behaviors(T, [{ x: 1, y: 2, z: 3 }], [null])
})
Test('Should Check 3', () => {
  const T = compile(Schema.standardSchemaV1(Schema.Struct({
    x: Schema.Number,
    y: Schema.Number,
    z: Schema.optional(Schema.Number)
  })))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    readonly x: number
    readonly y: number
    readonly z?: number
  }>(true)

  Behaviors(T, [{ x: 1, y: 2, z: 3 }, { x: 1, y: 2 }], [null])
})
Test('Should Check 4', () => {
  const T = compile(Schema.standardSchemaV1(Schema.Array(Schema.Number)))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, readonly number[]>(true)

  Behaviors(T, [[1, 2, 3]], [[1, 2, null], null])
})
Test('Should Check 5', () => {
  const T = compile(Schema.standardSchemaV1(Schema.Tuple(Schema.Number, Schema.Boolean)))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, readonly [number, boolean]>(true)

  Behaviors(T, [[1, true]], [[true, true], null])
})
Test('Should Check 6', () => {
  const T = compile(Schema.standardSchemaV1(Schema.Union(Schema.Number, Schema.String)))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number | string>(true)
  Behaviors(T, ['hello', 1], [null])
})
