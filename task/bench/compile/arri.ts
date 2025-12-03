import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'

import * as arri from '@arrirpc/schema'

const Vector3 = compile(arri.object({
  x: arri.number(),
  y: arri.number(),
  z: arri.number()
}))

benchmark(Vector3.isAccelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))