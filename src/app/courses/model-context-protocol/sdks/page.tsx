import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function SDKsPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 14: SDKs and Language Support</h1>
      
      <p>
        MCP is supported across multiple programming languages through official SDKs. 
        This section compares available SDKs and helps you choose the right one.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io/docs/sdk" target="_blank" rel="noopener noreferrer">
          MCP SDKs
        </a>
      </InfoBox>

      <hr />

      <h2>SDK Tiers</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Tiers["SDK Tiers"]
        Tier1["🏆 Tier 1: Full Support"]
        Tier2["⭐ Tier 2: Production Ready"]
        Tier3["🔧 Tier 3: Community"]
    end
    
    Tier1 --> Tier2 --> Tier3
`} />

      <hr />

      <h2>SDK Comparison</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Language</th>
              <th>Tier</th>
              <th>Package</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>TypeScript</strong></td>
              <td>Tier 1</td>
              <td><code>@modelcontextprotocol/sdk</code></td>
              <td>Node.js, web apps</td>
            </tr>
            <tr>
              <td><strong>Python</strong></td>
              <td>Tier 1</td>
              <td><code>mcp</code></td>
              <td>AI apps, scripts</td>
            </tr>
            <tr>
              <td><strong>C#</strong></td>
              <td>Tier 1</td>
              <td><code>ModelContextProtocol</code></td>
              <td>.NET applications</td>
            </tr>
            <tr>
              <td><strong>Go</strong></td>
              <td>Tier 1</td>
              <td><code>github.com/modelcontextprotocol/go-sdk</code></td>
              <td>Cloud services</td>
            </tr>
            <tr>
              <td><strong>Java</strong></td>
              <td>Tier 2</td>
              <td><code>io.modelcontextprotocol</code></td>
              <td>Enterprise Java</td>
            </tr>
            <tr>
              <td><strong>Rust</strong></td>
              <td>Tier 2</td>
              <td><code>mcp-sdk</code></td>
              <td>High-performance</td>
            </tr>
            <tr>
              <td><strong>Swift</strong></td>
              <td>Tier 3</td>
              <td><code>modelcontextprotocol-swift</code></td>
              <td>Apple platforms</td>
            </tr>
            <tr>
              <td><strong>Ruby</strong></td>
              <td>Tier 3</td>
              <td><code>mcp-ruby</code></td>
              <td>Ruby applications</td>
            </tr>
            <tr>
              <td><strong>PHP</strong></td>
              <td>Tier 3</td>
              <td><code>php-mcp-sdk</code></td>
              <td>PHP web apps</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Tier Descriptions</h2>

      <h3>Tier 1: Full Support</h3>
      <ul>
        <li>Complete protocol implementation</li>
        <li>Full test coverage</li>
        <li>Active maintenance</li>
        <li>Reference implementations available</li>
      </ul>

      <h3>Tier 2: Production Ready</h3>
      <ul>
        <li>Complete protocol implementation</li>
        <li>Good test coverage</li>
        <li>Community maintained</li>
      </ul>

      <h3>Tier 3: Community</h3>
      <ul>
        <li>Working implementation</li>
        <li>Basic functionality</li>
        <li>Community supported</li>
      </ul>

      <hr />

      <h2>Choosing an SDK</h2>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Use Case</th>
              <th>Recommended SDK</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Claude Desktop integration</td>
              <td>TypeScript or Python</td>
            </tr>
            <tr>
              <td>AI agent framework</td>
              <td>Python (most frameworks)</td>
            </tr>
            <tr>
              <td>Web application</td>
              <td>TypeScript</td>
            </tr>
            <tr>
              <td>Cloud-native service</td>
              <td>Go or TypeScript</td>
            </tr>
            <tr>
              <td>Enterprise .NET</td>
              <td>C#</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io/docs/sdk" target="_blank" rel="noopener noreferrer">
            MCP SDK Documentation
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/typescript-sdk" target="_blank" rel="noopener noreferrer">
            TypeScript SDK
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/python-sdk" target="_blank" rel="noopener noreferrer">
            Python SDK
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/authorization', title: 'Authorization' }}
      next={{ href: '/courses/model-context-protocol/labs/build-weather-server-python', title: 'Lab 1: Weather Server (Python)' }}
    />
    </>
  );
}
