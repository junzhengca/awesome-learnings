import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function FlowsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 4: OpenID Connect Authentication Flows</h1>

      <p>
        OpenID Connect defines three authentication flows. Each flow determines how tokens are returned 
        to your application. Understanding these flows is crucial for choosing the right implementation.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-core-1_0.html#Authentication" target="_blank" rel="noopener noreferrer">
          OpenID Connect Core 1.0 - Section 3. Authentication
        </a>
      </InfoBox>

      <h2>Flow Comparison Overview</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Flows["OIDC Flows"]
        AC["🔐 Authorization Code Flow"]
        IM["⚡ Implicit Flow"]
        HY["🔄 Hybrid Flow"]
    end
    
    AC -->|"response_type=code"| Best["✅ Recommended"]
    IM -->|"response_type=id_token"| Legacy["⚠️ Legacy"]
    HY -->|"response_type=code id_token"| Modern["🔷 Modern"]
`} />

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Property</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Authorization Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Implicit</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Hybrid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Tokens via Authorization Endpoint</strong></td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">Some</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Tokens via Token Endpoint</strong></td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">Some</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Tokens hidden from browser</strong></td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">Partial</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Client can be authenticated</strong></td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Refresh tokens possible</strong></td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Security level</strong></td>
              <td className="border border-gray-300 px-4 py-2">🛡️ High</td>
              <td className="border border-gray-300 px-4 py-2">⚠️ Lower</td>
              <td className="border border-gray-300 px-4 py-2">🛡️ High</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Recommended for new apps</strong></td>
              <td className="border border-gray-300 px-4 py-2">✅ Yes</td>
              <td className="border border-gray-300 px-4 py-2">❌ No</td>
              <td className="border border-gray-300 px-4 py-2">Sometimes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>1. Authorization Code Flow (Recommended)</h2>

      <p>
        The <strong>Authorization Code Flow</strong> is the most secure and recommended flow for most applications. 
        It involves a code exchange step that keeps tokens away from the browser.
      </p>

      <InfoBox type="success" title="Best For">
        <ul className="list-disc ml-4">
          <li>Server-side web applications (Node.js, Python, Ruby, etc.)</li>
          <li>Mobile apps with secure backends</li>
          <li>Any application that can securely store a client secret</li>
        </ul>
      </InfoBox>

      <MermaidDiagram chart={`
sequenceDiagram
    participant U as 👤 End-User
    participant B as 🌐 Browser
    participant RP as 📱 Relying Party
    participant OP as 🏛️ Authorization Server
    participant T as 🎫 Token Endpoint
    
    Note over U,B: Step 1: User initiates login
    U->>B: Click "Login"
    B->>RP: Request protected page
    RP->>B: Redirect to IDP
    
    Note over B,OP: Step 2: Authorization Request
    B->>OP: GET /authorize?<br/>response_type=code<br/>&client_id=...<br/>&redirect_uri=...<br/>&scope=openid profile email<br/>&state=...<br/>&nonce=...
    
    Note over U,OP: Step 3: User authenticates
    OP->>U: Login page
    U->>OP: Enter credentials
    OP->>OP: Verify credentials
    
    Note over B,RP: Step 4: Authorization Code returned
    OP->>B: 302 Redirect to<br/>redirect_uri?code=AUTH_CODE
    
    Note over B,RP: Step 5: Exchange code for tokens
    B->>RP: Page load with code
    RP->>T: POST /token<br/>code=AUTH_CODE<br/>&client_id=...<br/>&client_secret=...
    T->>T: Validate code
    
    Note over RP,T: Step 6: Tokens issued
    T->>RP: {<br/>"access_token": "...",<br/>"id_token": "...",<br/>"token_type": "Bearer",<br/>"expires_in": 3600,<br/>"refresh_token": "..."<br/>}
    
    Note over RP,U: Step 7: User is logged in
    RP->>B: 🎉 Set session, show logged-in page
    B->>U: Welcome!
