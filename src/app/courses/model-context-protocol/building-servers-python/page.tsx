import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';
import CodeBlock from '@/components/CodeBlock';

export default function BuildingServersPythonPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 6: Building MCP Servers with Python</h1>
      
      <p>
        This section covers building MCP servers using Python. We&apos;ll use the 
        <strong>FastMCP</strong> library, which provides a high-level interface for 
        creating MCP servers quickly, and the <strong>low-level MCP SDK</strong> for 
        more control.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer">
          MCP Python SDK
        </a>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Python 3.10 or higher</li>
        <li><code>uv</code> package manager (recommended)</li>
        <li>Basic understanding of async Python</li>
      </ul>

      <CodeBlock
        code={`# Install using uv (recommended)
uv add "mcp[cli]" httpx

# Or using pip
pip install mcp httpx`}
        language="bash"
        title="Install MCP Python SDK"
      />

      <hr />

      <h2>Quick Start with FastMCP</h2>
      <p>
        <strong>FastMCP</strong> is a high-level library that simplifies MCP server creation. 
        It handles the protocol details so you can focus on your application logic.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph FastMCP["FastMCP Server"]
        Decorator["@mcp.tool()"]
        Logic["Your Code"]
        Decorator --> Logic
    end
`} />

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("weather")

@mcp.tool()
async def get_weather(location: str, units: str = "fahrenheit") -> str:
    """Get current weather for a location.
    
    Args:
        location: City name or zip code
        units: Temperature units (celsius or fahrenheit)
    
    Returns:
        Weather information string
    """
    # Your weather API logic here
    return "The weather in " + location + " is 72°F and sunny"

# Run the server with stdio transport
mcp.run(transport="stdio")`}
        language="python"
        title="weather_server.py"
      />

      <InfoBox type="info" title="How It Works">
        The <code>@mcp.tool()</code> decorator registers the function as an MCP tool. 
        FastMCP automatically handles the JSON-RPC protocol, parameter parsing, and 
        response formatting.
      </InfoBox>

      <hr />

      <h2>Adding Resources</h2>
      <p>
        Resources provide passive data that the AI can read. FastMCP makes it easy to 
        expose resources.
      </p>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP
from pathlib import Path

mcp = FastMCP("filesystem")

@mcp.resource("file://{path}")
async def read_file(path: str) -> str:
    """Read a file from the filesystem.
    
    Args:
        path: Path to the file relative to project root
    
    Returns:
        File contents as string
    """
    file_path = Path(path)
    if not file_path.exists():
        raise FileNotFoundError("File not found: " + path)
    return file_path.read_text()

@mcp.resource("directory://{path}")
async def list_directory(path: str) -> str:
    """List contents of a directory.
    
    Args:
        path: Path to the directory
    
    Returns:
        Directory listing
    """
    dir_path = Path(path)
    if not dir_path.exists():
        raise FileNotFoundError("Directory not found: " + path)
    files = [f.name for f in dir_path.iterdir()]
    return "\\n".join(files)

mcp.run(transport="stdio")`}
        language="python"
        title="filesystem_server.py"
      />

      <hr />

      <h2>Adding Prompts</h2>
      <p>
        Prompts are reusable templates that users can invoke. They can include arguments 
        that users fill in.
      </p>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("prompts")

@mcp.prompt()
def code_review(language: str, focus_area: str = "general") -> str:
    """Generate a code review prompt."""
    focus_instructions = {
        "general": "Review for correctness, readability, and best practices.",
        "security": "Focus on security vulnerabilities.",
        "performance": "Look for performance issues."
    }
    
    instruction = focus_instructions.get(focus_area, focus_instructions["general"])
    return "Please review the following " + language + " code. Focus: " + focus_area + ". " + instruction

mcp.run(transport="stdio")`}
        language="python"
        title="prompt_server.py"
      />

      <hr />

      <h2>Using the Low-Level SDK</h2>
      <p>
        For more control over the MCP protocol, you can use the low-level SDK directly. 
        This gives you full access to all MCP features.
      </p>

      <CodeBlock
        code={`import asyncio
from mcp.server import Server
from mcp.types import Tool, TextContent
from mcp.server.stdio import stdio_server

server = Server("my-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="get_weather",
            description="Get weather for a location",
            inputSchema={
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name or zip code"
                    }
                },
                "required": ["location"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "get_weather":
        location = arguments.get("location", "Unknown")
        result = "Weather for " + location + ": 72°F"
        return [TextContent(type="text", text=result)]
    raise ValueError("Unknown tool: " + name)

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())`}
        language="python"
        title="low_level_server.py"
      />

      <hr />

      <h2>Tool Error Handling</h2>
      <p>
        Proper error handling ensures your server provides useful feedback when things go wrong.
      </p>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP
from mcp.types import TextContent

mcp = FastMCP("robust-server")

@mcp.tool()
async def divide(a: float, b: float) -> str:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return str(a / b)

