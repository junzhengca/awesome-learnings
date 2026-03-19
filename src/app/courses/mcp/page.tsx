import { metadata } from "./metadata";

export default function MCPPage() {
  return (
    <main className="course-container">
      <header className="course-header">
        <h1>{metadata.name}</h1>
        <p className="course-description">{metadata.description}</p>
        <div className="course-meta">
          <span>Last updated: {metadata.lastUpdated}</span>
          <span>Difficulty: {metadata.difficulty}</span>
          <span>Estimated time: {metadata.estimatedTime}</span>
        </div>
        <div className="course-tags">
          {metadata.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </header>
      <section className="course-content">
        <p>Course content coming soon...</p>
      </section>
    </main>
  );
}
