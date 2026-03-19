'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const oidcNavGroups = [
  {
    label: 'Course',
    sections: [
      { href: '/courses/openid-connect', title: 'Overview', description: 'Course home' },
    ],
  },
  {
    label: 'Foundations',
    sections: [
      { href: '/courses/openid-connect/introduction', title: '1. Introduction', description: 'What is OpenID Connect?' },
      { href: '/courses/openid-connect/core-concepts', title: '2. Core Concepts', description: 'Key terminology' },
      { href: '/courses/openid-connect/jwt', title: '3. JSON Web Tokens', description: 'Understanding JWTs' },
      { href: '/courses/openid-connect/flows', title: '4. Auth Flows', description: 'Code, Implicit, Hybrid' },
      { href: '/courses/openid-connect/discovery', title: '5. Discovery', description: 'Auto-configuration' },
    ],
  },
  {
    label: 'Labs',
    sections: [
      { href: '/courses/openid-connect/labs/setup-auth0', title: '6. Setup Auth0', description: 'Set up your identity provider' },
      { href: '/courses/openid-connect/labs/authorization-code-node', title: '7. Node.js', description: 'Auth Code in Node' },
      { href: '/courses/openid-connect/labs/authorization-code-python', title: '8. Python', description: 'Auth Code in Python' },
      { href: '/courses/openid-connect/labs/token-validation', title: '9. Token Validation', description: 'Verify ID tokens' },
      { href: '/courses/openid-connect/labs/userinfo-endpoint', title: '10. UserInfo', description: 'Fetch user details' },
      { href: '/courses/openid-connect/labs/refresh-tokens', title: '11. Refresh Tokens', description: 'Token renewal' },
    ],
  },
  {
    label: 'Advanced',
    sections: [
      { href: '/courses/openid-connect/security', title: '12. Security', description: 'Best practices' },
      { href: '/courses/openid-connect/advanced', title: '13. Advanced Topics', description: 'Federation, logout' },
    ],
  },
];

const mcpNavGroups = [
  {
    label: 'Course',
    sections: [
      { href: '/courses/model-context-protocol', title: 'Overview', description: 'Course home' },
    ],
  },
  {
    label: 'Foundations',
    sections: [
      { href: '/courses/model-context-protocol/introduction', title: '1. Introduction', description: 'What is MCP?' },
      { href: '/courses/model-context-protocol/architecture', title: '2. Architecture', description: 'Host, Client, Server' },
      { href: '/courses/model-context-protocol/core-primitives', title: '3. Core Primitives', description: 'Tools, Resources, Prompts' },
      { href: '/courses/model-context-protocol/transport-layer', title: '4. Transport Layer', description: 'STDIO and HTTP' },
      { href: '/courses/model-context-protocol/protocol-lifecycle', title: '5. Protocol Lifecycle', description: 'Initialization' },
    ],
  },
  {
    label: 'Building',
    sections: [
      { href: '/courses/model-context-protocol/building-servers-python', title: '6. Servers (Python)', description: 'FastMCP implementation' },
      { href: '/courses/model-context-protocol/building-servers-typescript', title: '7. Servers (TypeScript)', description: 'SDK implementation' },
      { href: '/courses/model-context-protocol/building-clients', title: '8. Building Clients', description: 'Client implementation' },
    ],
  },
  {
    label: 'Advanced',
    sections: [
      { href: '/courses/model-context-protocol/client-features', title: '9. Client Features', description: 'Sampling, Elicitation' },
      { href: '/courses/model-context-protocol/security', title: '10. Security', description: 'Attack patterns' },
      { href: '/courses/model-context-protocol/real-world-servers', title: '11. Real-World Servers', description: 'Reference implementations' },
      { href: '/courses/model-context-protocol/production-deployment', title: '12. Production', description: 'Deployment guide' },
      { href: '/courses/model-context-protocol/authorization', title: '13. Authorization', description: 'OAuth integration' },
      { href: '/courses/model-context-protocol/sdks', title: '14. SDKs', description: 'Language support' },
    ],
  },
  {
    label: 'Labs',
    sections: [
      { href: '/courses/model-context-protocol/labs/build-weather-server-python', title: 'Lab 1', description: 'Weather server (Python)' },
      { href: '/courses/model-context-protocol/labs/build-weather-server-typescript', title: 'Lab 2', description: 'Weather server (TS)' },
      { href: '/courses/model-context-protocol/labs/build-mcp-client', title: 'Lab 3', description: 'Build MCP client' },
      { href: '/courses/model-context-protocol/labs/multi-server-integration', title: 'Lab 4', description: 'Multi-server integration' },
      { href: '/courses/model-context-protocol/labs/capstone-project', title: 'Lab 5', description: 'Capstone project' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();
  
  const isOIDC = pathname?.startsWith('/courses/openid-connect');
  const isMCP = pathname?.startsWith('/courses/model-context-protocol') || 
                 pathname?.startsWith('/courses/mcp');
  
  const navGroups = isOIDC ? oidcNavGroups : isMCP ? mcpNavGroups : [];
 
  const isActive = (href: string) =>
    href === '/courses/openid-connect'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  const brandLabel = isOIDC ? 'OIDC' : isMCP ? 'MCP' : 'Course';
  const brandTitle = isOIDC ? 'Fundamentals' : isMCP ? 'Fundamentals' : '';
  const brandDescription = isOIDC ? 'Complete Tutorial · 13 modules' : isMCP ? 'Complete Tutorial · 14 modules + 5 labs' : '';

  return (
    <nav
      className="w-64 h-screen overflow-y-auto fixed left-0 top-0 hidden lg:flex flex-col"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Brand */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <Link href={isOIDC ? '/courses/openid-connect' : '/courses/model-context-protocol'} className="block group">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: 'var(--sidebar-active-text)' }}
            />
            <span
              className="text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: 'var(--sidebar-active-text)' }}
            >
              {brandLabel}
            </span>
          </div>
          <p className="font-heading text-base font-semibold" style={{ color: 'var(--sidebar-text)' }}>
            {brandTitle}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--sidebar-muted)' }}>
            {brandDescription}
          </p>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 py-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p
              className="px-5 pt-4 pb-1.5 text-xs font-mono font-semibold uppercase tracking-widest"
              style={{ color: 'var(--sidebar-label)' }}
            >
              {group.label}
            </p>
            {group.sections.map((section) => {
              const active = isActive(section.href);
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`nav-item block px-5 py-2${active ? ' nav-item-active' : ''}`}
                  style={active ? { background: 'var(--sidebar-active-bg)' } : undefined}
                >
                  <div
                    className="text-sm font-medium leading-snug"
                    style={{ color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)' }}
                  >
                    {section.title}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: active ? 'var(--sidebar-active-desc)' : 'var(--sidebar-muted)' }}
                  >
                    {section.description}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--sidebar-label)' }}>
          Sources
        </p>
        <div className="space-y-1">
          <a
            href={isOIDC ? 'https://openid.net/specs/openid-connect-core-1_0.html' : 'https://modelcontextprotocol.io'}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ext-link block text-xs"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            {isOIDC ? 'OpenID Connect Core 1.0' : 'MCP Documentation'} ↗
          </a>
          <a
            href={isOIDC ? 'https://auth0.com/docs' : 'https://github.com/modelcontextprotocol/servers'}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ext-link block text-xs"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            {isOIDC ? 'Auth0 Documentation' : 'MCP Reference Servers'} ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
