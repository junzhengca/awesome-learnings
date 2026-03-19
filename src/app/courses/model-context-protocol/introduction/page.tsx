import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function IntroductionPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 1: Introduction to the Model Context Protocol</h1>
      
      <h2>What is the Model Context Protocol?</h2>
      <p>
        The <strong>Model Context Protocol (MCP)</strong> is an open-source standard that provides a 
        standardized way for AI applications to connect to external data sources and tools. Think of it as 
        the &ldquo;USB-C&rdquo; for AI — a universal interface that allows any AI model to connect to any 
        external resource.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
          Official MCP Documentation
        </a>
      </InfoBox>

      <blockquote>
        <p>
          &ldquo;The Model Context Protocol is an open-source protocol that enables AI applications 
          to connect to external data sources and tools in a standardized way.&rdquo;
        </p>
        <footer className="text-sm mt-2">
          — <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
            modelcontextprotocol.io
          </a>
        </footer>
      </blockquote>

      <h2>The USB-C Analogy</h2>
      <p>
        Before USB-C, every device had its own charging cable. A laptop needed a different cable than a 
        phone, which needed a different cable than a camera. The same problem exists with AI models 
        and data sources today.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Before["❌ Before MCP (The Problem)"]
        A1["🤖 AI Model"] --> A2["📦 Custom Integration"]
        A2 --> A3["🔌 Google Drive"]
        A2 --> A4["📧 Email"]
        A2 --> A5["📊 Database"]
        A2 --> A6["🔒 Internal APIs"]
    end
    
    subgraph After["✅ With MCP (The Solution)"]
        B1["🤖 AI Model"] --> B2["🔌 MCP"]
        B2 --> B3["📦 Server: Google Drive"]
        B2 --> B4["📦 Server: Email"]
        B2 --> B5["📦 Server: Database"]
        B2 --> B6["📦 Server: APIs"]
    end
    
    style Before fill:#fef2f2,stroke:#dc2626,color:#7f1d1d
    style After fill:#f0fdf4,stroke:#16a34a,color:#14532d
`} />

      <p>
        MCP is like USB-C for AI: a single, universal interface that works with any device (or in this case, 
        any AI model) and any peripheral (or data source).
      </p>

      <InfoBox type="info" title="Key Insight">
        MCP creates a <strong>universal adapter</strong> between AI applications and external resources. 
        Instead of building custom integrations for each combination of AI model and data source, developers 
        can simply implement an MCP server, and any MCP-compatible AI application can use it.
      </InfoBox>

      <h2>The Problems MCP Solves</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["🤖 AI Applications"] --> B["🔗 Data Sources"]
    B --> C["😰 Custom Integrations"]
    C --> D["📝 Every pair = New code"]
    D --> E["🔧 Maintenance burden"]
    E --> F["🐛 Inconsistent behavior"]
    F --> G["📦 Vendor lock-in"]
`} />

      <h3>Before MCP: The Integration Chaos</h3>
      <p>Without MCP, connecting an AI to multiple data sources required:</p>
      <ul>
        <li><strong>Custom code for each data source</strong> — Every integration is unique</li>
        <li><strong>Multiple authentication systems</strong> — Each source has its own auth</li>
        <li><strong>No standard error handling</strong> — Each integration behaves differently</li>
        <li><strong>Vendor lock-in</strong> — Switching AI providers means rebuilding integrations</li>
      </ul>

      <h3>After MCP: The Standard Solution</h3>
      <p>With MCP, you get:</p>
      <ul>
        <li><strong>One protocol for all integrations</strong> — Learn once, use everywhere</li>
        <li><strong>Standardized security model</strong> — Built into the protocol</li>
        <li><strong>Consistent behavior</strong> — All servers work the same way</li>
        <li><strong>True portability</strong> — Switch AI providers without rebuilding integrations</li>
      </ul>

      <hr />

      <h2>Real-World Examples</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph AI["🤖 AI Applications"]
        Claude["👤 Claude Desktop"]
        Cursor["💻 Cursor IDE"]
        VSCode["📝 VS Code"]
    end
    
    subgraph MCP["🔌 MCP Protocol"]
        Server1["📦 Google Drive Server"]
        Server2["📦 Slack Server"]
        Server3["📦 GitHub Server"]
        Server4["📦 Database Server"]
    end
    
    subgraph Data["🔗 Data Sources"]
        Drive["📁 Files"]
        Slack["💬 Messages"]
        GitHub["📂 Repos"]
        DB["🗄️ Database"]
    end
    
    Claude --> Server1
    Claude --> Server2
    Cursor --> Server3
    Cursor --> Server4
    VSCode --> Server1
    VSCode --> Server3
    
    Server1 --> Drive
    Server2 --> Slack
    Server3 --> GitHub
    Server4 --> DB
