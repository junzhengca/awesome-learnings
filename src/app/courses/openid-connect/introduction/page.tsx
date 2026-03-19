import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import LessonNav from '@/components/LessonNav';

export default function IntroductionPage() {
  return (
    <>
    <div className="prose max-w-none">
      <h1>Section 1: Introduction to OpenID Connect</h1>
      
      <h2>What is OpenID Connect?</h2>
      <p>
        <strong>OpenID Connect (OIDC)</strong> is an interoperable authentication protocol based on the OAuth 2.0 
        framework. It provides a standardized way to verify the identity of users and obtain basic profile information 
        in an interoperable and REST-like manner.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/developers/how-connect-works/" target="_blank" rel="noopener noreferrer">
          OpenID Foundation - What is OpenID Connect
        </a>
      </InfoBox>

      <blockquote>
        <p>
          &ldquo;OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. 
          It enables Clients to verify the identity of the End-User based on the authentication performed 
          by an Authorization Server, as well as to obtain basic profile information about the End-User 
          in an interoperable and REST-like manner.&rdquo;
        </p>
        <footer className="text-sm mt-2">
          — <a href="https://openid.net/specs/openid-connect-core-1_0.html#Introduction" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 1
          </a>
        </footer>
      </blockquote>

      <h2>The Problem OpenID Connect Solves</h2>
      <p>Before OpenID Connect, websites had a difficult choice:</p>

      <MermaidDiagram chart={`
flowchart LR
    A["👤 User"] --> B["🔐 Password Problem"]
    B --> C["Every site = New password"]
    C --> D["😰 Password fatigue"]
    D --> E["😱 Security risks"]
    E --> F["Reused passwords"]
    F --> G["Data breaches"]
`} />

      <h3>The Traditional Approach vs OIDC</h3>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Traditional["Traditional (Problem)"]
        A1["User creates account"] --> A2["Site stores password"]
        A2 --> A3["Risk: Database breach"]
        A3 --> A4["User's password exposed"]
    end
    
    subgraph OIDC["OpenID Connect (Solution)"]
        B1["User clicks 'Login'"] --> B2["Redirect to IDP"]
        B2 --> B3["User authenticates with IDP"]
        B3 --> B4["IDP returns verified identity"]
        B4 --> B5["Your app never sees password"]
    end
`} />

      <p><strong>Key Benefits:</strong></p>
      <ul>
        <li><strong>No password management</strong> - Your app never stores or handles passwords</li>
        <li><strong>Single Sign-On (SSO)</strong> - Users log in once, access multiple apps</li>
        <li><strong>Standardized</strong> - Works across platforms and languages</li>
        <li><strong>Security</strong> - Password burden on specialized identity providers</li>
      </ul>

      <InfoBox type="source">
        <a href="https://auth0.com/docs/authenticate/protocols/openid-connect-protocol" target="_blank" rel="noopener noreferrer">
          Auth0 - OpenID Connect Protocol
        </a>
      </InfoBox>

      <h2>OpenID Connect vs OAuth 2.0</h2>
      <p>This is a crucial distinction that many developers confuse:</p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph OAuth["OAuth 2.0"]
        A1["Authorization"]
        A2["What can I ACCESS?"]
        A3["Returns: Access Token"]
    end
    
    subgraph OIDC["OpenID Connect"]
        B1["Authentication"]
        B2["Who ARE you?"]
        B3["Returns: ID Token + Access Token"]
    end
    
    A1 --- A2 --- A3
    B1 --- B2 --- B3
    OIDC -->|"extends"| OAuth
`} />

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Aspect</th>
              <th>OAuth 2.0</th>
              <th>OpenID Connect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Purpose</strong></td>
              <td>Authorization (access resources)</td>
              <td>Authentication (verify identity)</td>
            </tr>
            <tr>
              <td><strong>Primary Token</strong></td>
              <td>Access Token</td>
              <td>ID Token + Access Token</td>
            </tr>
            <tr>
              <td><strong>User Info</strong></td>
              <td>Not standardized</td>
              <td>Standardized UserInfo endpoint</td>
            </tr>
            <tr>
              <td><strong>Use Case</strong></td>
              <td>&ldquo;Can this app access my Google Drive?&rdquo;</td>
              <td>&ldquo;Is this really john@gmail.com?&rdquo;</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="Key Insight">
        OpenID Connect is built ON TOP of OAuth 2.0. It uses OAuth 2.0 as its underlying authorization 
        framework and adds an identity layer on top. Think of it as OAuth 2.0 with superpowers for identity verification.
      </InfoBox>

      <h2>How OpenID Connect Works (High-Level)</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant User as 👤 End-User
    participant App as 📱 Relying Party (Your App)
    participant IDP as 🏛️ OpenID Provider (e.g., Auth0)
    
    User->>App: 1. Click "Login"
    App->>IDP: 2. Redirect to Authorization Server
    IDP->>User: 3. Show Login Page
    User->>IDP: 4. Enter Credentials
    IDP->>IDP: 5. Verify Identity
    IDP->>App: 6. Return Authorization Code
    App->>IDP: 7. Exchange Code for Tokens
    IDP->>App: 8. Return ID Token + Access Token
    App->>User: 9. 🎉 User is logged in!
`} />

      <p><strong>The 7 Steps in Detail:</strong></p>
      <ol>
        <li><strong>User clicks &ldquo;Login&rdquo;</strong> - Your application initiates the flow</li>
        <li><strong>Redirect to IDP</strong> - User is sent to the Identity Provider</li>
        <li><strong>User authenticates</strong> - IDP presents login form</li>
        <li><strong>IDP verifies credentials</strong> - Authentication happens securely</li>
        <li><strong>Authorization Code returned</strong> - Temporary code sent back</li>
        <li><strong>Token exchange</strong> - App exchanges code for real tokens</li>
        <li><strong>Identity received</strong> - App receives ID Token with user info</li>
      </ol>

      <InfoBox type="source">
        <a href="https://openid.net/developers/how-connect-works/" target="_blank" rel="noopener noreferrer">
          OpenID Foundation - How Connect Works
        </a>
      </InfoBox>

      <h2>Evolution: OpenID 2.0 → OpenID Connect</h2>
      <p>OpenID Connect was designed to fix issues with OpenID 2.0:</p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph OIDv2["OpenID 2.0 (Legacy)"]
        A1["XML-based"]
        A2["Custom signature scheme"]
        A3["Complex implementation"]
        A4["Interoperability issues"]
    end
    
    subgraph OIDC["OpenID Connect (Modern)"]
        B1["JSON-based"]
        B2["Uses TLS/HTTPS for security"]
        B3["JWT for identity tokens"]
        B4["Easy to implement"]
    end
    
    OIDv2 -->|"improved"| OIDC
`} />

      <p><strong>Key Improvements in OpenID Connect:</strong></p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>OpenID 2.0</th>
              <th>OpenID Connect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data format</td>
              <td>XML</td>
              <td>JSON (REST-friendly)</td>
            </tr>
            <tr>
              <td>Security</td>
              <td>Custom signatures</td>
              <td>TLS/HTTPS</td>
            </tr>
            <tr>
              <td>Token format</td>
              <td>Custom</td>
              <td>JWT (standard)</td>
            </tr>
            <tr>
              <td>Implementation</td>
              <td>Difficult</td>
              <td>Straightforward</td>
            </tr>
            <tr>
              <td>Mobile support</td>
              <td>Poor</td>
              <td>Excellent</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="source">
        <a href="https://openid.net/developers/how-connect-works/" target="_blank" rel="noopener noreferrer">
          OpenID Foundation - How OpenID Connect Works
        </a>
      </InfoBox>

      <h2>Who Uses OpenID Connect?</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Providers["Identity Providers (OPs)"]
        G["Google"]
        M["Microsoft/Entra"]
        A["Auth0"]
        O["Okta"]
        K["Keycloak"]
    end
    
    subgraph Consumers["Relying Parties"]
        W["Web Apps"]
        M2["Mobile Apps"]
        S["SPAs (React, Vue)"]
        API["APIs"]
    end
    
    Providers -->|"OIDC"| Consumers
