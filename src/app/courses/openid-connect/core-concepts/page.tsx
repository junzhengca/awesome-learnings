import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';

export default function CoreConceptsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Section 2: Core Concepts & Terminology</h1>
      
      <p>
        Understanding OpenID Connect requires mastering a set of key terminology. These terms are used 
        throughout the specification and this tutorial. The OpenID Connect Core 1.0 specification 
        is very precise about these definitions.
      </p>

      <InfoBox type="source" title="Source">
        <a href="https://openid.net/specs/openid-connect-core-1_0.html#Terminology" target="_blank" rel="noopener noreferrer">
          OpenID Connect Core 1.0 - Section 1.2 Terminology
        </a>
      </InfoBox>

      <h2>The Key Players</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph OIDC_Ecosystem["OpenID Connect Ecosystem"]
        subgraph EndUser["🏢 Organization"]
            OP["🏛️ OpenID Provider (OP)"]
            IDP["🔐 Identity Provider (IDP)"]
        end
        
        subgraph Developer["👨‍💻 Developer"]
            RP["📱 Relying Party (RP)"]
            Client["💻 Client Application"]
        end
        
        subgraph User["👤 User"]
            EU["👤 End-User"]
        end
        
        OP --- IDP
        RP --- Client
        RP -->|"Authenticate & Provide Identity"| EU
        OP -->|"Verify & Issue Tokens"| RP
    end
`} />

      <h3>End-User (EU)</h3>
      <blockquote>
        <p><em>&ldquo;Human participant.&rdquo;</em></p>
      </blockquote>
      <p>
        The human being who wants to authenticate. When you log into an app with Google, 
        you are the End-User.
      </p>

      <h3>Relying Party (RP)</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 Client application requiring End-User Authentication and Claims from an OpenID Provider.&rdquo;</em></p>
      </blockquote>
      <p>
        This is YOUR application - the website or app that wants to know who the user is. 
        The term &ldquo;Relying Party&rdquo; comes from the fact that your app relies on the Identity Provider 
        to verify the user&apos;s identity.
      </p>

      <h3>OpenID Provider (OP)</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 Authorization Server that is capable of Authenticating the End-User and providing Claims to a Relying Party about the Authentication event and the End-User.&rdquo;</em></p>
      </blockquote>
      <p>
        The trusted identity service. Examples: Auth0, Okta, Google, Microsoft Entra ID, Keycloak.
      </p>

      <h3>Identity Provider (IDP)</h3>
      <p>
        Sometimes used interchangeably with OpenID Provider. The Identity Provider is the entity 
        that stores and manages identity information. In enterprise contexts, you&apos;ll often 
        see &ldquo;IDP&rdquo; used more frequently than &ldquo;OP&rdquo;.
      </p>

      <h3>Client</h3>
      <p>
        Same as Relying Party. In OAuth 2.0 terminology, the Client is the application requesting 
        access to resources. In OpenID Connect, the Client is specifically requesting identity information.
      </p>

      <hr />

      <h2>The Tokens</h2>

      <MermaidDiagram chart={`
flowchart LR
    subgraph Tokens["Token Types"]
        IDT["🎫 ID Token"]
        AT["🔑 Access Token"]
        RT["🔄 Refresh Token"]
    end
    
    IDT -->|"Contains"| Claims["👤 User Claims"]
    AT -->|"Grants"| Access["📊 API Access"]
    RT -->|"Renew"| AT
