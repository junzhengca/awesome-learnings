'use client';

import Link from 'next/link';
import { metadata } from './metadata';
import Badge from '@/components/Badge';
import SectionRow from '@/components/SectionRow';

const conceptSections = [
  { href: '/courses/model-context-protocol/introduction', num: '01', title: 'Introduction', desc: 'What is MCP and why it matters' },
  { href: '/courses/model-context-protocol/architecture', num: '02', title: 'Architecture', desc: 'Host, Client, Server architecture and capability negotiation' },
  { href: '/courses/model-context-protocol/core-primitives', num: '03', title: 'Core Primitives', desc: 'Tools, Resources, and Prompts in depth' },
  { href: '/courses/model-context-protocol/transport-layer', num: '04', title: 'Transport Layer', desc: 'STDIO and Streamable HTTP transports' },
  { href: '/courses/model-context-protocol/protocol-lifecycle', num: '05', title: 'Protocol Lifecycle', desc: 'Initialization, capability negotiation, and notifications' },
  { href: '/courses/model-context-protocol/building-servers-python', num: '06', title: 'Building Servers (Python)', desc: 'Create MCP servers with Python and FastMCP' },
  { href: '/courses/model-context-protocol/building-servers-typescript', num: '07', title: 'Building Servers (TypeScript)', desc: 'Create MCP servers with TypeScript and the SDK' },
  { href: '/courses/model-context-protocol/building-clients', num: '08', title: 'Building Clients', desc: 'Implement MCP clients to connect to servers' },
  { href: '/courses/model-context-protocol/client-features', num: '09', title: 'Client Features', desc: 'Sampling, Elicitation, and Roots' },
  { href: '/courses/model-context-protocol/security', num: '10', title: 'Security', desc: 'Attack patterns, mitigations, and best practices' },
  { href: '/courses/model-context-protocol/real-world-servers', num: '11', title: 'Real-World Servers', desc: 'Reference implementations and community servers' },
  { href: '/courses/model-context-protocol/production-deployment', num: '12', title: 'Production Deployment', desc: 'Deploying MCP servers to production' },
  { href: '/courses/model-context-protocol/authorization', num: '13', title: 'Authorization', desc: 'OAuth 2.0 and enterprise MCP patterns' },
  { href: '/courses/model-context-protocol/sdks', num: '14', title: 'SDKs', desc: 'Language support and SDK comparison' },
];

const labSections = [
  { href: '/courses/model-context-protocol/labs/build-weather-server-python', num: '01', title: 'Build a Weather Server (Python)', desc: 'Create your first MCP server with FastMCP' },
  { href: '/courses/model-context-protocol/labs/build-weather-server-typescript', num: '02', title: 'Build a Weather Server (TypeScript)', desc: 'Create an MCP server with TypeScript SDK' },
  { href: '/courses/model-context-protocol/labs/build-mcp-client', num: '03', title: 'Build an MCP Client', desc: 'Implement a client to consume MCP servers' },
  { href: '/courses/model-context-protocol/labs/multi-server-integration', num: '04', title: 'Multi-Server Integration', desc: 'Connect to multiple MCP servers' },
  { href: '/courses/model-context-protocol/labs/capstone-project', num: '05', title: 'Capstone Project', desc: 'Build a complete Travel Planning AI Assistant' },
];

const outcomes = [
  'What MCP is and why it matters for AI applications',
  'Host-Client-Server architecture and design principles',
  'Core primitives: Tools, Resources, and Prompts',
  'STDIO and Streamable HTTP transport mechanisms',
  'Building production-ready MCP servers in Python and TypeScript',
  'Implementing MCP clients for AI applications',
  'Security best practices and attack mitigations',
  'Real-world MCP server implementations',
];

const technologies: Array<{ name: string; variant: 'sage' | 'accent' | 'subtle' }> = [
  { name: 'Python', variant: 'sage' },
  { name: 'TypeScript', variant: 'sage' },
  { name: 'FastMCP', variant: 'sage' },
  { name: 'MCP SDK', variant: 'sage' },
  { name: 'JSON-RPC', variant: 'accent' },
  { name: 'Claude', variant: 'accent' },
  { name: 'AI Tools', variant: 'accent' },
];

export default function ModelContextProtocolPage() {
  return (
    <div>
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
          From zero to production-ready MCP integration. Learn the protocol that connects AI 
          to external tools and data sources — with real code, interactive diagrams, and hands-on labs.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/courses/model-context-protocol/introduction"
            className="cta-btn inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Begin Course
            <span aria-hidden>→</span>
          </Link>
          <div className="flex gap-5 text-sm" style={{ color: 'var(--fg-muted)' }}>
            <span>14 modules</span>
            <span aria-hidden>·</span>
            <span>5 labs</span>
            <span aria-hidden>·</span>
            <span>Real code</span>
          </div>
        </div>
      </div>

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

      <div className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="font-heading text-3xl font-bold" style={{ color: 'var(--fg)' }}>
            Hands-On Labs
          </h2>
          <Badge variant="sage">5 labs</Badge>
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

      <div className="mb-16">
        <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: 'var(--fg)' }}>
          Sources &amp; References
        </h2>
        <div className="space-y-2">
          {[
            { href: 'https://modelcontextprotocol.io', label: 'Official MCP Documentation' },
            { href: 'https://modelcontextprotocol.io/specification/2025-11-25', label: 'MCP Specification' },
            { href: 'https://github.com/modelcontextprotocol/typescript-sdk', label: 'TypeScript SDK' },
            { href: 'https://github.com/modelcontextprotocol/python-sdk', label: 'Python SDK' },
            { href: 'https://github.com/modelcontextprotocol/servers', label: 'Reference Servers' },
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
          href="/courses/model-context-protocol/introduction"
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
