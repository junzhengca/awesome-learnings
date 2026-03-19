import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function ProtocolLifecyclePage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 5: Protocol Lifecycle</h1>
      
      <p>
        Every MCP session follows a defined lifecycle: initialization, active communication, 
        and termination. Understanding this lifecycle is essential for building compliant 
        servers and clients.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle" target="_blank" rel="noopener noreferrer">
          MCP Specification - Lifecycle
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Lifecycle["MCP Session Lifecycle"]
        Start["1️⃣ Start"] --> Init["2️⃣ Initialize"]
        Init --> Active["3️⃣ Active Session"]
        Active --> Comm["💬 Message Exchange"]
        Comm <--> Loop["🔄 Loop"]
        Active --> Terminate["4️⃣ Terminate"]
        Terminate --> End["5️⃣ End"]
    end
`} />

      <hr />

      <h2>1. Initialization</h2>
      <p>
        The initialization phase establishes the connection and negotiates capabilities 
        between client and server.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client
    participant Server
    
    Note over Client,Server: Initialization Phase
    Client->>Server: initialize (protocolVersion, capabilities, clientInfo)
    Server-->>Client: protocolVersion, capabilities, serverInfo
    Client->>Server: notifications/initialized
    Server-->>Client: 202 Accepted
    
    Note over Client,Server: Active Session Begins
`} />

      <h3>Initialize Request (Client → Server)</h3>
      <p>The client sends its supported protocol version and capabilities:</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "sampling": {},
      "elicitation": {}
    },
    "clientInfo": {
      "name": "claude-desktop",
      "version": "1.0.0"
    }
  }
}`}
      </pre>

      <h3>Initialize Result (Server → Client)</h3>
      <p>The server responds with its protocol version and capabilities:</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "prompts": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "weather-server",
      "version": "1.0.0"
    },
    "instructions": "Weather server providing forecasts and conditions."
  }
}`}
      </pre>

      <h3>Initialized Notification (Client → Server)</h3>
      <p>After receiving the server&apos;s capabilities, the client sends:</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "jsonrpc": "2.0",
  "method": "notifications/initialized",
  "params": {}
}`}
      </pre>

      <InfoBox type="info" title="Order Matters">
        The client MUST wait for the server&apos;s InitializeResult before sending 
        the InitializedNotification. This ensures the client knows the server&apos;s 
        capabilities before proceeding.
      </InfoBox>

      <hr />

      <h2>2. Capability Negotiation</h2>
      <p>
        During initialization, both client and server declare their capabilities. 
        These capabilities determine what features are available during the session.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Negotiation["Capability Negotiation"]
        C["🔗 Client Capabilities"] -->|"Intersect"| C["✅ Active Features"]
        S["🖥️ Server Capabilities"] -->|"Intersect"| C
    end
`} />

      <h3>Server Capability Examples</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Description</th>
              <th>Features Enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>tools</code></td>
              <td>Tool support</td>
              <td><code>tools/list</code>, <code>tools/call</code></td>
            </tr>
            <tr>
              <td><code>resources</code></td>
              <td>Resource support</td>
              <td><code>resources/list</code>, <code>resources/read</code></td>
            </tr>
            <tr>
              <td><code>prompts</code></td>
              <td>Prompt support</td>
              <td><code>prompts/list</code>, <code>prompts/get</code></td>
            </tr>
            <tr>
              <td><code>sampling</code></td>
              <td>LLM sampling</td>
              <td><code>sampling/createMessage</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Client Capability Examples</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Capability</th>
              <th>Description</th>
              <th>Features Enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sampling</code></td>
              <td>Sampling support</td>
              <td>Server can request LLM completions</td>
            </tr>
            <tr>
              <td><code>elicitation</code></td>
              <td>Elicitation support</td>
              <td>Server can request user input</td>
            </tr>
            <tr>
              <td><code>roots</code></td>
              <td>Root directory support</td>
              <td>Filesystem boundary definitions</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>3. Active Session Communication</h2>
      <p>
        Once initialized, the client and server can exchange messages for tools, 
        resources, prompts, and other operations.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant LLM as 🤖 LLM
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    
    Note over LLM,Server: Active Session
    
    LLM->>Client: Need weather for NYC
    Client->>Server: tools/call(get_weather, {location:"NYC"})
    Server-->>Server: Fetch data
    Server-->>Client: {content: "72°F, sunny"}
    Client-->>LLM: Tool result
    LLM->>Client: Show user
