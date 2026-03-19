import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';
import CodeBlock from '@/components/CodeBlock';

export default function BuildingClientsPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 8: Building MCP Clients</h1>
      
      <p>
        This section covers building MCP clients that connect to MCP servers. 
        Clients are responsible for managing server connections, handling tool 
        invocations, and processing responses.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/develop/build-client" target="_blank" rel="noopener noreferrer">
          Building MCP Clients
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Client["MCP Client"]
        Session["ClientSession"]
        Transport["Transport"]
        Handler["Request Handler"]
    end
    
    Client --> Transport
    Transport --> Server["🖥️ MCP Server"]
    Server --> Client
`} />

      <hr />

      <h2>Python MCP Client</h2>
      <p>
        The Python MCP SDK provides a <code>ClientSession</code> class that handles 
        all protocol details for you.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def main():
    # Define server parameters
    server_params = StdioServerParameters(
        command="python",
        args=["weather_server.py"],
        env=None
    )
    
    # Connect to server
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        
        # List available tools
        tools = await session.list_tools()
        print("Available tools:")
        for tool in tools.tools:
            print(f"  - {tool.name}: {tool.description}")
        
        # Call a tool
        result = await session.call_tool("get_weather", {"location": "NYC"})
        print("Weather result:", result.content)

asyncio.run(main())`}
        language="python"
        title="python_client.py"
      />

      <hr />

      <h2>TypeScript MCP Client</h2>
      <p>
        The TypeScript SDK provides similar functionality for JavaScript/TypeScript applications.
      </p>

      <CodeBlock
        code={`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "weather_server.ts"]
  });

  const client = new Client({
    name: "my-mcp-client",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  await client.connect(transport);

  // List available tools
  const toolsResponse = await client.listTools();
  console.log("Available tools:");
  for (const tool of toolsResponse.tools) {
    console.log("  - " + tool.name + ": " + tool.description);
  }

  // Call a tool
  const result = await client.callTool({
    name: "get_weather",
    arguments: { location: "NYC" }
  });
  console.log("Result:", result);

  await client.close();
}

main();`}
        language="typescript"
        title="typescript_client.ts"
      />

      <hr />

      <h2>Client Architecture</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant App as 📱 Your App
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    participant LLM as 🤖 LLM
    
    App->>Client: Connect to server
    Client->>Server: Initialize
    Server-->>Client: Capabilities
    Client-->>App: Connected
    
    App->>Client: List tools
    Client->>Server: tools/list
    Server-->>Client: [tool1, tool2]
    Client-->>App: Tools list
    
    App->>Client: Call tool
    Client->>Server: tools/call
    Server-->>Server: Execute
    Server-->>Client: Result
    Client-->>App: Tool result
`} />

      <h3>Key Components</h3>
      <ul>
        <li><strong>Transport</strong> — Handles communication (STDIO or HTTP)</li>
        <li><strong>ClientSession</strong> — Manages protocol state and requests</li>
        <li><strong>Capabilities</strong> — Declares what the client supports</li>
      </ul>

      <hr />

      <h2>Connecting to Multiple Servers</h2>
      <p>
        A client can connect to multiple MCP servers simultaneously, each providing 
        different capabilities.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def connect_to_weather_server():
    server_params = StdioServerParameters(
        command="python",
        args=["weather_server.py"]
    )
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        return session

async def connect_to_filesystem_server():
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-filesystem", "/home/user"]
    )
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        return session

async def main():
    # Connect to multiple servers
    weather_session = await connect_to_weather_server()
    fs_session = await connect_to_filesystem_server()
    
    # Use weather server
    weather = await weather_session.call_tool("get_weather", {"location": "NYC"})
    print("Weather:", weather)
    
    # Use filesystem server
    files = await fs_session.list_resources()
    print("Files:", files)

asyncio.run(main())`}
        language="python"
        title="multi_server_client.py"
      />

      <hr />

      <h2>Handling Tool Results</h2>
      <p>
        Tool results are returned as content arrays with different content types.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import TextContent, ImageContent, Resource
import asyncio

async def main():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        result = await session.call_tool("get_complex_result", {})
        
        # Handle different content types
        for content in result.content:
            if isinstance(content, TextContent):
                print("Text:", content.text)
            elif isinstance(content, ImageContent):
                print("Image:", content.mimeType, "data length:", len(content.data))
            else:
                print("Unknown content type:", type(content))

