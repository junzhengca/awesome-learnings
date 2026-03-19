import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function UserInfoEndpointPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 5: UserInfo Endpoint</h1>

      <p>
        The UserInfo Endpoint provides a standardized way to retrieve additional user claims 
        after authentication. While the ID Token contains some claims, the UserInfo Endpoint 
        provides more detailed information.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-core-1_0.html#UserInfo" target="_blank" rel="noopener noreferrer">
          OpenID Connect Core 1.0 - Section 5.3 UserInfo Endpoint
        </a>
      </InfoBox>

      <h2>What is the UserInfo Endpoint?</h2>

      <MermaidDiagram chart={`
flowchart LR
    A["📱 Relying Party"] -->|"Access Token"| B["👤 UserInfo Endpoint"]
    B -->|"User Claims"| A
    B -->|"🛡️ Protected Resource"| C["👤 Claims about User"]
`} />

      <blockquote>
        <p>
          <em>
            &ldquo;The UserInfo Endpoint is a protected OAuth 2.0 resource that returns authorized claims 
            about the End-User represented by the corresponding authorization.&rdquo;
          </em>
        </p>
        <footer className="text-sm mt-2">— OpenID Connect Core 1.0</footer>
      </blockquote>

      <h2>UserInfo vs ID Token Claims</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ID Token</th>
              <th className="border border-gray-300 px-4 py-2 text-left">UserInfo Endpoint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Format</strong></td>
              <td className="border border-gray-300 px-4 py-2">Signed JWT</td>
              <td className="border border-gray-300 px-4 py-2">JSON object</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Transmission</strong></td>
              <td className="border border-gray-300 px-4 py-2">Part of OAuth flow</td>
              <td className="border border-gray-300 px-4 py-2">Requires Access Token</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>Contents</strong></td>
              <td className="border border-gray-300 px-4 py-2">Auth event + basic claims</td>
              <td className="border border-gray-300 px-4 py-2">More comprehensive user data</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><strong>When to use</strong></td>
              <td className="border border-gray-300 px-4 py-2">Quick auth verification</td>
              <td className="border border-gray-300 px-4 py-2">Getting full user profile</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Standard Claims from UserInfo Endpoint</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Claim</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>sub</code></td>
              <td className="border border-gray-300 px-4 py-2">Subject identifier (same as ID Token)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>name</code></td>
              <td className="border border-gray-300 px-4 py-2">Full name of the user</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>given_name</code></td>
              <td className="border border-gray-300 px-4 py-2">First name</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>family_name</code></td>
              <td className="border border-gray-300 px-4 py-2">Last name</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>middle_name</code></td>
              <td className="border border-gray-300 px-4 py-2">Middle name</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>nickname</code></td>
              <td className="border border-gray-300 px-4 py-2">Casual name</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>preferred_username</code></td>
              <td className="border border-gray-300 px-4 py-2">Claimed username</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>profile</code></td>
              <td className="border border-gray-300 px-4 py-2">Profile page URL</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>picture</code></td>
              <td className="border border-gray-300 px-4 py-2">Profile picture URL</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>website</code></td>
              <td className="border border-gray-300 px-4 py-2">Website URL</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email</code></td>
              <td className="border border-gray-300 px-4 py-2">Email address</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email_verified</code></td>
              <td className="border border-gray-300 px-4 py-2">Whether email is verified</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>gender</code></td>
              <td className="border border-gray-300 px-4 py-2">Gender</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>birthdate</code></td>
              <td className="border border-gray-300 px-4 py-2">Birthdate (YYYY-MM-DD)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>zoneinfo</code></td>
              <td className="border border-gray-300 px-4 py-2">Timezone string</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>locale</code></td>
              <td className="border border-gray-300 px-4 py-2">Language/location</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>phone_number</code></td>
              <td className="border border-gray-300 px-4 py-2">Phone number</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>phone_number_verified</code></td>
              <td className="border border-gray-300 px-4 py-2">Whether phone is verified</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>address</code></td>
              <td className="border border-gray-300 px-4 py-2">Physical mailing address</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>updated_at</code></td>
              <td className="border border-gray-300 px-4 py-2">Last update timestamp</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Calling the UserInfo Endpoint</h2>

      <h3>Node.js Example</h3>

      <CodeBlock
        code={`// Fetch user info from the UserInfo endpoint
async function getUserInfo(domain, accessToken) {
  // First, get the OIDC configuration
  const config = await getOIDCConfiguration(domain);
  
  // Call the UserInfo endpoint with the access token
  const response = await fetch(config.userinfo_endpoint, {
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
      Accept: 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(\`UserInfo request failed: \${response.status}\`);
  }
  
  const userInfo = await response.json();
  
  // Validate that sub matches the one in ID token
  // This prevents token substitution attacks
  return userInfo;
}

// Usage after receiving tokens
async function handleCallback(req, res) {
  const { access_token, id_token } = await exchangeCodeForTokens(...);
  
  // Decode ID token to get expected sub
  const idTokenClaims = decodeJwt(id_token);
  
  // Fetch user info
  const userInfo = await getUserInfo(process.env.AUTH0_DOMAIN, access_token);
  
  // CRITICAL: Verify sub matches
  if (userInfo.sub !== idTokenClaims.sub) {
    throw new Error('Subject mismatch - possible token substitution attack!');
  }
  
  console.log('User info:', userInfo);
  // { sub: '...', name: 'John Doe', email: 'john@example.com', ... }
}`}
        language="javascript"
        title="Fetch UserInfo - Node.js"
      />

      <h3>Python Example</h3>

      <CodeBlock
        code={`import requests

def get_user_info(domain: str, access_token: str) -> dict:
    """
    Fetch user info from the UserInfo endpoint.
    """
    # Get OIDC configuration
    config_response = requests.get(
        f"https://{domain}/.well-known/openid-configuration"
    )
    config = config_response.json()
    
    # Call UserInfo endpoint
    response = requests.get(
        config["userinfo_endpoint"],
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
    )
    
    response.raise_for_status()
    return response.json()


def handle_callback(id_token_claims: dict, access_token: str):
    """
    Handle callback with proper validation.
    """
    # Get user info
    user_info = get_user_info(os.getenv("AUTH0_DOMAIN"), access_token)
    
    # CRITICAL: Verify sub matches
    if user_info["sub"] != id_token_claims["sub"]:
        raise ValueError("Subject mismatch - possible token substitution attack!")
    
    print("User info:", user_info)
    return user_info`}
        language="python"
        title="Fetch UserInfo - Python"
      />

      <h2>UserInfo Flow Diagram</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant OP as 🏛️ OpenID Provider
    participant User as 👤 UserInfo Endpoint
    
    Note over RP,OP: Authentication complete
    RP->>OP: Code Exchange
    OP->>RP: ID Token + Access Token
    
    Note over RP,User: UserInfo Request
    RP->>User: GET /userinfo<br/>Authorization: Bearer {access_token}
    User->>OP: Validate Access Token
    User->>User: Verify scope (openid profile)
    User->>RP: User Claims (JSON)
    
    Note over RP: Sub matches ID Token sub?
    RP->>RP: Validate sub claim
`} />

      <h2>Scope vs Claims</h2>

      <p>The claims you receive depend on the scopes requested:</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Scope</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Claims Returned</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>openid</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>sub</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>profile</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>name</code>, <code>family_name</code>, <code>given_name</code>, <code>middle_name</code>, <code>nickname</code>, <code>preferred_username</code>, <code>profile</code>, <code>picture</code>, <code>website</code>, <code>gender</code>, <code>birthdate</code>, <code>zoneinfo</code>, <code>locale</code>, <code>updated_at</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>email</code>, <code>email_verified</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>address</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>address</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>phone</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>phone_number</code>, <code>phone_number_verified</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="Best Practice">
        Always request the minimum scopes needed. Request only <code>openid profile email</code> 
        if you only need the user&apos;s basic profile information.
      </InfoBox>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#UserInfo" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 5.3 UserInfo Endpoint
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 5.4 Requesting Claims using Scope Values
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/token-validation', title: 'Token Validation' }}
        next={{ href: '/courses/openid-connect/labs/refresh-tokens', title: 'Lab: Refresh Tokens' }}
      />
    </div>
  );
}
