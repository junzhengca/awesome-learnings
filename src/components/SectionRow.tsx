import Link from 'next/link';

interface SectionRowProps {
  href: string;
  num: string;
  title: string;
  desc: string;
  variant?: 'concept' | 'lab';
}

export default function SectionRow({ href, num, title, desc, variant = 'concept' }: SectionRowProps) {
  const isLab = variant === 'lab';
  return (
    <Link
      href={href}
      className={`section-row${isLab ? ' section-row-lab' : ''} group flex items-center gap-5 py-4`}
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <span
        className="font-mono text-sm font-bold w-7 flex-shrink-0 tabular-nums"
        style={{ color: isLab ? 'var(--sage)' : 'var(--accent)' }}
      >
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>
          {title}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
          {desc}
        </div>
      </div>
      <span
        className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity${isLab ? ' text-xs font-mono font-bold' : ' text-sm'}`}
        style={{ color: isLab ? 'var(--sage)' : 'var(--accent)' }}
        aria-hidden
      >
        {isLab ? 'LAB →' : '→'}
      </span>
    </Link>
  );
}
