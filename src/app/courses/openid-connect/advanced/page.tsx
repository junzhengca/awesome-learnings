import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function AdvancedPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 8: Advanced Topics</h1>

      <p>
        This section covers advanced OpenID Connect concepts including federation, 
        session management, and logout mechanisms.
      </p>

      <h2>OpenID Federation</h2>

      <p>
        Federation allows multiple organizations to establish trust relationships without 
        direct bilateral agreements. The OpenID Federation 1.0 specification defines how 
        to build multilateral federations.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-federation-1_0-final.html" target="_blank" rel="noopener noreferrer">
          OpenID Federation 1.0
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Federation["OpenID Federation"]
        E["🏛️ Enabling Entity"]
        I["📋 Intermediate Entity"]
        A["🏢 Relying Party"]
        OP["🏛️ OpenID Provider"]
    end
    
    E -->|"Trust Chain"| I
    I -->|"Trust Chain"| A
    I -->|"Trust Chain"| OP
`} />

      <h2>Session Management</h2>

      <p>
        OpenID Connect Session Management allows Relying Parties to track whether users 
        are still logged in at the OpenID Provider.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-session-1_0.html" target="_blank" rel="noopener noreferrer">
          OpenID Connect Session Management 1.0
        </a>
      </InfoBox>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant OP as 🏛️ OpenID Provider
    participant U as 👤 User
    
    Note over RP,U: Session established
    RP->>OP: Authentication with session check
    OP-->>RP: ID Token (session_state in claims)
    
    Note over RP,U: Later - check session
    U->>RP: Continue browsing
    RP->>OP: POST /userinfo or check session iframe
    OP-->>RP: Active session?
    
    Note over RP,OP: Session changed
    OP->>U: Session changed notification
    U->>OP: Acknowledge
    OP->>RP: Session update
`} />

      <h2>Logout Mechanisms</h2>

      <p>OpenID Connect defines several logout mechanisms:</p>

      <h3>1. RP-Initiated Logout</h3>

      <blockquote>
        <p>
          <em>Allows a Relying Party to request that the OpenID Provider log out the End-User.</em>
        </p>
      </blockquote>

      <CodeBlock
        code={`# RP-Initiated Logout URL
GET /v2/logout?
  client_id=your_client_id
  &returnTo=https%3A%2F%2Fyourapp.com%2Flogged_out
  &state=random_state`}
        language="http"
        title="RP-Initiated Logout"
      />

      <h3>2. Front-Channel Logout</h3>

      <p>
        The OpenID Provider loads an iframe in the Relying Party to notify it of logout, 
        without direct RP-OP communication.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant OP as 🏛️ OpenID Provider
    participant U as 👤 User
    
    OP->>U: User clicks logout
    OP->>U: Display logout confirmation
    
    Note over RP: Front-Channel Logout
    OP->>RP: Load RP&apos;s logout iframe<br/>https://rp.com/logout-iframe
    RP->>RP: Clear local session
    
    OP->>U: Logout complete
