import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function ArchitecturePage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 2: MCP Architecture Deep Dive</h1>
      
      <p>
        Understanding the Model Context Protocol&apos;s architecture is essential for building robust 
        MCP servers and clients. This section covers the Host-Client-Server model, capability 
        negotiation, and the design principles that make MCP work.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/learn/architecture" target="_blank" rel="noopener noreferrer">
          MCP Architecture Documentation
        </a>
      </InfoBox>

      <h2>The Host-Client-Server Architecture</h2>
      <p>
        MCP follows a <strong>client-host-server architecture</strong> where each host can run 
        multiple client instances. This architecture enables integration across applications while 
        maintaining clear security boundaries and isolating concerns.
      </p>

      <MermaidDiagram chart={`
graph LR
    subgraph "Application Host Process"
        H[Host]
        C1[Client 1]
        C2[Client 2]
        C3[Client 3]
        H --> C1
        H --> C2
        H --> C3
    end

    subgraph "Local machine"
        S1[Server 1<br/>Files & Git]
        S2[Server 2<br/>Database]
        R1[("Local<br/>Resource A")]
        R2[("Local<br/>Resource B")]

        C1 --> S1
        C2 --> S2
        S1 <--> R1
        S2 <--> R2
    end

    subgraph "Internet"
        S3[Server 3<br/>External APIs]
        R3[("Remote<br/>Resource C")]

        C3 --> S3
        S3 <--> R3
    end
`} />

      <h3>The Three Core Components</h3>

      <h4>1. Host</h4>
      <p>
        The <strong>host</strong> is the AI application itself (e.g., Claude Desktop, Cursor, VS Code). 
        It acts as the container and coordinator:
      </p>
      <ul>
        <li>Creates and manages multiple client instances</li>
        <li>Controls client connection permissions and lifecycle</li>
        <li>Enforces security policies and consent requirements</li>
        <li>Handles user authorization decisions</li>
        <li>Coordinates AI/LLM integration and sampling</li>
        <li>Manages context aggregation across clients</li>
      </ul>

      <h4>2. Clients</h4>
      <p>
        Each <strong>client</strong> is created by the host and maintains an isolated server connection:
      </p>
      <ul>
        <li>Establishes one stateful session per server</li>
        <li>Handles protocol negotiation and capability exchange</li>
        <li>Routes protocol messages bidirectionally</li>
        <li>Manages subscriptions and notifications</li>
        <li>Maintains security boundaries between servers</li>
      </ul>

      <InfoBox type="info" title="1:1 Relationship">
        A client maintains a 1:1 relationship with a particular server. Each server connection 
        has its own dedicated client instance managed by the host.
      </InfoBox>

      <h4>3. Servers</h4>
      <p>
        <strong>Servers</strong> provide specialized context and capabilities to the AI:
      </p>
      <ul>
        <li>Expose resources, tools, and prompts via MCP primitives</li>
        <li>Operate independently with focused responsibilities</li>
        <li>Request sampling through client interfaces</li>
        <li>Can be local processes or remote services</li>
      </ul>

      <hr />

      <h2>Design Principles</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Principles["MCP Design Principles"]
        P1["🎯 Servers are easy to build"]
        P2["🧩 Servers are composable"]
        P3["🔒 Servers don&apos;t see the whole conversation"]
        P4["📈 Features can be added progressively"]
    end
    
    P1 --> P1a["Focus on specific capabilities"]
    P2 --> P2a["Combine multiple servers"]
    P3 --> P3a["Security by isolation"]
    P4 --> P4a["Extensible protocol"]
`} />

      <h3>1. Servers Should Be Easy to Build</h3>
      <p>
        MCP is designed so that host applications handle complex orchestration responsibilities, 
        while servers focus on specific, well-defined capabilities. This separation:
      </p>
      <ul>
        <li>Minimizes implementation overhead for server developers</li>
        <li>Provides simple interfaces for common operations</li>
        <li>Enables clear separation of concerns</li>
      </ul>

      <h3>2. Servers Should Be Highly Composable</h3>
      <p>
        Multiple MCP servers can be combined seamlessly because they share the same protocol. 
        This means:
      </p>
      <ul>
        <li>Each server provides focused functionality in isolation</li>
        <li>Shared protocol enables interoperability</li>
        <li>Modular design supports extensibility</li>
      </ul>

      <h3>3. Servers Should Not See the Whole Conversation</h3>
      <p>
        A critical security principle: servers only receive necessary contextual information, 
        not the full conversation history:
      </p>
      <ul>
        <li>Full conversation history stays with the host</li>
        <li>Each server connection maintains isolation</li>
        <li>Cross-server interactions are controlled by the host</li>
      </ul>

      <InfoBox type="warning" title="Security Implication">
        This isolation means a compromised server cannot access conversations or data from 
        other servers. The host acts as a security boundary.
      </InfoBox>

      <h3>4. Features Can Be Added Progressively</h3>
      <p>
        MCP&apos;s capability negotiation system allows servers and clients to evolve independently:
      </p>
      <ul>
        <li>Core protocol provides minimal required functionality</li>
        <li>Additional capabilities negotiated as needed</li>
        <li>Protocol designed for future extensibility</li>
      </ul>

      <hr />

      <h2>Capability Negotiation</h2>
      <p>
        MCP uses a <strong>capability-based negotiation system</strong> where clients and servers 
        explicitly declare their supported features during initialization.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Host
    participant Client
    participant Server

    Host->>+Client: Initialize client
    Client->>+Server: Initialize session with capabilities
    Server-->>Client: Respond with supported capabilities

    Note over Host,Server: Active Session with Negotiated Features

    loop Client Requests
        Host->>Client: User- or model-initiated action
        Client->>Server: Request (tools/resources)
        Server-->>Client: Response
        Client-->>Host: Update UI or respond to model
    end

    loop Server Requests
        Server->>Client: Request (sampling)
        Client->>Host: Forward to AI
        Host-->>Client: AI response
        Client-->>Server: Response
    end

    loop Notifications
        Server--)Client: Resource updates
        Client--)Server: Status changes
    end

    Host->>Client: Terminate
    Client->>-Server: End session
`} />

      <h3>Server Capabilities</h3>
      <p>Servers declare capabilities like:</p>
      <ul>
        <li><code>resources</code> — Resource exposure and subscription support</li>
        <li><code>tools</code> — Tool invocation support</li>
        <li><code>prompts</code> — Prompt template support</li>
        <li><code>sampling</code> — Sampling request support</li>
      </ul>

      <h3>Client Capabilities</h3>
      <p>Clients declare capabilities like:</p>
      <ul>
        <li><code>sampling</code> — Ability to request LLM completions</li>
        <li><code>elicitation</code> — Ability to request user input</li>
        <li><code>roots</code> — Filesystem boundary definitions</li>
      </ul>

      <hr />

      <h2>Two-Layer Architecture</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Layers["MCP Architecture Layers"]
        subgraph Application["Application Layer"]
            JSONRPC["📜 JSON-RPC 2.0 Messages"]
            Methods["🔧 Methods & Notifications"]
        end
        
        subgraph Transport["Transport Layer"]
            STDIO["💻 STDIO"]
            HTTP["🌐 Streamable HTTP"]
        end
    end
    
    Application --> Transport
    
    style Application fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    style Transport fill:#fef3c7,stroke:#d97706,color:#92400e