asyncio.run(main())`}
        language="python"
        title="handle_results.py"
      />

      <hr />

      <h2>Resource Operations</h2>
      <p>
        Clients can list, read, and subscribe to resources.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def main():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        
        # List resources
        resources = await session.list_resources()
        print("Available resources:")
        for resource in resources.resources:
            print(f"  - {resource.uri}: {resource.name}")
        
        # List resource templates
        templates = await session.list_resource_templates()
        print("Resource templates:")
        for template in templates.resourceTemplates:
            print(f"  - {template.uriTemplate}: {template.name}")
        
        # Read a specific resource
        contents = await session.read_resource("file:///path/to/file.txt")
        for content in contents.contents:
            print("Content:", content.text[:100])

asyncio.run(main())`}
        language="python"
        title="resource_operations.py"
      />

      <hr />

      <h2>Subscription Handling</h2>
      <p>
        For resources that support subscriptions, clients can receive updates.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def main():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    
    async with stdio_client(server_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        
        # Subscribe to a resource
        await session.subscribe_resource("config://app")
        print("Subscribed to config resource")
        
        # In a real app, you would set up handlers for notifications
        # The server will send notifications/resources/updated when content changes
        # You can handle these in your application logic

asyncio.run(main())`}
        language="python"
        title="subscriptions.py"
      />

      <hr />

      <h2>Error Handling</h2>
      <p>
        Proper error handling ensures robust client applications.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.error import MCPError
import asyncio

async def main():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    
    try:
        async with stdio_client(server_params) as (read, write):
            session = await ClientSession(read, write).initialize()
            
            try:
                result = await session.call_tool("get_weather", {"location": "NYC"})
                print("Result:", result)
            except MCPError as e:
                print(f"MCP Error: {e.code} - {e.message}")
            except Exception as e:
                print(f"Tool Error: {e}")
                
    except Exception as e:
        print(f"Connection Error: {e}")

asyncio.run(main())`}
        language="python"
        title="error_handling_client.py"
      />

      <hr />

      <h2>HTTP Transport Client</h2>
      <p>
        For connecting to remote MCP servers over HTTP.
      </p>

      <CodeBlock
        code={`from mcp.client.http import HttpClientTransport
from mcp import ClientSession
import asyncio

async def main():
    # Connect to a remote MCP server
    transport = HttpClientTransport(
        url="http://localhost:8080/mcp",
        headers={"Authorization": "Bearer token"}
    )
    
    async with transport as (read, write):
        session = await ClientSession(read, write).initialize()
        
        # Use the session
        tools = await session.list_tools()
        print("Remote tools:", [t.name for t in tools.tools])

asyncio.run(main())`}
        language="python"
        title="http_client.py"
      />

      <hr />

      <h2>Complete Example: AI Assistant Integration</h2>
      <p>
        Here&apos;s how you would integrate an MCP client into an AI assistant application.
      </p>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

class MCPClient:
    def __init__(self):
        self.sessions = {}
    
    async def connect_server(self, name, server_params):
        """Connect to an MCP server."""
        async with stdio_client(server_params) as (read, write):
            session = await ClientSession(read, write).initialize()
            self.sessions[name] = session
            tools = await session.list_tools()
            print(f"Connected to {name} with {len(tools.tools)} tools")
    
    async def call_tool(self, server_name, tool_name, arguments):
        """Call a tool on a specific server."""
        if server_name not in self.sessions:
            raise ValueError(f"Not connected to {server_name}")
        
        session = self.sessions[server_name]
        result = await session.call_tool(tool_name, arguments)
        return result
    
    async def get_all_tools(self):
        """Get all available tools from all servers."""
        all_tools = []
        for name, session in self.sessions.items():
            tools = await session.list_tools()
            for tool in tools.tools:
                all_tools.append({...tool, "server": name})
        return all_tools

async def main():
    client = MCPClient()
    
    # Connect to multiple servers
    await client.connect_server("weather", StdioServerParameters(
        command="python", args=["weather_server.py"]
    ))
    await client.connect_server("filesystem", StdioServerParameters(
        command="npx", args=["-y", "@modelcontextprotocol/server-filesystem", "."]
    ))
    
    # List all available tools
    tools = await client.get_all_tools()
    print("\\nAll available tools:")
    for tool in tools:
        print(f"  [{tool['server']}] {tool['name']}: {tool['description']}")
    
    # Use a tool
    result = await client.call_tool("weather", "get_weather", {"location": "NYC"})
    print("\\nWeather result:", result.content[0].text)

asyncio.run(main())`}
        language="python"
        title="ai_assistant_client.py"
      />

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/develop/build-client" target="_blank" rel="noopener noreferrer">
            Building MCP Clients
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer">
            MCP Python SDK
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer">
            MCP TypeScript SDK
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/building-servers-typescript', title: 'Building Servers (TypeScript)' }}
      next={{ href: '/courses/model-context-protocol/client-features', title: 'Client Features' }}
    />
    </>
  );
}
