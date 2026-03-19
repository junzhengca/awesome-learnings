'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import ReadingProgress from './ReadingProgress';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOpenIDCourse = pathname?.startsWith('/courses/openid-connect');
  const isModulePage = pathname !== '/courses/openid-connect' && isOpenIDCourse;

  if (isOpenIDCourse) {
    return (
      <div className="flex">
        {isModulePage && <ReadingProgress />}
        <Navigation />
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
