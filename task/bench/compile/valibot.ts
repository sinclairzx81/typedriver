import { benchmark } from '../benchmark.ts'
import { compile } from 'typedriver'
import * as v from 'valibot'
import { toStandardJsonSchema } from '@valibot/to-json-schema'

const Vector3 = compile(toStandardJsonSchema(v.object({
  x: v.number(),
  y: v.number(),
  z: v.number()
})))

benchmark(Vector3.isAccelerated(), () => Vector3.parse({ x: 0, y: 0, z: 0 }))