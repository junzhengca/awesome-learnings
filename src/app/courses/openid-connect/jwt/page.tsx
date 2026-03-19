import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function JWTPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 3: Understanding JSON Web Tokens (JWTs)</h1>
      
      <p>
        JSON Web Tokens (JWTs, pronounced &ldquo;jots&rdquo;) are the foundational token format used by OpenID Connect. 
        Understanding JWTs is essential to mastering OpenID Connect.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer">
          RFC 7519 - JSON Web Token (JWT)
        </a>
      </InfoBox>

      <h2>What is a JWT?</h2>
      
      <blockquote>
        <p>
          &ldquo;JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred 
          between two parties.&rdquo;
        </p>
        <footer className="text-sm mt-2">— RFC 7519</footer>
      </blockquote>

      <MermaidDiagram chart={`
flowchart LR
    subgraph JWT["JWT Structure"]
        direction TB
        A["👤 Header"] --> B["📦 Payload"]
        B --> C["🔏 Signature"]
        
        A -->|"eyJhbGciOiJSUzI1NiJ9"| Part1
        B -->|"eyJzdWIiOiIxMjM0NTY3ODkwIn0"| Part2
        C -->|"SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"| Part3
        
        Part1 --> D["base64url encoded"]
        Part2 --> D
        C --> D
    end
    
    D --> E["jwt.example.com"]
`} />

      <p>
        A JWT is a <strong>compact, self-contained</strong> token that contains claims (information) about a user. 
        It&apos;s commonly used for authentication because it&apos;s:
      </p>
      <ul>
        <li><strong>Compact</strong> - Small enough to pass in URLs, headers, or request bodies</li>
        <li><strong>Self-contained</strong> - Contains all the information needed to verify identity</li>
        <li><strong>Verifiable</strong> - Can be cryptographically signed to prevent tampering</li>
      </ul>

      <InfoBox type="info" title="JWT vs OIDC">
        In OpenID Connect, the <strong>ID Token</strong> is always a JWT. The <strong>Access Token</strong> 
        may or may not be a JWT depending on the Identity Provider&apos;s implementation.
      </InfoBox>

      <h2>Anatomy of a JWT</h2>

      <p>A JWT has three parts, separated by dots (<code>.</code>):</p>

      <MermaidDiagram chart={`
flowchart LR
    A["eyJhbGciOiJSUzI1NiJ9"] -->|Header| B["eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9"] 
    B -->|Payload| C["SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"]
    C -->|Signature| D["🔐"]
    
    B --- E["."]
    A --- E
    E --- C
    
    style A fill:#fee2e2
    style B fill:#fef3c7
    style C fill:#d1fae5
`} />

      <h3>1. Header (JSON)</h3>
      <p>The header typically contains two parts:</p>
      <ul>
        <li><code>alg</code> - The algorithm used to sign the token (e.g., RS256)</li>
        <li><code>typ</code> - The type of token (usually &ldquo;JWT&rdquo;)</li>
      </ul>

      <CodeBlock
        code={`{
  "alg": "RS256",
  "typ": "JWT"
}`}
        language="json"
        title="JWT Header Example"
      />

      <h3>2. Payload (JSON - The Claims)</h3>
      <p>The payload contains the &ldquo;claims&rdquo; - statements about the user and the token.</p>

      <CodeBlock
        code={`{
  "sub": "user_12345",
  "name": "John Doe",
  "email": "john@example.com",
  "iat": 1516239022,
  "exp": 1516242622
}`}
        language="json"
        title="JWT Payload Example"
      />

      <h3>3. Signature</h3>
      <p>
        The signature is created by Base64URL-encoding the header and payload, concatenating them 
        with a dot, and signing with the algorithm specified in the header.
      </p>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Signature["Creating the Signature"]
        A["📦 Header (Base64URL)"] --> C["🔗 Concatenate"]
        B["📦 Payload (Base64URL)"] --> C
        C --> D["📝 Sign with Private Key"]
        D --> E["🔏 Signature (Base64URL)"]
    end
