import Link from 'next/link';

interface NavItem {
  href: string;
  title: string;
  label?: string; // overrides the full button text
}

interface LessonNavProps {
  prev?: NavItem;
  next?: NavItem;
}

export default function LessonNav({ prev, next }: LessonNavProps) {
  return (
    <div className="flex gap-4 mt-8">
      {prev && (
        <Link
          href={prev.href}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--bg-subtle)', color: 'var(--fg)', border: '1px solid var(--border)' }}
        >
          {prev.label ?? `← ${prev.title}`}
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          {next.label ?? `Next: ${next.title} →`}
        </Link>
      )}
    </div>
  );
}
