import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function SecurityPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 7: Security Best Practices</h1>

      <p>
        Security is paramount when implementing OpenID Connect. This section covers the essential 
        security practices every developer must follow.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-core-1_0.html#Security" target="_blank" rel="noopener noreferrer">
          OpenID Connect Core 1.0 - Section 16. Security Considerations
        </a>
      </InfoBox>

      <h2>Attack Prevention Checklist</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["🛡️ OIDC Security Checklist"] --> B["🔑 PKCE for Public Clients"]
    A --> C["🛡️ State Parameter"]
    A --> D["🔐 Token Validation"]
    A --> E["🔄 Nonce Verification"]
    A --> F["🕐 Token Expiration"]
    A --> G["🔒 HTTPS Only"]
    A --> H["🔏 Secure Storage"]
    
    B --> B1["Prevent code interception"]
    C --> C1["CSRF protection"]
    D --> D1["Verify signature + claims"]
    E --> E1["Replay attack prevention"]
    F --> F1["Check exp claim"]
    G --> G1["TLS required"]
    H --> H2["Encrypt at rest"]
`} />

      <h2>1. PKCE (Proof Key for Code Exchange)</h2>

      <p>
        PKCE is critical for public clients (SPAs, mobile apps) but recommended for all client types.
      </p>

      <InfoBox type="warning" title="Required for Public Clients">
        According to OAuth 2.1, PKCE is mandatory for all OAuth clients, not just public ones. 
        Always implement PKCE.
      </InfoBox>

      <MermaidDiagram chart={`
flowchart LR
    A["📱 App"] -->|"1. Generate code_verifier"| B["🔐 Random string"]
    B -->|"2. Hash to code_challenge"| C["📝 S256 Hash"]
    C -->|"3. Send with auth request"| D["🔐 Auth Endpoint"]
    D -->|"4. Return code"| E["🔓"]
    E -->|"5. Send code + verifier"| F["🎫 Token Endpoint"]
    F -->|"6. Verify challenge"| G["✅ Valid"]
    F -->|"6. Verify challenge"| H["❌ Invalid"]
`} />

      <CodeBlock
        code={`// PKCE Implementation
function generateCodeVerifier() {
  // Must be 43-128 characters
  return crypto.randomBytes(32).toString('base64url');
}

async function generateCodeChallenge(verifier) {
  // SHA-256 hash, base64url encoded
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash.toString('base64url');
}