`} />

      <h3>Authorization Request Parameters</h3>

      <CodeBlock
        code={`GET /authorize?
  response_type=code
  &client_id=your_client_id
  &redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback
  &scope=openid%20profile%20email
  &state=random_state_value
  &nonce=random_nonce_value
  &code_challenge=S256_pkce_challenge
  &code_challenge_method=S256`}
        language="http"
        title="Authorization Request (URL encoded for readability)"
      />

      <h3>Token Request (Code Exchange)</h3>

      <CodeBlock
        code={`POST /oauth/token HTTP/1.1
Host: your-idp.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=AUTH_CODE_FROM_AUTHORIZATION
&redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback
&client_id=your_client_id
&client_secret=your_client_secret`}
        language="http"
        title="Token Request"
      />

      <h3>Token Response</h3>

      <CodeBlock
        code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhlIHF1aWNrIGJyb3duIGZveA...",
  "scope": "openid profile email"
}`}
        language="json"
        title="Token Response"
      />

      <hr />

      <h2>2. Implicit Flow (Legacy - Not Recommended)</h2>

      <p>
        The <strong>Implicit Flow</strong> was designed for JavaScript-heavy applications (SPAs) but 
        has security concerns. It returns tokens directly in the URL fragment.
      </p>

      <InfoBox type="warning" title="Security Warning">
        The Implicit Flow is <strong>not recommended</strong> for new applications due to security concerns:
        <ul className="list-disc ml-4 mt-2">
          <li>Tokens exposed in browser history and logs</li>
          <li>No client authentication</li>
          <li>No refresh tokens</li>
          <li>Vulnerable to token interception</li>
        </ul>
        Use Authorization Code Flow with PKCE instead.
      </InfoBox>

      <MermaidDiagram chart={`
sequenceDiagram
    participant U as 👤 End-User
    participant B as 🌐 Browser (SPA)
    participant RP as 📱 Relying Party
    participant OP as 🏛️ Authorization Server
    
    U->>B: Click "Login"
    B->>OP: Redirect with implicit request
    
    OP->>U: Login page
    U->>OP: Credentials
    OP->>OP: Verify
    
    Note over OP,B: Tokens in URL fragment (#)
    OP->>B: 302 Redirect to<br/>app.com/callback#<br/>access_token=...<br/>&id_token=...<br/>&token_type=Bearer<br/>&expires_in=3600
    
    Note over B: Extract tokens from fragment
    B->>B: Parse #access_token, #id_token
    
    Note over B: Use tokens for API calls
    B->>OP: API call with<br/>Authorization: Bearer ...
`} />

      <h3>Implicit Flow Request</h3>

      <CodeBlock
        code={`GET /authorize?
  response_type=id_token%20token
  &client_id=your_client_id
  &redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback
  &scope=openid%20profile%20email
  &state=random_state
  &nonce=random_nonce`}
        language="http"
        title="Implicit Flow Authorization Request"
      />

      <h3>Implicit Flow Response (in URL fragment)</h3>

      <CodeBlock
        code={`https://yourapp.com/callback#
  access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
  &id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
  &token_type=Bearer
  &expires_in=3600
  &state=random_state`}
        language="http"
        title="Implicit Flow Response (⚠️ Insecure)"
      />

      <hr />

      <h2>3. Hybrid Flow</h2>

      <p>
        The <strong>Hybrid Flow</strong> combines aspects of both Authorization Code and Implicit flows. 
        It returns some tokens from the Authorization Endpoint and others from the Token Endpoint.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Hybrid["Hybrid Flow Response Types"]
        code_idtoken["code id_token"]
        code_token["code token"]
        code_idtoken_token["code id_token token"]
    end
    
    code_idtoken -->|"code + id_token"| AuthEP["Authz Endpoint"]
    code_token -->|"code + access_token"| AuthEP
    code_idtoken_token -->|"code + id_token + access_token"| AuthEP
