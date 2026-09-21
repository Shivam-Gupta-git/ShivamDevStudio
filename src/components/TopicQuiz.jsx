import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Shuffle,
  Trophy,
  Target,
  AlertCircle,
  Award,
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
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60-second speed test
  const [reviewIncorrectOnly, setReviewIncorrectOnly] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState(null)
  const resultsRef = useRef(null)

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
  const rawQuestionsList = shuffledQuestions || baseQuestions

  const activeQuestionsList = useMemo(() => {
    return rawQuestionsList.map((q, idx) => ({
      ...q,
      originalIndex: idx,
    }))
  }, [rawQuestionsList])

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
  const displayQuestions = useMemo(() => {
    if (!reviewIncorrectOnly || !submitted) return activeQuestionsList
    return activeQuestionsList.filter((q) => selectedAnswers[q.originalIndex] !== q.correct)
  }, [reviewIncorrectOnly, submitted, activeQuestionsList, selectedAnswers])

  const safeIndex = displayQuestions.length > 0 ? Math.min(currentIndex, displayQuestions.length - 1) : 0
  const currentQ = displayQuestions[safeIndex]
  const userSel = currentQ ? selectedAnswers[currentQ.originalIndex] : undefined

  const handleSelect = (oIdx) => {
    if (submitted || !currentQ) return
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.originalIndex]: oIdx }))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, displayQuestions.length - 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const score = Object.keys(selectedAnswers).reduce((acc, qIdx) => {
    const numericIdx = Number(qIdx)
    return selectedAnswers[numericIdx] === activeQuestionsList[numericIdx]?.correct ? acc + 1 : acc
  }, 0)

  const answeredCount = Object.keys(selectedAnswers).length
  const totalQuestions = activeQuestionsList.length
  const incorrectCount = answeredCount - score
  const unattemptedCount = Math.max(0, totalQuestions - answeredCount)
  const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  const handleSubmit = () => {
    setSubmitted(true)
    showToast(`Quiz submitted! You scored ${score}/${totalQuestions} (${scorePercent}%)`)
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

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
              {submitted
                ? 'Review your test results, answer breakdown, and detailed explanations below.'
                : 'Select your answers and click "Submit Quiz" to reveal your test score and explanations.'}
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
          {/* Status Mode Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
            <Target className="w-3.5 h-3.5" />
            <span>{submitted ? 'Status: Submitted & Evaluated' : 'Status: Test Drill in Progress'}</span>
          </div>

          {/* Speed Timer Toggle */}
          {!submitted && (
            <button
              type="button"
              onClick={() => {
                setTimerEnabled((v) => !v)
                setTimeLeft(60)
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium border transition ${
                timerEnabled
                  ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Speed Timer (60s): {timerEnabled ? `${timeLeft}s left` : 'OFF'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Answered: {answeredCount} / {totalQuestions}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Test Score & Performance Summary Banner (Visible after Submit) */}
      {submitted && (
        <div
          ref={resultsRef}
          className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 backdrop-blur-xl shadow-2xl space-y-4 animate-fade-in text-white"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 shrink-0 ring-4 ring-purple-500/20">
                <Trophy className="w-8 h-8 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                    Test Score Result
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      scorePercent >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : scorePercent >= 50
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {scorePercent >= 80 ? 'Mastery Achieved 🌟' : scorePercent >= 50 ? 'Good Effort 👍' : 'Needs Practice 📚'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  {score} / {totalQuestions}{' '}
                  <span className="text-lg sm:text-xl font-bold text-purple-300">
                    ({scorePercent}%)
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  {scorePercent >= 80
                    ? 'Outstanding! You have a solid understanding of these core concepts.'
                    : scorePercent >= 50
                    ? 'Solid start! Review the explanations below to master the trickier topics.'
                    : 'Keep working! Review the correct answers and explanations below to strengthen your fundamentals.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setReviewIncorrectOnly((v) => !v)
                  setCurrentIndex(0)
                }}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition shadow-sm ${
                  reviewIncorrectOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {reviewIncorrectOnly ? 'View All Questions' : 'Review Mistakes Only'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Drill
              </button>
            </div>
          </div>

          {/* Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-purple-500/20 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Total Questions</span>
              <span className="font-mono font-bold text-white">{totalQuestions}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <span className="text-emerald-300">Correct</span>
              <span className="font-mono font-bold text-emerald-400">{score}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <span className="text-rose-300">Incorrect</span>
              <span className="font-mono font-bold text-rose-400">{incorrectCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <span className="text-amber-300">Unanswered</span>
              <span className="font-mono font-bold text-amber-400">{unattemptedCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6 relative overflow-hidden">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          {displayQuestions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.originalIndex] !== undefined
            const isCurrent = idx === safeIndex
            const isRight = submitted && selectedAnswers[q.originalIndex] === q.correct

            let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'

            if (isCurrent) {
              btnClass = 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 bg-purple-600 text-white'
            } else if (submitted) {
              if (isRight) {
                btnClass = 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 font-bold'
              } else if (isAnswered) {
                btnClass = 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/40 font-bold'
              } else {
                btnClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }
            } else if (isAnswered) {
              btnClass = 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-semibold'
            }

            return (
              <button
                key={q.originalIndex}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center shrink-0 ${btnClass}`}
                title={`Question ${idx + 1}`}
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
              <span>
                QUESTION {safeIndex + 1} OF {displayQuestions.length}
                {reviewIncorrectOnly && ' (Review Mistakes)'}
              </span>
              {submitted && (
                <span
                  className={`flex items-center gap-1 font-semibold ${
                    userSel === currentQ.correct
                      ? 'text-emerald-400'
                      : userSel !== undefined
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {userSel === currentQ.correct ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                    </>
                  ) : userSel !== undefined ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" /> Unanswered
                    </>
                  )}
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

                let btnStyle =
                  'bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'

                if (submitted) {
                  if (isTargetCorrect) {
                    btnStyle =
                      'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/40 shadow-sm'
                  } else if (isSelected && !isTargetCorrect) {
                    btnStyle =
                      'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-200 font-semibold ring-2 ring-rose-500/40 shadow-sm'
                  } else {
                    btnStyle =
                      'opacity-60 bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }
                } else if (isSelected) {
                  btnStyle =
                    'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/25 border-purple-500'
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelect(oIdx)}
                    disabled={submitted}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm border transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
                  >
                    <span
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                        submitted && isTargetCorrect
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : submitted && isSelected && !isTargetCorrect
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : isSelected
                          ? 'border-white/50 bg-white/20 text-white'
                          : 'border-current'
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-relaxed flex-1">{opt}</span>

                    {/* Result Badges after submission */}
                    {submitted && isTargetCorrect && (
                      <span className="shrink-0 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Correct Answer
                      </span>
                    )}
                    {submitted && isSelected && !isTargetCorrect && (
                      <span className="shrink-0 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Your Choice
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Post-Submission Explanation */}
            {submitted && currentQ.explanation && (
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-indigo-300 space-y-1.5 animate-fade-in">
                <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Explanation & Reasoning:
                </span>
                <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">{currentQ.explanation}</p>
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
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  Submit Quiz ({answeredCount}/{totalQuestions})
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReviewIncorrectOnly((v) => !v)
                    setCurrentIndex(0)
                  }}
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
      </div>
    </section>
  )
}