// Authorization request
const authUrl = \`\${authorizationEndpoint}?
  response_type=code
  &code_challenge=\${await generateCodeChallenge(codeVerifier)}
  &code_challenge_method=S256\`;

// Token request (must include verifier)
const tokenResponse = await fetch(tokenEndpoint, {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    code_verifier: codeVerifier, // The original verifier
  }),
});`}
        language="javascript"
        title="PKCE Implementation"
      />

      <h2>2. State Parameter (CSRF Protection)</h2>

      <p>
        The state parameter prevents Cross-Site Request Forgery (CSRF) attacks by ensuring 
        the response matches your original request.
      </p>

      <CodeBlock
        code={`// Generate state
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

// In login handler
app.get('/login', (req, res) => {
  const state = generateState();
  req.session.oauthState = state;
  
  res.redirect(\`\${authUrl}&state=\${state}\`);
});

// In callback handler
app.get('/callback', (req, res) => {
  const { state, code } = req.query;
  
  // CRITICAL: Verify state matches
  if (state !== req.session.oauthState) {
    return res.status(400).send('State mismatch - possible CSRF attack');
  }
  
  // Proceed with token exchange...
  delete req.session.oauthState;
});`}
        language="javascript"
        title="State Parameter Implementation"
      />

      <h2>3. Nonce Parameter (Replay Attack Prevention)</h2>

      <p>
        The nonce is a unique value that ties the ID Token to the original authorization request, 
        preventing replay attacks.
      </p>

      <CodeBlock
        code={`// Generate nonce
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// In login handler
app.get('/login', (req, res) => {
  const nonce = generateNonce();
  req.session.nonce = nonce;
  
  res.redirect(\`\${authUrl}&nonce=\${nonce}\`);
});

// In callback - validate nonce in ID Token
app.get('/callback', async (req, res) => {
  const { id_token } = await exchangeCodeForTokens(code);
  const claims = await verifyIdToken(id_token);
  
  // CRITICAL: Verify nonce
  if (claims.nonce !== req.session.nonce) {
    return res.status(400).send('Nonce mismatch - possible replay attack');
  }
  
  delete req.session.nonce;
});`}
        language="javascript"
        title="Nonce Implementation"
      />

      <h2>4. Token Validation</h2>

      <p>Never trust a token without thorough validation:</p>

      <MermaidDiagram chart={`
flowchart TD
    A["📥 ID Token Received"] --> B{"1️⃣ Signature valid?"}
    B -->|No| Z["❌ REJECT"]
    B -->|Yes| C{"2️⃣ Issuer valid?"}
    C -->|No| Z
    C -->|Yes| D{"3️⃣ Audience valid?"}
    D -->|No| Z
    D -->|Yes| E{"4️⃣ Exp not passed?"}
    E -->|No| Z
    E -->|Yes| F{"5️⃣ Nonce valid?"}
    F -->|No| Z
    F -->|Yes| G["✅ ACCEPT"]
`} />

      <CodeBlock
        code={`// Complete token validation checklist
async function validateIdToken(idToken, expectedNonce, expectedClientId, expectedIssuer) {
  // 1. Verify signature with IDP's public key
  const claims = await verifySignature(idToken);
  
  // 2. Verify issuer (iss claim)
  if (claims.iss !== expectedIssuer) {
    throw new Error('Invalid issuer');
  }
  
  // 3. Verify audience (aud claim)
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(expectedClientId)) {
    throw new Error('Invalid audience');
  }
  
  // 4. Verify expiration (exp claim)
  if (claims.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }
  
  // 5. Verify nonce (if expected)
  if (expectedNonce && claims.nonce !== expectedNonce) {
    throw new Error('Invalid nonce');
  }
  
  // 6. Verify issued at (iat claim) - reject if too old
  const now = Date.now() / 1000;
  if (claims.iat > now + 60) { // Allow 1 minute clock skew
    throw new Error('Token issued in the future');
  }
  
  return claims;
}`}
        language="javascript"
        title="Complete Token Validation"
      />

      <h2>5. Secure Token Storage</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Token Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Storage Location</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Security</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Access Token</strong></td>
              <td className="border border-gray-300 px-4 py-2">Server-side session</td>
              <td className="border border-gray-300 px-4 py-2">HttpOnly cookie or encrypted storage</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>ID Token</strong></td>
              <td className="border border-gray-300 px-4 py-2">Server-side session only</td>
              <td className="border border-gray-300 px-4 py-2">Never expose to browser</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Refresh Token</strong></td>
              <td className="border border-gray-300 px-4 py-2">Server-side, encrypted at rest</td>
              <td className="border border-gray-300 px-4 py-2">Highest security - gateway to new tokens</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="error" title="Never Do These">
        <ul className="list-disc ml-4">
          <li><strong>Never store tokens in localStorage</strong> - XSS can steal them</li>
          <li><strong>Never store tokens in sessionStorage</strong> - Same issue</li>
          <li><strong>Never log tokens</strong> - Could expose them in logs</li>
          <li><strong>Never pass tokens in URLs</strong> - URLs get logged and cached</li>
          <li><strong>Never use &ldquo;alg: none&rdquo;</strong> - No signature = no security</li>
        </ul>
      </InfoBox>

      <h2>6. HTTPS/TLS Requirements</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["🌐 HTTP"] -->|"❌ Insecure"| B["🚨 Tokens can be intercepted"]
    C["🔒 HTTPS"] -->|"✅ Encrypted"| D["🛡️ Tokens protected in transit"]
`} />

      <InfoBox type="warning" title="Mandatory">
        OpenID Connect requires TLS (HTTPS) for all communications. Never transmit tokens over plain HTTP.
      </InfoBox>

      <h2>7. Client Secret Security</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Client Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Secret Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Server-side web app</td>
              <td className="border border-gray-300 px-4 py-2">Client Secret</td>
              <td className="border border-gray-300 px-4 py-2">Store securely in env vars or secrets manager</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">SPA (Browser)</td>
              <td className="border border-gray-300 px-4 py-2">None - use PKCE</td>
              <td className="border border-gray-300 px-4 py-2">No secret can be kept secret in browser</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Native Mobile App</td>
              <td className="border border-gray-300 px-4 py-2">None - use PKCE</td>
              <td className="border border-gray-300 px-4 py-2">Secrets embedded in apps can be extracted</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Service/Backend</td>
              <td className="border border-gray-300 px-4 py-2">Client Secret or Private Key JWT</td>
              <td className="border border-gray-300 px-4 py-2">Private Key JWT is more secure</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>8. Security Summary</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Critical["🔴 Critical Security Practices"]
        C1["✅ Always use PKCE"]
        C2["✅ Always validate tokens"]
        C3["✅ Always use HTTPS"]
        C4["✅ Store secrets securely"]
    end
    
    subgraph Important["🟡 Important Security Practices"]
        I1["✅ Implement state parameter"]
        I2["✅ Verify nonce"]
        I3["✅ Check token expiration"]
        I4["✅ Use short token lifetimes"]
    end
    
    subgraph Recommended["🟢 Recommended"]
        R1["✅ Rotate refresh tokens"]
        R2["✅ Implement logout"]
        R3["✅ Monitor for suspicious activity"]
    end
`} />

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#Security" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 16. Security Considerations
          </a>
        </li>
        <li>
          <a href="https://datatracker.ietf.org/doc/html/rfc6749" target="_blank" rel="noopener noreferrer">
            OAuth 2.0 Authorization Framework - Security Considerations
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/security" target="_blank" rel="noopener noreferrer">
            Auth0 - Security Best Practices
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/refresh-tokens', title: 'Refresh Tokens' }}
        next={{ href: '/courses/openid-connect/advanced', title: 'Advanced Topics' }}
      />
    </div>
  );
}
