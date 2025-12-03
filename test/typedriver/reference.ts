import { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec'
import { Static } from 'typebox'

/** Abstract StandardJsonSchema Factory Thing */
export const StandardJsonSchema = <const Schema extends Record<string, unknown>>(schema: Schema): StandardSchemaV1<Static<Schema>> & StandardJSONSchemaV1 => ({
  ...schema,
  '~standard': {
    version: 1,
    vendor: 'json-schema',
    validate: () => {},
    jsonSchema: {
      input: () => schema,
      output: () => schema
    }
  }
} as never)
