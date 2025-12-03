
import { benchmark } from '../benchmark.ts'
import { Schema } from 'effect'

const Vector3 = Schema.standardSchemaV1(Schema.Struct({
  x: Schema.Number,
  y: Schema.Number,
  z: Schema.Number
}))

benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))