import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function TokenValidationPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 4: Token Validation</h1>

      <p>
        Token validation is the most critical security step in OpenID Connect. 
        An ID token must be thoroughly validated before trusting its claims.
      </p>

      <InfoBox type="info" title="What You&apos;ll Learn">
        <ul className="list-disc ml-4">
          <li>Why token validation is critical</li>
          <li>How to validate JWT signatures</li>
          <li>How to verify claims (iss, aud, exp, etc.)</li>
          <li>How to handle key rotation</li>
        </ul>
      </InfoBox>

      <h2>Why Token Validation Matters</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["🎭 Attacker"] -->|"Creates fake ID Token"| B["❌ No Validation"]
    B -->|"Impersonates user"| C["🚨 Unauthorized Access"]
    
    A -->|"Steals token"| D["✅ With Validation"]
    D -->|"Signature invalid"| E["🚫 Token Rejected"]
    D -->|"exp expired"| E
    D -->|"wrong aud"| E
`} />

      <InfoBox type="warning" title="Critical Security">
        <p>Never trust an ID token without validating it. A valid-looking token could be:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>Forged by an attacker</li>
          <li>Stolen and replayed</li>
          <li>Expired</li>
          <li>Intended for a different audience</li>
        </ul>
      </InfoBox>

      <h2>The Validation Checklist</h2>

      <MermaidDiagram chart={`
flowchart TD
    START["📥 Receive ID Token"] --> A{"1️⃣ Parse JWT"}
    A --> B{"2️⃣ Verify Signature<br/>(with IDP public key)"}
    B -->|Valid| C{"3️⃣ Validate Claims"}
    B -->|Invalid| Z["❌ REJECT"]
    C -->|Valid| D{"4️⃣ Check nonce"}
    C -->|Invalid| Z
    D -->|Valid| E{"✅ ACCEPT"}
    D -->|Invalid| Z
    D -->|Not required| E
`} />

      <h2>Step 1: Fetch and Cache JWKS</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`// services/jwks.js
import axios from 'axios';

class JWKSClient {
  constructor(jwksUri) {
    this.jwksUri = jwksUri;
    this.keys = new Map();
    this.lastFetch = 0;
    this.cacheMs = 3600000; // 1 hour cache
  }
  
