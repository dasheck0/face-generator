#!/usr/bin/env node

/**
 * Example script demonstrating how to use the face generator MCP server
 * with the Model Context Protocol (MCP) and StdioTransport.
 * 
 * This example shows:
 * 1. How to connect to an MCP server using stdio transport
 * 2. How to list available tools from the server
 * 3. How to call a tool with parameters
 * 4. How to handle the response from the tool
 * 
 * The Model Context Protocol (MCP) is a standardized protocol for communication
 * between clients and servers that provide tools or capabilities. It allows
 * applications like Cline to interact with external tools in a consistent way.
 * 
 * StdioTransport is one of the transport mechanisms supported by MCP, which uses
 * standard input/output streams for communication between the client and server.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
async function main() {
  // Get current directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, 'generated-faces');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting face generator MCP server...');
  
  // Spawn the face generator server as a child process
  // Adjust the path to the server executable as needed
  const serverProcess = spawn('node', [path.join(__dirname, 'build', 'index.js')], {
    stdio: ['pipe', 'pipe', 'inherit'] // stdin, stdout, stderr
  });
  
  // Create a transport that connects to the server via stdio
  // StdioClientTransport handles the communication between the client and server
  // using standard input/output streams. It can either:
  // 1. Connect to an already running process (by passing stdin/stdout)
  // 2. Launch a new process and connect to it (by passing command/args)
  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.join(__dirname, 'build', 'index.js')]
  });
  
  // Create an MCP client
  // The client handles the high-level MCP protocol operations like:
  // - Connecting to the server
  // - Sending requests (list tools, call tool)
  // - Receiving and parsing responses
  const client = new Client({
    name: 'face-generator-client',
    version: '1.0.0'
  });
  
  try {
    // Connect to the server
    console.log('Connecting to server...');
    await client.connect(transport);
    console.log('Connected to server successfully!');
    
    // List available tools
    // This sends a "list_tools" request to the server to get information
    // about what tools are available and their parameters
    console.log('Listing available tools...');
    const toolsResponse = await client.listTools();
    console.log('Available tools:');
    if (toolsResponse.tools && Array.isArray(toolsResponse.tools)) {
      toolsResponse.tools.forEach(tool => {
        console.log(`- ${tool.name}: ${tool.description}`);
      });
    }
    
    // Call the generate_face tool
    console.log('\nGenerating face images...');
    
    // Example parameters for the generate_face tool
    const params = {
      outputDir: outputDir,
      count: 2,
      width: 256,
      height: 256,
      shape: 'circle',
      returnImageContent: false
    };
    
    console.log('Parameters:', JSON.stringify(params, null, 2));
    
    // Call the tool
    // This sends a "call_tool" request to the server with the tool name
    // and parameters. The server will execute the tool and return the result.
    const result = await client.callTool({
      name: 'generate_face',
      arguments: params
    });
    
    // Handle the response
    // The response from the server includes:
    // - Whether the call was successful or resulted in an error
    // - Content, which can be text, images, or other data types
    if (result.isError) {
      console.error('Error generating faces:', 
        result.content && Array.isArray(result.content) && result.content[0] && result.content[0].type === 'text' 
          ? result.content[0].text 
          : 'Unknown error');
    } else {
      console.log('Success!');
      // Display the result
      if (result.content && Array.isArray(result.content)) {
        result.content.forEach(content => {
          if (content.type === 'text') {
            console.log(content.text);
          } else if (content.type === 'image') {
            console.log(`Received image data (base64): ${content.data.substring(0, 20)}...`);
            // You could save the image or display it in a UI here
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Clean up
    console.log('\nClosing connection and terminating server...');
    try {
      // Different ways to disconnect based on the SDK version
      if (typeof client.disconnect === 'function') {
        await client.disconnect();
      } else if (transport && typeof transport.close === 'function') {
        await transport.close();
      }
    } catch (e) {
      console.error('Error during disconnect:', e);
    }
    
    serverProcess.kill();
  }
}

// Run the example
main().catch(console.error);
