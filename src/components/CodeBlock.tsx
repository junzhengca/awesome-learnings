'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ code, language, title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      javascript: 'js',
      js: 'js',
      typescript: 'ts',
      ts: 'ts',
      python: 'py',
      py: 'py',
      bash: 'sh',
      sh: 'sh',
      json: 'json',
      http: 'http',
    };
    return labels[lang.toLowerCase()] || lang.toLowerCase();
  };

  return (
    <div
      className="my-6 overflow-hidden code-block"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        }}
      >
        <span
          className="text-xs font-mono"
          style={{ color: 'var(--fg-faint)' }}
        >
          {title || getLanguageLabel(language)}
        </span>

        <button
          onClick={handleCopy}
          className="copy-btn flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono"
          style={{
            color: copied ? 'var(--sage-text)' : 'var(--fg-faint)',
            border: '1px solid',
            borderColor: copied ? 'var(--sage)' : 'var(--border)',
            background: copied ? 'var(--sage-bg)' : 'transparent',
            transition: 'color 0.2s, border-color 0.2s, background 0.2s',
          }}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
        >
          {copied ? (
            <>
              <svg
                className="copy-check"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1.5 5.5L4.5 8.5L9.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              copied
            </>
          ) : (
            'copy'
          )}
        </button>
      </div>

      <div className="relative overflow-x-auto">
        <pre
          className="p-4 text-sm"
          style={{
            margin: 0,
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            lineHeight: '1.6',
            color: 'var(--fg)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <code>
            {showLineNumbers ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td
                        className="select-none text-right"
                        style={{
                          paddingRight: '1.25rem',
                          color: 'var(--fg-faint)',
                          userSelect: 'none',
                          minWidth: '2rem',
                          fontSize: '0.8125rem',
                          lineHeight: '1.6',
                        }}
                      >
                        {i + 1}
                      </td>
                      <td style={{ whiteSpace: 'pre', lineHeight: '1.6' }}>{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
