import { Assert } from 'test'
import { compile, type Static } from 'typedriver'

const Test = Assert.Context('Validator.TypeScript')
import { Behaviors } from './~behaviors.ts'

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------
Test('Should Schema 1', () => {
  const X = null
  const T = compile(X)
  Assert.IsEqual({}, T.schema()) // special: do we need an unknown validator?
})
// ------------------------------------------------------------------
// Generation
// ------------------------------------------------------------------
Test('Should JsonSchema 1', () => {
  const T = compile(null)
  Assert.IsTrue(T.isJsonSchema())
})
Test('Should JsonSchema 1', () => {
  const T = compile(null)
  Assert.IsEqual(T.asJsonSchema(), {})
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', () => {
  const T = compile(null)
  type T = Static<typeof T>
  Assert.IsExtendsMutual<unknown, T>(true)

  Behaviors(T, ['hello'], [])
})