`} />

      <h3>Data Layer: JSON-RPC 2.0</h3>
      <p>
        MCP messages are encoded as <strong>JSON-RPC 2.0</strong> requests, responses, and notifications. 
        This provides:
      </p>
      <ul>
        <li>Standardized message format</li>
        <li>Bidirectional communication</li>
        <li>Method calls with parameters</li>
        <li>Response correlation via request IDs</li>
      </ul>

      <h3>Transport Layer</h3>
      <p>
        The transport layer handles how JSON-RPC messages are transmitted between clients and servers:
      </p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Transport</th>
              <th>Use Case</th>
              <th>How it Works</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>STDIO</strong></td>
              <td>Local servers</td>
              <td>Messages via stdin/stdout subprocess pipes</td>
            </tr>
            <tr>
              <td><strong>Streamable HTTP</strong></td>
              <td>Remote servers</td>
              <td>HTTP POST for requests, SSE for responses</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Multi-Server Connections</h2>
      <p>
        A single AI application can connect to multiple MCP servers simultaneously, 
        each providing different capabilities.
      </p>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Host["🤖 AI Host"]
        H[Claude Desktop]
        H --> C1[Client 1]
        H --> C2[Client 2]
        H --> C3[Client 3]
        H --> C4[Client 4]
    end

    C1 --> S1["🗄️ PostgreSQL Server"]
    C2 --> S2["📁 Filesystem Server"]
    C3 --> S3["📂 Git Server"]
    C4 --> S4["🌐 API Server"]
    
    S1 --> DB["🗃️ Database"]
    S2 --> FS["📂 Filesystem"]
    S3 --> GR["📦 Git Repository"]
    S4 --> API["🔌 External APIs"]
`} />

      <p>
        This architecture allows the AI to seamlessly work with data from multiple sources — 
        for example, reading code from Git, querying a database, and calling external APIs 
        all within the same conversation.
      </p>

      <hr />

      <h2>Security Boundaries</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Host["🔒 Host Process (Trusted)"]
        H[AI Model]
        Security["Security Policy"]
        Consent["User Consent"]
    end
    
    subgraph Clients["🔗 MCP Clients (Isolated)"]
        C1[Client 1]
        C2[Client 2]
        C3[Client 3]
    end
    
    subgraph Servers["🖥️ MCP Servers (Untrusted)"]
        S1[Server 1]
        S2[Server 2]
        S3[Server 3]
    end
    
    H --> Security
    H --> Consent
    Security --> C1
    Security --> C2
    Security --> C3
    
    C1 -.->|"Read-only access"| S1
    C2 -.->|"Limited tools"| S2
    C3 -.->|"User-approved actions"| S3
`} />

      <p>
        The host enforces important security boundaries:
      </p>
      <ul>
        <li><strong>Isolation</strong> — Each server connection is isolated</li>
        <li><strong>Consent</strong> — Users approve server connections</li>
        <li><strong>Policy</strong> — Host enforces security policies</li>
        <li><strong>Data minimization</strong> — Servers only see necessary context</li>
      </ul>

      <hr />

      <h2>Protocol Message Flow</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant User as 👤 User
    participant Host as 🤖 AI Host
    participant Client as 🔗 MCP Client
    participant Server as 🖥️ MCP Server
    
    User->>Host: Query/Request
    Host->>Client: Process request
    Client->>Server: tools/list
    Server-->>Client: Available tools
    
    Note over Client,Server: Capability Negotiation
    
    Host->>Client: Use tool X
    Client->>Server: tools/call (X, args)
    Server-->>Client: Tool result
    
    Client-->>Host: Result
    Host-->>User: Response
`} />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/learn/architecture" target="_blank" rel="noopener noreferrer">
            MCP Architecture Documentation
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/architecture" target="_blank" rel="noopener noreferrer">
            MCP Specification - Architecture
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/introduction', title: 'Introduction' }}
      next={{ href: '/courses/model-context-protocol/core-primitives', title: 'Core Primitives' }}
    />
    </>
  );
}
