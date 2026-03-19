import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function AuthorizationPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 13: Authorization & Enterprise MCP</h1>
      
      <p>
        This section covers MCP authorization flows, OAuth 2.0 integration, 
        and enterprise deployment patterns.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization" target="_blank" rel="noopener noreferrer">
          MCP Authorization Specification
        </a>
      </InfoBox>

      <hr />

      <h2>OAuth 2.0 Integration</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph OAuth["OAuth 2.0 Flow"]
        Client["🔗 MCP Client"]
        Server["🖥️ MCP Server"]
        Auth["🔐 Auth Server"]
        
        Client -->|"Auth request"| Server
        Server -->|"Forward"| Auth
        Auth -->|"Token"| Server
        Server -->|"Access"| Client
    end
`} />

      <h3>When to Use OAuth</h3>
      <ul>
        <li>Machine-to-machine communication</li>
        <li>Enterprise deployments</li>
        <li>Accessing third-party APIs</li>
        <li>User-specific data access</li>
      </ul>

      <hr />

      <h2>Enterprise Architecture</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Enterprise["Enterprise MCP"]
        subgraph IDP["Identity Provider"]
            Auth["OAuth 2.0 / OIDC"]
        end
        
        subgraph MCP["MCP Infrastructure"]
            Proxy["MCP Gateway"]
            Servers["MCP Servers"]
        end
        
        subgraph Apps["Applications"]
            Claude["Claude Desktop"]
            Custom["Custom Apps"]
        end
        
        IDP -->|"Auth"| Proxy
        Proxy -->|"Proxy"| Servers
        Apps -->|"MCP"| Proxy
    end
`} />

      <hr />

      <h2>Token Validation</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Issuer</strong></td>
              <td>Validate token issuer matches expected</td>
            </tr>
            <tr>
              <td><strong>Audience</strong></td>
              <td>Ensure token is for this service</td>
            </tr>
            <tr>
              <td><strong>Expiration</strong></td>
              <td>Check exp claim is in future</td>
            </tr>
            <tr>
              <td><strong>Signature</strong></td>
              <td>Verify cryptographic signature</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Best Practices</h2>

      <ul>
        <li><strong>Always validate tokens</strong> — Never trust tokens without verification</li>
        <li><strong>Use short-lived tokens</strong> — Prefer access tokens over refresh tokens</li>
        <li><strong>Implement scopes</strong> — Limit token capabilities to minimum needed</li>
        <li><strong>Log access</strong> — Audit trail for compliance</li>
      </ul>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization" target="_blank" rel="noopener noreferrer">
            MCP Authorization Specification
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/production-deployment', title: 'Production Deployment' }}
      next={{ href: '/courses/model-context-protocol/sdks', title: 'SDKs' }}
    />
    </>
  );
}
