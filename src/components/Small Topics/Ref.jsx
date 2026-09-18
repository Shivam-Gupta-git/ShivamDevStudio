import React, { useRef, useState, useEffect } from 'react'
import {
  Target,
  Focus,
  Eraser,
  Sparkles,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Zap,
  Info,
  Sliders,
} from 'lucide-react'

export default function RefDemo() {
  const [activeTab, setActiveTab] = useState('dom') // 'dom' | 'mutable'
  const inputRef = useRef(null)
  const [stateCounter, setStateCounter] = useState(0)

  // Mutable ref instance for render-free tracking
  const renderTickerRef = useRef(1)
  renderTickerRef.current += 1

  const timerRef = useRef(null)
  const timerSecondsRef = useRef(0)
  const [timerDisplay, setTimerDisplay] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  const handleSelectAll = () => {
    inputRef.current?.select()
  }

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleShakeAnimation = () => {
    if (!inputRef.current) return
    inputRef.current.classList.add('animate-bounce')
    setTimeout(() => {
      inputRef.current?.classList.remove('animate-bounce')
    }, 1000)
  }

  const handleHighlight = () => {
    if (inputRef.current) {
      inputRef.current.style.borderColor = '#6366f1'
      inputRef.current.style.boxShadow = '0 0 0 5px rgba(99, 102, 241, 0.35)'
    }
  }

  // Timer controls using useRef to avoid re-rendering whole tree on interval
  const handleStartTimer = () => {
    if (isTimerRunning) return
    setIsTimerRunning(true)
    timerRef.current = setInterval(() => {
      timerSecondsRef.current += 1
      // Synchronously update lightweight display
      setTimerDisplay(timerSecondsRef.current)
    }, 100)
  }

  const handlePauseTimer = () => {
    clearInterval(timerRef.current)
    setIsTimerRunning(false)
  }

  const handleResetTimer = () => {
    clearInterval(timerRef.current)
    setIsTimerRunning(false)
    timerSecondsRef.current = 0
    setTimerDisplay(0)
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Target className="w-4 h-4 text-indigo-500" />
          <span>useRef Primary Use Cases:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('dom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'dom'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            1. DOM Node Manipulation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mutable')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'mutable'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            2. Mutable Variable (No Re-render)
          </button>
        </div>
      </div>

      {activeTab === 'dom' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* DOM Ref Control Panel */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Imperative DOM Node Controller
              </h3>
              <span className="text-[11px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200/50">
                ref.current
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-600 dark:text-slate-300 font-bold">
                Target Element (<code className="text-indigo-400">ref={'{inputRef}'}</code>)
              </label>
              <input
                ref={inputRef}
                type="text"
                defaultValue="useRef grants direct access to native DOM API"
                placeholder="Type or click action triggers below..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium text-sm focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={handleFocus}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
              >
                <Focus className="w-4 h-4" />
                <span>.focus()</span>
              </button>

              <button
                type="button"
                onClick={handleSelectAll}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Target className="w-4 h-4 text-indigo-400" />
                <span>.select()</span>
              </button>

              <button
                type="button"
                onClick={handleShakeAnimation}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>.bounce()</span>
              </button>

              <button
                type="button"
                onClick={handleHighlight}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Glow Ring</span>
              </button>
            </div>
          </div>

          {/* Ref Persistence Inspector */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Render Tracker
                </span>
                <span className="text-xs text-indigo-400 font-bold bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60">
                  Renders: #{renderTickerRef.current}
                </span>
              </div>

              <p className="text-[11px] font-sans text-slate-400">
                Mutating <code className="text-indigo-400">ref.current</code> never causes a re-render. But it survives state re-renders intact!
              </p>

              <button
                type="button"
                onClick={() => setStateCounter((c) => c + 1)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 font-sans font-bold text-xs border border-slate-800 transition"
              >
                Trigger State Re-render (Count: {stateCounter})
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Mutable Variable & Stopwatch Demo */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Persistent Mutable Ref Interval Holder
              </h3>
              <span className="text-[11px] font-mono text-purple-500 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-200/50">
                timerRef.current = setInterval(...)
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-extrabold font-mono text-purple-400 tracking-wider">
                {(timerDisplay / 10).toFixed(1)}s
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Interval ID Stored in: <code className="text-purple-300">timerRef.current</code>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimer}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                >
                  <Play className="w-4 h-4" /> Start Timer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              )}

              <button
                type="button"
                onClick={handleResetTimer}
                className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs space-y-2 shadow-xl">
              <span className="text-slate-400 font-bold block border-b border-slate-800 pb-2">
                Why use useRef for Intervals/Timers?
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans pt-1">
                Storing timer IDs in <code className="text-purple-400 font-mono">useRef</code> prevents re-rendering the whole component every tick, and ensures the timer reference is never lost across component updates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">The Golden Rule of useRef:</strong> Think of <code className="text-indigo-500 dark:text-indigo-400">useRef</code> like a "box" that can hold any mutable value for the entire lifetime of the component. Changing <code>ref.current</code> does not trigger a re-render, whereas <code>useState</code> always does.
        </div>
      </div>
    </div>
  )
}