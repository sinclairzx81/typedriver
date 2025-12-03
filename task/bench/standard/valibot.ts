import { benchmark } from '../benchmark.ts'
import * as v from 'valibot'

const Vector3 = v.object({
  x: v.number(),
  y: v.number(),
  z: v.number()
})

benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))