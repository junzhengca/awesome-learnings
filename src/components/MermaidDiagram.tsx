'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, closeFullscreen]);

  useEffect(() => {
    const loadMermaid = async () => {
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
          useMaxWidth: false,
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
      setSvgContent(svg);
      setLoading(false);
    };

    loadMermaid();
  }, [chart]);

  return (
    <div className="my-6">
      <style>{`
        .mermaid-diagram-wrapper svg {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.3}
        maxScale={5}
        centerOnInit
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', minHeight: loading ? '200px' : '300px' }}
          contentStyle={{ display: 'flex', justifyContent: 'center' }}
        >
          <div
            className={`mermaid-container mermaid-diagram-wrapper ${className}`}
            style={{ 
              background: 'var(--bg-subtle)', 
              border: '1px solid var(--border)',
              padding: '24px',
              width: '100%',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </TransformComponent>
      </TransformWrapper>
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={() => transformRef.current?.zoomIn()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => transformRef.current?.zoomOut()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => transformRef.current?.resetTransform()}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Reset zoom"
        >
          Reset
        </button>
        <button
          onClick={() => setIsFullscreen(true)}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open fullscreen"
        >
          ⛶
        </button>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-2xl text-white bg-gray-800 rounded-lg hover:bg-gray-700"
            aria-label="Close fullscreen"
          >
            ×
          </button>
          <div
            className="flex-1 w-full h-full overflow-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <TransformWrapper
              initialScale={1}
              minScale={0.3}
              maxScale={5}
              centerOnInit
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <div
                  className="mermaid-container mermaid-diagram-wrapper"
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '24px',
                    minWidth: '80vw',
                    minHeight: '80vh',
                  }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
}
