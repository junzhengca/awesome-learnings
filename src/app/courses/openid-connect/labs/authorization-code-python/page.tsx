import LessonNav from '@/components/LessonNav';
import MermaidDiagram from '@/components/MermaidDiagram';
import InfoBox from '@/components/InfoBox';
import CodeBlock from '@/components/CodeBlock';

export default function AuthorizationCodePythonPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Lab 3: Authorization Code Flow - Python Implementation</h1>

      <p>
        In this lab, you&apos;ll implement the Authorization Code Flow using Python with Flask. 
        This provides the same functionality as the Node.js version but in Python.
      </p>

      <InfoBox type="info" title="What You&apos;ll Learn">
        <ul className="list-disc ml-4">
          <li>Implement OIDC Authorization Code Flow in Python</li>
          <li>Use the requests library for HTTP calls</li>
          <li>Work with JWTs using PyJWT and cryptography</li>
          <li>Create a Flask-based web application</li>
        </ul>
      </InfoBox>

      <h2>Prerequisites</h2>
      <ul>
        <li>Completed Lab 1 (Auth0 Setup)</li>
        <li>Python 3.9+ installed</li>
        <li>Basic knowledge of Flask</li>
      </ul>

      <h2>Project Setup</h2>

      <CodeBlock
        code={`# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install flask requests pyjwt cryptography python-dotenv`}
        language="bash"
        title="Setup Python Project"
      />

      <h2>Step 1: Create Environment Configuration</h2>

      <CodeBlock
        code={`# .env file
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production

# Auth0 Configuration (from Lab 1)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_CALLBACK_URL=http://localhost:5000/callback`}
        language="bash"
        title=".env file"
      />

      <h2>Step 2: Create the PKCE Utility</h2>

      <CodeBlock
        code={`# utils/pkce.py
import secrets
import hashlib
import base64


def generate_code_verifier(length: int = 64) -> str:
    """
    Generate a random code verifier for PKCE.
    Must be between 43-128 characters.
    """
    return base64.urlsafe_b64encode(
        secrets.token_bytes(length)
    ).rstrip(b'=').decode('utf-8')


def generate_code_challenge(code_verifier: str) -> str:
    """
    Generate S256 code challenge from verifier.
    """
    digest = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('utf-8')


def generate_state() -> str:
    """
    Generate random state for CSRF protection.
    """
    return secrets.token_hex(16)`}
        language="python"
        title="utils/pkce.py"
      />

      <h2>Step 3: Create the OIDC Service</h2>

      <CodeBlock
        code={`# services/auth0_service.py
import requests
import jwt
from jwt import PyJWKClient
from urllib.parse import urlencode


class Auth0Service:
    def __init__(self, domain: str, client_id: str, client_secret: str, callback_url: str):
        self.domain = domain
        self.client_id = client_id
        self.client_secret = client_secret
        self.callback_url = callback_url
        self._config = None
        self._jwks_client = None
    
    @property
    def config(self):
        """Lazy load and cache OIDC configuration."""
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
    
    def get_authorization_url(self, state: str, code_challenge: str) -> str:
        """Build the authorization URL."""
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.callback_url,
            "scope": "openid profile email",
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
        }
        return f"{self.config['authorization_endpoint']}?{urlencode(params)}"
    
    def exchange_code_for_tokens(self, code: str, code_verifier: str) -> dict:
        """Exchange authorization code for tokens."""
        response = requests.post(
            self.config["token_endpoint"],
            data={
                "grant_type": "authorization_code",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uri": self.callback_url,
                "code": code,
                "code_verifier": code_verifier,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        response.raise_for_status()
        return response.json()
    
    def get_user_info(self, access_token: str) -> dict:
        """Fetch user info from UserInfo endpoint."""
        response = requests.get(
            self.config["userinfo_endpoint"],
            headers={"Authorization": f"Bearer {access_token}"},
        )
        response.raise_for_status()
        return response.json()
    
    def verify_id_token(self, id_token: str) -> dict:
        """Verify and decode the ID token."""
        # Get the signing key from JWKS
        signing_key = self.jwks_client.get_signing_key_from_jwt(id_token)
        
        # Verify and decode
        payload = jwt.decode(
            id_token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=self.config["issuer"],
            audience=self.client_id,
        )
        return payload


# Factory function for creating service
_auth0_service = None

def get_auth0_service(domain: str, client_id: str, client_secret: str, callback_url: str):
    global _auth0_service
    if _auth0_service is None:
        _auth0_service = Auth0Service(domain, client_id, client_secret, callback_url)
    return _auth0_service`}
        language="python"
        title="services/auth0_service.py"
      />

      <h2>Step 4: Create the Flask Application</h2>

      <CodeBlock
        code={`# app.py
from flask import Flask, redirect, session, request, jsonify
import secrets
from dotenv import load_dotenv
import os

from utils.pkce import generate_code_verifier, generate_code_challenge, generate_state
from services.auth0_service import get_auth0_service

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", secrets.token_hex(32))


@app.route("/")
def index():
    """Home page."""
    if "user" in session:
        return redirect("/dashboard")
    
    return """
    <!DOCTYPE html>
    <html>
      <head><title>OIDC Tutorial - Python</title></head>
      <body>
        <h1>OpenID Connect Demo (Python/Flask)</h1>
        <p>This app demonstrates the Authorization Code Flow with PKCE.</p>
        <a href="/login"><button style="padding: 10px 20px; font-size: 16px;">Login with Auth0</button></a>
      </body>
    </html>
    """


@app.route("/login")
def login():
    """Initiate the OIDC login flow."""
    # Generate PKCE parameters
    state = generate_state()
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    
    # Store in session for callback verification
    session["pkce"] = {
        "state": state,
        "code_verifier": code_verifier,
    }
    
    # Get Auth0 service
    auth0 = get_auth0_service(
        domain=os.getenv("AUTH0_DOMAIN"),
        client_id=os.getenv("AUTH0_CLIENT_ID"),
        client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
        callback_url=os.getenv("AUTH0_CALLBACK_URL"),
    )
    
    # Build authorization URL and redirect
    auth_url = auth0.get_authorization_url(state, code_challenge)
    return redirect(auth_url)


@app.route("/callback")
def callback():
    """Handle the return from Auth0."""
    # Get query parameters
    code = request.args.get("code")
    state = request.args.get("state")
    error = request.args.get("error")
    
    # Check for errors
    if error:
        return f"Auth Error: {error} - {request.args.get('error_description')}", 400
    
    # Verify state (CSRF protection)
    pkce_data = session.get("pkce", {})
    if state != pkce_data.get("state"):
        return "State mismatch - possible CSRF attack", 400
    
    code_verifier = pkce_data.get("code_verifier")
    
    # Get Auth0 service
    auth0 = get_auth0_service(
        domain=os.getenv("AUTH0_DOMAIN"),
        client_id=os.getenv("AUTH0_CLIENT_ID"),
        client_secret=os.getenv("AUTH0_CLIENT_SECRET"),
        callback_url=os.getenv("AUTH0_CALLBACK_URL"),
    )
    
    try:
        # Exchange code for tokens
        tokens = auth0.exchange_code_for_tokens(code, code_verifier)
        
        # Verify ID token
        id_token_claims = auth0.verify_id_token(tokens["id_token"])
        
        # Get user info
        user_info = auth0.get_user_info(tokens["access_token"])
        
        # Store in session
        session["user"] = {
            "sub": id_token_claims["sub"],
            "email": user_info.get("email"),
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
        }
        session["tokens"] = {
            "access_token": tokens["access_token"],
            "id_token": tokens["id_token"],
            "refresh_token": tokens.get("refresh_token"),
            "expires_at": tokens.get("expires_in"),
        }
        
        # Clean up PKCE data
        session.pop("pkce", None)
        
        return redirect("/dashboard")
        
    except Exception as e:
        return f"Authentication failed: {str(e)}", 500


@app.route("/dashboard")
def dashboard():
    """Protected dashboard page."""
    user = session.get("user")
    if not user:
        return redirect("/")
    
    return f"""
    <!DOCTYPE html>
    <html>
      <head><title>Dashboard</title></head>
      <body>
        <h1>Welcome, {user['name']}!</h1>
        <img src="{user.get('picture', '')}" alt="Profile" style="width:100px;border-radius:50%;" />
        <p>Email: {user['email']}</p>
        <p>Subject: {user['sub']}</p>
        <a href="/logout"><button style="padding: 10px 20px; background: #dc3545; color: white; border: none;">Logout</button></a>
      </body>
    </html>
    """


@app.route("/logout")
def logout():
    """Log out user and redirect to Auth0 logout."""
    session.clear()
    
    # Build Auth0 logout URL
    domain = os.getenv("AUTH0_DOMAIN")
    client_id = os.getenv("AUTH0_CLIENT_ID")
    return_to = os.getenv("AUTH0_CALLBACK_URL", "http://localhost:5000")
    
    logout_url = f"https://{domain}/v2/logout?client_id={client_id}&returnTo={return_to}"
    return redirect(logout_url)


@app.route("/api/user")
def api_user():
    """API endpoint to get current user (for testing)."""
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify(user)


if __name__ == "__main__":
    app.run(debug=True, port=5000)`}
        language="python"
        title="app.py - Complete Flask OIDC App"
      />

      <h2>Step 5: Run the Application</h2>

      <CodeBlock
        code={`# Set environment variables (Linux/macOS)
export AUTH0_DOMAIN="your-tenant.auth0.com"
export AUTH0_CLIENT_ID="your-client-id"
export AUTH0_CLIENT_SECRET="your-client-secret"
export AUTH0_CALLBACK_URL="http://localhost:5000/callback"

# Or use a .env file and run:
flask run --port=5000

# Or directly:
python app.py`}
        language="bash"
        title="Run the Python Application"
      />

      <h2>Flow Diagram</h2>

      <MermaidDiagram chart={`
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant App as 📱 Flask App
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
        <li>Set your environment variables or update .env</li>
        <li>Start the application: <code>python app.py</code></li>
        <li>Open <code>http://localhost:5000</code> in your browser</li>
        <li>Click &ldquo;Login with Auth0&rdquo;</li>
        <li>You&apos;ll be redirected to Auth0</li>
        <li>Log in with your test user credentials</li>
        <li>You&apos;ll be redirected back to your app&apos;s dashboard</li>
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

      <h2>Python vs Node.js Comparison</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 my-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Aspect</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Node.js</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Python</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">HTTP Client</td>
              <td className="border border-gray-300 px-4 py-2">axios</td>
              <td className="border border-gray-300 px-4 py-2">requests</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">JWT Library</td>
              <td className="border border-gray-300 px-4 py-2">jose</td>
              <td className="border border-gray-300 px-4 py-2">PyJWT + cryptography</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Session Management</td>
              <td className="border border-gray-300 px-4 py-2">express-session</td>
              <td className="border border-gray-300 px-4 py-2">Flask sessions</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Framework</td>
              <td className="border border-gray-300 px-4 py-2">Express</td>
              <td className="border border-gray-300 px-4 py-2">Flask</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://flask.palletsprojects.com/" target="_blank" rel="noopener noreferrer">
            Flask Documentation
          </a>
        </li>
        <li>
          <a href="https://pyjwt.readthedocs.io/" target="_blank" rel="noopener noreferrer">
            PyJWT Documentation
          </a>
        </li>
        <li>
          <a href="https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth" target="_blank" rel="noopener noreferrer">
            OpenID Connect Core 1.0 - Authorization Code Flow
          </a>
        </li>
      </ul>

      <LessonNav
        prev={{ href: '/courses/openid-connect/labs/authorization-code-node', title: 'Auth Code (Node.js)' }}
        next={{ href: '/courses/openid-connect/labs/token-validation', title: 'Lab: Token Validation' }}
      />
    </div>
  );
}
