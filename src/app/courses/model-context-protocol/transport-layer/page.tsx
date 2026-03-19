import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function TransportLayerPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 4: Transport Layer</h1>
      
      <p>
        The transport layer in MCP handles how messages are transmitted between clients and servers. 
        MCP supports two standard transport mechanisms: <strong>STDIO</strong> for local servers 
        and <strong>Streamable HTTP</strong> for remote servers.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/transports" target="_blank" rel="noopener noreferrer">
          MCP Specification - Transports
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Transport["MCP Transports"]
        subgraph Local["💻 Local Transport"]
            STDIO["📡 STDIO"]
        end
        
        subgraph Remote["🌐 Remote Transport"]
            HTTP["🌐 Streamable HTTP"]
            SSE["⚡ Server-Sent Events"]
        end
    end
`} />

      <hr />

      <h2>1. STDIO Transport</h2>
      <p>
        The <strong>STDIO</strong> transport is used for local MCP servers running as subprocesses. 
        It&apos;s the simplest transport mechanism and ideal for development and local usage.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client
    participant Server as Server Process
    
    Client->>+Server: Launch subprocess
    loop Message Exchange
        Client->>Server: Write JSON-RPC to stdin
        Server->>Client: Write JSON-RPC to stdout
        Server--)Client: Optional logs on stderr
    end
    Client->>Server: Close stdin, terminate
    deactivate Server
`} />

      <h3>How STDIO Works</h3>
      <ul>
        <li><strong>Client launches server</strong> as a subprocess</li>
        <li><strong>Client writes</strong> JSON-RPC messages to server&apos;s stdin</li>
        <li><strong>Server writes</strong> JSON-RPC messages to stdout</li>
        <li><strong>Server writes</strong> logs to stderr (not part of protocol)</li>
        <li><strong>Messages are newline-delimited</strong></li>
      </ul>

      <h3>STDIO Message Format</h3>
      <p>Each JSON-RPC message is a single line (no embedded newlines):</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}
{"jsonrpc": "2.0", "id": 1, "result": {"tools": [...]}}`}
      </pre>

      <InfoBox type="info" title="When to Use STDIO">
        Use STDIO when:
        <ul className="list-disc ml-4 mt-2">
          <li>Running servers locally on the same machine</li>
          <li>Developing and testing MCP servers</li>
          <li>Servers are command-line tools or scripts</li>
        </ul>
      </InfoBox>

      <h3>STDIO Security Considerations</h3>
      <ul>
        <li><strong>Subprocess isolation</strong> — Server runs with client privileges</li>
        <li><strong>No network exposure</strong> — Server not accessible remotely</li>
        <li><strong>Limited attack surface</strong> — No network-based attacks possible</li>
      </ul>

      <hr />

      <h2>2. Streamable HTTP Transport</h2>
      <p>
        The <strong>Streamable HTTP</strong> transport is used for remote MCP servers accessible over a network. 
        It supports HTTP POST for requests and Server-Sent Events (SSE) for streaming responses.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client
    participant Server
    
    Note over Client,Server: Initialization
    Client->>+Server: POST InitializeRequest
    Server->>-Client: InitializeResponse + MCP-Session-Id
    
    Client->>+Server: POST Subsequent Request<br/>MCP-Session-Id: ...
    alt Single Response
        Server->>Client: JSON Response
    else Streaming Response
        Server->>Client: SSE Stream with messages
    end
    deactivate Server
`} />

      <h3>HTTP Endpoints</h3>
      <p>The server provides a single MCP endpoint that handles both POST and GET:</p>
      <ul>
        <li><code>POST /mcp</code> — Send JSON-RPC requests</li>
        <li><code>GET /mcp</code> — Open SSE stream for server-to-client messages</li>
      </ul>

      <h3>Request Headers</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Header</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Content-Type</code></td>
              <td>Yes</td>
              <td>Must be <code>application/json</code></td>
            </tr>
            <tr>
              <td><code>Accept</code></td>
              <td>Yes</td>
              <td><code>application/json</code> and <code>text/event-stream</code></td>
            </tr>
            <tr>
              <td><code>MCP-Protocol-Version</code></td>
              <td>Yes</td>
              <td>Protocol version (e.g., <code>2025-11-25</code>)</td>
            </tr>
            <tr>
              <td><code>MCP-Session-Id</code></td>
              <td>After init</td>
              <td>Session identifier for subsequent requests</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Server-Sent Events (SSE)</h3>
      <p>
        SSE allows the server to stream multiple messages to the client over a single HTTP connection:
      </p>
      <ul>
        <li>Server sends <code>event: message</code> with JSON-RPC content</li>
        <li>Each event has an <code>id</code> for resumability</li>
        <li>Server can include <code>retry</code> field for reconnection</li>
      </ul>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`event: message
id: 1
retry: 5000
data: {"jsonrpc": "2.0", "id": 1, "result": {...}}

event: message
id: 2
data: {"jsonrpc": "2.0", "method": "notifications/resources/updated", ...}`}
      </pre>

      <hr />

      <h2>Session Management</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Lifecycle["Session Lifecycle"]
        Init["1️⃣ Initialize"] --> Active["2️⃣ Active Session"]
        Active --> Messages["3️⃣ Message Exchange"]
        Messages --> Terminate["4️⃣ Terminate"]
        Terminate --> New["1️⃣ New Session"]
    end
