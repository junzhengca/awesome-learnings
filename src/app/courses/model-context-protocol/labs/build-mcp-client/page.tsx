import LessonNav from '@/components/LessonNav';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function BuildMCPClientLab() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Lab 3: Build an MCP Client</h1>
      
      <p>
        In this lab, you&apos;ll build a Python MCP client that connects to weather and filesystem servers.
      </p>

      <InfoBox type="info" title="What You Will Learn">
        <ul className="list-disc ml-4">
          <li>Connecting to MCP servers</li>
          <li>Listing and calling tools</li>
          <li>Reading resources</li>
          <li>Handling results and errors</li>
        </ul>
      </InfoBox>

      <h2>Step 1: Install Client Dependencies</h2>

      <CodeBlock
        code={`uv add mcp httpx`}
        language="bash"
        title="Install Dependencies"
      />

      <h2>Step 2: Create the Client</h2>

      <CodeBlock
        code={`from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

async def main():
    # Connect to weather server
    weather_params = StdioServerParameters(
        command="python",
        args=["weather_server.py"]
    )
    
    async with stdio_client(weather_params) as (read, write):
        session = await ClientSession(read, write).initialize()
        
        # List available tools
        tools = await session.list_tools()
        print("Available tools:", [t.name for t in tools.tools])
        
        # Call a tool
        result = await session.call_tool("get_weather", {"location": "NYC"})
        print("Result:", result.content[0].text)

asyncio.run(main())`}
        language="python"
        title="client.py"
      />

      <h2>Challenge</h2>
      <p>Connect to multiple servers and aggregate their results.</p>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/labs/build-weather-server-typescript', title: 'Lab 2: Weather Server (TS)' }}
      next={{ href: '/courses/model-context-protocol/labs/multi-server-integration', title: 'Lab 4: Multi-Server' }}
    />
    </>
  );
}
