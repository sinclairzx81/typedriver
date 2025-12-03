import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'

import * as z from 'zod'

const Vector3 = compile(z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
}))

benchmark(Vector3.isAccelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))