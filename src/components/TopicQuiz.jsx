import React, { useState, useEffect, useRef } from 'react'
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Shuffle,
  Eye,
  AlertTriangle,
  Trophy,
} from 'lucide-react'
import { topicQuizzes } from '../data/topicQuizzes'
import { getCombinedTopicQuizzes } from '../services/adminService'
import { generateAIQuiz } from '../services/codePracticeApi'
import { useDashboard } from '../hooks/useDashboard'

export default function TopicQuiz({ topicId, topicTitle }) {
  const { showToast } = useDashboard()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [aiQuestions, setAiQuestions] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [useAiMode, setUseAiMode] = useState(false)

  // Dynamic Quiz Settings
  const [instantFeedback, setInstantFeedback] = useState(true)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60-second speed test
  const [reviewIncorrectOnly, setReviewIncorrectOnly] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState(null)

  // Standard fallback questions
  const create10DefaultQuestions = (title) => [
    {
      question: `How does ${title} fit into React's unidirectional data flow?`,
      options: [
        'By allowing child components to mutate parent state directly',
        'By keeping state and props flow top-down, predictable, and traceable',
        'By bypassing virtual DOM reconciliation',
        'By disabling event listeners on window resize',
      ],
      correct: 1,
      explanation: `${title} enforces clean top-down data architecture, ensuring state flow remains predictable across child components.`,
    },
    {
      question: `Which scenario represents a major anti-pattern when implementing ${title}?`,
      options: [
        'Validating component parameters with TypeScript or PropTypes',
        'Mutating state objects directly inside render or handler bodies',
        'Keeping component functions pure and side-effect free during render',
        'Using functional state updates when calculating new state',
      ],
      correct: 1,
      explanation: 'Direct state mutation bypasses React setter detection, skipping reconciliation and causing silent UI bugs.',
    },
    {
      question: `What is the recommended strategy for testing components built with ${title}?`,
      options: [
        'Inspecting private state variables via internal component instances',
        'Using React Testing Library to test user-centric DOM interactions',
        'Disabling test suites in production builds',
        'Relying solely on manual browser reloads',
      ],
      correct: 1,
      explanation: 'React Testing Library advocates testing components from the user perspective (screen.getByRole / userEvent).',
    },
    {
      question: `How does React 18 Concurrent Rendering impact ${title}?`,
      options: [
        'It executes all renders in a single synchronous blocking loop',
        'It breaks rendering into yieldable units to keep the UI input responsive',
        'It disables component mounting',
        'It converts React JSX into server-side PHP scripts',
      ],
      correct: 1,
      explanation: 'React 18 Concurrent mode enables interruptible rendering so urgent user keystrokes take priority over heavy renders.',
    },
    {
      question: `What happens when component dependencies related to ${title} are omitted in hooks?`,
      options: [
        'Callbacks capture stale closures referencing outdated state or prop values',
        'React injects dependencies automatically at build time',
        'The application crashes with a compiler error',
        'Browser garbage collection is paused',
      ],
      correct: 0,
      explanation: 'Omitting hook dependencies creates stale closures, causing function handlers to reference old state variables.',
    },
    {
      question: `Why is immutability crucial when updating state in ${title}?`,
      options: [
        'It allows React to perform instantaneous reference equality checks (old !== new)',
        'It prevents JavaScript garbage collection',
        'It turns components into static HTML files',
        'It speeds up CSS transition animations',
      ],
      correct: 0,
      explanation: 'Immutability allows React to compare references shallowly (`prev !== next`) to trigger reconciliation instantly.',
    },
    {
      question: `How does React.memo optimize components utilizing ${title}?`,
      options: [
        'By shallowly comparing incoming props and skipping re-renders if unchanged',
        'By performing a 100-level deep recursive check on all variables',
        'By storing component state in browser cookies',
        'By removing component DOM nodes permanently',
      ],
      correct: 0,
      explanation: 'React.memo performs shallow prop comparisons (`prevProps === nextProps`) to skip unnecessary render cycles.',
    },
    {
      question: `What is the best practice for managing side-effects alongside ${title}?`,
      options: [
        'Isolating side-effects in useEffect or handler functions instead of the render body',
        'Executing API calls directly inside the JSX return statement',
        'Modifying document.title during component reconciliation',
        'Using sync while loops inside render',
      ],
      correct: 0,
      explanation: 'Side-effects (data fetching, DOM subscriptions) must be kept out of pure render logic and placed inside useEffect.',
    },
    {
      question: `How should you structure complex nested data structures in ${title}?`,
      options: [
        'Keep state normalized (flattened) to avoid deep nested mutation bugs',
        'Nest state arrays 10 levels deep inside single objects',
        'Store everything in global window variables',
        'Use stringified HTML blocks',
      ],
      correct: 0,
      explanation: 'Normalized (flat) state structures simplify updating individual items without cloning deeply nested objects.',
    },
    {
      question: `When should you refactor or optimize components using ${title}?`,
      options: [
        'Prematurely on every component before writing logic',
        'After measuring real performance bottlenecks using React DevTools Profiler',
        'Never under any circumstances',
        'Only when changing CSS frameworks',
      ],
      correct: 1,
      explanation: 'Always profile rendering bottlenecks using React DevTools Profiler before adding memoization utilities.',
    },
  ]

  const get10StandardQuestions = () => {
    const existing = getCombinedTopicQuizzes(topicId) || []
    if (existing.length >= 10) return existing.slice(0, 10)
    const defaults = create10DefaultQuestions(topicTitle)
    return [...existing, ...defaults.slice(existing.length)].slice(0, 10)
  }

  const standard10 = get10StandardQuestions()
  const baseQuestions = useAiMode && aiQuestions?.length > 0 ? aiQuestions.slice(0, 10) : standard10
  const activeQuestionsList = shuffledQuestions || baseQuestions

  // Timer countdown
  useEffect(() => {
    if (!timerEnabled || submitted) return

    if (timeLeft <= 0) {
      setSubmitted(true)
      showToast('Time is up! Quiz submitted.')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timerEnabled, timeLeft, submitted, showToast])

  // Filter for review
  const displayQuestions = React.useMemo(() => {
    if (!reviewIncorrectOnly || !submitted) return activeQuestionsList
    return activeQuestionsList.filter((q, idx) => selectedAnswers[idx] !== q.correct)
  }, [reviewIncorrectOnly, submitted, activeQuestionsList, selectedAnswers])

  const safeIndex = displayQuestions.length > 0 ? Math.min(currentIndex, displayQuestions.length - 1) : 0
  const currentQ = displayQuestions[safeIndex]
  const userSel = selectedAnswers[safeIndex]

  const handleSelect = (oIdx) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({ ...prev, [safeIndex]: oIdx }))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, displayQuestions.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const score = Object.keys(selectedAnswers).reduce((acc, qIdx) => {
    return selectedAnswers[qIdx] === activeQuestionsList[qIdx]?.correct ? acc + 1 : acc
  }, 0)

  const handleReset = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setCurrentIndex(0)
    setTimeLeft(60)
    setReviewIncorrectOnly(false)
    setShuffledQuestions(null)
  }

  const handleShuffle = () => {
    const copy = [...baseQuestions]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    setShuffledQuestions(copy)
    setSelectedAnswers({})
    setSubmitted(false)
    setCurrentIndex(0)
    setTimeLeft(60)
    showToast('Quiz questions randomized! 🔀')
  }

  const handleGenerateAI = async () => {
    setLoadingAI(true)
    try {
      const data = await generateAIQuiz({ topicTitle })
      if (data.questions?.length > 0) {
        setAiQuestions(data.questions)
        setUseAiMode(true)
        setSelectedAnswers({})
        setSubmitted(false)
        setCurrentIndex(0)
        setShuffledQuestions(null)
        setTimeLeft(60)
        showToast(data.source === 'llm' ? 'Generated 10 AI Interview Questions!' : 'Generated 10 Fallback AI Questions!')
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoadingAI(false)
    }
  }

  const answeredCount = Object.keys(selectedAnswers).length
  const scorePercent = Math.round((score / (activeQuestionsList.length || 1)) * 100)

  return (
    <section className="space-y-4" aria-labelledby="quiz-section-title">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="quiz-section-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Test Your Understanding (10 Questions Drill)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive quiz with instant explanation feedback, speed timers, and AI decks.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {aiQuestions?.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setUseAiMode((m) => !m)
                setSelectedAnswers({})
                setSubmitted(false)
                setCurrentIndex(0)
                setShuffledQuestions(null)
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
            <span>{loadingAI ? 'Generating...' : 'AI Generate 10 Questions ✨'}</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            title="Randomize questions"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Dynamic Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Instant Feedback Toggle */}
          <button
            type="button"
            onClick={() => setInstantFeedback((v) => !v)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium border transition ${
              instantFeedback
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Instant Feedback: {instantFeedback ? 'ON' : 'OFF'}</span>
          </button>

          {/* Speed Timer Toggle */}
          <button
            type="button"
            onClick={() => {
              setTimerEnabled((v) => !v)
              setTimeLeft(60)
            }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium border transition ${
              timerEnabled
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Speed Timer (60s): {timerEnabled ? `${timeLeft}s remaining` : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Answered: {answeredCount} / {activeQuestionsList.length}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          {displayQuestions.map((_, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined
            const isCurrent = idx === safeIndex
            const isRight = (submitted || instantFeedback) && selectedAnswers[idx] === displayQuestions[idx].correct

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 bg-purple-600 text-white'
                    : isAnswered
                    ? isRight
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : (submitted || instantFeedback)
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        {/* Current Question Block */}
        {currentQ ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-purple-400 font-mono font-bold">
              <span>QUESTION {safeIndex + 1} OF {displayQuestions.length}</span>
              {submitted && (
                <span className={userSel === currentQ.correct ? 'text-emerald-400' : 'text-rose-400'}>
                  {userSel === currentQ.correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userSel === oIdx
                const isTargetCorrect = oIdx === currentQ.correct
                const showValidation = submitted || (instantFeedback && isSelected)

                let btnStyle = 'bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'

                if (showValidation) {
                  if (isTargetCorrect) {
                    btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold ring-1 ring-emerald-500/40'
                  } else if (isSelected && !isTargetCorrect) {
                    btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold ring-1 ring-rose-500/40'
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/25 border-purple-500'
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelect(oIdx)}
                    disabled={submitted}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm border transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-lg border border-current flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* Instant Feedback / Post-Submission Explanation */}
            {(submitted || (instantFeedback && userSel !== undefined)) && currentQ.explanation && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1 animate-fade-in">
                <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-400 block">
                  💡 Explanation & Reasoning:
                </span>
                <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">No questions to display.</div>
        )}

        {/* Carousel Navigation Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={safeIndex === displayQuestions.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!submitted ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitted(true)
                  showToast(`Quiz completed! You scored ${score}/${activeQuestionsList.length} (${scorePercent}%)`)
                }}
                disabled={answeredCount === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition"
              >
                <Check className="w-4 h-4" />
                <span>Submit Quiz ({answeredCount}/{activeQuestionsList.length})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewIncorrectOnly((v) => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    reviewIncorrectOnly
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {reviewIncorrectOnly ? 'Show All Questions' : 'Review Mistakes Only'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Score Summary Modal Card when Submitted */}
        {submitted && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Score: {score} / {activeQuestionsList.length} ({scorePercent}%)
                </h4>
                <p className="text-xs text-slate-300">
                  {scorePercent >= 80
                    ? 'Outstanding! You have strong grasp of this topic.'
                    : scorePercent >= 50
                    ? 'Good effort! Review the explanations above to achieve full mastery.'
                    : 'Keep practicing! Check the flashcards and study notes to reinforce key points.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition shrink-0"
            >
              Retake Drill
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
