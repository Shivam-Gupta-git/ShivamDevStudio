import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useNavigate, useLocation } from 'react-router-dom'
import { searchAllTopicCode } from '../data/topicCode'
import { Search, Command, X, ArrowRight, Code, BookOpen, Sun, Moon, Star, CheckCircle2, Sparkles, Terminal, FileCode, Shield, Flame } from 'lucide-react'

const practiceProblems = [
  { id: 'sum-two-numbers', title: 'Sum of Two Numbers', category: 'Code Practice', difficulty: 'Easy', path: '/practice' },
  { id: 'reverse-string', title: 'Reverse a String', category: 'Code Practice', difficulty: 'Easy', path: '/practice' },
  { id: 'valid-palindrome', title: 'Valid Palindrome', category: 'Code Practice', difficulty: 'Easy', path: '/practice' },
  { id: 'max-subarray', title: 'Maximum Subarray (Kadane)', category: 'Code Practice', difficulty: 'Medium', path: '/practice' },
  { id: 'merge-arrays', title: 'Merge Sorted Arrays', category: 'Code Practice', difficulty: 'Medium', path: '/practice' },
]

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    topics,
    selectTopic,
    theme,
    toggleTheme,
    activeTopicId,
    toggleCompleted,
    toggleFavorite,
    completedTopics,
    favoriteTopics,
    showToast,
  } = useDashboard()

  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  // Build searchable items list
  const searchableItems = useMemo(() => {
    const items = []

    // 1. Topic items
    topics.forEach((t) => {
      items.push({
        id: `topic-${t.id}`,
        type: 'topic',
        title: t.title,
        subtitle: `${t.readTime ? t.readTime + ' · ' : ''}${t.description}`,
        badge: t.difficulty ? `${t.category} (${t.difficulty})` : t.category,
        icon: BookOpen,
        action: () => {
          if (location.pathname !== '/') navigate('/')
          selectTopic(t.id)
          setCommandPaletteOpen(false)
        },
      })
    })

    // 2. Full-text source code matches across all React examples
    if (query.trim().length >= 2) {
      const codeMatches = searchAllTopicCode(query)
      codeMatches.slice(0, 10).forEach((match, idx) => {
        const matchedTopic = topics.find((t) => t.id === match.topicId)
        if (!matchedTopic) return
        items.push({
          id: `code-${match.topicId}-${match.lineNumber}-${idx}`,
          type: 'code',
          title: `${matchedTopic.title} (Line ${match.lineNumber})`,
          subtitle: match.lineContent,
          badge: 'Code Match',
          icon: FileCode,
          action: () => {
            if (location.pathname !== '/') navigate('/')
            selectTopic(match.topicId)
            setCommandPaletteOpen(false)
          },
        })
      })
    }

    // 3. Practice problem items
    practiceProblems.forEach((p) => {
      items.push({
        id: `problem-${p.id}`,
        type: 'problem',
        title: p.title,
        subtitle: `Difficulty: ${p.difficulty} · Interactive Judge0 IDE`,
        badge: 'IDE Problem',
        badgeColor: p.difficulty === 'Easy' ? 'emerald' : 'amber',
        icon: Code,
        action: () => {
          navigate('/practice')
          setCommandPaletteOpen(false)
        },
      })
    })

    // 4. Quick Actions
    items.push({
      id: 'action-theme',
      type: 'action',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: `Toggle application visual theme`,
      badge: 'Theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme()
        setCommandPaletteOpen(false)
      },
    })

    items.push({
      id: 'action-interview',
      type: 'action',
      title: 'Take AI Mock Interview Simulator',
      subtitle: 'Simulate high-pressure FAANG & Senior React technical interview',
      badge: 'Simulator',
      icon: Flame,
      action: () => {
        navigate('/interview')
        setCommandPaletteOpen(false)
      },
    })

    items.push({
      id: 'action-practice',
      type: 'action',
      title: 'Open Code Practice Workspace',
      subtitle: 'Write algorithms in Monaco Editor with Judge0 sandbox',
      badge: 'Workspace',
      icon: Terminal,
      action: () => {
        navigate('/practice')
        setCommandPaletteOpen(false)
      },
    })

    items.push({
      id: 'action-admin',
      type: 'action',
      title: 'Open Admin Studio (Add Questions & Content)',
      subtitle: 'Manage DSA coding problems, quiz questions, and flashcards',
      badge: 'Admin',
      icon: Shield,
      action: () => {
        navigate('/admin')
        setCommandPaletteOpen(false)
      },
    })

    const isCompleted = completedTopics.includes(activeTopicId)
    const isFavorite = favoriteTopics.includes(activeTopicId)

    items.push({
      id: 'action-complete',
      type: 'action',
      title: isCompleted ? 'Mark Topic as Incomplete' : 'Mark Topic as Completed',
      subtitle: `Update your mastery level & study progress`,
      badge: 'Progress',
      icon: CheckCircle2,
      action: () => {
        toggleCompleted(activeTopicId)
        showToast(isCompleted ? 'Marked as incomplete' : 'Topic completed! 🎉')
        setCommandPaletteOpen(false)
      },
    })

    items.push({
      id: 'action-star',
      type: 'action',
      title: isFavorite ? 'Remove Topic from Starred' : 'Star Current Topic',
      subtitle: `Save to your favorites sidebar list`,
      badge: 'Favorite',
      icon: Star,
      action: () => {
        toggleFavorite(activeTopicId)
        showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites!')
        setCommandPaletteOpen(false)
      },
    })

    // Filter by query
    const q = query.toLowerCase().trim()
    if (!q) return items

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
    )
  }, [query, topics, theme, activeTopicId, completedTopics, favoriteTopics, location.pathname, navigate, selectTopic, toggleTheme, toggleCompleted, toggleFavorite, showToast, setCommandPaletteOpen])

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setCommandPaletteOpen(false)
      return
    }

    if (searchableItems.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % searchableItems.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + searchableItems.length) % searchableItems.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = searchableItems[selectedIndex]
      if (selected) {
        selected.action()
      }
    }
  }

  if (!commandPaletteOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#183630]/75 backdrop-blur-xl animate-fade-in"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#112420] border border-[#183630]/20 dark:border-[#E5C690]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#183630]/15 dark:border-[#E5C690]/20 bg-[#FAF7F2]/60 dark:bg-[#0d1f1c]/60">
          <Search className="w-5 h-5 text-[#183630] dark:text-[#E5C690] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, practice problems, or actions... (type 'use', 'state', etc.)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[#183630] dark:text-[#E3DAC9] placeholder-[#415c54]/60 dark:placeholder-[#a6b8b0]/60 text-sm sm:text-base focus:outline-none focus:ring-0"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-[#E3DAC9]/60 dark:hover:bg-[#183630] text-[#415c54] dark:text-[#E3DAC9] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-semibold text-[#183630] dark:text-[#E5C690] bg-[#E3DAC9]/60 dark:bg-[#183630] rounded-md border border-[#183630]/15 dark:border-[#E5C690]/30">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {searchableItems.length > 0 ? (
            searchableItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              const ItemIcon = item.icon

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] shadow-md shadow-[#183630]/20 font-bold border border-[#E5C690]/30'
                      : 'hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/60 text-[#183630] dark:text-[#E3DAC9]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-current'
                          : 'bg-[#E3DAC9]/60 dark:bg-[#183630] text-[#183630] dark:text-[#E5C690]'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 border ${
                            isSelected
                              ? 'bg-white/20 text-current border-current/30'
                              : 'bg-[#E3DAC9]/50 dark:bg-[#183630] text-[#415c54] dark:text-[#E3DAC9] border-[#183630]/15 dark:border-[#E5C690]/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isSelected ? 'opacity-90' : 'text-[#415c54] dark:text-[#a6b8b0]'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-current translate-x-1' : 'opacity-0'
                    }`}
                  />
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#E5C690] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[#183630] dark:text-[#E3DAC9]">
                No matching results found for "{query}"
              </p>
              <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">Try searching for "useState", "useContext", or "Reverse String"</p>
            </div>
          )}
        </div>

        {/* Bottom Keyboard Shortcut Guide Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAF7F2] dark:bg-[#0d1f1c] border-t border-[#183630]/15 dark:border-[#E5C690]/20 text-[11px] text-[#415c54] dark:text-[#a6b8b0] font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#E3DAC9] dark:bg-[#183630] text-[#183630] dark:text-[#E5C690]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-[#E3DAC9] dark:bg-[#183630] text-[#183630] dark:text-[#E5C690]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#E3DAC9] dark:bg-[#183630] text-[#183630] dark:text-[#E5C690]">↵</kbd> Select
            </span>
          </div>
          <div>
            <span className="font-semibold text-[#183630] dark:text-[#E5C690]">ShivamDev Studio Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  )
}
