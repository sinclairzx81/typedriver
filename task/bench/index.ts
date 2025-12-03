import { run, deltas } from './runner.ts'

async function library(standardPath: string, compilePath: string) {
  console.log('bench', { standardPath: standardPath, compilePath })
  const standard_ = standardPath.length === 0 ? { elapsed: 0, delta: NaN } : (await run(new URL(standardPath, import.meta.url)))
  const compile_ = (await run(new URL(compilePath, import.meta.url)))
  const { percent } = deltas(standard_.elapsed, compile_.elapsed)
  return {
    iterations: compile_.iterations,
    accelerated: compile_.accelerated, 
    'default(...)': standard_.elapsed === 0 ? '------'.padStart(8) : `${standard_.elapsed.toFixed(0)} ms`.padStart(8),
    'compile(...)': `${compile_.elapsed.toFixed(0)} ms`.padStart(8),
    result: standard_.elapsed === 0 ? '------'.padStart(8) : percent.padStart(8),
  }
}
export async function Bench() {
  const result = {
    typescript: await library(
      '',
      './compile/typescript.ts'
    ),
    jsonschema: await library(
      '',
      './compile/jsonschema.ts'
    ),
    arktype: await library(
      './standard/arktype.ts',
      './compile/arktype.ts'
    ),
    arri: await library(
      './standard/arri.ts',
      './compile/arri.ts'
    ),
    effect: await library(
      './standard/effect.ts',
      './compile/effect.ts'
    ),
    sury: await library(
      './standard/sury.ts',
      './compile/sury.ts'
    ),
    valibot: await library(
      './standard/valibot.ts',
      './compile/valibot.ts'
    ),
    zod: await library(
      './standard/zod.ts',
      './compile/zod.ts'
    ),
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