import { type, Static } from 'typedriver'

const A = type(`{
  x: number
  y: number
  z: number  
}`)

const R = A.check(null)