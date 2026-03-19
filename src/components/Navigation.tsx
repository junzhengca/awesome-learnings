'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navGroups = [
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

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/courses/openid-connect'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      className="w-64 h-screen overflow-y-auto fixed left-0 top-0 hidden lg:flex flex-col"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Brand */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <Link href="/courses/openid-connect" className="block group">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: 'var(--sidebar-active-text)' }}
            />
            <span
              className="text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: 'var(--sidebar-active-text)' }}
            >
              OIDC
            </span>
          </div>
          <p className="font-heading text-base font-semibold" style={{ color: 'var(--sidebar-text)' }}>
            Fundamentals
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--sidebar-muted)' }}>
            Complete Tutorial · 13 modules
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
            href="https://openid.net/specs/openid-connect-core-1_0.html"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ext-link block text-xs"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            OpenID Connect Core 1.0 ↗
          </a>
          <a
            href="https://auth0.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ext-link block text-xs"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            Auth0 Documentation ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
