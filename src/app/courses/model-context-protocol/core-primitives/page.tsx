import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function CorePrimitivesPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 3: Core Primitives — Tools, Resources, and Prompts</h1>
      
      <p>
        MCP defines three core primitives that servers can expose to AI applications: 
        <strong>Tools</strong>, <strong>Resources</strong>, and <strong>Prompts</strong>. 
        Understanding these primitives is essential for building effective MCP servers.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/learn/server-concepts" target="_blank" rel="noopener noreferrer">
          MCP Server Concepts Documentation
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Primitives["MCP Core Primitives"]
        T["🔧 Tools"]
        R["📄 Resources"]
        P["📝 Prompts"]
    end
    
    T --> T1["Model-controlled"]
    T --> T2["Executable actions"]
    
    R --> R1["Application-driven"]
    R --> R2["Passive data"]
    
    P --> P1["User-controlled"]
    P --> P2["Template reuse"]
`} />

      <hr />

      <h2>1. Tools</h2>
      <p>
        <strong>Tools</strong> are executable functions that AI models can invoke to perform actions. 
        They are <strong>model-controlled</strong>, meaning the AI decides when and how to use them based 
        on the user&apos;s request.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant LLM as 🤖 LLM
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    
    Note over LLM,Server: Tool Discovery
    Client->>Server: tools/list
    Server-->>Client: {tools: [get_weather, search_db, send_email]}
    Client-->>LLM: Available tools
    
    Note over LLM,Server: Tool Invocation
    LLM->>Client: Use get_weather(location="NYC")
    Client->>Server: tools/call(name="get_weather", args={location:"NYC"})
    Server-->>Server: Execute function
    Server-->>Client: {content: "72°F, sunny"}
    Client-->>LLM: Tool result
`} />

      <h3>Tool Characteristics</h3>
      <ul>
        <li><strong>Model-controlled</strong> — AI decides when to invoke</li>
        <li><strong>Executable</strong> — Performs actions or computations</li>
        <li><strong>Parameterized</strong> — Accept input arguments</li>
        <li><strong>Returns structured data</strong> — Results back to AI</li>
      </ul>

      <h3>Tool Definition Schema</h3>
      <p>A tool is defined with a name, description, and input schema:</p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
              <th>Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>name</code></td>
              <td>Unique identifier for the tool</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td>Human-readable description of functionality</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><code>inputSchema</code></td>
              <td>JSON Schema defining expected parameters</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td><code>title</code></td>
              <td>Human-readable name for display</td>
              <td>No</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Example Tool Definition</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or zip code"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "default": "fahrenheit"
      }
    },
    "required": ["location"]
  }
}`}
      </pre>

      <h3>Tool Naming Rules</h3>
      <ul>
        <li>1-128 characters in length</li>
        <li>Case-sensitive</li>
        <li>Allowed characters: A-Z, a-z, 0-9, underscore, hyphen, dot</li>
        <li>No spaces or special characters</li>
        <li>Unique within a server</li>
      </ul>

      <InfoBox type="warning" title="User Consent">
        There should always be a human in the loop with the ability to deny tool invocations. 
        Applications should provide clear visual indicators when tools are invoked.
      </InfoBox>

      <hr />

      <h2>2. Resources</h2>
      <p>
        <strong>Resources</strong> are passive data sources that provide context to AI models. 
        They are <strong>application-driven</strong>, meaning the host application determines 
        how to incorporate them based on user actions or automatic context injection.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Resource["Resource Flow"]
        Server["🖥️ Server"] -->|"Resource List"| Client["🔗 Client"]
        Client -->|"Resource Read"| Server
        Server -->|"Resource Contents"| Client
        Client -->|"Context"| LLM["🤖 LLM"]
    end
`} />

      <h3>Resource vs Resource Templates</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Direct Resource</strong></td>
              <td>Fixed URI with static content</td>
              <td><code>file:///project/README.md</code></td>
            </tr>
            <tr>
              <td><strong>Resource Template</strong></td>
              <td>Parameterized URI pattern</td>
              <td><code>file:///{+path}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Resource URI Schemes</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Scheme</th>
              <th>Purpose</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>file://</code></td>
              <td>Filesystem resources</td>
              <td><code>file:///path/to/file</code></td>
            </tr>
            <tr>
              <td><code>https://</code></td>
              <td>Web resources</td>
              <td><code>https://api.example.com/data</code></td>
            </tr>
            <tr>
              <td><code>git://</code></td>
              <td>Git repositories</td>
              <td><code>git://github.com/user/repo</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Resource Subscriptions</h3>
      <p>
        Servers can support <strong>subscriptions</strong> to notify clients when resource content changes:
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    
    Client->>Server: resources/subscribe(uri="file:///config.json")
    Server-->>Client: Subscription confirmed
    
    Note over Server: File changes
    Server--)Client: notifications/resources/updated(uri="file:///config.json")
    
    Client->>Server: resources/read(uri="file:///config.json")
    Server-->>Client: Updated content
