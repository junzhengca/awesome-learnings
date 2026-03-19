import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function DiscoveryPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 5: Discovery & Registration</h1>

      <p>
        OpenID Connect provides mechanisms for clients to automatically discover the OpenID Provider&apos;s 
        configuration and dynamically register themselves. This makes integration much easier.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-discovery-1_0.html" target="_blank" rel="noopener noreferrer">
          OpenID Connect Discovery 1.0
        </a>
      </InfoBox>

      <h2>OpenID Connect Discovery</h2>

      <p>
        The Discovery document allows your application to automatically learn about the Identity Provider&apos;s 
        endpoints and capabilities without hardcoding URLs.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    A["📱 Relying Party"] -->|"GET /.well-known/openid-configuration"| B["🗂️ Discovery Document"]
    B -->|"JSON Metadata"| A
    
    B -->|"authorization_endpoint"| C["🔐 Auth Endpoint URL"]
    B -->|"token_endpoint"| D["🎫 Token Endpoint URL"]
    B -->|"userinfo_endpoint"| E["👤 UserInfo Endpoint URL"]
    B -->|"jwks_uri"| F["🔑 Keys for verification"]
    B -->|"issuer"| G["🏛️ Issuer Identifier"]
`} />

      <h3>The Discovery Endpoint</h3>

      <p>
        The Discovery document is available at a well-known URL:
      </p>

      <CodeBlock
        code={`GET /.well-known/openid-configuration
Host: your-idp.com

# Example:
GET https://your-idp.com/.well-known/openid-configuration`}
        language="http"
        title="Discovery Request"
      />

      <h3>Discovery Response Example</h3>

      <CodeBlock
        code={`{
  "issuer": "https://your-idp.com/",
  "authorization_endpoint": "https://your-idp.com/authorize",
  "token_endpoint": "https://your-idp.com/oauth/token",
  "userinfo_endpoint": "https://your-idp.com/userinfo",
  "jwks_uri": "https://your-idp.com/.well-known/jwks.json",
  "response_types_supported": [
    "code",
    "id_token",
    "id_token token",
    "code id_token",
    "code token",
    "code id_token token"
  ],
  "subject_types_supported": [
    "public",
    "pairwise"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256",
    "RS384",
    "ES256"
  ],
  "scopes_supported": [
    "openid",
    "profile",
    "email",
    "offline_access"
  ],
  "token_endpoint_auth_methods_supported": [
    "client_secret_basic",
    "client_secret_post",
    "private_key_jwt"
  ],
  "claims_supported": [
    "sub",
    "name",
    "given_name",
    "family_name",
    "email",
    "email_verified",
    "picture",
    "locale"
  ],
  "code_challenge_methods_supported": [
    "S256"
  ],
  "grant_types_supported": [
    "authorization_code",
    "implicit",
    "refresh_token"
  ]
}`}
        language="json"
        title="Discovery Document (OIDC Configuration)"
      />

      <h3>Key Discovery Fields</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>issuer</code></td>
              <td className="border border-gray-300 px-4 py-2">The identifier of the token issuer (must match in ID Token)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>authorization_endpoint</code></td>
              <td className="border border-gray-300 px-4 py-2">URL for initiating authentication</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>token_endpoint</code></td>
              <td className="border border-gray-300 px-4 py-2">URL for exchanging codes for tokens</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>userinfo_endpoint</code></td>
              <td className="border border-gray-300 px-4 py-2">URL for fetching additional user claims</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>jwks_uri</code></td>
              <td className="border border-gray-300 px-4 py-2">URL for fetching public keys for token verification</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>response_types_supported</code></td>
              <td className="border border-gray-300 px-4 py-2">Which OAuth response types are supported</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>scopes_supported</code></td>
              <td className="border border-gray-300 px-4 py-2">Which OAuth scopes are available</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>code_challenge_methods_supported</code></td>
              <td className="border border-gray-300 px-4 py-2">PKCE methods (e.g., S256)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>JSON Web Key Set (JWKS)</h2>

      <p>
        The JWKS endpoint provides the public keys used to verify JWT signatures. This is critical 
        for security - you must verify tokens using these keys.
      </p>

      <CodeBlock
        code={`GET /.well-known/jwks.json
Host: your-idp.com

# Response:
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "key-id-1",
      "alg": "RS256",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbW...",
      "e": "AQAB"
    }
  ]
}`}
        language="json"
        title="JWKS Response"
      />

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant JWKS as 🔑 JWKS Endpoint
    participant IDP as 🏛️ IDP
    
    Note over RP,IDP: 1. Fetch Discovery Document
    RP->>IDP: GET /.well-known/openid-configuration
    IDP-->>RP: Discovery JSON (includes jwks_uri)
    
    Note over RP,JWKS: 2. Fetch Public Keys
    RP->>JWKS: GET /.well-known/jwks.json
    JWKS-->>RP: Public Key Set
    
    Note over RP,IDP: 3. Verify Token
    RP->>RP: Use public key to verify<br/>ID Token signature
