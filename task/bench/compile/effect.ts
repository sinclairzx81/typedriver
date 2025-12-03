
import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'
import { Schema } from 'effect'

const Vector3 = compile(Schema.standardSchemaV1(Schema.Struct({
  x: Schema.Number,
  y: Schema.Number,
  z: Schema.Number
})))

benchmark(Vector3.accelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))