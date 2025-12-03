  import { benchmark } from '../benchmark.ts'
  import * as sury from 'sury'
  
  const Vector3 = sury.schema({
    x: sury.number,
    y: sury.number,
    z: sury.number
  })
  
  benchmark(false, () => Vector3['~standard'].validate({ x: 0, y: 0, z: 0 }))