`} />

      <h3>Session ID</h3>
      <p>
        After initialization, the server returns a unique <code>MCP-Session-Id</code> that the client 
        must include in all subsequent requests:
      </p>
      <ul>
        <li><strong>Globally unique</strong> — Cryptographically secure identifier</li>
        <li><strong>Server-assigned</strong> — Client cannot choose the ID</li>
        <li><strong>Required for subsequent requests</strong> — Must be sent in header</li>
      </ul>

      <h3>Session Termination</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Client Action</th>
              <th>Server Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Client closes</td>
              <td>Send DELETE with session ID</td>
              <td>Terminate session</td>
            </tr>
            <tr>
              <td>Server closes</td>
              <td>Receive 404, start new session</td>
              <td>Return 404 to subsequent requests</td>
            </tr>
            <tr>
              <td>Session expires</td>
              <td>Re-initialize</td>
              <td>Terminate SSE streams</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Transport Comparison</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>STDIO</th>
              <th>Streamable HTTP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Use Case</strong></td>
              <td>Local servers</td>
              <td>Remote servers</td>
            </tr>
            <tr>
              <td><strong>Protocol</strong></td>
              <td>stdin/stdout pipes</td>
              <td>HTTP + SSE</td>
            </tr>
            <tr>
              <td><strong>Authentication</strong></td>
              <td>None (local only)</td>
              <td>Token-based</td>
            </tr>
            <tr>
              <td><strong>Sessions</strong></td>
              <td>None (stateless)</td>
              <td>Stateful with session ID</td>
            </tr>
            <tr>
              <td><strong>Server-to-Client</strong></td>
              <td>Not supported</td>
              <td>SSE streaming</td>
            </tr>
            <tr>
              <td><strong>Complexity</strong></td>
              <td>Simple</td>
              <td>More complex</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Resumability and Redelivery</h2>
      <p>
        For Streamable HTTP with SSE, MCP supports <strong>resumability</strong> — the ability 
        to reconnect and receive missed messages after a connection drop.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Client
    participant Server
    
    Note over Client,Server: Initial Connection
    Client->>Server: GET /mcp (SSE stream)
    Server->>Server: Assign event IDs
    Server--)Client: event:id: msg1
    Server--)Client: event:id: msg2
    Server--)Client: event:id: msg3
    
    Note over Client,Server: Connection Lost
    Client-xServer: Connection closed
    
    Note over Client,Server: Resume Connection
    Client->>Server: GET /mcp<br/>Last-Event-ID: msg3
    Server->>Server: Resume from msg3
    Server--)Client: event:id: msg4
    Server--)Client: event:id: msg5
`} />

      <h3>How Resumability Works</h3>
      <ol>
        <li><strong>Server assigns unique event IDs</strong> to each message on a stream</li>
        <li><strong>Client tracks last received ID</strong></li>
        <li><strong>On reconnect</strong>, client sends <code>Last-Event-ID</code> header</li>
        <li><strong>Server redelivers</strong> missed messages from that point</li>
      </ol>

      <InfoBox type="info" title="Best Practice">
        Always use resumability for production HTTP deployments. Network interruptions happen, 
        and resumability ensures no messages are lost.
      </InfoBox>

      <hr />

      <h2>Security Considerations</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Security["HTTP Transport Security"]
        Origin["🔍 Origin Validation"]
        HTTPS["🔒 HTTPS Only"]
        Auth["🔑 Authentication"]
        Rate["⏱️ Rate Limiting"]
    end
    
    Origin --> HTTPS
    HTTPS --> Auth
    Auth --> Rate
`} />

      <h3>For Streamable HTTP Servers</h3>
      <ul>
        <li><strong>Validate Origin header</strong> — Prevent DNS rebinding attacks</li>
        <li><strong>Bind to localhost</strong> — When running locally, use 127.0.0.1</li>
        <li><strong>Implement authentication</strong> — Token-based auth for all connections</li>
        <li><strong>Use HTTPS</strong> — Encrypt all traffic in production</li>
      </ul>

      <InfoBox type="warning" title="DNS Rebinding Attack">
        Without Origin validation, attackers could use DNS rebinding to interact with local MCP servers 
        from remote websites. Always validate the Origin header.
      </InfoBox>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/transports" target="_blank" rel="noopener noreferrer">
            MCP Specification - Transports
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/core-primitives', title: 'Core Primitives' }}
      next={{ href: '/courses/model-context-protocol/protocol-lifecycle', title: 'Protocol Lifecycle' }}
    />
    </>
  );
}
