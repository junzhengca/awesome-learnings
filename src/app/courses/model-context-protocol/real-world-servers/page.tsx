import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';
import CodeBlock from '@/components/CodeBlock';

export default function RealWorldServersPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 11: Real-World MCP Servers</h1>
      
      <p>
        This section covers reference MCP server implementations and how to use them 
        in your applications.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">
          MCP Reference Servers Repository
        </a>
      </InfoBox>

      <hr />

      <h2>Official Reference Servers</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Reference["Reference Servers"]
        E["Everything"]
        F["Fetch"]
        FS["Filesystem"]
        G["Git"]
        M["Memory"]
        T["Time"]
    end
`} />

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Server</th>
              <th>Purpose</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Everything</strong></td>
              <td>Reference/test server with all features</td>
              <td>TypeScript</td>
            </tr>
            <tr>
              <td><strong>Fetch</strong></td>
              <td>Web content fetching</td>
              <td>TypeScript</td>
            </tr>
            <tr>
              <td><strong>Filesystem</strong></td>
              <td>Secure file operations</td>
              <td>TypeScript</td>
            </tr>
            <tr>
              <td><strong>Git</strong></td>
              <td>Git repository operations</td>
              <td>Python</td>
            </tr>
            <tr>
              <td><strong>Memory</strong></td>
              <td>Knowledge graph storage</td>
              <td>Python</td>
            </tr>
            <tr>
              <td><strong>Time</strong></td>
              <td>Time and timezone conversion</td>
              <td>Python</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Quick Start Commands</h2>

      <CodeBlock
        code={`# Using npx (TypeScript servers)
npx -y @modelcontextprotocol/server-memory
npx -y @modelcontextprotocol/server-filesystem /path/to/allowed

# Using uvx (Python servers)
uvx mcp-server-git
uvx mcp-server-time`}
        language="bash"
        title="Quick Start Reference Servers"
      />

      <hr />

      <h2>Configuring in Claude Desktop</h2>

      <CodeBlock
        code={`{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}`}
        language="json"
        title="claude_desktop_config.json"
      />

      <hr />

      <h2>Community Servers</h2>
      <p>
        The MCP ecosystem includes many community-built servers for various services:
      </p>
      <ul>
        <li><strong>AWS:</strong> Bedrock, S3, EC2 management</li>
        <li><strong>Slack:</strong> Messaging and channel operations</li>
        <li><strong>Google:</strong> Drive, Calendar, Gmail integration</li>
        <li><strong>Databases:</strong> PostgreSQL, SQLite, Redis</li>
        <li><strong>And many more...</strong></li>
      </ul>

      <hr />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">
            MCP Reference Servers
          </a>
        </li>
      </ol>

    </div>

    <LessonNav 
      prev={{ href: '/courses/model-context-protocol/security', title: 'Security' }}
      next={{ href: '/courses/model-context-protocol/production-deployment', title: 'Production Deployment' }}
    />
    </>
  );
}
