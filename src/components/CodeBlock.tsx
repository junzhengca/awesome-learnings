'use client';

import { useState, useEffect, useRef } from 'react';
import { createHighlighter, type BundledLanguage } from 'shiki';
import { awlLeaseTheme } from '@/themes/awl-lease';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

const SUPPORTED_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'bash',
  'sh',
  'zsh',
  'json',
  'yaml',
  'toml',
  'xml',
  'sql',
  'html',
  'css',
  'scss',
  'less',
  'go',
  'rust',
  'java',
  'kotlin',
  'scala',
  'c',
  'cpp',
  'csharp',
  'swift',
  'objective-c',
  'ruby',
  'php',
  'perl',
  'lua',
  'r',
  'julia',
  'matlab',
  'haskell',
  'elixir',
  'erlang',
  'clojure',
  'fsharp',
  'ocaml',
  'vim',
  'markdown',
  'regex',
  'dockerfile',
  'nginx',
  'apache',
  'terraform',
  'graphql',
  'http',
];

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [awlLeaseTheme],
      langs: SUPPORTED_LANGUAGES,
    });
  }
  return highlighterPromise;
}

function detectLanguage(lang: string): BundledLanguage {
  const langLower = lang.toLowerCase();
  
  const aliases: Record<string, BundledLanguage> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    rb: 'ruby',
    cs: 'csharp',
    cxx: 'cpp',
    cc: 'cpp',
    'c++': 'cpp',
    ml: 'ocaml',
    clj: 'clojure',
    ex: 'elixir',
    erl: 'erlang',
    hs: 'haskell',
    fs: 'fsharp',
    viml: 'vim',
    tf: 'terraform',
    yml: 'yaml',
    kt: 'kotlin',
  };

  const normalized = aliases[langLower] || langLower;
  
  if (SUPPORTED_LANGUAGES.includes(normalized as BundledLanguage)) {
    return normalized as BundledLanguage;
  }

  if (langLower === 'text' || langLower === 'plain') {
    return 'bash';
  }

  return 'bash';
}

function SkeletonLines() {
  return (
    <div className="p-4 space-y-2">
      <div className="h-4 bg-[var(--border)] rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-[var(--border)] rounded w-1/2 animate-pulse" />
      <div className="h-4 bg-[var(--border)] rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-[var(--border)] rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-[var(--border)] rounded w-1/3 animate-pulse" />
    </div>
  );
}

interface Token {
  content: string;
  color?: string;
}

interface TokenLine {
  tokens: Token[];
}

export default function CodeBlock({ code, language, title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [tokenLines, setTokenLines] = useState<TokenLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedLang = detectLanguage(language);

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const highlighter = await getHighlighter();
        
        if (!mounted) return;

        if (showLineNumbers) {
          const tokensResult = highlighter.codeToTokens(code, {
            lang: normalizedLang,
            theme: 'awl-lease',
          });
          setTokenLines(tokensResult as unknown as TokenLine[]);
        } else {
          const html = highlighter.codeToHtml(code, {
            lang: normalizedLang,
            theme: 'awl-lease',
          });
          setHighlightedHtml(html);
        }
      } catch (error) {
        console.error('Syntax highlighting failed:', error);
        if (mounted) {
          setHighlightedHtml(`<pre class="shiki"><code>${code}</code></pre>`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, normalizedLang, showLineNumbers]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      yaml: 'yaml',
      html: 'html',
      css: 'css',
      sql: 'sql',
      go: 'go',
      rust: 'rust',
      java: 'java',
      ruby: 'rb',
      php: 'php',
      swift: 'swift',
      kotlin: 'kt',
    };
    return labels[lang.toLowerCase()] || lang.toLowerCase();
  };

  const renderHighlightedCode = () => {
    if (isLoading) {
      return <SkeletonLines />;
    }

    if (showLineNumbers && tokenLines.length > 0) {
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {tokenLines.map((line: TokenLine, lineIndex: number) => (
              <tr key={lineIndex}>
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
                  {lineIndex + 1}
                </td>
                <td style={{ whiteSpace: 'pre', lineHeight: '1.6' }}>
                  {line.tokens.map((token: Token, tokenIndex: number) => (
                    <span
                      key={tokenIndex}
                      style={{ color: token.color || 'inherit' }}
                    >
                      {token.content}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        className="shiki-wrapper"
      />
    );
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

      <div className="relative overflow-x-auto" ref={containerRef}>
        {renderHighlightedCode()}
      </div>
    </div>
  );
}
