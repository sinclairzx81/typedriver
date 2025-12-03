  import { benchmark } from '../benchmark.ts'
  import { compile } from 'typedriver'
  
  const Vector3 = compile(`{
    x: number
    y: number
    z: number
  }`)
  
  benchmark(Vector3.accelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))