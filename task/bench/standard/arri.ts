import { benchmark } from '../benchmark.ts'
import * as arri from '@arrirpc/schema'

const Vector3 = arri.object({
  x: arri.number(),
  y: arri.number(),
  z: arri.number()
})

benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))