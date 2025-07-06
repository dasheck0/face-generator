# Face Generator MCP Server: Generate Human Faces with Ease

[![Smithery badge](https://smithery.ai/badge/@dasheck0/face-generator)](https://smithery.ai/server/@dasheck0/face-generator)

<a href="https://glama.ai/mcp/servers/0v6oomxing">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/0v6oomxing/badge" alt="Face Generator Server MCP server" />
</a>

## Features
This project provides a Model Context Protocol (MCP) server for generating human face images using https://thispersondoesnotexist.com. Think of it as a tool that lets other applications, like Cline, generate realistic-looking faces on demand.

This guide is designed for beginners, so we'll walk through everything step-by-step. We'll cover:

1.  **Prerequisites:** What you need before you start.
2.  **Installation and Setup:** Getting everything up and running.
3.  **Running the Server:** Starting the server.
4.  **Integrating with Cline:** Connecting this server to the Cline VS Code extension.
5.  **Troubleshooting:** Common problems and solutions.
6.  **Tool Parameters:** A list of the parameters you can use with the `generate_face` tool.

## 1. Prerequisites

Before you begin, you'll need a few things:

*   **Node.js and npm:** Node.js is a JavaScript runtime that lets you run JavaScript code outside of a web browser. npm (Node Package Manager) is included with Node.js and is used to install packages (libraries of code).
    *   [Download Node.js](https://nodejs.org/en/download/). **Choose the LTS (Long Term Support) version.** This is the most stable version. Follow the installation instructions for your operating system. Make sure to include npm in the installation (it's usually included by default).
    *   **Verify Installation:** After installing Node.js, open a new terminal (command prompt on Windows, Terminal on macOS/Linux) and type:
        ```bash
        node -v
        npm -v
        ```
        You should see version numbers for both Node.js and npm. If you see an error, Node.js might not be installed correctly, or it might not be in your system's PATH. (See Troubleshooting below).

## 2. Installation and Setup

Let's get the project code and set it up:

1.  **Clone the Repository:**
    *   **Using Git (command line):**
        1.  Open a terminal (command prompt or Terminal).
        2.  Navigate to the directory where you want to store the project. For example, to put it on your Desktop:
            ```bash
            cd Desktop
            ```
        3.  Clone the repository:
            ```bash
            git clone https://github.com/Moe/mcp-face-generator
            ```
        4.  Change into the project directory:
            ```bash
            cd mcp-face-generator
            ```
    *   **Using GitHub Desktop:**
        1.  Open GitHub Desktop.
        2.  Click "File" -> "Clone Repository...".
        3.  In the "URL" tab, paste the repository URL.
        4.  Choose a local path (where you want to save the project on your computer).
        5.  Click "Clone".

2.  **Install Dependencies:** This downloads all the necessary libraries the project needs. In the terminal, inside the project directory, run:
    ```bash
    npm install
    ```
    This might take a few minutes.

3.  **Build the Project:** This compiles the code into an executable format.
    ```bash
    npm run build
    ```

## 3. Running the Server

You can run the server in two main ways:

*   **Standalone Mode:** This runs the server directly, and it will output messages to the terminal.
*   **Development/Debug Mode:** This runs the server with the MCP Inspector. You can open the URL that it outputs in your browser and start playing around.

### 3.1 Standalone Mode

To run the server in standalone mode, use the following command in the terminal (from the project directory):

```bash
npm run start
```

You should see messages in the terminal indicating that the server is running. It will listen for connections from MCP clients. The server will keep running until you stop it (usually with Ctrl+C).

### 3.2 Development/Debug Mode (with Inspector)

This mode is useful for debugging.

1.  **Start the server in debug mode:**
    ```bash
    npm run dev
    ```
    This will start the server and output a message like: `🔍 MCP Inspector is up and running at http://localhost:5173 🚀`. This is the URL you'll use to open the MCP inspector in your Browser.

## 4. Integrating with Cline

Cline is a VS Code extension that uses MCP servers to provide language support. Here's how to connect this face generator server to Cline:

1.  **Install Cline:** If you haven't already, install the "Cline" extension in VS Code.

2.  **Open Cline Settings:**
    *   Open the VS Code settings (File -> Preferences -> Settings, or Ctrl+,).
    *   Search for "Cline MCP Settings".
    *   Click "Edit in settings.json". This will open the `cline_mcp_settings.json` file.

3.  **Add the Server Configuration:** You'll need to add an entry to the `servers` array in the `cline_mcp_settings.json` file. Here's an example:

    ```json
    {
      "mcpServers": {
        "face-generator": {
          "command": "node",
          "args": [
            "C:/PATH_TO/mcp-face-generator/build/index.js"
          ],
          "disabled": false,
          "autoApprove": []
        }
      }
    }
    ```
    *   Replace `"C:/PATH_TO/mcp-face-generator/build/index.js"` with the actual path to the `index.js` file in your project directory.  Use forward slashes (/) or double backslashes (\\\\) for the path on Windows.

4.  **Test the Connection:**
    *   Cline should automatically connect to the server. You will see the Server appear in the "MCP Servers" Panel (in the Cline extension, you'll find different buttons on the top.)
    *   Ask Cline to generate a face and it should mention the MCP Server and should try to use the corresponding tools

## 5. Troubleshooting

*   **`node -v` or `npm -v` gives an error:**
    *   Make sure Node.js is installed correctly. Try reinstalling it.
    *   Ensure that the Node.js installation directory is in your system's PATH environment variable. On Windows, you can edit environment variables through the System Properties (search for "environment variables" in the Start Menu).
*   **`npm install` fails:**
    *   Make sure you have an internet connection.
    *   Try deleting the `node_modules` folder and running `npm install` again.
    *   If you're behind a proxy, you might need to configure npm to use the proxy. Search online for "npm proxy settings".
*   **Cline doesn't connect to the server:**
    *   Double-check the settings in `cline_mcp_settings.json`. It *must* be the correct path to the `index.js` file.
    *   Make sure the server is running (use `npm run start` to check).
    *   Restart VS Code.

## 6. Tool Parameters

The `generate_face` tool accepts the following parameters:

*   `outputDir`: (required) Directory to save the images
*   `fileName`: Optional file name (defaults to timestamp)
*   `count`: Number of images to generate (default: 1)
*   `width`: Image width in pixels (default: 256)
*   `height`: Image height in pixels (default: 256)
*   `shape`: Image shape (square|circle|rounded, default: square)
*   `borderRadius`: Border radius for rounded shape (default: 32)
*   `returnImageContent`: Return image as base64 encoded content instead of file path (default: false)

## Example

```json
{
  "outputDir": "./output",
  "count": 3,
  "width": 512,
  "height": 512,
  "shape": "circle",
  "returnImageContent": true
}
```

## License

MIT
