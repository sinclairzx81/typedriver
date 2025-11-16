import { McpServer } from './mcp.ts'
import * as v from 'valibot'

const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0'
})
server.registerTool('add', {
  title: 'Addition tool',
  description: 'add two numbers',
  inputSchema: v.object({ // note: requires explicit json schema transform
    a: v.number(),
    b: v.number()
  }),
  outputSchema: v.object({
    result: v.number()
  })
}, ({ a, b }) => {
  const output = { result: a + b };
  return {
    content: [{ type: 'text', text: JSON.stringify(output) }],
    structuredContent: output
  }
}) 