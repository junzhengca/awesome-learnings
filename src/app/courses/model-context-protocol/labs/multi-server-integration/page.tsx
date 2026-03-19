import LessonNav from '@/components/LessonNav';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function MultiServerIntegrationLab() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Lab 4: Multi-Server Integration</h1>
      
      <p>
        In this lab, you&apos;ll create an MCP client that connects to multiple servers and 
        demonstrates how AI can seamlessly work with data from multiple sources.
      </p>

      <InfoBox type="info" title="What You Will Learn">
        <ul className="list-disc ml-4">
          <li>Connecting to multiple MCP servers simultaneously</li>
          <li>Coordinating data from different sources</li>
          <li>Building a unified data aggregation client</li>
        </ul>
      </InfoBox>

      <h2>Architecture</h2>

      <CodeBlock
        code={`┌─────────────────────────────────────┐
│         MCP Client App              │
├─────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐         │
│  │ Weather │  │ Git     │         │
│  │ Server  │  │ Server  │         │
│  └────┬────┘  └────┬────┘         │
│       │            │              │
│       └──────┬─────┘              │
│              │                    │
│         Aggregate                  │
└─────────────────────────────────────┘`}
        language="text"
        title="Multi-Server Architecture"
      />

      <h2>Step 1: Create Multi-Server Client</h2>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

class MCPClient:
    def __init__(self):
        self.sessions = {}
    
    async def connect(self, name, server_params):
        async with stdio_client(server_params) as (read, write):
            session = await ClientSession(read, write).initialize()
            self.sessions[name] = session
    
    async def call_tool(self, server_name, tool_name, arguments):
        return await self.sessions[server_name].call_tool(tool_name, arguments)
    
    async def list_tools(self, server_name):
        return await self.sessions[server_name].list_tools()

async def main():
    client = MCPClient()
    
    # Connect to multiple servers
    await client.connect("weather", StdioServerParameters(
        command="python", args=["weather_server.py"]
    ))
    await client.connect("git", StdioServerParameters(
        command="uvx", args=["mcp-server-git"]
    ))
    
    # Use tools from both servers
    weather = await client.call_tool("weather", "get_weather", {"location": "NYC"})
    print("Weather:", weather.content[0].text)

asyncio.run(main())`}
        language="python"
        title="multi_client.py"
      />

      <h2>Challenge</h2>
      <p>Add a filesystem server and aggregate weather, git status, and file listings.</p>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/labs/build-mcp-client', title: 'Lab 3: Build MCP Client' }}
      next={{ href: '/courses/model-context-protocol/labs/capstone-project', title: 'Lab 5: Capstone' }}
    />
    </>
  );
}