`} />

      <h3>Common Operations During Active Session</h3>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>Direction</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>tools/list</code></td>
              <td>Client → Server</td>
              <td>List available tools</td>
            </tr>
            <tr>
              <td><code>tools/call</code></td>
              <td>Client → Server</td>
              <td>Invoke a tool</td>
            </tr>
            <tr>
              <td><code>resources/list</code></td>
              <td>Client → Server</td>
              <td>List available resources</td>
            </tr>
            <tr>
              <td><code>resources/read</code></td>
              <td>Client → Server</td>
              <td>Read resource content</td>
            </tr>
            <tr>
              <td><code>resources/subscribe</code></td>
              <td>Client → Server</td>
              <td>Subscribe to resource updates</td>
            </tr>
            <tr>
              <td><code>prompts/list</code></td>
              <td>Client → Server</td>
              <td>List available prompts</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>4. Notifications</h2>
      <p>
        Notifications are one-way messages that don&apos;t require a response. They&apos;re used for 
        asynchronous updates and events.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Notifications["Notification Types"]
        ServerNotify["🖥️ → 🔗 Server to Client"]
        ClientNotify["🔗 → 🖥️ Client to Server"]
    end
    
    ServerNotify --> T["tools/list_changed"]
    ServerNotify --> R["resources/updated"]
    ServerNotify --> L["resources/list_changed"]
    
    ClientNotify --> C["cancelled"]
    ClientNotify --> P["progress"]
`} />

      <h3>Server-to-Client Notifications</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`// Tool list changed
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed",
  "params": {}
}

// Resource updated
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": {
    "uri": "file:///project/config.json"
  }
}

// Resource list changed
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/list_changed",
  "params": {}
}`}
      </pre>

      <h3>Client-to-Server Notifications</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`// Cancel a request
{
  "jsonrpc": "2.0",
  "method": "notifications/cancelled",
  "params": {
    "requestId": 5
  }
}

// Progress update
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "requestId": 5,
    "progress": 0.5,
    "message": "Processing..."
  }
}`}
      </pre>

      <hr />

      <h2>5. Termination</h2>
      <p>
        Sessions can be terminated by either client or server at any time. 
        Clean termination ensures resources are properly released.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client
    participant Server
    
    alt Client-Initiated
        Client->>Server: Close connection
        Server->>Server: Cleanup resources
        Server-->>Client: Final messages
    end
    
    alt Server-Initiated
        Server-->>Client: Session ending soon
        Client->>Server: Acknowledge
        Server->>Server: Cleanup
    end
    
    Note over Client,Server: Session Ended
`} />

      <h3>HTTP Session Termination</h3>
      <p>For HTTP transports, clients SHOULD send a DELETE request:</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`DELETE /mcp HTTP/1.1
MCP-Session-Id: 1868a90c...
Host: server.example.com`}
      </pre>

      <hr />

      <h2>Protocol Version Negotiation</h2>
      <p>
        MCP supports protocol version negotiation to ensure backward compatibility between 
        clients and servers.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    C["🔗 Client v2025-03-26"] -->|"Support"| S1["🖥️ Server v2025-03-26"]
    C -->|"Fall back"| S2["🖥️ Server v2024-11-05"]
    
    S1 -->|"Use"| P1["Protocol 2025-03-26"]
    S2 -->|"Use"| P2["Protocol 2024-11-05"]
`} />

      <h3>Version Selection Process</h3>
      <ol>
        <li>Client sends <code>protocolVersion</code> in InitializeRequest</li>
        <li>Server checks if it supports that version</li>
        <li>If supported, server uses that version</li>
        <li>If not, server responds with highest version it supports</li>
        <li>Client adapts to server&apos;s version</li>
      </ol>

      <InfoBox type="info" title="Current Version">
        The current MCP protocol version is <code>2025-11-25</code>. Always check the 
        specification for the latest version.
      </InfoBox>

      <hr />

      <h2>Complete Session Flow</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant User as 👤 User
    participant Host as 🤖 AI Host
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    
    Note over User,Server: 1. Startup
    Host->>Client: Create client
    Host->>Server: Launch server process
    
    Note over User,Server: 2. Initialization
    Client->>Server: initialize (version, caps)
    Server-->>Client: protocolVersion, capabilities
    Client->>Server: notifications/initialized
    
    Note over User,Server: 3. Tool Discovery
    Client->>Server: tools/list
    Server-->>Client: {tools: [...]}
    
    Note over User,Server: 4. Active Session
    User->>Host: "Get weather for NYC"
    Host->>Client: Use get_weather("NYC")
    Client->>Server: tools/call(get_weather, {city:"NYC"})
    Server-->>Client: {content: "72°F, sunny"}
    Client-->>Host: Tool result
    Host-->>User: "It's 72°F and sunny in NYC"
    
    Note over User,Server: 5. Termination
    Host->>Client: Close
    Client->>Server: End session
    Server-->>Server: Cleanup
`} />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle" target="_blank" rel="noopener noreferrer">
            MCP Specification - Lifecycle
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/content" target="_blank" rel="noopener noreferrer">
            MCP Specification - Content
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/transport-layer', title: 'Transport Layer' }}
      next={{ href: '/courses/model-context-protocol/building-servers-python', title: 'Building Servers (Python)' }}
    />
    </>
  );
}
