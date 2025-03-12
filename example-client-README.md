# MCP Face Generator Client Example

This example demonstrates how to use the face generator MCP server with the Model Context Protocol (MCP) and StdioTransport. It shows how to create a client application that connects to the MCP server, lists available tools, and calls the `generate_face` tool to generate human face images.

## What is MCP?

The Model Context Protocol (MCP) is a standardized protocol for communication between clients and servers that provide tools or capabilities. It allows applications like Cline to interact with external tools in a consistent way.

## What is StdioTransport?

StdioTransport is one of the transport mechanisms supported by MCP, which uses standard input/output streams for communication between the client and server. This makes it easy to integrate with command-line tools and processes.

## Prerequisites

Before running this example, make sure you have:

1. Node.js installed (version 14 or higher)
2. The face generator MCP server built (run `npm run build` in the project root)

## How to Run the Example

1. Make sure you've built the face generator server:
   ```bash
   npm run build
   ```

2. Run the example client:
   ```bash
   node example-client.js
   ```

## What the Example Does

The example client:

1. Spawns the face generator server as a child process
2. Connects to the server using StdioTransport
3. Lists available tools provided by the server
4. Calls the `generate_face` tool with parameters to generate face images
5. Handles the response, which may include text or image data
6. Cleans up by disconnecting from the server and terminating the process

## Understanding the Code

The example demonstrates several key concepts:

### 1. Setting up the Transport

```javascript
const transport = new StdioClientTransport({
  command: 'node',
  args: [path.join(__dirname, 'build', 'index.js')]
});
```

This creates a transport that can communicate with the server over standard input/output. The transport can either connect to an already running process or launch a new one.

### 2. Creating the Client

```javascript
const client = new Client({
  name: 'face-generator-client',
  version: '1.0.0'
});
```

The client handles high-level MCP protocol operations like connecting to the server, sending requests, and receiving responses.

### 3. Listing Tools

```javascript
const toolsResponse = await client.listTools();
```

This sends a "list_tools" request to the server to get information about available tools and their parameters.

### 4. Calling a Tool

```javascript
const result = await client.callTool({
  name: 'generate_face',
  arguments: params
});
```

This sends a "call_tool" request to the server with the tool name and parameters. The server executes the tool and returns the result.

### 5. Handling the Response

```javascript
if (result.isError) {
  // Handle error
} else {
  // Process successful result
  result.content.forEach(content => {
    if (content.type === 'text') {
      console.log(content.text);
    } else if (content.type === 'image') {
      // Handle image data
    }
  });
}
```

The response includes whether the call was successful and the content, which can be text, images, or other data types.

## Modifying the Example

You can modify the example to:

- Change the parameters for the `generate_face` tool
- Save generated images to a different directory
- Process the returned image data in different ways
- Add error handling for specific scenarios

## Using with Other MCP Servers

This example can be adapted to work with other MCP servers by:

1. Changing the server path in the transport configuration
2. Updating the tool name and parameters to match what the server provides
3. Adjusting the response handling based on the expected content types

## Learn More

For more information about the Model Context Protocol, visit:
- [MCP GitHub Repository](https://github.com/modelcontextprotocol/mcp)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