`} />

      <h3>ID Token</h3>
      <blockquote>
        <p><em>&ldquo;JSON Web Token (JWT) that contains Claims about the Authentication event. It MAY contain other Claims.&rdquo;</em></p>
      </blockquote>
      <p>
        The ID Token is the heart of OpenID Connect. It&apos;s a JWT that proves the user has been 
        authenticated. It contains:
      </p>
      <ul>
        <li><strong>sub</strong> - Unique user identifier</li>
        <li><strong>iss</strong> - Who issued this token</li>
        <li><strong>aud</strong> - Who this token is for (your app)</li>
        <li><strong>exp</strong> - When the token expires</li>
        <li><strong>iat</strong> - When the token was issued</li>
        <li><strong>auth_time</strong> - When the user authenticated</li>
      </ul>

      <h3>Access Token</h3>
      <blockquote>
        <p><em>&ldquo;Authorization credential, in the form of an opaque string or JWT, used to access an API.&rdquo;</em></p>
      </blockquote>
      <p>
        The Access Token is used to call APIs after authentication. It tells the API who you are 
        (in OIDC context) and what permissions you have. Unlike the ID Token, the Access Token 
        is meant for machine-to-machine communication.
      </p>

      <h3>Refresh Token</h3>
      <blockquote>
        <p><em>&ldquo;Token that can be used to obtain a new Access Token.&rdquo;</em></p>
      </blockquote>
      <p>
        Long-lived token that allows your app to get new Access Tokens without requiring the 
        user to log in again. Typically valid for days or weeks.
      </p>

      <InfoBox type="warning" title="Token Security">
        <ul className="list-disc ml-4">
          <li><strong>ID Tokens</strong> - Must be validated by YOUR application</li>
          <li><strong>Access Tokens</strong> - Used to call APIs, validated by the API</li>
          <li><strong>Refresh Tokens</strong> - Should be stored securely, never expose to browsers</li>
        </ul>
      </InfoBox>

      <hr />

      <h2>Claims</h2>
      <blockquote>
        <p><em>&ldquo;Piece of information asserted about an Entity.&rdquo;</em></p>
      </blockquote>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Claims["Claims in ID Token"]
        Standard["📋 Standard Claims"]
        Custom["🎨 Custom Claims"]
        
        Standard -->|sub]
        Standard -->|name]
        Standard -->|email]
        Standard -->|picture]
        
        Custom -->|Any custom data]
    end
`} />

      <h3>Standard Claims</h3>
      <p>The OpenID Connect specification defines a set of standard claims:</p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Claim</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>sub</code></td>
              <td className="border border-gray-300 px-4 py-2">Subject (unique user ID)</td>
              <td className="border border-gray-300 px-4 py-2"><code>user_123</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>name</code></td>
              <td className="border border-gray-300 px-4 py-2">Full name</td>
              <td className="border border-gray-300 px-4 py-2"><code>John Doe</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>given_name</code></td>
              <td className="border border-gray-300 px-4 py-2">First name</td>
              <td className="border border-gray-300 px-4 py-2"><code>John</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>family_name</code></td>
              <td className="border border-gray-300 px-4 py-2">Last name</td>
              <td className="border border-gray-300 px-4 py-2"><code>Doe</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email</code></td>
              <td className="border border-gray-300 px-4 py-2">Email address</td>
              <td className="border border-gray-300 px-4 py-2"><code>john@example.com</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email_verified</code></td>
              <td className="border border-gray-300 px-4 py-2">Email verified?</td>
              <td className="border border-gray-300 px-4 py-2"><code>true</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>picture</code></td>
              <td className="border border-gray-300 px-4 py-2">Profile picture URL</td>
              <td className="border border-gray-300 px-4 py-2"><code>https://...</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>locale</code></td>
              <td className="border border-gray-300 px-4 py-2">User&apos;s locale</td>
              <td className="border border-gray-300 px-4 py-2"><code>en-US</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Essential vs Voluntary Claims</h3>
      <ul>
        <li><strong>Essential Claim</strong> - Required for the specific task (e.g., email for login)</li>
        <li><strong>Voluntary Claim</strong> - Nice to have but not required</li>
      </ul>

      <hr />

      <h2>Endpoints</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant RP as 📱 Relying Party
    participant Auth as 🔐 Authorization Endpoint
    participant Token as 🎫 Token Endpoint
    participant UserInfo as 👤 UserInfo Endpoint
    
    RP->>Auth: Authorization Request
    Auth-->>RP: Authorization Code
    RP->>Token: Code + Client Credentials
    Token-->>RP: ID Token + Access Token
    RP->>UserInfo: Access Token
    UserInfo-->>RP: User Claims
