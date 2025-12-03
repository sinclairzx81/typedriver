import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'
import { type } from 'arktype'

const Vector3 = compile(type({
  x: 'number',
  y: 'number',
  z: 'number'
}))

benchmark(Vector3.isAccelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))