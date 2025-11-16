// --------------------------------------------------------------------------
// McpServer + TypeDriver (Reference)
// --------------------------------------------------------------------------

// deno-fmt-ignore-file

import { compile, Validator, type Static } from 'typedriver'
import * as z from 'zod' // required for backwards compat

// ------------------------------------------------------------------
// RegisterTool (Reference)
// ------------------------------------------------------------------
export interface TRegisterToolOptions<
  Title extends string = string,
  Description extends string = string,
  Meta extends unknown = unknown,
  InputSchema extends unknown = unknown,
  OutputSchema extends unknown = unknown
> {
  title?: Title,
  description?: Description,
  inputSchema?: InputSchema,
  outputSchema?: OutputSchema
  meta?: Meta
}
export type TRegisterToolCallback<Options extends TRegisterToolOptions,
  Input extends unknown = Static<Options['inputSchema']>,  
  Output extends unknown = Static<Options['outputSchema']>,
> = (input: Input) => {
  content: unknown,
  structuredContent: Output
}
// ------------------------------------------------------------------
// McpServer (Reference)
// ------------------------------------------------------------------
export interface McpServerOptions {
  name?: string,
  version?: string
}
export class McpServer {
  constructor(private readonly options: McpServerOptions) {}

  // ----------------------------------------------------------------
  // RegisterTool
  // ----------------------------------------------------------------
  public registerTool<Name extends string, const Options extends TRegisterToolOptions>(name: Name, options: Options, callback: TRegisterToolCallback<Options>) {
    // step 1: compile input and output schemas
    const [inputValidator, outputValidator] = [
      options.inputSchema ? compile(options.inputSchema) : compile({}),
      options.outputSchema ? compile(options.outputSchema) : compile({})
    ]
    // step 2: resolve Json Schema
    const [inputJsonSchema, outputJsonSchema] = [
      this.#resolveJsonSchema(inputValidator),
      this.#resolveJsonSchema(outputValidator)
    ]
    // step 3: todo handle protocol ...
  }
  // ----------------------------------------------------------------
  // Resolve JsonSchema
  // ----------------------------------------------------------------
  #resolveJsonSchema(validator: Validator): unknown {
    // if the validator supports Json Schema, just return it
    if(validator.isJsonSchema()) return validator.asJsonSchema()
    
      // ... otherwise, check if the schema is Zod and transform
    const schema = validator.schema()
    if(schema instanceof z.ZodType) return z.toJSONSchema(schema)
    
      // ... otherwise ... throw or return 
    return {} // <-- unknown (no-constraints)
  }
}
