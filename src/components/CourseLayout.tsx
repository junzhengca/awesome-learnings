'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import ReadingProgress from './ReadingProgress';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isOpenIDCourse = pathname?.startsWith('/courses/openid-connect');
  const isMCPCourse = pathname?.startsWith('/courses/model-context-protocol') || 
                      pathname?.startsWith('/courses/mcp');
  
  const isCourse = isOpenIDCourse || isMCPCourse;
  const isLandingPage = pathname === '/courses/openid-connect' || 
                        pathname === '/courses/model-context-protocol' ||
                        pathname === '/courses/mcp';
  const isModulePage = !isLandingPage && isCourse;

  if (isCourse) {
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
