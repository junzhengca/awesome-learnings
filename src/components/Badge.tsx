interface BadgeProps {
  variant?: 'accent' | 'sage' | 'advanced' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<string, { background: string; color: string }> = {
  accent:   { background: 'var(--accent-bg)',        color: 'var(--accent-text)' },
  sage:     { background: 'var(--sage-bg)',           color: 'var(--sage-text)' },
  advanced: { background: 'oklch(95% 0.03 25)',       color: 'oklch(44% 0.14 25)' },
  subtle:   { background: 'var(--bg-subtle)',         color: 'var(--fg-muted)' },
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-0.5',
  lg: 'px-3 py-1',
};

export function difficultyVariant(difficulty: string): BadgeProps['variant'] {
  if (difficulty === 'beginner')    return 'sage';
  if (difficulty === 'intermediate') return 'accent';
  if (difficulty === 'advanced')    return 'advanced';
  return 'subtle';
}

export default function Badge({
  variant = 'subtle',
  size = 'md',
  uppercase = false,
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`text-xs font-mono font-bold ${sizeClasses[size]}${uppercase ? ' uppercase tracking-widest' : ''}${className ? ` ${className}` : ''}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
