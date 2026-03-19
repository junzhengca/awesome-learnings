import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function ClientFeaturesPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 9: Client Features — Sampling, Elicitation, and Roots</h1>
      
      <p>
        MCP defines client-to-server primitives that enable servers to request AI capabilities 
        from the client. This section covers <strong>Sampling</strong>, <strong>Elicitation</strong>, 
        and <strong>Roots</strong>.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/learn/client-concepts" target="_blank" rel="noopener noreferrer">
          MCP Client Concepts
        </a>
      </InfoBox>

      <hr />

      <h2>1. Sampling</h2>
      <p>
        <strong>Sampling</strong> allows MCP servers to request LLM completions through the client. 
        The server specifies what it needs, and the client&apos;s AI handles the actual completion request.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Server as 🖥️ MCP Server
    participant Client as 🔗 MCP Client
    participant AI as 🤖 AI Model
    
    Note over Server,AI: Sampling Request Flow
    
    Server->>Client: sampling/createMessage
    Client->>AI: Send prompt
    AI-->>Client: Completion
    Client-->>Server: sampling/messageCreate result
`} />

      <h3>When to Use Sampling</h3>
      <ul>
        <li>Agents that need to reason about complex problems</li>
        <li>Servers that generate dynamic content or summaries</li>
        <li>Problem-solving tools that break down tasks</li>
      </ul>

      <h3>Server Capability Declaration</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "capabilities": {
    "sampling": {}
  }
}`}
      </pre>

      <h3>Client Capability Declaration</h3>
      <p>Clients declare sampling support when initializing:</p>

      <pre style={{ background: 'var(--bg-subute)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "capabilities": {
    "sampling": {
      "supportedStrategies": ["auto", "few-shot", "reject"]
    }
  }
}`}
      </pre>

      <InfoBox type="info" title="Human-in-the-Loop">
        Sampling requests should include a mechanism for human approval before 
        sending sensitive prompts to the AI model.
      </InfoBox>

      <hr />

      <h2>2. Elicitation</h2>
      <p>
        <strong>Elicitation</strong> allows servers to request specific information from users 
        through the client. This is useful when a server needs additional data to complete a task.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant Server as 🖥️ MCP Server
    participant Client as 🔗 MCP Client
    participant User as 👤 User
    
    Server->>Client: elicitation/createMessage
    Client->>User: Prompt for input
    User-->>Client: User provides input
    Client-->>Server: Elicited result
`} />

      <h3>Use Cases</h3>
      <ul>
        <li>Booking confirmation (yes/no)</li>
        <li>Selecting from options</li>
        <li>Providing missing required information</li>
        <li>Confirming destructive actions</li>
      </ul>

      <h3>Example: Booking Confirmation</h3>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "method": "elicitation/createMessage",
  "params": {
    "message": {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Confirm booking flight to NYC on Friday?"
      }
    },
    "requestedSchema": {
      "type": "object",
      "properties": {
        "confirm": {
          "type": "boolean",
          "description": "User confirmation"
        }
      }
    },
    "expiresTime": "2025-01-15T12:00:00Z"
  }
}`}
      </pre>

      <hr />

      <h2>3. Roots</h2>
      <p>
        <strong>Roots</strong> define filesystem boundaries that servers can operate within. 
        They provide a coordination mechanism between client and server.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Roots["Roots System"]
        C["🔗 Client"] -->|"Declares roots"| R["📁 Root Directories"]
        R -->|"Defines boundary"| S["🖥️ Server"]
    end
`} />

      <h3>Root vs Security Boundary</h3>
      <p>
        <strong>Important:</strong> Roots are a coordination mechanism, not a security boundary. 
        Servers should not blindly trust root declarations for security purposes.
      </p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Roots</th>
              <th>Security Boundary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Purpose</strong></td>
              <td>Coordination</td>
              <td>Access control</td>
            </tr>
            <tr>
              <td><strong>Enforcement</strong></td>
              <td>By convention</td>
              <td>By system</td>
            </tr>
            <tr>
              <td><strong>Trust level</strong></td>
              <td>Untrusted</td>
              <td>Trusted</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Declaring Roots</h3>
      <p>Clients declare their roots during initialization:</p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "roots": [
    {
      "uri": "file:///home/user/projects",
      "name": "Projects Directory",
      "description": "User's coding projects"
    },
    {
      "uri": "file:///home/user/documents",
      "name": "Documents",
      "description": "Personal documents"
    }
  ]
}`}
      </pre>

      <hr />

      <h2>Complete Client Capability Example</h2>
      <p>
        Here&apos;s how a client declares all its capabilities during initialization:
      </p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`{
  "capabilities": {
    "sampling": {},
    "elicitation": {},
    "roots": {
      "list": {
        "supported": true
      }
    }
  }
}`}
      </pre>

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/learn/client-concepts" target="_blank" rel="noopener noreferrer">
            MCP Client Concepts
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/building-clients', title: 'Building Clients' }}
      next={{ href: '/courses/model-context-protocol/security', title: 'Security' }}
    />
    </>
  );
}