`} />

      <p>Many major platforms provide OpenID Connect:</p>
      <ul>
        <li><strong>Google</strong> - Used by countless apps for &ldquo;Sign in with Google&rdquo;</li>
        <li><strong>Microsoft/Entra ID</strong> - Enterprise identity</li>
        <li><strong>Auth0</strong> - Developer-focused identity platform</li>
        <li><strong>Okta</strong> - Enterprise identity management</li>
        <li><strong>Keycloak</strong> - Open-source option</li>
      </ul>

      <h2>Your Learning Path</h2>

      <MermaidDiagram chart={`
flowchart TB
    A["📚 Introduction"] --> B["🧠 Core Concepts"]
    B --> C["🔐 JWTs Explained"]
    C --> D["🔄 OIDC Flows"]
    D --> E["📡 Discovery"]
    E --> F["🧪 Hands-On Labs"]
    F --> G["🛡️ Security"]
    G --> H["🚀 Advanced Topics"]

    style A fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style B fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style C fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style D fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style E fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style F fill:#eef6ef,stroke:#4a7a50,color:#2a4a30
    style G fill:#f5ede0,stroke:#c47a2a,color:#3d2810
    style H fill:#f5ede0,stroke:#c47a2a,color:#3d2810
`} />

      <h2>Sources</h2>
      <p>This section was based on:</p>
      <ol>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 Specification
          </a> - The authoritative specification
        </li>
        <li>
          <a href="https://openid.net/developers/how-connect-works/" target="_blank" rel="noopener noreferrer">
            OpenID Foundation - How Connect Works
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/authenticate/protocols/openid-connect-protocol" target="_blank" rel="noopener noreferrer">
            Auth0 - OpenID Connect Protocol
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/json-web-tokens" target="_blank" rel="noopener noreferrer">
            Auth0 - JSON Web Tokens
          </a>
        </li>
      </ol>

    </div>

    <LessonNav next={{ href: '/courses/openid-connect/core-concepts', title: 'Core Concepts' }} />
    </>
  );
}
