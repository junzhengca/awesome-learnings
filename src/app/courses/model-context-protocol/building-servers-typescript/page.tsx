import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';
import CodeBlock from '@/components/CodeBlock';

export default function BuildingServersTypeScriptPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 7: Building MCP Servers with TypeScript</h1>
      
      <p>
        This section covers building MCP servers using TypeScript and the official 
        <strong>MCP TypeScript SDK</strong>. TypeScript provides excellent type safety 
        and is the primary language for many MCP reference implementations.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer">
          MCP TypeScript SDK
        </a>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18 or higher</li>
        <li>npm or yarn package manager</li>
        <li>TypeScript familiarity</li>
      </ul>

      <CodeBlock
        code={`# Create a new project
mkdir my-mcp-server && cd my-mcp-server
npm init -y

# Install the MCP SDK
npm install @modelcontextprotocol/sdk zod

# Install TypeScript
npm install -D typescript @types/node tsx`}
        language="bash"
        title="Project Setup"
      />

      <hr />

      <h2>Quick Start with McpServer</h2>
      <p>
        The <strong>McpServer</strong> class is the core of the TypeScript SDK. It handles 
        the protocol details and provides a clean API for defining tools, resources, and prompts.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph TypeScript["TypeScript MCP Server"]
        Server["McpServer"]
        Tool["registerTool()"]
        Resource["registerResource()"]
        Prompt["registerPrompt()"]
        
        Server --> Tool
        Server --> Resource
        Server --> Prompt
    end
`} />

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0"
});

// Register a tool
server.registerTool(
  "get_weather",
  {
    description: "Get current weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "City name or zip code"
        },
        units: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          default: "fahrenheit"
        }
      },
      required: ["location"]
    }
  },
  async ({ location, units }) => {
    const temp = units === "celsius" ? 22 : 72;
    return {
      content: [
        {
          type: "text",
          text: "The weather in " + location + " is " + temp + " and sunny"
        }
      ]
    };
  }
);

// Run the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="src/index.ts"
      />

      <InfoBox type="info" title="Using Zod for Validation">
        The Zod library integrates seamlessly with MCP for runtime schema validation. 
        It provides better error messages and type inference.
      </InfoBox>

      <hr />

      <h2>Adding Resources</h2>
      <p>
        Resources expose data that AI models can read. They use URI templates for 
        parameterized access.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Resource } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";

const server = new McpServer({
  name: "filesystem-server",
  version: "1.0.0"
});

// Static resource
const configResource: Resource = {
  uri: "config://app",
  name: "app-config",
  description: "Application configuration",
  mimeType: "application/json"
};

server.resource("config", configResource, async () => {
  return {
    contents: [
      {
        uri: "config://app",
        mimeType: "application/json",
        text: JSON.stringify({ theme: "dark", language: "en" })
      }
    ]
  };
});

// Template resource with path parameter
server.resource(
  "file",
  {
    uriTemplate: "file://{path}",
    name: "file-reader",
    description: "Read a file from the filesystem"
  },
  async ({ path }) => {
    try {
      const content = readFileSync(path, "utf-8");
      return {
        contents: [
          {
            uri: "file://" + path,
            mimeType: "text/plain",
            text: content
          }
        ]
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: "file://" + path,
            mimeType: "text/plain",
            text: "Error reading file"
          }
        ]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="resources.ts"
      />

      <hr />

      <h2>Adding Prompts</h2>
      <p>
        Prompts are reusable templates that guide user interactions. They can include 
        arguments for customization.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "prompt-server",
  version: "1.0.0"
});

server.setRequestHandler("prompts/list", async () => {
  return {
    prompts: [
      {
        name: "code-review",
        description: "Generate a code review prompt",
        arguments: [
          {
            name: "language",
            description: "Programming language",
            required: true
          },
          {
            name: "focus",
            description: "Focus area",
            required: false
          }
        ]
      }
    ]
  };
});

server.setRequestHandler("prompts/get", async (request) => {
  const name = request.params.name;
  const args = request.params.arguments || {};
  
  if (name === "code-review") {
    const lang = args.language || "unknown";
    const focus = args.focus || "general";
    
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Please review the following " + lang + " code. Focus: " + focus + "."
          }
        }
      ]
    };
  }
  
  throw new Error("Unknown prompt");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="prompts.ts"
      />

      <hr />

      <h2>Tool with Zod Schema Validation</h2>
      <p>
        Using Zod provides automatic validation and better type inference for your tools.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "validated-server",
  version: "1.0.0"
});

const GetWeatherSchema = z.object({
  location: z.string().describe("City name or zip code"),
  units: z.enum(["celsius", "fahrenheit"]).default("fahrenheit")
});

type GetWeatherArgs = z.infer<typeof GetWeatherSchema>;

server.registerTool(
  {
    name: "get_weather",
    description: "Get weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string" },
        units: { type: "string", enum: ["celsius", "fahrenheit"] }
      },
      required: ["location"]
    }
  },
  async (args) => {
    const { location, units = "fahrenheit" } = args;
    const temp = units === "celsius" ? 22 : 72;
    
    return {
      content: [
        {
          type: "text",
          text: "Weather for " + location + ": " + temp + " degrees"
        }
      ]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="validated_tool.ts"
      />

      <hr />

      <h2>Error Handling</h2>
      <p>
        Proper error handling ensures AI models can understand and recover from errors.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "error-handling-server",
  version: "1.0.0"
});

server.registerTool(
  "fetch_data",
  {
    description: "Fetch data from a URL",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", format: "uri" }
      },
      required: ["url"]
    }
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }
      const text = await response.text();
      return {
        content: [{ type: "text", text: text }]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "Error: " + String(error)
          }
        ],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="error_handling.ts"
      />

      <InfoBox type="info" title="Error Response">
        Setting <code>isError: true</code> in the response signals to the AI that this 
        was an error. The AI can use this information to self-correct and retry.
      </InfoBox>

      <hr />

      <h2>Resource Subscriptions</h2>
      <p>
        Resources can support subscriptions to notify clients of changes.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "subscription-server",
  version: "1.0.0",
  capabilities: {
    resources: {
      subscribe: true,
      listChanged: true
    }
  }
});

server.resource(
  "config",
  {
    uriTemplate: "config://app",
    name: "app-config",
    description: "Application configuration"
  },
  async () => {
    return {
      contents: [
        {
          uri: "config://app",
          mimeType: "application/json",
          text: JSON.stringify({ theme: "dark", language: "en" })
        }
      ]
    };
  }
);

server.setRequestHandler("resources/subscribe", async ({ uri }) => {
  return {};
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="subscriptions.ts"
      />

      <hr />

      <h2>Running with Different Transports</h2>
      <p>
        The TypeScript SDK supports both STDIO and HTTP transports.
      </p>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "multi-transport-server",
  version: "1.0.0"
});

server.registerTool(
  "get_time",
  {
    description: "Get current time",
    inputSchema: { type: "object", properties: {} }
  },
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "Current time: " + new Date().toISOString()
        }
      ]
    };
  }
);

async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const transportType = process.env.TRANSPORT || "stdio";

if (transportType === "http") {
  // For HTTP transport, use StreamableHTTPServerTransport
  console.log("HTTP transport not shown in this example");
} else {
  runStdio();
}`}
        language="typescript"
        title="transports.ts"
      />

      <hr />

      <h2>Configuring Claude Desktop</h2>

      <CodeBlock
        code={`{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["tsx", "/path/to/src/index.ts"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
    }
  }
}`}
        language="json"
        title="claude_desktop_config.json"
      />

      <hr />

      <h2>Complete Example: Git MCP Server</h2>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { execSync } from "child_process";

