import { Link } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import { categories } from '../data/topics'
import {
  Search,
  X,
  Menu,
  BookOpen,
  Star,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  Sparkles,
  Shield,
  Flame,
} from 'lucide-react'

export default function Sidebar() {
  const {
    filteredTopics,
    activeTopicId,
    selectTopic,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    completedTopics,
    favoriteTopics,
    topicNotes,
    progress,
    masteryRank,
    topics,
  } = useDashboard()

  const favoriteList = topics.filter((t) => favoriteTopics.includes(t.id))

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#183630]/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-white/95 dark:bg-[#112420]/95 backdrop-blur-2xl border-r border-[#183630]/15 dark:border-[#E5C690]/20 shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Topic navigation"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#183630]/15 dark:border-[#E5C690]/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#183630] via-[#234d45] to-[#E5C690] text-[#E3DAC9] flex items-center justify-center shadow-lg shadow-[#183630]/30 border border-[#E5C690]/40 shrink-0">
                <Code2 className="w-5 h-5 text-[#E5C690]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-extrabold text-[#183630] dark:text-[#E3DAC9] tracking-tight leading-tight truncate">
                  ShivamDev <span className="bg-gradient-to-r from-[#183630] via-[#2a5c53] to-[#E5C690] dark:from-[#E5C690] dark:to-[#f0dacb] bg-clip-text text-transparent">Studio</span>
                </h1>
                <p className="text-[11px] text-[#415c54] dark:text-[#a6b8b0] font-medium truncate">React & Algorithms</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630] text-[#415c54] dark:text-[#E3DAC9] transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mastery Rank & Progress Indicator */}
          <div className="mb-4 bg-[#E3DAC9]/40 dark:bg-[#183630]/60 p-3.5 rounded-2xl border border-[#183630]/10 dark:border-[#E5C690]/25 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{masteryRank.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#183630] dark:text-[#E3DAC9]">
                    {masteryRank.title}
                  </h4>
                  <span className="text-[10px] text-[#415c54] dark:text-[#a6b8b0] font-mono">
                    Level {masteryRank.level} / 5
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#183630] dark:text-[#E5C690] px-2 py-0.5 rounded-full bg-[#E5C690]/20 dark:bg-[#E5C690]/20 border border-[#E5C690]/40">
                {progress}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-[#E3DAC9] dark:bg-[#0d1f1c] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#183630] via-[#2d6358] to-[#E5C690] transition-all duration-500"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Learning progress"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#415c54] dark:text-[#a6b8b0] font-medium">
              <span>{completedTopics.length} of {topics.length} completed</span>
              <span>{topics.length - completedTopics.length} remaining</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#415c54] dark:text-[#a6b8b0]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Filter topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#E3DAC9]/40 dark:bg-[#0d1f1c] border border-[#183630]/15 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9] placeholder:text-[#415c54]/70 dark:placeholder:text-[#a6b8b0]/60 focus:outline-none focus:ring-2 focus:ring-[#E5C690] transition font-sans"
              aria-label="Filter topics"
            />
          </div>
        </div>

        {/* Workspaces, Simulator & Admin CTAs */}
        <div className="px-4 pt-3 space-y-2">
          <Link
            to="/interview"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#183630] via-[#1f4840] to-[#E5C690] text-[#E3DAC9] shadow-lg shadow-[#183630]/25 hover:scale-[1.02] active:scale-[0.98] border border-[#E5C690]/40 transition-all duration-200"
          >
            <Flame className="w-4 h-4 text-[#E5C690] animate-pulse" />
            <span className="font-extrabold">Take Mock Interview</span>
            <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#E5C690]/25 font-bold text-[#E5C690]">
              AI LIVE
            </span>
          </Link>

          <Link
            to="/practice"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF7F2] dark:bg-[#112420] text-[#183630] dark:text-[#E5C690] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] border border-[#183630]/15 dark:border-[#E5C690]/30 shadow-sm transition-all duration-200"
          >
            <Code2 className="w-4 h-4 text-[#E5C690]" />
            <span>Code Practice IDE</span>
            <ChevronRight className="w-4 h-4 ml-auto text-[#E5C690]" />
          </Link>

          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF7F2] dark:bg-[#112420] text-[#183630] dark:text-[#E5C690] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] border border-[#183630]/15 dark:border-[#E5C690]/30 shadow-sm transition-all duration-200"
          >
            <Shield className="w-4 h-4 text-[#E5C690]" />
            <span>Admin Studio (Add Content)</span>
            <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#E5C690]/20 font-bold">
              PORTAL
            </span>
          </Link>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-3 flex flex-wrap gap-1 border-b border-[#183630]/15 dark:border-[#E5C690]/20">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-[#183630] text-[#E3DAC9] dark:bg-[#E5C690] dark:text-[#183630] font-bold shadow-sm shadow-[#183630]/20'
                  : 'bg-[#E3DAC9]/40 dark:bg-[#183630]/60 text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840]'
              }`}
              aria-pressed={categoryFilter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Navigation Topic List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="React topics">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">No matching topics found</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const Icon = topic.icon
              const isActive = activeTopicId === topic.id
              const isCompleted = completedTopics.includes(topic.id)
              const isFavorite = favoriteTopics.includes(topic.id)

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => selectTopic(topic.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E5C690] ${
                    isActive
                      ? 'bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] shadow-md shadow-[#183630]/20 font-bold border border-[#E5C690]/30'
                      : 'text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9]/50 dark:hover:bg-[#183630]/70 hover:translate-x-0.5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#E5C690] dark:text-[#183630]' : 'text-[#415c54] dark:text-[#a6b8b0] group-hover:text-[#183630] dark:group-hover:text-[#E5C690]'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold truncate">{topic.title}</span>
                      {topic.readTime && (
                        <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-[#E5C690]/80 dark:text-[#183630]/80' : 'text-[#415c54] dark:text-[#a6b8b0]'}`}>
                          {topic.readTime.replace(' read', '')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 shrink-0">
                    {topic.difficulty && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          topic.difficulty === 'Beginner'
                            ? 'bg-emerald-500'
                            : topic.difficulty === 'Advanced'
                            ? 'bg-rose-500'
                            : 'bg-[#E5C690]'
                        }`}
                        title={`Difficulty: ${topic.difficulty}`}
                      />
                    )}
                    {Boolean(topicNotes?.[topic.id]?.trim()) && (
                      <FileText
                        className={`w-3 h-3 ${isActive ? 'text-[#E5C690]' : 'text-[#E5C690]'}`}
                        title="Has personal notes"
                      />
                    )}
                    {isFavorite && (
                      <Star
                        className={`w-3 h-3 ${isActive ? 'text-[#E5C690] fill-[#E5C690]' : 'text-[#E5C690] fill-[#E5C690]'}`}
                        aria-label="Favorite"
                      />
                    )}
                    {isCompleted && (
                      <CheckCircle2
                        className={`w-3 h-3 ${isActive ? 'text-emerald-400' : 'text-emerald-500'}`}
                        aria-label="Completed"
                      />
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />}
                  </span>
                </button>
              )
            })
          )}
        </nav>

        {/* Favorites Section */}
        {favoriteList.length > 0 && (
          <div className="p-4 border-t border-[#183630]/15 dark:border-[#E5C690]/20 bg-[#E3DAC9]/30 dark:bg-[#0d1f1c]/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#415c54] dark:text-[#a6b8b0] mb-2 flex items-center gap-1">
              <Star className="w-3 h-3 text-[#E5C690] fill-[#E5C690]" aria-hidden="true" />
              Starred ({favoriteList.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {favoriteList.slice(0, 4).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTopic(t.id)}
                  className="px-2 py-1 rounded-md text-[11px] font-medium bg-[#E3DAC9] dark:bg-[#183630] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/20 dark:border-[#E5C690]/30 hover:bg-[#E5C690]/30 transition"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export function SidebarToggle() {
  const { setSidebarOpen } = useDashboard()
  return (
    <button
      type="button"
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-[#E3DAC9]/50 dark:hover:bg-[#183630] text-[#183630] dark:text-[#E3DAC9] transition"
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
