import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'
import * as sury from 'sury'
  
const Vector3 = compile(sury.schema({
  x: sury.number,
  y: sury.number,
  z: sury.number
}))

benchmark(Vector3.accelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))