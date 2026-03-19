import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function RefreshTokensPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 6: Refresh Tokens</h1>

      <p>
        Refresh tokens allow your application to obtain new access tokens without requiring the user 
        to log in again. They are essential for maintaining long-lived user sessions.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens" target="_blank" rel="noopener noreferrer">
          OpenID Connect Core 1.0 - Section 12. Using Refresh Tokens
        </a>
      </InfoBox>

      <h2>Why Refresh Tokens?</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["👤 User logs in"] --> B["🎫 Access Token issued"]
    B --> C["⏰ Access Token expires (e.g., 1 hour)"]
    C --> D["🔄 Use Refresh Token"]
    D --> E["🎫 New Access Token issued"]
    E --> F["✅ Session continues"]
    
    style C fill:#fee2e2
    style D fill:#d1fae5
    style F fill:#d1fae5
`} />

      <p>Access tokens are short-lived by design for security reasons:</p>
      <ul>
        <li><strong>Limited exposure</strong> - If an access token is compromised, it can only be used briefly</li>
        <li><strong>Reduced risk</strong> - Even if stolen, the token expires quickly</li>
        <li><strong>User control</strong> - Users can revoke access by logging out</li>
      </ul>

      <h2>How Refresh Tokens Work</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant U as 👤 User
    participant App as 📱 Relying Party
    participant IDP as 🏛️ Identity Provider
    
    Note over U,IDP: Initial Login
    App->>IDP: Authorization Request (with offline_access scope)
    IDP->>U: Login
    U->>IDP: Credentials
    IDP->>App: Access Token + Refresh Token
    App->>App: Store tokens securely
    
    Note over App,IDP: When Access Token Expires
    App->>IDP: POST /token (grant_type=refresh_token)
    IDP->>IDP: Validate Refresh Token
    IDP->>App: New Access Token + (optional new Refresh Token)
    App->>App: Update stored tokens
`} />

      <h2>Requesting Refresh Tokens</h2>

      <p>To receive refresh tokens, you must:</p>
      <ol>
        <li>Request the <code>offline_access</code> scope</li>
        <li>Use the Authorization Code Flow</li>
        <li>Have a confidential (server-side) client</li>
      </ol>

      <CodeBlock
        code={`# Authorization Request with offline_access scope
GET /authorize?
  response_type=code
  &client_id=your_client_id
  &redirect_uri=https%3A%2F%2Fyourapp.com%2Fcallback
  &scope=openid%20profile%20email%20offline_access
  &state=random_state
  &code_challenge=S256_challenge
  &code_challenge_method=S256`}
        language="http"
        title="Authorization Request with offline_access"
      />

      <InfoBox type="warning" title="Note">
        <code>offline_access</code> is a special scope that asks the Identity Provider to issue a refresh token. 
        Not all Identity Providers support it, and users may need to consent to it.
      </InfoBox>

      <h2>Token Response with Refresh Token</h2>

      <CodeBlock
        code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhlIHF1aWNrIGJyb3duIGZveA...",  // 👈 This is the refresh token!
  "scope": "openid profile email offline_access"
}`}
        language="json"
        title="Token Response with Refresh Token"
      />

      <h2>Refreshing an Access Token</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`async function refreshAccessToken(domain, clientId, clientSecret, refreshToken) {
  const config = await getOIDCConfiguration(domain);
  
  const response = await fetch(config.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(\`Refresh failed: \${error.error_description}\`);
  }
  
  return await response.json();
}

// Usage
async function ensureValidToken(session) {
  // Check if access token is expired or about to expire
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer
  
  if (session.tokens.expiresAt - bufferMs < now) {
    // Token expired or expiring soon, refresh it
    const newTokens = await refreshAccessToken(
      process.env.AUTH0_DOMAIN,
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_CLIENT_SECRET,
      session.tokens.refreshToken
    );
    
    // Update session with new tokens
    session.tokens = {
      accessToken: newTokens.access_token,
      idToken: newTokens.id_token,
      refreshToken: newTokens.refresh_token || session.tokens.refreshToken,
      expiresAt: Date.now() + (newTokens.expires_in * 1000),
    };
  }
}`}
        language="javascript"
        title="Refresh Token - Node.js"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`import requests
import time

def refresh_access_token(domain: str, client_id: str, client_secret: str, refresh_token: str) -> dict:
    """
    Refresh the access token using a refresh token.
    """
    config_response = requests.get(
        f"https://{domain}/.well-known/openid-configuration"
    )
    config = config_response.json()
    
    response = requests.post(
        config["token_endpoint"],
        data={
            "grant_type": "refresh_token",
            "client_id": client_id,
            "client_secret": client_secret,
            "refresh_token": refresh_token,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    
    response.raise_for_status()
    return response.json()


def ensure_valid_token(session: dict) -> dict:
    """
    Ensure we have a valid access token, refreshing if necessary.
    """
    buffer_seconds = 300  # 5 minute buffer
    
    if session["tokens"]["expires_at"] - buffer_seconds < time.time():
        # Token expired or expiring soon
        new_tokens = refresh_access_token(
            os.getenv("AUTH0_DOMAIN"),
            os.getenv("AUTH0_CLIENT_ID"),
            os.getenv("AUTH0_CLIENT_SECRET"),
            session["tokens"]["refresh_token"]
        )
        
        # Update session with new tokens
        session["tokens"]["access_token"] = new_tokens["access_token"]
        session["tokens"]["id_token"] = new_tokens["id_token"]
        session["tokens"]["refresh_token"] = new_tokens.get(
            "refresh_token", 
            session["tokens"]["refresh_token"]
        )
        session["tokens"]["expires_at"] = time.time() + new_tokens["expires_in"]
    
    return session`}
        language="python"
        title="Refresh Token - Python"
      />

      <h2>Refresh Token Rotation</h2>

      <p>Some Identity Providers implement refresh token rotation for enhanced security:</p>

      <MermaidDiagram chart={`
flowchart LR
    A["🔄 App uses Refresh Token"] --> B["🆕 IDP issues NEW Refresh Token"]
    B --> C["👴 OLD Refresh Token invalidated"]
    C --> D["🔐 If stolen, old token won&apos;t work"]
    D --> E["✅ Only new token works"]
`} />

      <InfoBox type="info" title="Token Rotation">
        When implementing refresh token rotation:
        <ul className="list-disc ml-4 mt-2">
          <li>Store the new refresh token immediately</li>
          <li>The old refresh token becomes invalid after use</li>
          <li>If reuse is detected, revoke all sessions</li>
        </ul>
      </InfoBox>

      <h2>Error Handling</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Error</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Meaning</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>invalid_grant</code></td>
              <td className="border border-gray-300 px-4 py-2">Refresh token expired/revoked</td>
              <td className="border border-gray-300 px-4 py-2">User must log in again</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>invalid_token</code></td>
              <td className="border border-gray-300 px-4 py-2">Token format invalid</td>
              <td className="border border-gray-300 px-4 py-2">Check token storage</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>unauthorized_client</code></td>
              <td className="border border-gray-300 px-4 py-2">Client not allowed to use this grant</td>
              <td className="border border-gray-300 px-4 py-2">Check client configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Security Best Practices</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["🔐 Refresh Token Security"] --> B["1️⃣ Store securely"]
    A --> C["2️⃣ Use HTTPS only"]
    A --> D["3️⃣ Implement rotation"]
    A --> E["4️⃣ Handle revocation"]
    
    B --> B1["Encrypt at rest"]
    B --> B2["Server-side only"]
    B --> B3["Never in browser localStorage"]
    
    C --> C1["All token transmission"]
    C --> C2["Token endpoint calls"]
    
    D --> D1["Store new token"]
    D --> D2["Invalidate old token"]
    
    E --> E1["Detect reuse attempts"]
    E --> E2["Revoke on suspicious activity"]
`} />

      <InfoBox type="warning" title="Critical Security">
        <ul className="list-disc ml-4">
          <li><strong>Never expose refresh tokens to browsers</strong> - They should only exist on your server</li>
          <li><strong>Store encrypted</strong> - Encrypt refresh tokens at rest in your database</li>
          <li><strong>Use HTTPS</strong> - All token transmission must be over TLS</li>
          <li><strong>Implement rotation</strong> - When supported, always rotate refresh tokens</li>
          <li><strong>Monitor for reuse</strong> - A reused refresh token indicates theft</li>
        </ul>
      </InfoBox>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#RefreshTokens" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 12. Using Refresh Tokens
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/refresh-tokens" target="_blank" rel="noopener noreferrer">
            Auth0 - Refresh Tokens
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/refresh-tokens/configure-refresh-token-rotation" target="_blank" rel="noopener noreferrer">
            Auth0 - Refresh Token Rotation
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/userinfo-endpoint', title: 'UserInfo Endpoint' }}
        next={{ href: '/courses/openid-connect/security', title: 'Security Best Practices' }}
      />
    </div>
  );
}
