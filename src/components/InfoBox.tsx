interface InfoBoxProps {
  type?: 'info' | 'warning' | 'success' | 'error' | 'source';
  title?: string;
  children: React.ReactNode;
}

const config = {
  info: {
    label: 'Note',
    bg: 'oklch(95% 0.024 220)',
    labelColor: 'oklch(38% 0.12 220)',
    contentColor: 'oklch(28% 0.06 220)',
    iconPath: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
  },
  warning: {
    label: 'Warning',
    bg: 'oklch(95% 0.04 75)',
    labelColor: 'oklch(48% 0.14 65)',
    contentColor: 'oklch(30% 0.08 65)',
    iconPath: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
  },
  success: {
    label: 'Success',
    bg: 'oklch(95% 0.028 148)',
    labelColor: 'oklch(38% 0.1 148)',
    contentColor: 'oklch(26% 0.07 148)',
    iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
  },
  error: {
    label: 'Error',
    bg: 'oklch(95% 0.03 25)',
    labelColor: 'oklch(44% 0.14 25)',
    contentColor: 'oklch(30% 0.09 25)',
    iconPath: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
  },
  source: {
    label: 'Source',
    bg: 'oklch(95% 0.025 290)',
    labelColor: 'oklch(42% 0.12 290)',
    contentColor: 'oklch(30% 0.08 290)',
    iconPath: 'M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z',
  },
};

export default function InfoBox({ type = 'info', title, children }: InfoBoxProps) {
  const { label, bg, labelColor, contentColor, iconPath } = config[type];
  const displayLabel = title || label;

  return (
    <div className="my-6 rounded-sm overflow-hidden" style={{ background: bg }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${bg.replace('95%', '88%')}` }}>
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          style={{ color: labelColor }}
        >
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
        <span
          className="text-xs font-mono font-bold uppercase tracking-widest"
          style={{ color: labelColor }}
        >
          {displayLabel}
        </span>
      </div>
      <div className="px-4 py-3 text-sm leading-relaxed" style={{ color: contentColor }}>
        {children}
      </div>
    </div>
  );
}
