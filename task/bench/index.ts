import { run, deltas } from './runner.ts'

const pad = 10

async function library(standardPath: string, compilePath: string) {
  console.log('bench', [standardPath, compilePath])
  const standard_ = standardPath.length === 0 ? { elapsed: 0, delta: NaN } : (await run(new URL(standardPath, import.meta.url)))
  const compile_ = (await run(new URL(compilePath, import.meta.url)))
  const { times } = deltas(standard_.elapsed, compile_.elapsed)
  return {
    iterations: compile_.iterations,
    accelerated: compile_.accelerated, 
    'standard (...)': (standard_.elapsed === 0 ? '' : `${standard_.elapsed.toFixed(0)} ms`).padStart(pad),
    'compile (...)': (`${compile_.elapsed.toFixed(0)} ms`).padStart(pad),
    performance: (times).padStart(pad),
  }
}
export async function Bench() {
  const result = {
    typescript: await library(
      './standard/typescript.ts',
      './compile/typescript.ts'
    ),
    jsonschema: await library(
      './standard/jsonschema.ts',
      './compile/jsonschema.ts'
    ),
    zod: await library(
      './standard/zod.ts',
      './compile/zod.ts'
    ),
    arktype: await library(
      './standard/arktype.ts',
      './compile/arktype.ts'
    ),
    valibot: await library(
      './standard/valibot.ts',
      './compile/valibot.ts'
    ),
    // effect: await library(
    //   './standard/effect.ts',
    //   './compile/effect.ts'
    // ),
    // arri: await library(
    //   './standard/arri.ts',
    //   './compile/arri.ts'
    // ),
    // sury: await library(
    //   './standard/sury.ts',
    //   './compile/sury.ts'
    // ),
  }
  // Deno version info
  console.log("Deno version:     ", Deno.version.deno)
  console.log("V8 version:       ", Deno.version.v8)
  // Engine & OS info
  console.log("Architecture:     ", Deno.build.arch)
  console.log("Operating System: ", Deno.build.os)
  console.log("64-bit:           ", Deno.build.arch.includes("64"))
  console.log()
  console.table(result)
  console.log()
  console.log('Last Run:', new Date().toDateString())
}