import Link from "next/link";
import { courses } from "./courses/courses";

const difficultyStyles = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function Home() {
  const courseList = Object.values(courses);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <header className="w-full max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Course Library
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Explore our collection of courses to expand your skills
        </p>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courseList.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group flex flex-col p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    difficultyStyles[course.difficulty as keyof typeof difficultyStyles]
                  }`}
                >
                  {course.difficulty}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {course.estimatedTime}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-black dark:text-zinc-50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {course.name}
              </h2>

              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 flex-1">
                {course.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