`} />

      <h3>Authorization Endpoint</h3>
      <p>
        The endpoint where the user authenticates. Your app redirects the user here to log in.
      </p>
      <p><strong>Used for:</strong> Initiating authentication</p>

      <h3>Token Endpoint</h3>
      <p>
        The endpoint where tokens are issued. Used to exchange the authorization code for tokens.
      </p>
      <p><strong>Used for:</strong> Getting/refresh tokens</p>

      <h3>UserInfo Endpoint</h3>
      <p>
        An OAuth 2.0 protected resource that returns identity information about the user.
      </p>
      <p><strong>Used for:</strong> Getting additional user claims</p>

      <h3>Discovery Endpoint</h3>
      <p>
        Metadata endpoint at <code>/.well-known/openid-configuration</code> that provides 
        all the necessary OIDC provider information.
      </p>
      <p><strong>Used for:</strong> Auto-discovery of endpoints and capabilities</p>

      <hr />

      <h2>Scopes</h2>
      <blockquote>
        <p><em>&ldquo;Space-delimited case-sensitive list of ASCII strings that allows the Client to request the use of Claims.&rdquo;</em></p>
      </blockquote>

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
              <td className="border border-gray-300 px-4 py-2">Required for OIDC. Returns <code>sub</code> claim.</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>profile</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>name</code>, <code>family_name</code>, <code>given_name</code>, <code>locale</code>, <code>picture</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>email</code></td>
              <td className="border border-gray-300 px-4 py-2"><code>email</code>, <code>email_verified</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code>offline_access</code></td>
              <td className="border border-gray-300 px-4 py-2">Enables refresh tokens</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox type="info" title="Important">
        The <code>openid</code> scope is MANDATORY for OpenID Connect. Without it, 
        you&apos;re just using plain OAuth 2.0, not OpenID Connect.
      </InfoBox>

      <hr />

      <h2>Flow Terminology</h2>

      <h3>Authentication Request</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 Authorization Request using extension parameters and scopes defined by OpenID Connect to request that the End-User be authenticated.&rdquo;</em></p>
      </blockquote>

      <h3>Authorization Code Flow</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint and all tokens are returned from the Token Endpoint.&rdquo;</em></p>
      </blockquote>
      <p>This is the <strong>recommended</strong> flow for most applications.</p>

      <h3>Implicit Flow</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 flow in which all tokens are returned from the Authorization Endpoint and neither the Token Endpoint nor an Authorization Code are used.&rdquo;</em></p>
      </blockquote>
      <p>This flow is <strong>not recommended</strong> for new applications due to security concerns.</p>

      <h3>Hybrid Flow</h3>
      <blockquote>
        <p><em>&ldquo;OAuth 2.0 flow in which an Authorization Code is returned from the Authorization Endpoint, some tokens are returned from the Authorization Endpoint, and others are returned from the Token Endpoint.&rdquo;</em></p>
      </blockquote>

      <hr />

      <h2>Quick Reference: The OIDC Ecosystem</h2>

      <MermaidDiagram chart={`
flowchart TB
    subgraph Actors
        EU["👤 End-User"]
        RP["📱 Relying Party"]
        OP["🏛️ OpenID Provider"]
    end
    
    subgraph Tokens
        IDT["🎫 ID Token (JWT)"]
        AT["🔑 Access Token"]
        RT["🔄 Refresh Token"]
    end
    
    subgraph Endpoints
        Auth["🔐 Authorization Endpoint"]
        Token["🎫 Token Endpoint"]
        UserInfo["👤 UserInfo Endpoint"]
        Disco["📡 Discovery Endpoint"]
    end
    
    subgraph Claims
        STD["📋 Standard Claims"]
        CUST["🎨 Custom Claims"]
    end
    
    EU <-->|1. Auth Request| RP
    RP <-->|2. Tokens| OP
    IDT -->|Contains| STD
    AT -->|Grants| CUST
`} />

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#Terminology" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Section 1.2 Terminology
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Standard Claims
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow" target="_blank" rel="noopener noreferrer">
            Auth0 - Authorization Code Flow
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/introduction', title: 'Introduction' }}
        next={{ href: '/courses/openid-connect/jwt', title: 'JSON Web Tokens' }}
      />
    </div>
  );
}