`} />

      <h3>3. Back-Channel Logout</h3>

      <p>
        Direct server-to-server communication from the OpenID Provider to the Relying Party, 
        more secure than front-channel.
      </p>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant OP as 🏛️ OpenID Provider
    
    Note over OP: User logs out
    OP->>OP: Invalidate sessions
    
    Note over RP,OP: Back-Channel Logout
    OP->>RP: POST /backchannel_logout<br/>logout_token=...
    RP->>RP: Invalidate user sessions
    RP-->>OP: 200 OK
`} />

      <h2>Backchannel Logout Token</h2>

      <CodeBlock
        code={`// Example Backchannel Logout Token (JWT)
{
  "iss": "https://your-idp.com/",
  "sub": "user_12345",
  "aud": "your-client-id",
  "iat": 1516239022,
  "jti": "unique-event-id",
  "events": {
    "http://schemas.openid.net/event/backchannel-logout": {}
  }
}`}
        language="json"
        title="Backchannel Logout Token"
      />

      <h2>Self-Issued OpenID Provider</h2>

      <p>
        Self-Issued OPs allow users to act as their own Identity Provider, providing 
        a privacy-focused option where users control their own identity.
      </p>

      <InfoBox type="info" title="Source">
        <a href="https://openid.net/specs/openid-connect-self-signed-1_0.html" target="_blank" rel="noopener noreferrer">
          OpenID Connect Self-Issued OP
        </a>
      </InfoBox>

      <h2>Client Authentication Methods</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>client_secret_basic</code></td>
              <td className="border border-gray-300 px-4 py-2">Send client_id and client_secret in Authorization header</td>
              <td className="border border-gray-300 px-4 py-2">Server-side apps</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>client_secret_post</code></td>
              <td className="border border-gray-300 px-4 py-2">Send credentials in POST body</td>
              <td className="border border-gray-300 px-4 py-2">Legacy compatibility</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>private_key_jwt</code></td>
              <td className="border border-gray-300 px-4 py-2">Sign a JWT with client&apos;s private key</td>
              <td className="border border-gray-300 px-4 py-2">High-security, no shared secret</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>none</code></td>
              <td className="border border-gray-300 px-4 py-2">No authentication (public clients)</td>
              <td className="border border-gray-300 px-4 py-2">SPAs, mobile apps (with PKCE)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Private Key JWT Client Authentication</h2>

      <CodeBlock
        code={`// Client assertion for private_key_jwt
const clientAssertion = {
  header: {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'your-key-id',
  },
  payload: {
    iss: 'your-client-id',
    sub: 'your-client-id',
    aud: 'https://idp.com/token',
    exp: Math.floor(Date.now() / 1000) + 60,
    iat: Math.floor(Date.now() / 1000),
    jti: crypto.randomUUID(),
  },
};

// Sign with private key
const signature = await signWithPrivateKey(
  JSON.stringify(clientAssertion),
  privateKey
);

const clientAssertionValue = \`\${base64url(JSON.stringify(clientAssertion))}.\${signature}\`;

// Token request
const response = await fetch(tokenEndpoint, {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: callbackUrl,
    client_id: 'your-client-id',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: clientAssertionValue,
  }),
});`}
        language="javascript"
        title="Private Key JWT Client Authentication"
      />

      <h2>Identity Assurance (eKYC)</h2>

      <p>
        OpenID Connect for Identity Assurance extends OIDC to support verified claims, 
        useful for regulated industries like banking and healthcare.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-4-identity-assurance-1_0.html" target="_blank" rel="noopener noreferrer">
          OpenID Connect for Identity Assurance 1.0
        </a>
      </InfoBox>

      <h2>PAR (Pushed Authorization Requests)</h2>

      <p>
        Pushed Authorization Requests (RFC 9126) allow clients to push authorization 
        request parameters directly to the authorization server, improving security.
      </p>

      <CodeBlock
        code={`# PAR Request
POST /authorize
Host: idp.com
Content-Type: application/x-www-form-urlencoded

response_type=code
&client_id=your-client-id
&redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback
&scope=openid%20profile
&state=random-state
&code_challenge=S256-challenge
&code_challenge_method=S256

# PAR Response
{
  "request_uri": "urn:ietf:params:oauth:request_uri:auth-request-12345",
  "expires_in": 60
}

# Then redirect with request_uri instead of full params
GET /authorize?request_uri=urn:ietf:params:oauth:request_uri:auth-request-12345`}
        language="http"
        title="Pushed Authorization Requests"
      />

      <h2>JWT Secured Authorization Response (JARM)</h2>

      <p>
        JARM encodes authorization responses as JWTs, providing better security 
        for authorization responses.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/oauth-v2-jarm.html" target="_blank" rel="noopener noreferrer">
          JWT Secured Authorization Response Mode for OAuth 2.0
        </a>
      </InfoBox>

      <h2>What&apos;s Next?</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["📚 Completed Tutorial"] --> B["🛡️ Security Hardening"]
    A --> C["📊 Monitoring & Logging"]
    A --> D["🚀 Production Deployment"]
    A --> E["🔄 CI/CD Integration"]
    
    B --> B1["Add rate limiting"]
    B --> B2["Implement IP allowlisting"]
    
    C --> C1["Log authentication events"]
    C --> C2["Monitor token usage"]
    
    D --> D1["Set up production IDP"]
    D --> D2["Configure monitoring"]
    
    E --> E1["Add OIDC tests"]
    E --> E2["Automate token rotation"]
`} />

      <h2>Further Learning</h2>

      <ul>
        <li><strong>FAPI 2.0</strong> - Financial-grade API security profile</li>
        <li><strong>CIBA</strong> - Client Initiated Backchannel Authentication</li>
        <li><strong>OpenID4VCI</strong> - Verifiable Credential Issuance</li>
        <li><strong>DID SIOP</strong> - Self-Issued OpenID Provider with Decentralized Identifiers</li>
      </ul>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-federation-1_0-final.html" target="_blank" rel="noopener noreferrer">
            OpenID Federation 1.0
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-session-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Session Management 1.0
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-rpinitiated-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect RP-Initiated Logout 1.0
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-backchannel-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Back-Channel Logout 1.0
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-frontchannel-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Front-Channel Logout 1.0
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/security', title: 'Security' }}
        next={{ href: '/', title: 'Tutorial Home', label: 'Back to Course Library →' }}
      />
    </div>
  );
}
