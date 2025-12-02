// ---------------------------------------------------------
// Design
// ---------------------------------------------------------
post('/', {
  body: `{
    x: number,
    y: number,
    z: number
  }`
}, (request) => {
  const { x, y, z } = request.body // type-safe!
})

// ---------------------------------------------------------
// Framework
// ---------------------------------------------------------
import { type Static, compile } from 'typedriver'

export interface RouteOptions<Body extends unknown = unknown> {
  body: Body
}
export type RouteCallback<Path extends string, Options extends RouteOptions> = (
  (request: { url: Path, body: Static<Options['body']> }) => void
)
export function post<Path extends string, const Options extends RouteOptions, 
  Callback = RouteCallback<Path, Options>
>(path: Path, options: Options, callback: Callback) {
  const body_validator = compile(options['body'])
  // todo: ... implement route logic
}
