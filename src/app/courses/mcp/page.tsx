import { metadata } from "./metadata";
import Badge, { difficultyVariant } from "@/components/Badge";

export default function MCPPage() {
  return (
    <div>
      <div className="mb-16 pt-4">
        <Badge variant={difficultyVariant(metadata.difficulty)} size="lg" uppercase className="rounded-sm mb-6 inline-block">
          {metadata.difficulty}
        </Badge>
        <h1
          className="font-heading text-5xl font-bold leading-tight mb-5"
          style={{ color: 'var(--fg)' }}
        >
          {metadata.name}
        </h1>
        <p className="text-lg max-w-lg mb-6" style={{ color: 'var(--fg-muted)', lineHeight: '1.7' }}>
          {metadata.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {metadata.tags.map((tag) => (
            <Badge key={tag} variant="subtle" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-6 text-sm font-mono" style={{ color: 'var(--fg-faint)' }}>
          <span>{metadata.estimatedTime}</span>
          <span aria-hidden>·</span>
          <span>Updated {metadata.lastUpdated}</span>
        </div>
      </div>

      <div
        className="p-8"
        style={{ background: 'var(--bg-subtle)', borderLeft: '3px solid var(--accent)' }}
      >
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
          This course is in development. Check back soon.
        </p>
      </div>
    </div>
  );
}