  async refreshKeys() {
    const now = Date.now();
    
    // Check if cache is still valid
    if (this.keys.size > 0 && (now - this.lastFetch) < this.cacheMs) {
      return;
    }
    
    try {
      const response = await axios.get(this.jwksUri);
      const { keys } = response.data;
      
      this.keys.clear();
      for (const key of keys) {
        this.keys.set(key.kid, key);
      }
      
      this.lastFetch = now;
      console.log(\`Refreshed JWKS with \${keys.length} keys\`);
    } catch (error) {
      console.error('Failed to fetch JWKS:', error.message);
      // Keep using old keys if refresh fails
      if (this.keys.size === 0) {
        throw error;
      }
    }
  }
  
  getKey(kid) {
    return this.keys.get(kid);
  }
}

export default JWKSClient;`}
        language="javascript"
        title="services/jwks.js - JWKS Client"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`# services/jwks_client.py
import time
import requests
from jwt import PyJWKClient

class JWKSClient:
    def __init__(self, jwks_uri: str, cache_seconds: int = 3600):
        self.jwks_uri = jwks_uri
        self.cache_seconds = cache_seconds
        self._client = None
        self._last_fetch = 0
        self._keys = {}
    
    def _refresh_keys(self):
        """Refresh keys from JWKS endpoint."""
        now = time.time()
        
        if self._keys and (now - self._last_fetch) < self.cache_seconds:
            return
        
        try:
            response = requests.get(self.jwks_uri)
            response.raise_for_status()
            data = response.json()
            
            self._keys = {key['kid']: key for key in data['keys']}
            self._last_fetch = now
            print(f"Refreshed JWKS with {len(self._keys)} keys")
        except Exception as e:
            print(f"Failed to fetch JWKS: {e}")
            if not self._keys:
                raise
    
    def get_key(self, kid: str):
        """Get key by kid, refreshing if needed."""
        self._refresh_keys()
        return self._keys.get(kid)`}
        language="python"
        title="services/jwks_client.py - JWKS Client"
      />

      <h2>Step 2: Validate the Token</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`// services/tokenValidator.js
import axios from 'axios';
import { jwtVerify, importSPKI } from 'jose';
import JWKSClient from './jwks.js';

class TokenValidator {
  constructor(domain, clientId) {
    this.domain = domain;
    this.clientId = clientId;
    this.jwksClient = null;
    this.config = null;
  }
  
  async getConfig() {
    if (!this.config) {
      const response = await axios.get(
        \`https://\${this.domain}/.well-known/openid-configuration\`
      );
      this.config = response.data;
      this.jwksClient = new JWKSClient(this.config.jwks_uri);
    }
    return this.config;
  }
  
  async validateIdToken(idToken) {
    // Step 1: Decode header to get kid
    const [, header] = idToken.split('.');
    const { kid, alg } = JSON.parse(
      Buffer.from(header, 'base64url').toString()
    );
    
    // Step 2: Get configuration and keys
    const config = await this.getConfig();
    await this.jwksClient.refreshKeys();
    
    // Step 3: Get the signing key
    const keyData = this.jwksClient.getKey(kid);
    if (!keyData) {
      throw new Error(\`Key \${kid} not found in JWKS\`);
    }
    
    // Step 4: Import the public key
    const publicKey = await importSPKI(
      \`-----BEGIN PUBLIC KEY-----
\${keyData.x5c[0]}
-----END PUBLIC KEY-----\`,
      alg || 'RS256'
    );
    
    // Step 5: Verify the signature and claims
    const { payload } = await jwtVerify(idToken, publicKey, {
      issuer: config.issuer,
      audience: this.clientId,
      algorithms: ['RS256'],
    });
    
    // Step 6: Additional validation (jwtVerify handles some)
    if (!payload.iat) {
      throw new Error('Missing iat claim');
    }
    
    if (!payload.sub) {
      throw new Error('Missing sub claim');
    }
    
    return payload;
  }
}

export default TokenValidator;`}
        language="javascript"
        title="services/tokenValidator.js - Complete Token Validator"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`# services/token_validator.py
import time
import requests
import jwt
from jwt import PyJWKClient, ExpiredSignatureError, InvalidAudienceError

class TokenValidator:
    def __init__(self, domain: str, client_id: str):
        self.domain = domain
        self.client_id = client_id
        self._config = None
        self._jwks_client = None
    
    @property
    def config(self):
        """Lazy load OIDC configuration."""
        if self._config is None:
            response = requests.get(
                f"https://{self.domain}/.well-known/openid-configuration"
            )
            response.raise_for_status()
            self._config = response.json()
        return self._config
    
    @property
    def jwks_client(self):
        """Lazy load JWKS client."""
        if self._jwks_client is None:
            self._jwks_client = PyJWKClient(self.config["jwks_uri"])
        return self._jwks_client
    
    def validate_id_token(self, id_token: str) -> dict:
        """
        Validate an ID token and return the claims.
        
        Raises appropriate exceptions for validation failures.
        """
        try:
            # Get the signing key from JWKS
            signing_key = self.jwks_client.get_signing_key_from_jwt(id_token)
            
            # Verify and decode the token
            payload = jwt.decode(
                id_token,
                signing_key.key,
                algorithms=["RS256"],
                issuer=self.config["issuer"],
                audience=self.client_id,
            )
            
            # Additional validation
            if 'sub' not in payload:
                raise ValueError('Missing sub claim')
            
            return payload
            
        except ExpiredSignatureError:
            raise ValueError('Token has expired')
        except InvalidAudienceError:
            raise ValueError('Invalid audience')
        except jwt.InvalidIssuerError:
            raise ValueError('Invalid issuer')
        except Exception as e:
            raise ValueError(f'Token validation failed: {e}')`}
        language="python"
        title="services/token_validator.py - Complete Token Validator"
      />

      <h2>Step 3: Complete Validation Example</h2>

      <CodeBlock
        code={`// Example usage in Express route
import TokenValidator from './services/tokenValidator.js';

const validator = new TokenValidator(
  process.env.AUTH0_DOMAIN,
  process.env.AUTH0_CLIENT_ID
);

app.get('/callback', async (req, res) => {
  try {
    const { id_token } = await exchangeCodeForTokens(...);
    
    // Validate the ID token
    const claims = await validator.validateIdToken(id_token);
    
    console.log('Token validated successfully!');
    console.log('Subject:', claims.sub);
    console.log('Email:', claims.email);
    console.log('Issued at:', new Date(claims.iat * 1000));
    console.log('Expires:', new Date(claims.exp * 1000));
    
    // Token is valid - proceed with login
    req.session.user = {
      sub: claims.sub,
      email: claims.email,
    };
    
    res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Token validation failed:', error.message);
    res.status(401).send('Authentication failed');
  }
});`}
        language="javascript"
        title="Using Token Validator in Express"
      />

      <h2>Key Rotation Handling</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["🆕 New Key Added"] --> B["🔄 IDP starts using new key"]
    B --> C["👀 Old + New keys in JWKS"]
    C --> D["✅ RP fetches updated JWKS"]
    D --> E["🔑 Both keys work"]
    E --> F["⏰ Old key retired"]
    F --> G["✅ JWKS updated again"]
`} />

      <InfoBox type="info" title="Best Practice">
        <p>When implementing JWKS caching:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>Cache JWKS for a reasonable period (1-24 hours)</li>
          <li>Always have fallback - don&apos;t fail if refresh fails</li>
          <li>When receiving a &ldquo;kid not found&rdquo; error, try refreshing JWKS</li>
          <li>Support multiple active keys during key rotation</li>
        </ul>
      </InfoBox>

      <h2>Common Validation Errors</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Error</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cause</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Solution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Signature verification failed</td>
              <td className="border border-gray-300 px-4 py-2">Wrong key or tampered token</td>
              <td className="border border-gray-300 px-4 py-2">Refresh JWKS, check key kid</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Token expired</td>
              <td className="border border-gray-300 px-4 py-2">exp claim is in the past</td>
              <td className="border border-gray-300 px-4 py-2">Use refresh token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Invalid audience</td>
              <td className="border border-gray-300 px-4 py-2">aud claim doesn&apos;t match client_id</td>
              <td className="border border-gray-300 px-4 py-2">Check client_id configuration</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Invalid issuer</td>
              <td className="border border-gray-300 px-4 py-2">iss claim doesn&apos;t match IDP</td>
              <td className="border border-gray-300 px-4 py-2">Check domain configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - ID Token Validation
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/json-web-tokens/validate-json-web-tokens" target="_blank" rel="noopener noreferrer">
            Auth0 - Validate JSON Web Tokens
          </a>
        </li>
        <li>
          <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer">
            RFC 7519 - JWT
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/authorization-code-python', title: 'Auth Code (Python)' }}
        next={{ href: '/courses/openid-connect/labs/userinfo-endpoint', title: 'Lab: UserInfo Endpoint' }}
      />
    </div>
  );
}
