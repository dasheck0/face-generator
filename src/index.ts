#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

class FaceGenerator {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'face-generator',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_face',
          description: 'Generate and save a human face image',
          inputSchema: {
            type: 'object',
            properties: {
              outputDir: {
                type: 'string',
                description: 'Directory to save the image',
              },
              fileName: {
                type: 'string',
                description: 'Optional file name (defaults to timestamp)',
                default: `${Date.now()}.png`,
              },
              count: {
                type: 'number',
                description: 'Number of images to generate (default: 1)',
                default: 1,
                minimum: 1,
                maximum: 10
              },
              width: {
                type: 'number',
                description: 'Width of the image in pixels (default: 256)',
                default: 256,
                minimum: 64,
                maximum: 1024
              },
              height: {
                type: 'number',
                description: 'Height of the image in pixels (default: 256)',
                default: 256,
                minimum: 64,
                maximum: 1024
              },
              shape: {
                type: 'string',
                description: 'Image shape (square|circle|rounded, default: square)',
                default: 'square',
                enum: ['square', 'circle', 'rounded']
              },
              borderRadius: {
                type: 'number',
                description: 'Border radius for rounded shape (default: 32)',
                default: 32,
                minimum: 0,
                maximum: 512
              }
            },
            required: ['outputDir'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'generate_face') {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      interface GenerateFaceArgs {
        outputDir: string;
        fileName?: string;
        count?: number;
        width?: number;
        height?: number;
        shape?: string;
        borderRadius?: number;
      }
      
      if (!request.params.arguments) {
        throw new Error('Arguments are required');
      }
      
      const args = request.params.arguments as unknown as GenerateFaceArgs;
      const { 
        outputDir, 
        fileName = `${Date.now()}.jpg`,
        count = 1,
        width = 256,
        height = 256
      } = args;
      
      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const sharp = (await import('sharp')).default;
        const results = [];
        
        for (let i = 0; i < count; i++) {
          // Fetch image
          const response = await axios.get('https://thispersondoesnotexist.com', {
            responseType: 'arraybuffer',
          });

          // Process image
          let image = sharp(response.data)
            .resize(width, height);

          // Apply shape transformations
          switch (args.shape || 'square') {
            case 'circle':
              const radius = Math.min(width, height) / 2;
              const circleShape = Buffer.from(
                `<svg><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" /></svg>`
              );
              image = image.composite([{
                input: circleShape,
                blend: 'dest-in'
              }]);
              break;
            
            case 'rounded':
              const borderRadius = args.borderRadius || 32;
              const roundedShape = Buffer.from(
                `<svg><rect width="${width}" height="${height}" rx="${borderRadius}" ry="${borderRadius}" fill="white" /></svg>`
              );
              image = image.composite([{
                input: roundedShape,
                blend: 'dest-in'
              }]);
              break;
          }

          image = image.png();

          // Generate unique filename if multiple images
          // Ensure .png extension
          const baseName = fileName.replace(/\.(jpg|jpeg|png)$/i, '');
          const finalFileName = count > 1 ? 
            `${baseName}_${i}.png` : 
            `${baseName}.png`;

          // Save image
          const filePath = path.join(outputDir, finalFileName);
          await image.toFile(filePath);
          
          results.push(filePath);
        }

        return {
          content: [
            {
              type: 'text',
              text: `Generated ${count} face image(s):\n${results.join('\n')}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error generating face: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Face Generator MCP server running on stdio');
  }
}

const server = new FaceGenerator();
server.run().catch(console.error);
