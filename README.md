# Face Generator MCP Server

A Model Context Protocol (MCP) server for generating human face images using https://thispersondoesnotexist.com.

## Features

- Generate human face images
- Multiple output shapes: square, circle, rounded rectangle
- Configurable image dimensions
- Transparent backgrounds for non-square shapes
- Batch generation of multiple images

## Installation

```bash
npm install @dasheck0/face-generator
```

## Usage

### As an MCP Server

1. Start the server:
```bash
npx face-generator
```

2. Use the `generate_face` tool through an MCP client.

### Tool Parameters

- `outputDir`: (required) Directory to save the images
- `fileName`: Optional file name (defaults to timestamp)
- `count`: Number of images to generate (default: 1)
- `width`: Image width in pixels (default: 256)
- `height`: Image height in pixels (default: 256)
- `shape`: Image shape (square|circle|rounded, default: square)
- `borderRadius`: Border radius for rounded shape (default: 32)

## Example

```json
{
  "outputDir": "./output",
  "count": 3,
  "width": 512,
  "height": 512,
  "shape": "circle"
}
```

## License

MIT