`} />

      <h3>Example Resource Definition</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "uri": "file:///project/src/main.rs",
  "name": "main.rs",
  "title": "Main Rust File",
  "description": "Primary application entry point",
  "mimeType": "text/x-rust",
  "size": 1247
}`}
      </pre>

      <hr />

      <h2>3. Prompts</h2>
      <p>
        <strong>Prompts</strong> are reusable templates that help users accomplish specific tasks. 
        They are <strong>user-controlled</strong>, meaning users explicitly select and invoke them.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Prompt["Prompt Flow"]
        U["👤 User"] -->|"Select"| P["📝 Prompt Template"]
        P -->|"Fill Arguments"| Args["📋 Arguments"]
        Args -->|"Execute"| LLM["🤖 LLM"]
    end
`} />

      <h3>Prompt vs Tools</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Tools</th>
              <th>Prompts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Control</strong></td>
              <td>Model-controlled</td>
              <td>User-controlled</td>
            </tr>
            <tr>
              <td><strong>When invoked</strong></td>
              <td>AI decides based on context</td>
              <td>User explicitly selects</td>
            </tr>
            <tr>
              <td><strong>Purpose</strong></td>
              <td>Perform actions</td>
              <td>Guide interactions</td>
            </tr>
            <tr>
              <td><strong>Flexibility</strong></td>
              <td>Fixed parameters</td>
              <td>Template with variables</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Example Prompt Definition</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "name": "code_review",
  "description": "Review code for bugs and improvements",
  "arguments": [
    {
      "name": "language",
      "description": "Programming language",
      "required": true
    },
    {
      "name": "focus_area",
      "description": "Area to focus review on",
      "required": false
    }
  ]
}`}
      </pre>

      <hr />

      <h2>Protocol Operations Summary</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Tools["🔧 Tools"]
        TL["tools/list"]
        TC["tools/call"]
        TLC["notifications/tools/list_changed"]
    end
    
    subgraph Resources["📄 Resources"]
        RL["resources/list"]
        RR["resources/read"]
        RS["resources/subscribe"]
        RTL["resources/templates/list"]
        RLC["notifications/resources/list_changed"]
        RUC["notifications/resources/updated"]
    end
    
    subgraph Prompts["📝 Prompts"]
        PL["prompts/list"]
        PG["prompts/get"]
    end
`} />

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Primitive</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tools</strong></td>
              <td><code>tools/list</code>, <code>tools/call</code>, <code>notifications/tools/list_changed</code></td>
            </tr>
            <tr>
              <td><strong>Resources</strong></td>
              <td><code>resources/list</code>, <code>resources/read</code>, <code>resources/subscribe</code>, <code>resources/templates/list</code>, <code>notifications/resources/*</code></td>
            </tr>
            <tr>
              <td><strong>Prompts</strong></td>
              <td><code>prompts/list</code>, <code>prompts/get</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Putting It All Together: A Travel Planning Example</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant User as 👤 User
    participant Client as 🔗 MCP Client
    participant Calendar as 📅 Calendar Server
    participant Weather as 🌤️ Weather Server
    participant Booking as 🎫 Booking Server
    participant LLM as 🤖 LLM
    
    User->>Client: "Plan my trip to NYC next week"
    
    Client->>Calendar: resources/read(uri="calendar://upcoming")
    Calendar-->>Client: [Meeting on Wed, Flight on Fri]
    
    Client->>Weather: tools/call(get_forecast, {city:"NYC", dates:["Wed","Fri"]})
    Weather-->>Client: Wed: Rain, Fri: Sunny
    
    Client->>LLM: Context: Meetings, Weather, User request
    LLM->>Client: Proposed itinerary
    
    User->>Client: "Looks good, book it"
    
    Client->>Booking: tools/call(book_flight, {date:"Fri", destination:"NYC"})
    Booking-->>Client: Confirmation: AB123
`} />

      <p>
        In this example:
      </p>
      <ul>
        <li><strong>Resources</strong> provide the calendar data (passive)</li>
        <li><strong>Tools</strong> fetch weather and book flights (actions)</li>
        <li><strong>The AI</strong> orchestrates everything based on user request</li>
      </ul>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/learn/server-concepts" target="_blank" rel="noopener noreferrer">
            MCP Server Concepts
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/server/tools" target="_blank" rel="noopener noreferrer">
            MCP Specification - Tools
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/server/resources" target="_blank" rel="noopener noreferrer">
            MCP Specification - Resources
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/architecture', title: 'Architecture' }}
      next={{ href: '/courses/model-context-protocol/transport-layer', title: 'Transport Layer' }}
    />
    </>
  );
}
