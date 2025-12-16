export function run(url: URL): Promise<{ 
  accelerated: boolean, 
  iterations: number, 
  elapsed: number 
}> {
  return new Promise((resolve) => {
  const worker = new Worker(url.href, { type: "module" })
    worker.onmessage = (event) => {
      resolve(event.data)
      worker.terminate()
    }
  })
}
// rough delta formatter
export function deltas(
  standard: number,
  compiled: number,
) {
  const delta = standard - compiled
  const percent = (Math.abs(delta) / standard) * 100
  const times = standard / compiled
  return {
    delta: `${delta.toFixed(0)} ms`,
    percent: `${percent.toFixed(2)} %`,
    times: `${times.toFixed(2)} ×`
  };
}