const server = new McpServer({
  name: "git-server",
  version: "1.0.0"
});

server.registerTool(
  {
    name: "git_status",
    description: "Get git status of repository",
    inputSchema: { type: "object", properties: {} }
  },
  async () => {
    try {
      const output = execSync("git status --short").toString();
      return { content: [{ type: "text", text: output || "Clean" }] };
    } catch (error) {
      return { content: [{ type: "text", text: String(error) }], isError: true };
    }
  }
);

server.registerTool(
  {
    name: "git_log",
    description: "Get recent git commits",
    inputSchema: {
      type: "object",
      properties: {
        count: { type: "number", default: 10 }
      }
    }
  },
  async ({ count = 10 }) => {
    try {
      const output = execSync("git log --oneline -n " + count).toString();
      return { content: [{ type: "text", text: output }] };
    } catch (error) {
      return { content: [{ type: "text", text: String(error) }], isError: true };
    }
  }
);

server.registerTool(
  {
    name: "git_branches",
    description: "List git branches",
    inputSchema: { type: "object", properties: {} }
  },
  async () => {
    try {
      const current = execSync("git branch --show-current").toString().trim();
      const all = execSync("git branch -a").toString();
      return { content: [{ type: "text", text: "Current: " + current + all }] };
    } catch (error) {
      return { content: [{ type: "text", text: String(error) }], isError: true };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="git_server.ts"
      />

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer">
            MCP TypeScript SDK
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/servers/tree/main/src" target="_blank" rel="noopener noreferrer">
            Reference Server Implementations
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/docs/develop/build-server" target="_blank" rel="noopener noreferrer">
            Building MCP Servers
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/building-servers-python', title: 'Building Servers (Python)' }}
      next={{ href: '/courses/model-context-protocol/building-clients', title: 'Building Clients' }}
    />
    </>
  );
}