`} />

      <hr />

      <h2>Dynamic Client Registration</h2>

      <p>
        OpenID Connect supports dynamic registration, allowing clients to register without manual 
        pre-configuration. This is useful for automated scenarios.
      </p>

      <InfoBox type="info" title="When to Use Dynamic Registration">
        <ul className="list-disc ml-4">
          <li>Service providers that need to integrate with multiple identity providers</li>
          <li>Automated testing environments</li>
          <li>Applications that need to register on-the-fly</li>
        </ul>
        <p className="mt-2">For most applications, you&apos;ll manually register your client and get credentials.</p>
      </InfoBox>

      <h3>Registration Request</h3>

      <CodeBlock
        code={`POST /register
Host: your-idp.com
Content-Type: application/json

{
  "redirect_uris": [
    "https://yourapp.com/callback",
    "https://yourapp.com/logout-callback"
  ],
  "response_types": ["code"],
  "grant_types": ["authorization_code", "refresh_token"],
  "client_name": "Your Application Name",
  "jwks_uri": "https://yourapp.com/.well-known/jwks.json",
  "token_endpoint_auth_method": "client_secret_basic",
  "id_token_signed_response_alg": "RS256"
}`}
        language="json"
        title="Client Registration Request"
      />

      <h3>Registration Response</h3>

      <CodeBlock
        code={`{
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "client_id_issued_at": 1609459200,
  "client_secret_expires_at": 1609545600,
  "redirect_uris": [
    "https://yourapp.com/callback"
  ],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "client_secret_basic"
}`}
        language="json"
        title="Client Registration Response"
      />

      <hr />

      <h2>Implementation: Fetching Discovery Document</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`// Simple discovery fetch with caching
import NodeCache from 'node-cache';

const discoveryCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function getOIDCConfiguration(issuer) {
  const cacheKey = \`oidc_config_\${issuer}\`;
  
  // Check cache first
  const cached = discoveryCache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch discovery document
  const url = \`\${issuer}/.well-known/openid-configuration\`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch OIDC configuration: \${response.status}\`);
  }
  
  const config = await response.json();
  
  // Validate required fields
  const required = [
    'issuer',
    'authorization_endpoint',
    'token_endpoint',
    'jwks_uri'
  ];
  
  for (const field of required) {
    if (!config[field]) {
      throw new Error(\`Invalid OIDC configuration: missing \${field}\`);
    }
  }
  
  // Cache the configuration
  discoveryCache.set(cacheKey, config);
  
  return config;
}

// Usage
const config = await getOIDCConfiguration('https://your-idp.com');
console.log(config.authorization_endpoint);`}
        language="javascript"
        title="Node.js - OIDC Discovery"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`import requests
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def get_oidc_configuration(issuer: str, ttl_seconds: int = 3600):
    """
    Fetch and cache OIDC discovery document.
    In production, use a proper caching library.
    """
    url = f"{issuer.rstrip('/')}/.well-known/openid-configuration"
    
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    
    config = response.json()
    
    # Validate required fields
    required_fields = [
        'issuer',
        'authorization_endpoint', 
        'token_endpoint',
        'jwks_uri'
    ]
    
    for field in required_fields:
        if field not in config:
            raise ValueError(f"Invalid OIDC configuration: missing {field}")
    
    # Add cache timestamp
    config['_cached_at'] = time.time()
    config['_cache_ttl'] = ttl_seconds
    
    return config

# Usage
config = get_oidc_configuration('https://your-idp.com')
print(config['authorization_endpoint'])`}
        language="python"
        title="Python - OIDC Discovery"
      />

      <hr />

      <h2>Putting It All Together: Complete Discovery Flow</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant Disco as 📡 Discovery Endpoint
    participant JWKS as 🔑 JWKS Endpoint
    participant Auth as 🔐 Auth Endpoint
    
    Note over RP: Initialization Phase
    RP->>Disco: 1. Fetch Discovery Doc
    Disco-->>RP: Config with endpoints
    
    RP->>JWKS: 2. Fetch JWKS
    JWKS-->>RP: Public Keys
    
    Note over RP,Auth: Authentication Phase
    RP->>Auth: 3. Authorization Request<br/>(using discovered endpoint)
    Auth-->>RP: 4. Authorization Code
    
    RP->>RP: 5. Validate ID Token<br/>(using cached keys)
`} />

      <InfoBox type="success" title="Best Practice">
        <ol className="list-decimal ml-4">
          <li>Cache the discovery document (typically valid for 24+ hours)</li>
          <li>Cache the JWKS keys (refresh periodically)</li>
          <li>Handle key rotation gracefully (multiple keys in JWKS)</li>
          <li>Always verify tokens even if you trust the IDP</li>
        </ol>
      </InfoBox>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-discovery-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Discovery 1.0
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-registration-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Dynamic Client Registration 1.0
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow" target="_blank" rel="noopener noreferrer">
            Auth0 - Authorization Code Flow
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/flows', title: 'Authentication Flows' }}
        next={{ href: '/courses/openid-connect/labs/setup-auth0', title: 'Lab: Setup Auth0' }}
      />
    </div>
  );
}
