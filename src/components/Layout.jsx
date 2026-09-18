import { Suspense } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import TopicPage from './TopicPage'
import ScrollToTop from './ScrollToTop'
import LoadingSpinner from './LoadingSpinner'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d1f1c] text-[#183630] dark:text-[#E3DAC9] transition-colors duration-300 relative overflow-x-hidden">
      {/* Background ambient gradient glow with #183630 and #E5C690 */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 dark:opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E5C690]/30 via-transparent to-[#183630]/20 dark:from-[#E5C690]/15 dark:to-[#183630]/60" />

      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" id="main-content" role="main">
          <Suspense fallback={<LoadingSpinner message="Loading topic..." />}>
            <TopicPage />
          </Suspense>
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}
