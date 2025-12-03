import { benchmark } from '../benchmark.ts'
import { type } from 'arktype'

const Vector3 = type({
  x: 'number',
  y: 'number',
  z: 'number'
})

benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))