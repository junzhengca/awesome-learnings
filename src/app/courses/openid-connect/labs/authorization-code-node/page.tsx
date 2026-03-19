import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function AuthorizationCodeNodePage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 2: Authorization Code Flow - Node.js Implementation</h1>

      <p>
        In this lab, you&apos;ll implement the Authorization Code Flow in a Node.js/Express application. 
        This is the recommended flow for most web applications.
      </p>

      <InfoBox type="info" title="What You&apos;ll Learn">
        <ul className="list-disc ml-4">
          <li>Generate PKCE code verifier and challenge</li>
          <li>Construct the authorization URL</li>
          <li>Handle the callback and exchange code for tokens</li>
          <li>Validate the ID token</li>
          <li>Manage user sessions</li>
        </ul>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Completed Lab 1 (Auth0 Setup)</li>
        <li>Node.js 18+ installed</li>
        <li>Basic knowledge of Express.js</li>
      </ul>

      <h2>Project Setup</h2>

      <CodeBlock
        code={`# Create a new project
mkdir oidc-node-app && cd oidc-node-app
npm init -y

# Install dependencies
npm install express express-session cookie-parser
npm install axios cors jose dotenv
npm install --save-dev nodemon`}
        language="bash"
        title="Setup Node.js Project"
      />

      <h2>Step 1: Create Environment Configuration</h2>

      <CodeBlock
        code={`# .env file
PORT=3000
NODE_ENV=development

# Auth0 Configuration (from Lab 1)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Session secret (generate a random string for production)
SESSION_SECRET=your-session-secret-change-in-production`}
        language="bash"
        title=".env file"
      />

      <h2>Step 2: Create the PKCE Utility</h2>

      <p>PKCE (Proof Key for Code Exchange) adds security by preventing authorization code interception.</p>

      <CodeBlock
        code={`// utils/pkce.js
import crypto from 'crypto';

/**
 * Generate a random code verifier for PKCE
 */
export function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Generate a code challenge from verifier using S256 method
 */
export async function generateCodeChallenge(verifier) {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash.toString('base64url');
}

/**
 * Generate state parameter for CSRF protection
 */
export function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Store for PKCE verifiers and states
 * In production, use Redis or similar
 */
const pendingAuth = new Map();

export function storePendingAuth(state, data) {
  pendingAuth.set(state, data);
}

export function getPendingAuth(state) {
  const data = pendingAuth.get(state);
  pendingAuth.delete(state); // One-time use
  return data;
}`}
        language="javascript"
        title="utils/pkce.js"
      />

      <h2>Step 3: Create the OIDC Service</h2>

      <CodeBlock
        code={`// services/auth0.js
import axios from 'axios';
import { joseVerify } from 'jose';

let oidcConfig = null;

/**
 * Fetch and cache the OIDC discovery document
 */
export async function getOIDCConfiguration(domain) {
  if (oidcConfig) return oidcConfig;
  
  const response = await axios.get(\`https://\${domain}/.well-known/openid-configuration\`);
  oidcConfig = response.data;
  return oidcConfig;
}

/**
 * Get the authorization URL where users will be redirected
 */
export async function getAuthorizationUrl(domain, clientId, callbackUrl, state, codeChallenge) {
  const config = await getOIDCConfiguration(domain);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'openid profile email openid', // 'openid' is required!
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  
  return \`\${config.authorization_endpoint}?\${params.toString()}\`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(domain, clientId, clientSecret, callbackUrl, code, codeVerifier) {
  const config = await getOIDCConfiguration(domain);
  
  const response = await axios.post(config.token_endpoint, 
    new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      code: code,
      code_verifier: codeVerifier,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  return response.data;
}

/**
 * Fetch user info from the UserInfo endpoint
 */
export async function getUserInfo(domain, accessToken) {
  const config = await getOIDCConfiguration(domain);
  
  const response = await axios.get(config.userinfo_endpoint, {
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
    },
  });
  
  return response.data;
}

/**
 * Verify and decode the ID token
 */
export async function verifyIdToken(domain, clientId, idToken) {
  const config = await getOIDCConfiguration(domain);
  
  // Fetch the JWKS (JSON Web Key Set)
  const jwksResponse = await axios.get(config.jwks_uri);
  const { keys } = jwksResponse.data;
  
  // Create a JWKS key store
  const keyStore = new Map();
  for (const key of keys) {
    keyStore.set(key.kid, key);
  }
  
  // Get the key ID from the token header
  const [header] = idToken.split('.');
  const headerObj = JSON.parse(Buffer.from(header, 'base64url').toString());
  const kid = headerObj.kid;
  
  // Find the key
  const key = keyStore.get(kid);
  if (!key) {
    throw new Error('Key not found in JWKS');
  }
  
  // Verify using jose
  const publicKey = await joseVerify(idToken, key, {
    issuer: config.issuer,
    audience: clientId,
  });
  
  return publicKey.payload;
}`}
        language="javascript"
        title="services/auth0.js"
      />

      <h2>Step 4: Create the Express Application</h2>

      <CodeBlock
        code={`// app.js
import express from 'express';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { 
  getAuthorizationUrl, 
  exchangeCodeForTokens, 
  getUserInfo,
  verifyIdToken 
} from './services/auth0.js';
import { 
  generateCodeVerifier, 
  generateCodeChallenge, 
  generateState,
  storePendingAuth,
  getPendingAuth 
} from './utils/pkce.js';
import 'dotenv/config';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// In-memory store for PKCE verifiers (use Redis in production!)
const pkceStore = new Map();

/**
 * Login route - initiates the OIDC flow
 */
app.get('/login', async (req, res) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store for callback verification
    req.session.pkce = { codeVerifier, state };
    
    // Generate authorization URL
    const authUrl = await getAuthorizationUrl(
      process.env.AUTH0_DOMAIN,
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_CALLBACK_URL,
      state,
      codeChallenge
    );
    
    // Redirect to Auth0
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Login failed');
  }
});

/**
 * Callback route - handles the return from Auth0
 */
app.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const { codeVerifier, state: storedState } = req.session.pkce || {};
    
    // Verify state to prevent CSRF
    if (state !== storedState) {
      return res.status(400).send('State mismatch - possible CSRF attack');
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      process.env.AUTH0_DOMAIN,
      process.env.AUTH0_CLIENT_ID,
      process.env.AUTH0_CLIENT_SECRET,
      process.env.AUTH0_CALLBACK_URL,
      code,
      codeVerifier
    );
    
    // Verify and decode ID token
    const idTokenClaims = await verifyIdToken(
      process.env.AUTH0_DOMAIN,
      process.env.AUTH0_CLIENT_ID,
      tokens.id_token
    );
    
    // Optionally fetch additional user info
    const userInfo = await getUserInfo(
      process.env.AUTH0_DOMAIN,
      tokens.access_token
    );
    
    // Create session
    req.session.user = {
      sub: idTokenClaims.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
    req.session.tokens = {
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    };
    
    // Clean up PKCE data
    delete req.session.pkce;
    
    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

/**
 * Dashboard - protected route
 */
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  
  const user = req.session.user;
  res.send(\`
    <!DOCTYPE html>
    <html>
      <head><title>Dashboard</title></head>
      <body>
        <h1>Welcome, \${user.name}!</h1>
        <img src="\${user.picture}" alt="Profile" style="width:100px;border-radius:50%;" />
        <p>Email: \${user.email}</p>
        <p>Subject: \${user.sub}</p>
        <a href="/logout">Logout</a>
      </body>
    </html>
  \`);
});

/**
 * Logout route
 */
app.get('/logout', (req, res) => {
  req.session.destroy();
  
  // Redirect to Auth0 logout
  const logoutUrl = \`https://\${process.env.AUTH0_DOMAIN}/v2/logout\`;
  res.redirect(logoutUrl);
});

/**
 * Home route
 */
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  
  res.send(\`
    <!DOCTYPE html>
    <html>
      <head><title>OIDC Tutorial</title></head>
      <body>
        <h1>OpenID Connect Demo</h1>
        <p>This app demonstrates the Authorization Code Flow with PKCE.</p>
        <a href="/login"><button>Login with Auth0</button></a>
      </body>
    </html>
  \`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`}
        language="javascript"
        title="app.js - Complete Express OIDC App"
      />

      <h2>Step 5: Run the Application</h2>

      <CodeBlock
        code={`# Start the development server
npm run dev

# Or for production
npm start`}
        language="bash"
        title="Run the Application"
      />

      <h2>Flow Diagram</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant App as 📱 Express App
    participant Auth0 as 🏛️ Auth0
    
    U->>B: Visit /login
    B->>App: GET /login
    App->>App: Generate PKCE codes
    App->>B: 302 Redirect to Auth0
    B->>Auth0: Authorization Request
    
    Auth0->>U: Login Page
    U->>Auth0: Enter credentials
    Auth0->>Auth0: Verify credentials
    
    Auth0->>B: 302 Redirect to /callback?code=...
    B->>App: GET /callback?code=...
    App->>Auth0: POST /token (code + PKCE)
    Auth0->>App: Tokens (ID + Access)
    App->>Auth0: Verify ID Token (JWKS)
    Auth0->>App: Public Keys
    App->>App: Validate claims
    
    App->>B: Set session, redirect /dashboard
    B->>U: Show logged-in page
