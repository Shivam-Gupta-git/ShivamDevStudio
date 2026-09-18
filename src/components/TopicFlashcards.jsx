import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Shuffle,
  Play,
  Pause,
  Filter,
  RotateCcw,
  Volume2,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { generateAIFlashcards } from '../services/codePracticeApi'
import { getCustomFlashcards } from '../services/adminService'

export default function TopicFlashcards({ topicId, topicTitle, questions, keyPoints }) {
  const { showToast } = useDashboard()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredMap, setMasteredMap] = useState({})
  const [aiCards, setAiCards] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [useAiMode, setUseAiMode] = useState(false)

  // Dynamic Study Filters & Tools
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'unmastered' | 'mastered'
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(4000)
  const [shuffledIndices, setShuffledIndices] = useState(null)

  // Load mastered flashcards from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`flashcards-mastered-${topicId}`)
      if (saved) {
        setMasteredMap(JSON.parse(saved))
      } else {
        setMasteredMap({})
      }
    } catch {
      setMasteredMap({})
    }
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsAutoPlaying(false)
    setShuffledIndices(null)
  }, [topicId])

  const customCards = (getCustomFlashcards()[topicId] || []).map((c) => ({
    question: c.question,
    answer: {
      summary: c.summary,
      points: c.points || [],
    },
  }))

  const baseQuestions =
    useAiMode && aiCards?.length > 0 ? aiCards : [...customCards, ...(questions || [])]

  // Compute active deck based on filter & shuffle
  const activeDeck = React.useMemo(() => {
    let list = baseQuestions.map((q, originalIndex) => ({
      item: q,
      originalIndex,
      isMastered: Boolean(masteredMap[`${useAiMode ? 'ai-' : ''}${originalIndex}`]),
    }))

    if (filterMode === 'unmastered') {
      list = list.filter((c) => !c.isMastered)
    } else if (filterMode === 'mastered') {
      list = list.filter((c) => c.isMastered)
    }

    if (shuffledIndices && shuffledIndices.length === list.length) {
      return shuffledIndices.map((i) => list[i]).filter(Boolean)
    }

    return list
  }, [baseQuestions, filterMode, masteredMap, useAiMode, shuffledIndices])

  // Handle safe index bounds
  const safeIndex = activeDeck.length > 0 ? Math.min(currentIndex, activeDeck.length - 1) : 0
  const currentCard = activeDeck[safeIndex]

  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length)
  }, [activeDeck.length])

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length)
  }, [activeDeck.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped((f) => !f)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isAutoPlaying || activeDeck.length === 0) return

    const timer = setInterval(() => {
      setIsFlipped((prevFlipped) => {
        if (!prevFlipped) {
          return true // flip to reveal answer
        } else {
          handleNext() // go to next card
          return false
        }
      })
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, autoPlayInterval, activeDeck.length, handleNext])

  const toggleMastered = (originalIdx) => {
    const key = `${useAiMode ? 'ai-' : ''}${originalIdx}`
    const next = { ...masteredMap, [key]: !masteredMap[key] }
    setMasteredMap(next)
    try {
      localStorage.setItem(`flashcards-mastered-${topicId}`, JSON.stringify(next))
    } catch {}
    if (!masteredMap[key]) {
      showToast(`Card marked as Mastered! 🎉`)
    }
  }

  const handleShuffle = () => {
    if (activeDeck.length <= 1) return
    const indices = Array.from({ length: activeDeck.length }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setShuffledIndices(indices)
    setCurrentIndex(0)
    setIsFlipped(false)
    showToast('Deck shuffled! 🔀')
  }

  const handleResetMastery = () => {
    setMasteredMap({})
    try {
      localStorage.removeItem(`flashcards-mastered-${topicId}`)
    } catch {}
    showToast('Mastery progress reset')
  }

  const handleGenerateAI = async () => {
    setLoadingAI(true)
    try {
      const data = await generateAIFlashcards({ topicTitle })
      if (data.flashcards?.length > 0) {
        setAiCards(data.flashcards)
        setUseAiMode(true)
        setCurrentIndex(0)
        setIsFlipped(false)
        setFilterMode('all')
        setShuffledIndices(null)
        showToast(data.source === 'llm' ? 'AI Flashcards Generated!' : 'Generated Fallback AI Flashcards!')
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoadingAI(false)
    }
  }

  const masteredCount = Object.keys(masteredMap).filter((k) => masteredMap[k]).length
  const totalInBase = baseQuestions.length
  const masteryPercent = totalInBase > 0 ? Math.round((masteredCount / totalInBase) * 100) : 0

  if (!baseQuestions || baseQuestions.length === 0) return null

  // Answer formatting
  const getAnswer = (item, originalIdx) => {
    if (useAiMode && typeof item === 'object') {
      return {
        summary: item.summary,
        points: item.points,
      }
    }

    if (originalIdx === 0) {
      return {
        summary: keyPoints?.why || 'Core fundamental concept in React architecture.',
        points: keyPoints?.advantages || ['Enables modular components', 'Predictable data flow'],
      }
    } else if (originalIdx === 1) {
      return {
        summary: keyPoints?.limitations?.[0] || 'Requires understanding React component lifecycle and state boundaries.',
        points: keyPoints?.limitations || ['Read-only props', 'Requires lifting state up for sibling updates'],
      }
    } else {
      return {
        summary: `Key interview response for ${topicTitle}: Focus on real-world application, state immutability, and React re-render optimization.`,
        points: keyPoints?.interviewQuestions || [],
      }
    }
  }

  const questionText = currentCard
    ? typeof currentCard.item === 'string'
      ? currentCard.item
      : currentCard.item.question
    : ''
  const answer = currentCard ? getAnswer(currentCard.item, currentCard.originalIndex) : null

  return (
    <section className="space-y-4" aria-labelledby="flashcards-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="flashcards-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Interview Flashcard Drill
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive spaced repetition with auto-play, deck filters, and AI generation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {aiCards?.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setUseAiMode((m) => !m)
                setCurrentIndex(0)
                setIsFlipped(false)
                setFilterMode('all')
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            >
              {useAiMode ? 'Standard Deck' : 'AI Deck ✨'}
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={loadingAI}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition shadow-md shadow-purple-600/20"
          >
            {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-200" />}
            <span>{loadingAI ? 'Generating...' : 'AI Generate ✨'}</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAutoPlaying((p) => !p)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isAutoPlaying
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? 'Pause Auto' : 'Auto Play'}</span>
          </button>
        </div>
      </div>

      {/* Deck Filters & Mastery Stats Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Filter Deck:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            {['all', 'unmastered', 'mastered'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setFilterMode(mode)
                  setCurrentIndex(0)
                  setIsFlipped(false)
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterMode === mode
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
            {masteredCount} / {totalInBase} Mastered ({masteryPercent}%)
          </span>
          {masteredCount > 0 && (
            <button
              type="button"
              onClick={handleResetMastery}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition"
              title="Reset Mastered"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Interactive Card */}
      {activeDeck.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {filterMode === 'unmastered'
              ? 'All cards in this deck are mastered! 🎉'
              : 'No cards match the selected filter.'}
          </h3>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/20"
          >
            Show All Cards
          </button>
        </div>
      ) : (
        <div className="relative min-h-[260px]">
          <div
            onClick={() => setIsFlipped((f) => !f)}
            className={`w-full min-h-[260px] p-6 sm:p-8 rounded-3xl cursor-pointer select-none transition-all duration-300 border shadow-xl flex flex-col justify-between relative overflow-hidden ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/40 text-slate-100'
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white hover:border-indigo-500/40'
            }`}
          >
            {/* Card Top Meta */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-indigo-500 uppercase tracking-wider">
                  Card {safeIndex + 1} of {activeDeck.length} {isFlipped ? '· Answer' : '· Question'}
                </span>
                {useAiMode && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI Generated
                  </span>
                )}
                {currentCard?.isMastered && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Mastered ✓
                  </span>
                )}
              </div>

              <span className="text-slate-400 text-[11px] font-mono flex items-center gap-1">
                <RotateCw className="w-3 h-3 text-indigo-400" /> Space or Click to flip
              </span>
            </div>

            {/* Card Main Content */}
            <div className="my-5">
              {!isFlipped ? (
                <div className="space-y-3 animate-fade-in">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    Interview Question
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold leading-snug">
                    {questionText}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in text-slate-100">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Senior Developer Model Answer
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-200">
                    {answer?.summary}
                  </p>
                  {answer?.points?.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-300">
                      {answer.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Card Bottom Controls */}
            <div
              className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  title="Previous card (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  title="Next card (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  ← / → navigate
                </span>
              </div>

              <button
                type="button"
                onClick={() => currentCard && toggleMastered(currentCard.originalIndex)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentCard?.isMastered
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{currentCard?.isMastered ? 'Mastered ✓' : 'Mark Mastered'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
