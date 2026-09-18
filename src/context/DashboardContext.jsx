import { useCallback, useMemo, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { topics, getTopicById, getTopicIndex } from '../data/topics'
import { DashboardContext } from './createDashboardContext'


export function DashboardProvider({ children }) {
  const [activeTopicId, setActiveTopicId] = useLocalStorage('react-dashboard-topic', topics[0].id)
  const [theme, setTheme] = useLocalStorage('react-dashboard-theme', 'light')
  const [completedTopics, setCompletedTopics] = useLocalStorage('react-dashboard-completed', [])
  const [favoriteTopics, setFavoriteTopics] = useLocalStorage('react-dashboard-favorites', [])
  const [topicNotes, setTopicNotes] = useLocalStorage('react-dashboard-notes', {})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [toast, setToast] = useState(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  const activeTopic = getTopicById(activeTopicId) ?? topics[0]

  const getTopicNote = useCallback((id) => topicNotes[id] || '', [topicNotes])

  const saveTopicNote = useCallback(
    (id, noteText) => {
      setTopicNotes((prev) => ({
        ...prev,
        [id]: noteText,
      }))
    },
    [setTopicNotes],
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [])

  const selectTopic = useCallback(
    (id) => {
      setActiveTopicId(id)
      setSidebarOpen(false)
      setCommandPaletteOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setActiveTopicId],
  )

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  const toggleCompleted = useCallback(
    (id) => {
      setCompletedTopics((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
      )
    },
    [setCompletedTopics],
  )

  const toggleFavorite = useCallback(
    (id) => {
      setFavoriteTopics((prev) =>
        prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
      )
    },
    [setFavoriteTopics],
  )

  const goToNext = useCallback(() => {
    const idx = getTopicIndex(activeTopicId)
    if (idx < topics.length - 1) selectTopic(topics[idx + 1].id)
  }, [activeTopicId, selectTopic])

  const goToPrevious = useCallback(() => {
    const idx = getTopicIndex(activeTopicId)
    if (idx > 0) selectTopic(topics[idx - 1].id)
  }, [activeTopicId, selectTopic])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
        return
      }
      if (e.target.matches('input, textarea, select')) return
      if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        goToNext()
      }
      if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        goToPrevious()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesCategory = categoryFilter === 'All' || topic.category === categoryFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [searchQuery, categoryFilter])

  const progress = useMemo(
    () => Math.round((completedTopics.length / topics.length) * 100),
    [completedTopics],
  )

  const masteryRank = useMemo(() => {
    if (progress >= 100) return { title: 'React Master', level: 5, icon: '👑', color: 'emerald' }
    if (progress >= 75) return { title: 'React Specialist', level: 4, icon: '💎', color: 'purple' }
    if (progress >= 50) return { title: 'React Practitioner', level: 3, icon: '🥇', color: 'amber' }
    if (progress >= 25) return { title: 'React Apprentice', level: 2, icon: '🥈', color: 'cyan' }
    return { title: 'React Novice', level: 1, icon: '🥉', color: 'indigo' }
  }, [progress])

  const value = {
    topics,
    activeTopic,
    activeTopicId,
    selectTopic,
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    filteredTopics,
    completedTopics,
    toggleCompleted,
    favoriteTopics,
    toggleFavorite,
    topicNotes,
    getTopicNote,
    saveTopicNote,
    progress,
    masteryRank,
    goToNext,
    goToPrevious,
    toast,
    showToast,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}


