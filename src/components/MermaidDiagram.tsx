'use client';

import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMermaid = async () => {
      if (ref.current && !ref.current.querySelector('.mermaid')) {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: true,
          theme: 'neutral',
          themeVariables: {
            primaryColor: '#f5ede0',
            primaryTextColor: '#3d2810',
            primaryBorderColor: '#c47a2a',
            lineColor: '#7a6e60',
            secondaryColor: '#ebe1d4',
            tertiaryColor: '#faf6ef',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          },
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      }
    };

    loadMermaid();
  }, [chart]);

  return (
    <div 
      ref={ref} 
      className={`mermaid-container flex justify-center my-6 p-4 overflow-x-auto ${className}`}
      style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
    />
  );
}
