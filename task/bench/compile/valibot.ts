import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'
import * as v from 'valibot'

const Vector3 = compile(v.object({
  x: v.number(),
  y: v.number(),
  z: v.number()
}))

benchmark(Vector3.accelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))