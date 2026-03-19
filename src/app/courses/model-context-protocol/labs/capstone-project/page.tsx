import LessonNav from '@/components/LessonNav';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function CapstoneProjectLab() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Lab 5: Capstone Project — Travel Planning Assistant</h1>
      
      <p>
        In this capstone project, you&apos;ll build a complete Travel Planning MCP server that 
        demonstrates all three MCP primitives: Tools, Resources, and Prompts.
      </p>

      <InfoBox type="info" title="What You Will Build">
        A Travel Planning Assistant MCP server with:
        <ul className="list-disc ml-4 mt-2">
          <li><strong>Tools:</strong> Search flights, book hotels, get weather</li>
          <li><strong>Resources:</strong> Trip itineraries, booking confirmations</li>
          <li><strong>Prompts:</strong> Trip planning templates</li>
        </ul>
      </InfoBox>

      <h2>Project Structure</h2>

      <CodeBlock
        code={`travel-planner/
├── pyproject.toml
├── travel_server.py      # Main MCP server
├── flights.py           # Flight search logic
├── hotels.py            # Hotel booking logic
└── weather.py           # Weather integration`}
        language="text"
        title="Project Structure"
      />

      <h2>Step 1: Create the Travel Server</h2>

      <CodeBlock
        code={`from mcp.server.fastmcp import FastMCP
from datetime import datetime, timedelta

mcp = FastMCP("travel-planner")

# Mock data
TRIPS = {}

@mcp.tool()
async def search_flights(origin: str, destination: str, date: str) -> str:
    """Search for flights between two cities."""
    return f"Flights from {origin} to {destination} on {date}:\\n- AA123: $350\\n- UA456: $420"

@mcp.tool()
async def book_hotel(city: str, checkin: str, checkout: str) -> str:
    """Book a hotel room."""
    booking_id = f"BK{len(TRIPS) + 1:04d}"
    TRIPS[booking_id] = {"city": city, "checkin": checkin, "checkout": checkout}
    return f"Booked: {booking_id} at {city} from {checkin} to {checkout}"

@mcp.resource("trip://{booking_id}")
async def get_booking(booking_id: str) -> str:
    """Get booking details."""
    if booking_id in TRIPS:
        t = TRIPS[booking_id]
        return f"Booking {booking_id}: {t['city']}, {t['checkin']} to {t['checkout']}"
    return "Booking not found"

@mcp.prompt()
def plan_trip() -> str:
    """Generate a trip planning prompt."""
    return "Help me plan a trip. I need: 1) Flights, 2) Hotels, 3) Weather info"

if __name__ == "__main__":
    mcp.run(transport="stdio")`}
        language="python"
        title="travel_server.py"
      />

      <h2>Step 2: Test Your Server</h2>

      <CodeBlock
        code={`# Run with inspector
uv run mcp dev travel_server.py

# Test in Claude Desktop with config:
# {
#   "mcpServers": {
#     "travel": {
#       "command": "uv",
#       "args": ["run", "travel_server.py"]
#     }
#   }
# }`}
        language="bash"
        title="Testing"
      />

      <h2>Extensions</h2>
      <ul>
        <li>Add car rental tool</li>
        <li>Create activity suggestions prompt</li>
        <li>Add packing list resource</li>
        <li>Integrate real flight/hotel APIs</li>
      </ul>

      <hr />

      <h2>Congratulations!</h2>
      <p>
        You&apos;ve completed the MCP Fundamentals course! You now understand:
      </p>
      <ul>
        <li>MCP architecture and design principles</li>
        <li>Tools, Resources, and Prompts</li>
        <li>Transport layer mechanisms</li>
        <li>Building servers and clients</li>
        <li>Security best practices</li>
        <li>Production deployment</li>
      </ul>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/labs/multi-server-integration', title: 'Lab 4: Multi-Server' }}
    />
    </>
  );
}
