'use client';

import Link from 'next/link';
import { metadata } from './metadata';
import Badge from '@/components/Badge';
import SectionRow from '@/components/SectionRow';

const conceptSections = [
  { href: '/courses/openid-connect/introduction', num: '01', title: 'Introduction', desc: 'What is OpenID Connect and why it was created' },
  { href: '/courses/openid-connect/core-concepts', num: '02', title: 'Core Concepts', desc: 'Relying Party, OpenID Provider, ID Token, Access Token, Claims' },
  { href: '/courses/openid-connect/jwt', num: '03', title: 'JSON Web Tokens', desc: 'JWT structure, signature, and validation' },
  { href: '/courses/openid-connect/flows', num: '04', title: 'Authentication Flows', desc: 'Authorization Code, Implicit, and Hybrid flows' },
  { href: '/courses/openid-connect/discovery', num: '05', title: 'Discovery', desc: 'Auto-configuration with the OIDC discovery endpoint' },
  { href: '/courses/openid-connect/security', num: '12', title: 'Security', desc: 'PKCE, state, nonce, token validation best practices' },
  { href: '/courses/openid-connect/advanced', num: '13', title: 'Advanced Topics', desc: 'Federation, logout, dynamic client registration' },
];

const labSections = [
  { href: '/courses/openid-connect/labs/setup-auth0', num: '06', title: 'Setup Auth0', desc: 'Configure your Identity Provider' },
  { href: '/courses/openid-connect/labs/authorization-code-node', num: '07', title: 'Auth Code Flow — Node.js', desc: 'Implement Authorization Code flow with Express' },
  { href: '/courses/openid-connect/labs/authorization-code-python', num: '08', title: 'Auth Code Flow — Python', desc: 'Implement Authorization Code flow with Flask' },
  { href: '/courses/openid-connect/labs/token-validation', num: '09', title: 'Token Validation', desc: 'Properly validate ID tokens' },
  { href: '/courses/openid-connect/labs/userinfo-endpoint', num: '10', title: 'UserInfo Endpoint', desc: 'Fetch user claims from the provider' },
  { href: '/courses/openid-connect/labs/refresh-tokens', num: '11', title: 'Refresh Tokens', desc: 'Implement silent token renewal' },
];

const outcomes = [
  'What OpenID Connect is and why it matters',
  'How OIDC builds on OAuth 2.0',
  'JWT structure, claims, and validation',
  'All three OIDC authentication flows',
  'Security best practices and common pitfalls',
  'Real implementations in Node.js and Python',
];

const technologies: Array<{ name: string; variant: 'sage' | 'accent' | 'subtle' }> = [
  { name: 'Node.js', variant: 'sage' },
  { name: 'Python', variant: 'sage' },
  { name: 'Flask',  variant: 'sage' },
  { name: 'Express', variant: 'subtle' },
  { name: 'Auth0', variant: 'accent' },
  { name: 'JWT',   variant: 'accent' },
  { name: 'PKCE',  variant: 'accent' },
];

export default function OpenIDConnectPage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-16 pt-4">
        <Badge variant="accent" size="lg" uppercase className="rounded-sm mb-6 inline-block">
          Complete Course
        </Badge>
        <h1
          className="font-heading text-6xl font-bold leading-tight mb-5"
          style={{ color: 'var(--fg)' }}
        >
          {metadata.name}
          <br />
          <span style={{ color: 'var(--accent)' }}>Fundamentals</span>
        </h1>
        <p className="text-lg max-w-lg mb-8" style={{ color: 'var(--fg-muted)', lineHeight: '1.7' }}>
          From zero to production-ready auth. Learn the protocol that powers identity on the
          modern web — with real code, interactive diagrams, and hands-on labs.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/courses/openid-connect/introduction"
            className="cta-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Begin Course
            <span aria-hidden>→</span>
          </Link>
          <div className="flex gap-5 text-sm" style={{ color: 'var(--fg-muted)' }}>
            <span>13 modules</span>
            <span aria-hidden>·</span>
            <span>6 labs</span>
            <span aria-hidden>·</span>
            <span>Real code</span>
          </div>
        </div>
      </div>

      {/* What you'll master */}
      <div className="mb-16 p-8" style={{ background: 'var(--bg-subtle)', borderLeft: '3px solid var(--accent)' }}>
        <h2 className="font-heading text-xl font-semibold mb-5" style={{ color: 'var(--fg)' }}>
          What You&apos;ll Master
        </h2>
        <div className="grid sm:grid-cols-2 gap-y-2 gap-x-8">
          {outcomes.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: 'var(--accent)' }}>✓</span>
              <span className="text-sm" style={{ color: 'var(--fg)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="font-heading text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Learning Path
          </h2>
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--fg-muted)' }}>
          Concepts and theory — work through these first, in order.
        </p>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {conceptSections.map((section) => (
            <SectionRow key={section.href} {...section} variant="concept" />
          ))}
        </div>
      </div>

      {/* Hands-On Labs */}
      <div className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="font-heading text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Hands-On Labs
          </h2>
          <Badge variant="sage">6 labs</Badge>
        </div>
        <p className="text-sm mb-8" style={{ color: 'var(--fg-muted)' }}>
          Write real code, see real results. Best tackled after the theory sections.
        </p>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {labSections.map((section) => (
            <SectionRow key={section.href} {...section} variant="lab" />
          ))}
        </div>
      </div>

      {/* Technologies */}
      <div className="mb-16">
        <h2 className="font-heading text-xl font-semibold mb-5" style={{ color: 'var(--fg)' }}>
          Technologies Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map(({ name, variant }) => (
            <Badge key={name} variant={variant} size="lg">
              {name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-16">
        <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: 'var(--fg)' }}>
          Sources &amp; References
        </h2>
        <div className="space-y-2">
          {[
            { href: 'https://openid.net/specs/openid-connect-core-1_0.html', label: 'OpenID Connect Core 1.0 Specification' },
            { href: 'https://openid.net/developers/how-connect-works/', label: 'OpenID Foundation — How Connect Works' },
            { href: 'https://auth0.com/docs/authenticate/protocols/openid-connect-protocol', label: 'Auth0 — OpenID Connect Protocol' },
            { href: 'https://auth0.com/docs/secure/tokens/json-web-tokens', label: 'Auth0 — JSON Web Tokens' },
            { href: 'https://datatracker.ietf.org/doc/html/rfc7519', label: 'RFC 7519 — JSON Web Token (JWT)' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link flex items-center gap-2 text-sm hover:underline"
              style={{ color: 'var(--fg-muted)' }}
            >
              <span aria-hidden style={{ color: 'var(--border-strong)' }}>↗</span>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* CTA — dark warm block, NO gradient */}
      <div
        className="relative p-10 mt-4"
        style={{ background: 'var(--fg)' }}
      >
        <p
          className="text-xs font-mono font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--accent)' }}
        >
          Start here
        </p>
        <h3
          className="font-heading text-3xl font-bold mb-3"
          style={{ color: 'oklch(94% 0.01 75)' }}
        >
          Ready to begin?
        </h3>
        <p className="text-sm mb-7 max-w-md" style={{ color: 'oklch(62% 0.014 75)' }}>
          Start with Introduction and work through each section in order.
        </p>
        <Link
          href="/courses/openid-connect/introduction"
          className="cta-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
          style={{ background: 'var(--accent)' }}
        >
          Start with Introduction
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