`} />

      <InfoBox type="info" title="When to Use Hybrid Flow">
        Hybrid Flow is useful when you need:
        <ul className="list-disc ml-4 mt-2">
          <li>Quick access to ID Token from Authorization Endpoint (for fast UI updates)</li>
          <li>Secure token exchange via Token Endpoint</li>
          <li>Refresh tokens</li>
        </ul>
      </InfoBox>

      <hr />

      <h2>Response Types Summary</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">response_type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Flow</th>
              <th className="border border-gray-300 px-4 py-2 text-left">From Auth Endpoint</th>
              <th className="border border-gray-300 px-4 py-2 text-left">From Token Endpoint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>code</code></td>
              <td className="border border-gray-300 px-4 py-2">Authorization Code</td>
              <td className="border border-gray-300 px-4 py-2">Authorization Code</td>
              <td className="border border-gray-300 px-4 py-2">ID Token, Access Token, Refresh Token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>id_token</code></td>
              <td className="border border-gray-300 px-4 py-2">Implicit</td>
              <td className="border border-gray-300 px-4 py-2">ID Token</td>
              <td className="border border-gray-300 px-4 py-2">None</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>id_token token</code></td>
              <td className="border border-gray-300 px-4 py-2">Implicit</td>
              <td className="border border-gray-300 px-4 py-2">ID Token, Access Token</td>
              <td className="border border-gray-300 px-4 py-2">None</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>code id_token</code></td>
              <td className="border border-gray-300 px-4 py-2">Hybrid</td>
              <td className="border border-gray-300 px-4 py-2">Code, ID Token</td>
              <td className="border border-gray-300 px-4 py-2">Access Token, Refresh Token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>code token</code></td>
              <td className="border border-gray-300 px-4 py-2">Hybrid</td>
              <td className="border border-gray-300 px-4 py-2">Code, Access Token</td>
              <td className="border border-gray-300 px-4 py-2">ID Token, Refresh Token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>code id_token token</code></td>
              <td className="border border-gray-300 px-4 py-2">Hybrid</td>
              <td className="border border-gray-300 px-4 py-2">Code, ID Token, Access Token</td>
              <td className="border border-gray-300 px-4 py-2">Refresh Token</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Choosing the Right Flow</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["What type of application?"] --> B{"Is it a SPA<br/>(React, Vue, Angular)?"}
    
    B -->|Yes, Modern| C["Use Authorization Code + PKCE"]
    B -->|No| D{"Is it a native mobile app?"}
    
    D -->|Yes| E["Use Authorization Code + PKCE"]
    D -->|No| F{"Is it a backend/API service?"}
    
    F -->|Yes| G["Use Authorization Code + Client Credentials"]
    F -->|No| H{"Is it a traditional web app?"}
    
    H -->|Yes| I["Use Authorization Code Flow"]
    
    C --> J["✅ Secure & Recommended"]
    E --> J
    I --> J
    G --> K["✅ For machine-to-machine"]
    
    style C fill:#d1fae5
    style E fill:#d1fae5
    style I fill:#d1fae5
    style G fill:#fef3c7
    style J fill:#d1fae5
    style K fill:#fef3c7
`} />

      <InfoBox type="success" title="Recommendation">
        <p>For almost all modern applications, use the <strong>Authorization Code Flow with PKCE</strong>.</p>
        <p className="mt-2">This provides the best security regardless of your application type.</p>
      </InfoBox>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#Authentication" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 3. Authentication
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 3.1 Authorization Code Flow
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 3.2 Implicit Flow
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow" target="_blank" rel="noopener noreferrer">
            Auth0 - Authorization Code Flow
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/jwt', title: 'JSON Web Tokens' }}
        next={{ href: '/courses/openid-connect/discovery', title: 'Discovery' }}
      />
    </div>
  );
}