`} />

      <h2>Registered Claims (Standard)</h2>

      <p>The JWT specification defines several &ldquo;registered claims&rdquo;:</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Claim</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>iss</code></td>
              <td className="border border-gray-300 px-4 py-2">Issuer</td>
              <td className="border border-gray-300 px-4 py-2">Who issued this token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>sub</code></td>
              <td className="border border-gray-300 px-4 py-2">Subject</td>
              <td className="border border-gray-300 px-4 py-2">The user identifier</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>aud</code></td>
              <td className="border border-gray-300 px-4 py-2">Audience</td>
              <td className="border border-gray-300 px-4 py-2">Who this token is intended for</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>exp</code></td>
              <td className="border border-gray-300 px-4 py-2">Expiration Time</td>
              <td className="border border-gray-300 px-4 py-2">When the token expires (Unix timestamp)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>nbf</code></td>
              <td className="border border-gray-300 px-4 py-2">Not Before</td>
              <td className="border border-gray-300 px-4 py-2">When the token becomes valid</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>iat</code></td>
              <td className="border border-gray-300 px-4 py-2">Issued At</td>
              <td className="border border-gray-300 px-4 py-2">When the token was issued</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>jti</code></td>
              <td className="border border-gray-300 px-4 py-2">JWT ID</td>
              <td className="border border-gray-300 px-4 py-2">Unique identifier for this token</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>OIDC-Specific Claims in ID Token</h2>

      <p>OpenID Connect defines additional claims for the ID Token:</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Claim</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Required?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>auth_time</code></td>
              <td className="border border-gray-300 px-4 py-2">Time of user authentication</td>
              <td className="border border-gray-300 px-4 py-2">Conditional</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>nonce</code></td>
              <td className="border border-gray-300 px-4 py-2">Value to associate with session</td>
              <td className="border border-gray-300 px-4 py-2">Conditional</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>acr</code></td>
              <td className="border border-gray-300 px-4 py-2">Authentication Context Class Reference</td>
              <td className="border border-gray-300 px-4 py-2">Optional</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>amr</code></td>
              <td className="border border-gray-300 px-4 py-2">Authentication Methods References</td>
              <td className="border border-gray-300 px-4 py-2">Optional</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>azp</code></td>
              <td className="border border-gray-300 px-4 py-2">Authorized Party</td>
              <td className="border border-gray-300 px-4 py-2">Optional</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="Complete ID Token Example">
        See <a href="https://openid.net/specs/openid-connect-core-1_0.html#IDToken" target="_blank" rel="noopener noreferrer">
          Section 2 of OpenID Connect Core 1.0
        </a> for the complete specification.
      </InfoBox>

      <h2>Signing Algorithms</h2>

      <p>JWTs can be signed using different algorithms:</p>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Algorithms["Signing Algorithms"]
        subgraph Asymmetric["Asymmetric (Public/Private Key)"]
            RS["RS256 - RSA Signature"]
            ES["ES256 - ECDSA"]
        end
        
        subgraph Symmetric["Symmetric (Shared Secret)"]
            HS["HS256 - HMAC"]
        end
        
        subgraph Special["Special"]
            NONE["none - No Signature (⚠️)"]
        end
    end
`} />

      <h3>RS256 (RSA Signature with SHA-256)</h3>
      <p>
        <strong>Recommended for most applications.</strong> Uses a public/private key pair where:
      </p>
      <ul>
        <li>The <strong>Identity Provider</strong> signs with the <strong>private key</strong></li>
        <li>Your application verifies with the <strong>public key</strong></li>
      </ul>

      <h3>ES256 (ECDSA with SHA-256)</h3>
      <p>
        Similar to RS256 but uses elliptic curve cryptography. Produces smaller signatures 
        but may have less library support.
      </p>

      <h3>HS256 (HMAC with SHA-256)</h3>
      <p>
        Uses a shared secret key. The same key is used to sign AND verify. Generally only used 
        when the token consumer and producer are the same entity.
      </p>

      <InfoBox type="warning" title="Security Warning">
        Never use <code>alg: none</code> in production. This allows attackers to craft tokens 
        that bypass signature verification.
      </InfoBox>

      <h2>Decoding and Verifying JWTs</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`// Install: npm install jsonwebtoken
import jwt from 'jsonwebtoken';

// Your ID Token (this is what you receive from OIDC)
const idToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';

// Decode without verification (to see contents)
const decoded = jwt.decode(idToken, { complete: true });
console.log(decoded.header);
console.log(decoded.payload);
console.log(decoded.signature);

// Verify and decode
const publicKey = \`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----\`;

try {
  const verified = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://your-idp.com',
    audience: 'your-client-id'
  });
  console.log('✅ Token is valid!');
  console.log(verified);
} catch (err) {
  console.log('❌ Token verification failed:', err.message);
}`}
        language="javascript"
        title="Node.js - Decode and Verify JWT"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`# Install: pip install PyJWT cryptography
import jwt
from jwt import PyJWKClient

# Your ID Token
id_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'

# For RS256, you need the public key from JWKS endpoint
# This is typically found in the OIDC discovery document
jwks_url = 'https://your-idp.com/.well-known/jwks.json'
jwk_client = PyJWKClient(jwks_url)

try:
    # Get the signing key
    signing_key = jwk_client.get_signing_key_from_jwt(id_token)
    
    # Verify and decode
    payload = jwt.decode(
        id_token,
        signing_key.key,
        algorithms=['RS256'],
        issuer='https://your-idp.com',
        audience='your-client-id'
    )
    print('✅ Token is valid!')
    print(payload)
except jwt.ExpiredSignatureError:
    print('❌ Token has expired')
except jwt.InvalidTokenError as e:
    print(f'❌ Token verification failed: {e}')`}
        language="python"
        title="Python - Verify JWT"
      />

      <h3>Manual Base64URL Decoding (Educational)</h3>

      <CodeBlock
        code={`// JWT parts: header.payload.signature
const token = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function base64UrlDecode(str) {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  
  // Decode
  return atob(str);
}

// Split and decode
const [headerB64, payloadB64, signatureB64] = token.split('.');

const header = JSON.parse(base64UrlDecode(headerB64));
const payload = JSON.parse(base64UrlDecode(payloadB64));
const signature = base64UrlDecode(signatureB64);

console.log('Header:', header); // { alg: 'RS256', typ: 'JWT' }
console.log('Payload:', payload); // { sub: '1234567890', ... }
console.log('Signature:', signature); // ArrayBuffer of signature bytes`}
        language="javascript"
        title="Manual JWT Decoding (Educational Only)"
      />

      <h2>JWT Claims Validation Checklist</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["📥 Receive ID Token"] --> B{"✅ exp (Expiration)"}
    B -->|Valid| C["✅ iss (Issuer)"]
    B -->|Invalid| Z["❌ Reject Token"]
    C -->|Valid| D["✅ aud (Audience)"]
    C -->|Invalid| Z
    D -->|Valid| E["✅ alg (Algorithm)"]
    D -->|Invalid| Z
    E -->|Valid| F["✅ Signature"]
    E -->|Invalid| Z
    F -->|Valid| G["✅ nonce (if present)"]
    F -->|Invalid| Z
    G -->|Valid| H["✅ auth_time (if requested)"]
    G -->|Invalid| Z
    H -->|Valid| I["✅ Token Successfully Validated"]
    H -->|Invalid| Z