@mcp.tool()
async def fetch_data(url: str) -> list[TextContent]:
    try:
        import httpx
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
        return [TextContent(type="text", text=response.text)]
    except httpx.HTTPError as e:
        return [TextContent(type="text", text="HTTP error: " + str(e))]
    except Exception as e:
        return [TextContent(type="text", text="Error: " + str(e))]

mcp.run(transport="stdio")`}
        language="python"
        title="error_handling_server.py"
      />

      <InfoBox type="info" title="Error Best Practices">
        <ul className="list-disc ml-4">
          <li>Return <code>isError: true</code> in TextContent for recoverable errors</li>
          <li>Use JSON-RPC errors for protocol-level issues</li>
          <li>Provide actionable error messages that AI can use to self-correct</li>
        </ul>
      </InfoBox>

      <hr />

      <h2>Resource Subscriptions</h2>
      <p>
        Resources can support subscriptions to notify clients when data changes.
      </p>

      <CodeBlock
        code={`import asyncio
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("subscription-demo")

@mcp.resource("config://app")
async def get_config() -> str:
    return '{"theme": "dark", "language": "en"}'

@mcp.resource("config://app")
async def update_config() -> None:
    await mcp.notify_resource_updated("config://app")

async def watch_config():
    while True:
        await asyncio.sleep(30)
        await mcp.notify_resource_updated("config://app")

mcp.run(transport="stdio")`}
        language="python"
        title="subscription_server.py"
      />

      <hr />

      <h2>Server Configuration</h2>
      <p>
        FastMCP and the SDK support various configuration options for your server.
      </p>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="my-weather-server",
    version="1.0.0",
    dependencies=["httpx"],
)

@mcp.tool()
async def get_data() -> str:
    import httpx
    response = await httpx.get("https://api.example.com/data")
    return response.text

mcp.run(transport="stdio")`}
        language="python"
        title="configured_server.py"
      />

      <hr />

      <h2>Testing Your Server</h2>
      <p>
        Use the MCP Inspector to test your server during development.
      </p>

      <CodeBlock
        code={`# Run your server with the inspector
uv run mcp dev weather_server.py

# The inspector will open at http://localhost:6274
# You can test tools, resources, and prompts interactively`}
        language="bash"
        title="Testing with MCP Inspector"
      />

      <hr />

      <h2>Configuring Claude Desktop</h2>
      <p>
        Once your server is working, add it to Claude Desktop configuration.
      </p>

      <CodeBlock
        code={`{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": ["run", "--directory", "/path/to/project", "weather_server.py"]
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

      <InfoBox type="info" title="Configuration Location">
        <ul>
          <li><strong>macOS:</strong> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
          <li><strong>Windows:</strong> <code>%APPDATA%\\Claude\\claude_desktop_config.json</code></li>
          <li><strong>Linux:</strong> <code>~/.config/Claude/claude_desktop_config.json</code></li>
        </ul>
      </InfoBox>

      <hr />

      <h2>Complete Example: Todo Server</h2>
      <p>
        Let&apos;s build a complete MCP server for managing todos with all three primitives.
      </p>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP
from datetime import datetime
from typing import Optional

mcp = FastMCP("todo-server")
todos = []

@mcp.tool()
async def add_todo(title: str, description: str = "") -> str:
    todo_id = len(todos) + 1
    todo = {
        "id": todo_id,
        "title": title,
        "description": description,
        "completed": False,
        "created_at": datetime.now().isoformat()
    }
    todos.append(todo)
    return "Added todo #" + str(todo_id) + ": " + title

@mcp.tool()
async def complete_todo(todo_id: int) -> str:
    for todo in todos:
        if todo["id"] == todo_id:
            todo["completed"] = True
            return "Completed todo #" + str(todo_id)
    return "Todo #" + str(todo_id) + " not found"

@mcp.tool()
async def list_todos(status: Optional[str] = None) -> str:
    filtered = todos
    if status == "completed":
        filtered = [t for t in todos if t["completed"]]
    elif status == "pending":
        filtered = [t for t in todos if not t["completed"]]
    
    if not filtered:
        return "No todos found."
    
    lines = []
    for t in filtered:
        check = "X" if t["completed"] else "O"
        lines.append("[" + check + "] [" + str(t["id"]) + "] " + t["title"])
    return "\\n".join(lines)

@mcp.resource("todos://all")
async def get_all_todos() -> str:
    return await list_todos()

mcp.run(transport="stdio")`}
        language="python"
        title="todo_server.py"
      />

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer">
            MCP Python SDK
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/docs/develop/build-server" target="_blank" rel="noopener noreferrer">
            Building MCP Servers
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/servers/tree/main/src" target="_blank" rel="noopener noreferrer">
            Reference Server Implementations
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/protocol-lifecycle', title: 'Protocol Lifecycle' }}
      next={{ href: '/courses/model-context-protocol/building-servers-typescript', title: 'Building Servers (TypeScript)' }}
    />
    </>
  );
}
