import Link from "next/link";
import { courses } from "./courses/courses";
import Badge, { difficultyVariant } from "@/components/Badge";

export default function Home() {
  const courseList = Object.values(courses);

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg)' }}>
      <header className="page-header w-full max-w-5xl mx-auto px-6 pt-16 pb-12">
        <h1
          className="font-heading text-4xl font-bold tracking-tight"
          style={{ color: 'var(--fg)' }}
        >
          Course Library
        </h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--fg-muted)', lineHeight: '1.6' }}>
          Deep-dive courses on authentication, protocols, and developer tools
        </p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courseList.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="course-card group flex flex-col p-6"
              style={{ background: 'var(--bg)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={difficultyVariant(course.difficulty)}>
                  {course.difficulty}
                </Badge>
                <span className="text-xs font-mono" style={{ color: 'var(--fg-faint)' }}>
                  {course.estimatedTime}
                </span>
              </div>

              <h2
                className="font-heading text-lg font-semibold leading-snug"
                style={{ color: 'var(--fg)' }}
              >
                {course.name}
              </h2>

              <p className="mt-2 text-sm flex-1" style={{ color: 'var(--fg-muted)', lineHeight: '1.6' }}>
                {course.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="subtle" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
