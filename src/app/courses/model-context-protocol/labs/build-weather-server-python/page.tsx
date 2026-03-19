import LessonNav from '@/components/LessonNav';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function BuildWeatherServerPythonLab() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Lab 1: Build a Weather MCP Server with Python</h1>
      
      <p>
        In this lab, you&apos;ll build a complete MCP weather server using Python and FastMCP. 
        The server will expose tools for getting weather data and forecasts.
      </p>

      <InfoBox type="info" title="What You Will Learn">
        <ul className="list-disc ml-4">
          <li>Setting up a Python project with FastMCP</li>
          <li>Creating MCP tools with FastMCP decorators</li>
          <li>Handling tool arguments and return values</li>
          <li>Testing with MCP Inspector</li>
          <li>Configuring in Claude Desktop</li>
        </ul>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Python 3.10 or higher</li>
        <li>uv package manager (recommended)</li>
        <li>API key for OpenWeatherMap (optional, we&apos;ll use mock data)</li>
      </ul>

      <h2>Step 1: Project Setup</h2>

      <CodeBlock
        code={`# Create project directory
mkdir weather-mcp && cd weather-mcp

# Initialize with uv
uv init

# Create virtual environment
uv venv

# Activate it
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install FastMCP
uv add "mcp[cli]" httpx`}
        language="bash"
        title="Project Setup"
      />

      <h2>Step 2: Create the Weather Server</h2>

      <CodeBlock
        code={`"""Weather MCP Server using FastMCP."""

from mcp.server.fastmcp import FastMCP
from datetime import datetime
from typing import Optional

# Create the MCP server
mcp = FastMCP("weather")

# Mock weather data for demonstration
MOCK_WEATHER = {
    "New York": {"temp": 72, "conditions": "Partly cloudy", "humidity": 65},
    "London": {"temp": 55, "conditions": "Rainy", "humidity": 80},
    "Tokyo": {"temp": 68, "conditions": "Sunny", "humidity": 50},
    "Sydney": {"temp": 75, "conditions": "Clear", "humidity": 45},
}

@mcp.tool()
async def get_current_weather(location: str) -> str:
    """Get current weather for a location.
    
    Args:
        location: City name (e.g., "New York", "London", "Tokyo", "Sydney")
    
    Returns:
        Current weather information as a formatted string.
    """
    location = location.strip().title()
    
    if location in MOCK_WEATHER:
        data = MOCK_WEATHER[location]
        return (
            f"Current weather in {location}:\\n"
            f"  Temperature: {data['temp']}°F\\n"
            f"  Conditions: {data['conditions']}\\n"
            f"  Humidity: {data['humidity']}%"
        )
    else:
        return f"Weather data not available for {location}. Try: New York, London, Tokyo, or Sydney."

@mcp.tool()
async def get_forecast(location: str, days: int = 3) -> str:
    """Get weather forecast for a location.
    
    Args:
        location: City name
        days: Number of days to forecast (1-7)
    
    Returns:
        Weather forecast as a formatted string.
    """
    location = location.strip().title()
    days = max(1, min(7, days))  # Clamp between 1 and 7
    
    if location not in MOCK_WEATHER:
        return f"Forecast data not available for {location}."
    
    base_temp = MOCK_WEATHER[location]["temp"]
    conditions = ["Sunny", "Partly cloudy", "Cloudy", "Rainy"]
    
    forecast_lines = [f"{days}-day forecast for {location}:"]
    for i in range(days):
        day = datetime.now().day + i
        temp = base_temp + (i * 2) - 5  # Vary temperature
        condition = conditions[i % len(conditions)]
        forecast_lines.append(
            f"  Day {i+1}: {temp}°F, {condition}"
        )
    
    return "\\n".join(forecast_lines)

@mcp.tool()
async def compare_cities(city1: str, city2: str) -> str:
    """Compare weather between two cities.
    
    Args:
        city1: First city name
        city2: Second city name
    
    Returns:
        Comparison of weather between the two cities.
    """
    city1 = city1.strip().title()
    city2 = city2.strip().title()
    
    result = []
    
    for city in [city1, city2]:
        if city in MOCK_WEATHER:
            data = MOCK_WEATHER[city]
            result.append(f"{city}: {data['temp']}°F, {data['conditions']}")
        else:
            result.append(f"{city}: Data not available")
    
    return "\\n".join(result)

@mcp.resource("weather://supported-cities")
async def get_supported_cities() -> str:
    """Get list of supported cities."""
    cities = ", ".join(sorted(MOCK_WEATHER.keys()))
    return f"Supported cities: {cities}"

if __name__ == "__main__":
    mcp.run(transport="stdio")`}
        language="python"
        title="weather_server.py"
      />

      <h2>Step 3: Test with MCP Inspector</h2>

      <CodeBlock
        code={`# Run the server with the inspector
uv run mcp dev weather_server.py

# This will open the MCP Inspector at http://localhost:6274`}
        language="bash"
        title="Testing with MCP Inspector"
      />

      <InfoBox type="info" title="Inspector Features">
        The MCP Inspector allows you to:
        <ul className="list-disc ml-4 mt-2">
          <li>Test tools interactively</li>
          <li>View resource contents</li>
          <li>Inspect protocol messages</li>
          <li>Debug issues</li>
        </ul>
      </InfoBox>

      <h2>Step 4: Configure Claude Desktop</h2>

      <CodeBlock
        code={`{
  "mcpServers": {
    "weather": {
      "command": "uv",
      "args": ["run", "--directory", "/full/path/to/weather-mcp", "weather_server.py"]
    }
  }
}`}
        language="json"
        title="claude_desktop_config.json"
      />

      <InfoBox type="info" title="Configuration Location">
        <ul>
          <li><strong>macOS:</strong> <code>~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
          <li><strong>Linux:</strong> <code>~/.config/Claude/claude_desktop_config.json</code></li>
        </ul>
      </InfoBox>

      <h2>Step 5: Verify Installation</h2>

      <CodeBlock
        code={`# Test the server directly
cd weather-mcp
uv run python weather_server.py

# If you see no errors, the server is ready
# Use Ctrl+C to stop`}
        language="bash"
        title="Direct Test"
      />

      <hr />

      <h2>Challenge Exercises</h2>

      <ol>
        <li>
          <strong>Add a new tool</strong> called <code>get_alerts</code> that returns weather alerts for a location
        </li>
        <li>
          <strong>Add temperature conversion</strong> to the existing tools to support Celsius
        </li>
        <li>
          <strong>Create a resource template</strong> for city-specific weather at <code>weather://&#123;city&#125;</code>
        </li>
        <li>
          <strong>Add error handling</strong> for empty or invalid location inputs
        </li>
      </ol>

      <hr />

      <h2>Solution: Extended Weather Server</h2>

      <CodeBlock
        code={`"""Extended Weather MCP Server with additional features."""

from mcp.server.fastmcp import FastMCP
from datetime import datetime
from typing import Optional

mcp = FastMCP("weather-extended")

MOCK_WEATHER = {
    "New York": {"temp": 72, "conditions": "Partly cloudy", "humidity": 65},
    "London": {"temp": 55, "conditions": "Rainy", "humidity": 80},
    "Tokyo": {"temp": 68, "conditions": "Sunny", "humidity": 50},
    "Sydney": {"temp": 75, "conditions": "Clear", "humidity": 45},
}

ALERTS = {
    "New York": ["Heat advisory in effect until 8 PM"],
    "London": ["Flood warning for Thames area"],
    "Tokyo": [],
    "Sydney": [],
}

@mcp.tool()
async def get_current_weather(location: str, units: str = "fahrenheit") -> str:
    """Get current weather for a location."""
    if not location or not location.strip():
        return "Error: Location cannot be empty"
    
    location = location.strip().title()
    
    if location not in MOCK_WEATHER:
        return f"Weather data not available for {location}. Try: New York, London, Tokyo, or Sydney."
    
    data = MOCK_WEATHER[location]
    temp = data["temp"]
    
    if units == "celsius":
        temp = int((temp - 32) * 5 / 9)
        unit = "°C"
    else:
        unit = "°F"
    
    return (
        f"Current weather in {location}:\\n"
        f"  Temperature: {temp}{unit}\\n"
        f"  Conditions: {data['conditions']}\\n"
        f"  Humidity: {data['humidity']}%"
    )

@mcp.tool()
async def get_alerts(location: str) -> str:
    """Get weather alerts for a location."""
    location = location.strip().title()
    
    if location not in ALERTS:
        return f"No alert data available for {location}."
    
    alerts = ALERTS[location]
    if not alerts:
        return f"No active weather alerts for {location}."
    
    return f"Active alerts for {location}:\\n" + "\\n".join(f"  - {a}" for a in alerts)

@mcp.resource("weather://{city}")
async def get_city_weather(city: str) -> str:
    """Get weather for a specific city."""
    city = city.strip().title()
    if city in MOCK_WEATHER:
        data = MOCK_WEATHER[city]
        return f"{city}: {data['temp']}°F, {data['conditions']}"
    return f"Weather data not available for {city}"

if __name__ == "__main__":
    mcp.run(transport="stdio")`}
        language="python"
        title="weather_server_extended.py"
      />

      <hr />

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer">
            MCP Python SDK
          </a>
        </li>
      </ul>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/sdks', title: 'SDKs' }}
      next={{ href: '/courses/model-context-protocol/labs/build-weather-server-typescript', title: 'Lab 2: Weather Server (TS)' }}
    />
    </>
  );
}
