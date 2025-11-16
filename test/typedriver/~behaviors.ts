import { Assert } from 'test'
import { compile, Validator, type Static } from 'typedriver'

export function Behaviors(validator: Validator, valid: unknown[], invalid: unknown[]) {
  // Assert
  valid.forEach(value => validator.assert(value))
  invalid.forEach(value => Assert.Throws(() => validator.assert(value)))
  // Checks
  valid.forEach(value => Assert.IsTrue(validator.check(value)))
  invalid.forEach(value => Assert.IsFalse(validator.check(value)))
  // Parse
  valid.forEach(value => Assert.IsEqual(value, validator.parse(value)))
  invalid.forEach(value => Assert.Throws(() => validator.parse(value)))
  // Errors
  invalid.forEach(value => Assert.IsTrue(validator.errors(value).length > 0))
}