import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function ProductionDeploymentPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 12: Production Deployment</h1>
      
      <p>
        This section covers deploying MCP servers to production environments, 
        including remote server setup and monitoring.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/tools/inspector" target="_blank" rel="noopener noreferrer">
          MCP Inspector
        </a>
      </InfoBox>

      <hr />

      <h2>Remote MCP Server Architecture</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Production["Production Architecture"]
        subgraph Clients["Clients"]
            Claude["Claude Desktop"]
            App["Your Application"]
        end
        
        subgraph Server["Remote MCP Server"]
            HTTP["HTTP Endpoint"]
            Logic["Server Logic"]
            Resources["Resources/Tools"]
        end
        
        Clients -->|"HTTPS"| HTTP
        HTTP --> Logic
        Logic --> Resources
    end
`} />

      <hr />

      <h2>HTTP Transport Setup</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Protocol</strong></td>
              <td>HTTPS only in production</td>
            </tr>
            <tr>
              <td><strong>Authentication</strong></td>
              <td>Token-based authentication</td>
            </tr>
            <tr>
              <td><strong>Session Management</strong></td>
              <td>Use MCP-Session-Id header</td>
            </tr>
            <tr>
              <td><strong>Origin Validation</strong></td>
              <td>Validate Origin header</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>MCP Inspector for Testing</h2>
      <p>
        The MCP Inspector is a development tool for testing MCP servers.
      </p>

      <pre style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
{`# Run inspector with your server
npx -y @modelcontextprotocol/inspector uvx mcp-server-weather

# Opens web UI at http://localhost:6274`}
      </pre>

      <hr />

      <h2>Deployment Checklist</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Security</strong></td>
              <td>HTTPS enabled</td>
            </tr>
            <tr>
              <td><strong>Security</strong></td>
              <td>Authentication implemented</td>
            </tr>
            <tr>
              <td><strong>Security</strong></td>
              <td>Origin validation enabled</td>
            </tr>
            <tr>
              <td><strong>Operations</strong></td>
              <td>Logging configured</td>
            </tr>
            <tr>
              <td><strong>Operations</strong></td>
              <td>Error handling robust</td>
            </tr>
            <tr>
              <td><strong>Operations</strong></td>
              <td>Health check endpoint</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/tools/inspector" target="_blank" rel="noopener noreferrer">
            MCP Inspector
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/real-world-servers', title: 'Real-World Servers' }}
      next={{ href: '/courses/model-context-protocol/authorization', title: 'Authorization' }}
    />
    </>
  );
}