`} />

      <InfoBox type="warning" title="Critical Security Points">
        <ol className="list-decimal ml-4">
          <li><strong>Always validate the signature</strong> with the OP&apos;s public key</li>
          <li><strong>Always check expiration (exp)</strong> - reject expired tokens</li>
          <li><strong>Always verify issuer (iss)</strong> - ensure it matches expected</li>
          <li><strong>Always verify audience (aud)</strong> - ensure it&apos;s your client_id</li>
          <li><strong>Validate the algorithm</strong> - reject &ldquo;none&rdquo; algorithm</li>
          <li><strong>Check nonce</strong> - if present in request, must match in token</li>
        </ol>
      </InfoBox>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer">
            RFC 7519 - JSON Web Token (JWT)
          </a>
        </li>
        <li>
          <a href="https://datatracker.ietf.org/doc/html/rfc7515" target="_blank" rel="noopener noreferrer">
            RFC 7515 - JSON Web Signature (JWS)
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/json-web-tokens" target="_blank" rel="noopener noreferrer">
            Auth0 - JSON Web Tokens
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#IDToken" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - ID Token
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/core-concepts', title: 'Core Concepts' }}
        next={{ href: '/courses/openid-connect/flows', title: 'Authentication Flows' }}
      />
    </div>
  );
}
