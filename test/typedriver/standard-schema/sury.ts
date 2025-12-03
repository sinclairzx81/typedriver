import { Assert } from 'test'
import { compile, type Static } from 'typedriver'

const Test = Assert.Context('Validator.StandardSchema.Sury')
import { Behaviors } from '../behaviors.ts'
import * as sury from 'sury'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const X = sury.string
  const T = compile(X)
  Assert.IsEqual(X, T.schema())
})
// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
Test('Should JsonSchema 1', () => {
  const T = compile(sury.string)
  Assert.IsFalse(T.isJsonSchema())
})
Test('Should JsonSchema 2', () => {
  const T = compile(sury.string)
  Assert.IsEqual(T.toJsonSchema(), {})
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', () => {
  const T = compile(sury.string)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<string, T>(true)

  Behaviors(T, ['hello'], [null])
})
Test('Should Check 2', () => {
  const T = compile(sury.schema({
    x: sury.number,
    y: sury.number,
    z: sury.number
  }))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, {
    x: number
    y: number
    z: number
  }>(true)

  Behaviors(T, [{ x: 1, y: 2, z: 3 }], [null])
})
// Test('Should Check 3', () => {
//   const T = compile(sury.schema({
//     x: sury.number,
//     y: sury.number,
//     z: sury.optional(sury.number)
//   }))
//   type T = Static<typeof T>
//   Assert.IsExtendsMutual<T, {
//     x: number
//     y: number
//     z?: number
//   }>(true)
//   Behaviors(T, [{ x: 1, y: 2, z: 3 }, { x: 1, y: 2 }], [null])
// })
Test('Should Check 4', () => {
  const T = compile(sury.array(sury.number))

  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number[]>(true)

  Behaviors(T, [[1, 2, 3]], [[1, 2, null], null])
})
// Test('Should Check 5', () => {
//   const T = compile(z.object(s => (s.field("0", z.number), s.field("1", z.string))))
//   type T = Static<typeof T>
//   Assert.IsExtendsMutual<T, [number, boolean]>(true)

//   Behaviors(T, [[1, true]], [[true, true], null])
// })
Test('Should Check 6', () => {
  const T = compile(sury.union([
    sury.number,
    sury.string
  ]))
  type T = Static<typeof T>
  Assert.IsExtendsMutual<T, number | string>(true)
  Behaviors(T, ['hello', 1], [null])
})
