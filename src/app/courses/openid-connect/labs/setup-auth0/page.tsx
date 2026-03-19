import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function SetupAuth0Page() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 1: Setting Up Auth0 as Your Identity Provider</h1>

      <p>
        In this lab, you&apos;ll set up Auth0 as your OpenID Connect Identity Provider. Auth0 provides 
        a free tier that&apos;s perfect for learning and development.
      </p>

      <InfoBox type="info" title="What You&apos;ll Learn">
        <ul className="list-disc ml-4">
          <li>Creating an Auth0 account and tenant</li>
          <li>Registering a new application</li>
          <li>Configuring callback and logout URLs</li>
          <li>Obtaining client credentials</li>
          <li>Understanding the Auth0 OIDC discovery document</li>
        </ul>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>A web browser</li>
        <li>An email address (for account creation)</li>
      </ul>

      <h2>Step 1: Create an Auth0 Account</h2>

      <ol>
        <li>Go to <a href="https://auth0.com/signup" target="_blank" rel="noopener noreferrer">auth0.com/signup</a></li>
        <li>Click &ldquo;Sign up&rdquo; and choose your preferred signup method</li>
        <li>Verify your email address</li>
        <li>You&apos;ll be redirected to the Auth0 Dashboard</li>
      </ol>

      <MermaidDiagram chart={`
flowchart LR
    A["📧 Email Signup"] --> B["✅ Verify Email"]
    B --> C["🏠 Auth0 Dashboard"]
    C --> D["📝 Create Application"]
`} />

      <h2>Step 2: Create a New Application</h2>

      <ol>
        <li>In the Auth0 Dashboard, click <strong>&ldquo;Applications&rdquo;</strong> in the left sidebar</li>
        <li>Click <strong>&ldquo;Create Application&rdquo;</strong></li>
        <li>Enter a name: <code>My OIDC Tutorial App</code></li>
        <li>Select <strong>&ldquo;Regular Web Applications&rdquo;</strong> (we&apos;ll implement a traditional web app flow)</li>
        <li>Click <strong>&ldquo;Create&rdquo;</strong></li>
      </ol>

      <InfoBox type="info" title="Application Type Selection">
        <p>For this tutorial, we&apos;re using <strong>Regular Web Applications</strong> because:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>It supports the Authorization Code Flow (recommended)</li>
          <li>Client secrets can be stored securely on the server</li>
          <li>Best security model for web applications</li>
        </ul>
      </InfoBox>

      <h2>Step 3: Configure Application Settings</h2>

      <p>After creating your application, you&apos;ll see the Quick Start tab. Click the <strong>&ldquo;Settings&rdquo;</strong> tab to configure:</p>

      <h3>Required Settings</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Setting</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Name</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>My OIDC Tutorial App</code></td>
              <td className="border border-gray-300 px-4 py-2">Your app&apos;s display name</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Domain</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>your-tenant.auth0.com</code></td>
              <td className="border border-gray-300 px-4 py-2">Your unique Auth0 domain (read-only)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Client ID</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>xxxxxxxxxxxxxxxxxx</code></td>
              <td className="border border-gray-300 px-4 py-2">Unique identifier for your app (copy this!)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Client Secret</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>••••••••••••</code></td>
              <td className="border border-gray-300 px-4 py-2">Keep this secret! (click to reveal)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Callback URL</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>http://localhost:3000/callback</code></td>
              <td className="border border-gray-300 px-4 py-2">Where Auth0 redirects after login</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Logout URL</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>http://localhost:3000</code></td>
              <td className="border border-gray-300 px-4 py-2">Where Auth0 redirects after logout</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Allowed Logout URLs</strong></td>
              <td className="border border-gray-300 px-4 py-2"><code>http://localhost:3000</code></td>
              <td className="border border-gray-300 px-4 py-2">URLs that can trigger logout</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="warning" title="Important">
        For development, use <code>http://localhost:port</code>. In production, always use HTTPS.
      </InfoBox>

      <h2>Step 4: Enable OAuth 2.0/API Settings</h2>

      <ol>
        <li>Scroll down to <strong>&ldquo;Advanced Settings&rdquo;</strong></li>
        <li>Click on <strong>&ldquo;OAuth & Social Networks&rdquo;</strong></li>
        <li>Ensure <strong>&ldquo;JSON Web Token (JWT) Signature Algorithm&rdquo;</strong> is set to <strong>&ldquo;RS256&rdquo;</strong></li>
        <li>Click <strong>&ldquo;Save Changes&rdquo;</strong></li>
      </ol>

      <h2>Step 5: Explore the Auth0 Discovery Document</h2>

      <p>Auth0 exposes a standard OIDC Discovery document. Let&apos;s verify it&apos;s working:</p>

      <CodeBlock
        code={`# Replace with your actual Auth0 domain
DOMAIN="your-tenant.auth0.com"

# Fetch the discovery document
curl "https://$DOMAIN/.well-known/openid-configuration" | jq .`}
        language="bash"
        title="Fetch Auth0 Discovery Document"
      />

      <p>You should see a response like this:</p>

      <CodeBlock
        code={`{
  "issuer": "https://your-tenant.auth0.com/",
  "authorization_endpoint": "https://your-tenant.auth0.com/authorize",
  "token_endpoint": "https://your-tenant.auth0.com/oauth/token",
  "userinfo_endpoint": "https://your-tenant.auth0.com/userinfo",
  "jwks_uri": "https://your-tenant.auth0.com/.well-known/jwks.json",
  "response_types_supported": ["code", "token", ...],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256", "HS256"],
  "scopes_supported": ["openid", "profile", "email", ...],
  ...
}`}
        language="json"
        title="Auth0 Discovery Document (partial)"
      />

      <MermaidDiagram chart={`
flowchart LR
    A["📱 Your App"] -->|"GET /.well-known/openid-configuration"| B["🔍 Auth0 Discovery"]
    B -->|"Config with endpoints"| A
    B -->|"jwks_uri"| C["🔑 JWKS"]
    B -->|"authorization_endpoint"| D["🔐 Auth Endpoint"]
    B -->|"token_endpoint"| E["🎫 Token Endpoint"]
`} />

      <h2>Step 6: Test Your Configuration</h2>

      <p>Let&apos;s verify your Auth0 domain is accessible:</p>

      <CodeBlock
        code={`# Replace with your actual domain
DOMAIN="your-tenant.auth0.com"

# Test 1: Discovery document
echo "Testing discovery document..."
curl -s "https://$DOMAIN/.well-known/openid-configuration" | jq '.issuer'

# Test 2: JWKS endpoint  
echo "Testing JWKS endpoint..."
curl -s "https://$DOMAIN/.well-known/jwks.json" | jq '.keys[0].kid'

# Test 3: Authorization endpoint
echo "Testing authorization endpoint..."
curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/authorize"`}
        language="bash"
        title="Test Auth0 Configuration"
      />

      <h2>Your Auth0 Configuration</h2>

      <InfoBox type="success" title="Configuration Complete!">
        <p>Save these values - you&apos;ll need them for the next labs:</p>
        <ul className="list-disc ml-4 mt-2">
          <li><strong>Domain:</strong> <code>your-tenant.auth0.com</code></li>
          <li><strong>Client ID:</strong> <code>xxxxxxxxxxxxxxxxxx</code></li>
          <li><strong>Client Secret:</strong> <code>your-client-secret</code></li>
          <li><strong>Callback URL:</strong> <code>http://localhost:3000/callback</code></li>
        </ul>
      </InfoBox>

      <h2>Understanding Auth0 vs Standard OIDC</h2>

      <p>Auth0 is an OIDC-compliant Identity Provider, but it adds some convenience features:</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Feature</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Standard OIDC</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Auth0</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Discovery Document</td>
              <td className="border border-gray-300 px-4 py-2">✅ Standard</td>
              <td className="border border-gray-300 px-4 py-2">✅ OIDC compliant</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">ID Token Format</td>
              <td className="border border-gray-300 px-4 py-2">JWT (RS256)</td>
              <td className="border border-gray-300 px-4 py-2">JWT (RS256)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">User Management</td>
              <td className="border border-gray-300 px-4 py-2">Varies by IDP</td>
              <td className="border border-gray-300 px-4 py-2">Built-in dashboard</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Social Login</td>
              <td className="border border-gray-300 px-4 py-2">Requires setup</td>
              <td className="border border-gray-300 px-4 py-2">One-click integration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr />

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://auth0.com/docs/get-started" target="_blank" rel="noopener noreferrer">
            Auth0 - Get Started
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/applications" target="_blank" rel="noopener noreferrer">
            Auth0 - Applications
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/applications/configure-applications-with-oidc-discovery" target="_blank" rel="noopener noreferrer">
            Auth0 - OIDC Discovery
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-discovery-1_0.html" target="_blank" rel="noopener noreferrer">
            OpenID Connect Discovery 1.0
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/discovery', title: 'Discovery' }}
        next={{ href: '/courses/openid-connect/labs/authorization-code-node', title: 'Lab: Auth Code (Node.js)' }}
      />
    </div>
  );
}
