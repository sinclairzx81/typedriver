import { Assert } from 'test'
import { compile, type Static } from 'typedriver'

const Test = Assert.Context('Validator.StandardSchema.Zod')
import { Behaviors } from './~behaviors.ts'
import * as z from 'zod'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const X = z.string()
  const T = compile(X)
  Assert.IsEqual(X, T.schema())
})
// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
Test('Should JsonSchema 1', () => {
  const T = compile(z.string())
  Assert.IsFalse(T.isJsonSchema())
})
Test('Should JsonSchema 2', () => {
  const T = compile(z.string())
  Assert.IsEqual(T.toJsonSchema(), {})
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', () => {
  const T = compile(z.string())
  type T = Static<typeof T>
  Assert.IsExtendsMutual<string, T>(true)

  Behaviors(T, ['hello'], [null])
})
Test('Should Check 2', () => {
  const T = compile(z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
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
  const T = compile(z.object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional()
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
  const T = compile(z.array(z.number()))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number[]>(true)

  Behaviors(T, [[1, 2, 3]], [[1, 2, null], null])
})
Test('Should Check 5', () => {
  const T = compile(z.tuple([
    z.number(),
    z.boolean()
  ]))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, [number, boolean]>(true)

  Behaviors(T, [[1, true]], [[true, true], null])
})
Test('Should Check 6', () => {
  const T = compile(z.union([
    z.number(),
    z.string()
  ]))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number | string>(true)
  Behaviors(T, ['hello', 1], [null])
})
