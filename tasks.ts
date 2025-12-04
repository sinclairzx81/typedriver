// deno-fmt-ignore-file

import { Range, RangeNext } from './task/range/index.ts'
import { Bench } from './task/bench/index.ts'
import { Task } from 'tasksmith'

const Version = '0.8.6'

// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
const BuildPackage = (target: string = `target/build`) => Task.build.esm('src', {
  outdir: target,
  compiler: '5.9.3',
  additional: ['license', 'readme.md'],
  packageJson: {
    name: 'typedriver',
    description: 'High Performance Driver for Runtime Type System Integration',
    version: Version,
    keywords: ['typescript', 'json-schema', 'standard-schema'],
    license: 'MIT',
    author: 'sinclairzx81',
    repository: {
      type: 'git',
      url: 'https://github.com/sinclairzx81/typedriver'
    },
    dependencies: {
      "typebox": "^1.0.61"
    }
  },
})
const PublishPackage = async (target: string = `target/build`) => {
  const { version } = JSON.parse(await Task.file(`${target}/package.json`).read())
  await Task.shell(`git tag ${version}`)
  await Task.shell(`git push origin ${version}`)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
Task.run('build', (target: string = `target/build`) => BuildPackage(target))
// ------------------------------------------------------------------
// Clean
// ------------------------------------------------------------------
Task.run('clean', () => Task.folder('target').delete())
// ------------------------------------------------------------------
// Local
// ------------------------------------------------------------------
Task.run('local', (target: string = `../build-test/node_modules/typedriver`) => BuildPackage(target))
// ------------------------------------------------------------------
// Publish
// ------------------------------------------------------------------
Task.run('publish', (target: string = `target/build`) => PublishPackage(target))
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
Task.run('format', () => Task.shell('deno fmt src test/typedriver'))
// ------------------------------------------------------------------
// Metrics
// ------------------------------------------------------------------
Task.run('metrics', () => Task.esbuild.metrics(['./task/metrics/all.ts']))
// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
Task.run('start', () => Task.shell('deno run -A --watch --no-check example/index.ts'))
// ------------------------------------------------------------------
// Test
// ------------------------------------------------------------------
Task.run('test', (filter: string = '') => Task.test.run(['test/typedriver'], { filter }))
// ------------------------------------------------------------------
// Fast
// ------------------------------------------------------------------
Task.run('fast', (filter: string = '') => Task.test.run(['test/typedriver'], { watch: true, noCheck: true, filter }))
// ------------------------------------------------------------------
// Report
// ------------------------------------------------------------------
Task.run('report', () => Task.test.report(['test/typedriver']))
// ------------------------------------------------------------------
// Bench
// ------------------------------------------------------------------
Task.run('bench', async () => {
  await Task.file('deno.lock').delete()
  await Task.shell('deno clean')
  await Task.shell('deno install')
  await Bench()
})
// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------
Task.run('range', () => Range([
  '5.1.3', '5.1.6', '5.2.2', '5.3.2', '5.3.3',
  '5.4.3', '5.4.5', '5.5.2', '5.5.3', '5.5.4', '5.6.2',
  '5.6.3', '5.7.2', '5.7.3', 
  '5.9.2', 'latest',
]).then(() => RangeNext(['next'])))