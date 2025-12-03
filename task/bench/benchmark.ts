const iterations = 16_000_000

export function benchmark(accelerated: boolean, callback: Function) {
  const now = performance.now()
  for(let i = 0; i < iterations; i++) callback()
  const elapsed = performance.now() - now
  self.postMessage({ accelerated, iterations, elapsed })
}