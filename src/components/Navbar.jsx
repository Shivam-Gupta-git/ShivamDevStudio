import { useDashboard } from '../hooks/useDashboard'
import { SidebarToggle } from './Sidebar'
import { Moon, Sun, Star, CheckCircle2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { getTopicIndex, topics } from '../data/topics'

export default function Navbar() {
  const {
    activeTopic,
    theme,
    toggleTheme,
    toggleFavorite,
    toggleCompleted,
    favoriteTopics,
    completedTopics,
    goToPrevious,
    goToNext,
    activeTopicId,
    setCommandPaletteOpen,
    masteryRank,
  } = useDashboard()

  const idx = getTopicIndex(activeTopicId)
  const isFavorite = favoriteTopics.includes(activeTopicId)
  const isCompleted = completedTopics.includes(activeTopicId)

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-xl border-b border-[#183630]/15 dark:border-[#E5C690]/20 shadow-xs">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarToggle />
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#415c54] dark:text-[#a6b8b0]">
              <li className="hover:text-[#183630] dark:hover:text-[#E3DAC9] transition font-semibold">ShivamDev Studio</li>
              <li aria-hidden="true" className="text-[#183630]/30 dark:text-[#E3DAC9]/30">/</li>
              <li className="text-[#183630] dark:text-[#E3DAC9]">{activeTopic.category}</li>
              <li aria-hidden="true" className="text-[#183630]/30 dark:text-[#E3DAC9]/30">/</li>
              <li
                className="font-bold text-[#183630] dark:text-[#E5C690] truncate"
                aria-current="page"
              >
                {activeTopic.title}
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E3DAC9]/40 dark:bg-[#183630]/70 border border-[#183630]/15 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9]"
            title={`Current Mastery Rank: ${masteryRank.title}`}
          >
            <span>{masteryRank.icon}</span>
            <span>{masteryRank.title}</span>
          </div>

          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#415c54] dark:text-[#a6b8b0] bg-[#E3DAC9]/40 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] border border-[#183630]/15 dark:border-[#E5C690]/30 transition-colors"
            title="Open Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#183630] dark:text-[#E5C690]" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#183630] dark:text-[#E5C690] bg-white dark:bg-[#0d1f1c] rounded border border-[#183630]/20 dark:border-[#E5C690]/30">
              ⌘K
            </kbd>
          </button>

          <div className="w-px h-5 bg-[#183630]/15 dark:bg-[#E5C690]/20 mx-0.5 hidden sm:block" />

          <button
            type="button"
            onClick={() => toggleFavorite(activeTopicId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E5C690] ${
              isFavorite
                ? 'text-[#183630] dark:text-[#183630] bg-[#E5C690] dark:bg-[#E5C690] border border-[#E5C690] shadow-xs font-bold'
                : 'text-[#415c54] dark:text-[#E3DAC9] bg-[#E3DAC9]/40 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] border border-[#183630]/15 dark:border-[#E5C690]/30'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current text-[#183630]' : 'text-[#E5C690]'}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Starred' : 'Star'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleCompleted(activeTopicId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E5C690] ${
              isCompleted
                ? 'text-[#183630] dark:text-[#183630] bg-[#E5C690] dark:bg-[#E5C690] border border-[#E5C690] shadow-xs font-bold'
                : 'text-[#415c54] dark:text-[#E3DAC9] bg-[#E3DAC9]/40 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] border border-[#183630]/15 dark:border-[#E5C690]/30'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
            aria-pressed={isCompleted}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-[#183630]' : 'text-emerald-500'}`} />
            <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Done'}</span>
          </button>

          <div className="w-px h-5 bg-[#183630]/15 dark:bg-[#E5C690]/20 mx-0.5" />

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#183630] dark:text-[#E5C690] bg-[#E3DAC9]/40 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] border border-[#183630]/15 dark:border-[#E5C690]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E5C690]" /> : <Moon className="w-4 h-4 text-[#183630]" />}
          </button>
        </div>
      </div>

      {/* Prev / Next Pagination Sub-bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 bg-[#FAF7F2]/80 dark:bg-[#0d1f1c]/80 border-t border-[#183630]/10 dark:border-[#E5C690]/15 gap-2">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={idx === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] hover:shadow-xs border border-transparent hover:border-[#183630]/20 dark:hover:border-[#E5C690]/30 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
          aria-label="Previous topic"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-medium text-[#415c54] dark:text-[#a6b8b0]">
          <span className="px-2.5 py-0.5 rounded-full bg-[#E3DAC9] dark:bg-[#183630] text-[#183630] dark:text-[#E5C690] font-bold border border-[#183630]/10 dark:border-[#E5C690]/30">
            {idx + 1} of {topics.length}
          </span>
          <span className="hidden md:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[#E3DAC9] dark:bg-[#183630] text-[10px] text-[#183630] dark:text-[#E5C690] font-mono border border-[#183630]/10 dark:border-[#E5C690]/30">⌘←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#E3DAC9] dark:bg-[#183630] text-[10px] text-[#183630] dark:text-[#E5C690] font-mono border border-[#183630]/10 dark:border-[#E5C690]/30">⌘→</kbd>
          </span>
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={idx === topics.length - 1}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] hover:shadow-xs border border-transparent hover:border-[#183630]/20 dark:hover:border-[#E5C690]/30 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
          aria-label="Next topic"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
