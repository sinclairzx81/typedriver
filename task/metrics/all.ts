import { compile, Static } from 'typedriver'

const A = compile(`{
  x: number
  y: number
  z: number  
}`)

const R = A.check(null)