`} />

      <h2>Testing the Flow</h2>

      <ol>
        <li>Start the application: <code>npm run dev</code></li>
        <li>Open <code>http://localhost:3000</code> in your browser</li>
        <li>Click &ldquo;Login with Auth0&rdquo;</li>
        <li>You&apos;ll be redirected to Auth0</li>
        <li>Log in with your test user credentials</li>
        <li>You&apos;ll be redirected back to your app&apos;s dashboard</li>
        <li>You should see the user&apos;s name, email, and picture</li>
      </ol>

      <InfoBox type="success" title="Success Criteria">
        You&apos;ve successfully implemented the Authorization Code Flow with PKCE when:
        <ul className="list-disc ml-4 mt-2">
          <li>The login page redirects to Auth0</li>
          <li>After login, you see the dashboard with user info</li>
          <li>The ID token is properly verified</li>
          <li>Logout properly clears the session</li>
        </ul>
      </InfoBox>

      <hr />

      <h2>Key Takeaways</h2>

      <MermaidDiagram chart={`
flowchart TD
    A["🔐 Authorization Code Flow"] --> B["✅ Security Best Practices"]
    
    B --> C["🔑 PKCE prevents code interception"]
    B --> D["🛡️ State parameter prevents CSRF"]
    B --> E["📜 ID Token verification is mandatory"]
    B --> F["🔄 Refresh tokens for longevity"]
    
    C --> G["Generate random code_verifier"]
    C --> H["Hash to create code_challenge"]
    
    D --> I["Store state in session"]
    D --> J["Verify state on callback"]
    
    E --> K["Fetch JWKS from discovery"]
    E --> L["Verify signature with public key"]
    E --> M["Check iss, aud, exp claims"]
`} />

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Authorization Code Flow
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow" target="_blank" rel="noopener noreferrer">
            Auth0 - Authorization Code Flow
          </a>
        </li>
        <li>
          <a href="https://auth0.com/docs/secure/tokens/refresh-tokens" target="_blank" rel="noopener noreferrer">
            Auth0 - Refresh Tokens
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/setup-auth0', title: 'Setup Auth0' }}
        next={{ href: '/courses/openid-connect/labs/authorization-code-python', title: 'Lab: Auth Code (Python)' }}
      />
    </div>
  );
}
