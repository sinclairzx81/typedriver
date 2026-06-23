  import { benchmark } from '../benchmark.ts'
  import { type } from 'typedriver'
  
  const Vector3 = type(`{
    x: number
    y: number
    z: number
  }`)
  
  benchmark(Vector3.isAccelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))