`} />

      <h3>Example: Claude + Notion + Calendar</h3>
      <p>
        Imagine you want an AI assistant that can read your calendar and create Notion pages for meetings. 
        Without MCP, this requires custom integrations for both Notion and Google Calendar.
      </p>
      <p>
        With MCP, you simply connect to existing MCP servers for both services, and the AI can 
        seamlessly work with both — reading your calendar to understand upcoming meetings and 
        creating Notion pages with the meeting notes.
      </p>

      <h3>Example: Cursor IDE + Figma</h3>
      <p>
        In Cursor IDE, you can connect to an MCP server for Figma, allowing the AI to:
      </p>
      <ul>
        <li>Read design files to understand UI specifications</li>
        <li>Extract colors, typography, and spacing from designs</li>
        <li>Compare implementation with the original designs</li>
      </ul>

      <hr />

      <h2>MCP Ecosystem</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Ecosystem["MCP Ecosystem"]
        subgraph Hosts["🤖 AI Hosts"]
            Claude["Claude Desktop"]
            ChatGPT["ChatGPT"]
            Cursor["Cursor"]
            VSCode["VS Code"]
        end
        
        subgraph Protocol["📜 MCP Protocol"]
            Spec["Specification"]
            SDKs["SDKs (TS, Python, Go, ...)"]
        end
        
        subgraph Servers["🖥️ MCP Servers"]
            Ref["Reference Servers"]
            Comm["Community Servers"]
            Custom["Custom Servers"]
        end
    end
    
    Hosts --> Protocol
    Protocol --> Servers
    Hosts --> Servers
    
    style Hosts fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    style Protocol fill:#fef3c7,stroke:#d97706,color:#92400e
    style Servers fill:#d1fae5,stroke:#059669,color:#065f46
`} />

      <h3>Who Supports MCP?</h3>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Platforms</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>AI Applications</strong></td>
              <td>Claude (Desktop, Code), ChatGPT, Cursor, VS Code</td>
            </tr>
            <tr>
              <td><strong>Official Servers</strong></td>
              <td>Filesystem, Git, Memory, Time, Fetch, Sequential Thinking</td>
            </tr>
            <tr>
              <td><strong>SDKs</strong></td>
              <td>TypeScript, Python, Go, C#, Java, Rust, Swift, Ruby, PHP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="Growing Ecosystem">
        The MCP ecosystem is rapidly expanding. Major companies like AWS, Google, Azure, and Slack 
        have published or are building MCP servers for their platforms.
      </InfoBox>

      <hr />

      <h2>Benefits of MCP</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Benefits["MCP Benefits"]
        direction TB
        A["👨‍💻 For Developers"]
        B["🤖 For AI Apps"]
        C["👤 For Users"]
        
        A --> A1["Reuse integrations"]
        A --> A2["Standard security"]
        A --> A3["Open standard"]
        
        B --> B1["Any data source"]
        B --> B2["Consistent behavior"]
        B --> B3["Easy extensibility"]
        
        C --> C1["Better AI responses"]
        C --> C2["Data stays private"]
        C --> C3["More capabilities"]
    end
`} />

      <h3>For Developers</h3>
      <ul>
        <li><strong>Build once, use everywhere</strong> — Your MCP server works with any compatible AI</li>
        <li><strong>Standardized security</strong> — Security best practices built into the protocol</li>
        <li><strong>Open standard</strong> — No vendor lock-in, community-driven development</li>
      </ul>

      <h3>For AI Applications</h3>
      <ul>
        <li><strong>Universal data access</strong> — Connect to any MCP server out of the box</li>
        <li><strong>Consistent behavior</strong> — All servers follow the same protocol rules</li>
        <li><strong>Easy extensibility</strong> — Add new capabilities without core changes</li>
      </ul>

      <h3>For End Users</h3>
      <ul>
        <li><strong>More capable AI</strong> — Access to real data and tools</li>
        <li><strong>Privacy</strong> — Data stays in your systems</li>
        <li><strong>Better results</strong> — AI with context performs better</li>
      </ul>

      <hr />

      <h2>How MCP Relates to Other Standards</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Related["Related Protocols"]
        MCP["🔌 MCP"]
        OpenAPI["📡 OpenAPI"]
        GraphQL["🔗 GraphQL"]
        Webhooks["⚡ Webhooks"]
    end
    
    MCP -->|"Complements"| OpenAPI
    MCP -->|"Replaces custom"| GraphQL
    MCP -->|"Provides structure"| Webhooks
    
    style MCP fill:#d1fae5,stroke:#059669,color:#065f46
`} />

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>What it does</th>
              <th>MCP relationship</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>OpenAPI</strong></td>
              <td>API description format</td>
              <td>MCP can expose OpenAPI-defined APIs as tools</td>
            </tr>
            <tr>
              <td><strong>GraphQL</strong></td>
              <td>Query language for APIs</td>
              <td>MCP provides similar functionality with a simpler model</td>
            </tr>
            <tr>
              <td><strong>Webhooks</strong></td>
              <td>Event notifications</td>
              <td>MCP subscriptions provide structured event handling</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="MCP is Complementary">
        MCP doesn&apos;t replace these technologies — it works alongside them. You can expose an 
        OpenAPI-defined API through MCP, or use MCP subscriptions for what you&apos;d use webhooks for.
      </InfoBox>

      <hr />

      <h2>Your Learning Path</h2>

      <MermaidDiagram chart={`
flowchart TB
    A["📚 Introduction"] --> B["🏗️ Architecture"]
    B --> C["🔧 Core Primitives"]
    C --> D["🚇 Transport Layer"]
    D --> E["🔄 Protocol Lifecycle"]
    E --> F["💻 Building Servers"]
    F --> G["🔗 Building Clients"]
    G --> H["🛡️ Security"]
    H --> I["🚀 Production & Labs"]

    style A fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style B fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style C fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style D fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style E fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style F fill:#eef6ef,stroke:#4a7a50,color:#2a4a30
    style G fill:#eef6ef,stroke:#4a7a50,color:#2a4a30
    style H fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style I fill:#eef6ef,stroke:#4a7a50,color:#2a4a30
`} />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
            Official MCP Documentation
          </a>
        </li>
        <li>
          <a href="https://modelcontextprotocol.io/introduction" target="_blank" rel="noopener noreferrer">
            MCP Introduction
          </a>
        </li>
        <li>
          <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener noreferrer">
            MCP Reference Servers Repository
          </a>
        </li>
      </ol>

    </div>

    <LessonNav next={{ href: '/courses/model-context-protocol/architecture', title: 'Architecture' }} />
    </>
  );
}
