import LessonNav from '@/components/LessonNav';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function BuildWeatherServerTypescriptLab() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Lab 2: Build a Weather MCP Server with TypeScript</h1>
      
      <p>
        In this lab, you&apos;ll build a complete MCP weather server using TypeScript and the MCP SDK.
      </p>

      <InfoBox type="info" title="What You Will Learn">
        <ul className="list-disc ml-4">
          <li>Setting up a TypeScript project with the MCP SDK</li>
          <li>Creating MCP tools with the SDK</li>
          <li>Using Zod for input validation</li>
          <li>Building and running the server</li>
        </ul>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18+</li>
        <li>npm or yarn</li>
      </ul>

      <h2>Step 1: Project Setup</h2>

      <CodeBlock
        code={`mkdir weather-mcp-ts && cd weather-mcp-ts
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node tsx`}
        language="bash"
        title="Project Setup"
      />

      <h2>Step 2: Create the Weather Server</h2>

      <CodeBlock
        code={`import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "weather-server",
  version: "1.0.0"
});

const MOCK_WEATHER: Record<string, { temp: number; conditions: string; humidity: number }> = {
  "New York": { temp: 72, conditions: "Partly cloudy", humidity: 65 },
  "London": { temp: 55, conditions: "Rainy", humidity: 80 },
  "Tokyo": { temp: 68, conditions: "Sunny", humidity: 50 },
  "Sydney": { temp: 75, conditions: "Clear", humidity: 45 },
};

server.registerTool(
  "get_weather",
  {
    description: "Get current weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
        units: { type: "string", enum: ["celsius", "fahrenheit"], default: "fahrenheit" }
      },
      required: ["location"]
    }
  },
  async ({ location, units = "fahrenheit" }) => {
    const city = location?.trim()?.title();
    const data = MOCK_WEATHER[city || ""];
    
    if (!data) {
      return {
        content: [{ type: "text", text: "City not found. Try: New York, London, Tokyo, Sydney" }],
        isError: true
      };
    }
    
    let temp = data.temp;
    let unit = "°F";
    if (units === "celsius") {
      temp = Math.round((temp - 32) * 5 / 9);
      unit = "°C";
    }
    
    return {
      content: [{
        type: "text" as const,
        text: \`Current weather in \${city}:
  Temperature: \${temp}\${unit}
  Conditions: \${data.conditions}
  Humidity: \${data.humidity}%\`
      }]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();`}
        language="typescript"
        title="src/index.ts"
      />

      <h2>Step 3: Configure package.json</h2>

      <CodeBlock
        code={`{
  "name": "weather-mcp-ts",
  "type": "module",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}`}
        language="json"
        title="package.json"
      />

      <h2>Step 4: Build and Test</h2>

      <CodeBlock
        code={`# Test with inspector
npx @modelcontextprotocol/inspector npm run dev`}
        language="bash"
        title="Test with Inspector"
      />

      <hr />

      <h2>Sources</h2>
      <ul>
        <li><a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank">MCP TypeScript SDK</a></li>
      </ul>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/labs/build-weather-server-python', title: 'Lab 1: Weather Server (Python)' }}
      next={{ href: '/courses/model-context-protocol/labs/build-mcp-client', title: 'Lab 3: Build MCP Client' }}
    />
    </>
  );
}
