import { benchmark } from '../benchmark.ts'
import * as z from 'zod'

const Vector3 = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
})

benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))