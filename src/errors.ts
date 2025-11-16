export class AssertError extends globalThis.Error {
  constructor(public readonly errors: object[]) {
    super('AssertError')
  }
}
export class ParseError extends globalThis.Error {
  constructor(public readonly errors: object[]) {
    super('ParseError')
  }
}
export class UnknownError extends globalThis.Error {
  constructor(message: string) {
    super(`UnknownError: ${message}`)
  }
}
