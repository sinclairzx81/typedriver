import { McpServer } from './mcp.ts'

const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0'
})
server.registerTool('add', {
  title: 'Addition tool',
  description: 'add two numbers',
  inputSchema: {
    type: 'object',
    required: ['a', 'b'],
    properties: {
      a: { type: 'number' },
      b: { type: 'number' },
    }
  },
  outputSchema: {
    type: 'object',
    required: ['result'],
    properties: {
      result: { type: 'number' },
    }
  }
}, ({ a, b }) => {
  const output = { result: a + b };
  return {
    content: [{ type: 'text', text: JSON.stringify(output) }],
    structuredContent: output
  }
}) 