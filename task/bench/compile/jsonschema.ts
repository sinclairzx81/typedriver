  import { benchmark } from '../benchmark.ts'
  import { compile } from 'typedriver'
  
  const Vector3 = compile({
    type: 'object',
    required: ['x', 'y', 'z'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    }
  })
  
  benchmark(Vector3.accelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))