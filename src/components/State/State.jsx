import React, { useState, useRef } from 'react'
import {
  Plus,
  Minus,
  RotateCcw,
  Activity,
  Layers,
  Sparkles,
  Zap,
  History,
  Info,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default function StateDemo() {
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([0])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [step, setStep] = useState(1)
  const [lastAction, setLastAction] = useState('Initial state mount')
  const renderCountRef = useRef(1)
  renderCountRef.current += 1

  const applyNewCount = (nextValue, actionLabel) => {
    const updatedHistory = [nextValue, ...history.slice(0, 7)]
    setCount(nextValue)
    setHistory(updatedHistory)
    setLastAction(actionLabel)
  }

  const handleDelta = (delta) => {
    applyNewCount(count + delta, `Incremented by ${delta > 0 ? '+' : ''}${delta}`)
  }

  const handleMultiply = (multiplier) => {
    applyNewCount(count * multiplier, `Multiplied state by ${multiplier}x`)
  }

  const handleReset = () => {
    setCount(0)
    setHistory([0])
    setLastAction('Reset state back to 0')
  }

  // Demonstration of Functional updates vs stale closure batching
  const handleBatchTripleIncrement = () => {
    // Uses functional form: setCount(prev => prev + 1)
    setCount((prev) => {
      const v1 = prev + 1
      setCount((prev2) => {
        const v2 = prev2 + 1
        setCount((prev3) => {
          const v3 = prev3 + 1
          setHistory((h) => [v3, ...h.slice(0, 7)])
          return v3
        })
        return v2
      })
      return v1
    })
    setLastAction('Batched 3x functional updates: setCount(prev => prev + 1)')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Activity className="w-4 h-4 text-indigo-500" />
          <span>Local Component State Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Total Component Re-renders:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-mono font-bold text-xs shadow-xs animate-pulse">
            #{renderCountRef.current}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Counter Controller Card */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col items-center justify-between text-center space-y-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              const [count, setCount] = useState(0)
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Dynamic State Reactor
            </h3>
          </div>

          {/* Big Counter Ring */}
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex flex-col items-center justify-center shadow-inner">
              <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-mono tracking-tight">
                {count}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mt-1">
                Current Value
              </span>
            </div>
          </div>

          {/* Primary Operations */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDelta(-step)}
                className="flex-1 max-w-[130px] py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 transition-all"
              >
                <Minus className="w-4 h-4" />
                <span>-{step}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Reset counter to 0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelta(step)}
                className="flex-1 max-w-[130px] py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+{step}</span>
              </button>
            </div>

            {/* Quick Modifiers */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleMultiply(2)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-100 transition flex items-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Double (* 2)</span>
              </button>

              <button
                type="button"
                onClick={handleBatchTripleIncrement}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 hover:bg-indigo-100 transition flex items-center gap-1"
                title="Demonstrates functional update safety with setCount(prev => prev + 1)"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Batch +3 (Functional)</span>
              </button>
            </div>

            {/* Step Size Selector */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1">
              <span>Step Size:</span>
              {[1, 5, 10, 50].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    step === s
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  ±{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Inspector & Audit Timeline */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> State Snapshot
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Synchronized
              </span>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-900/80 text-emerald-400 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(
  {
    count,
    step,
    renderCount: renderCountRef.current,
    historyDepth: history.length,
    lastTrigger: lastAction,
  },
  null,
  2
)}
            </pre>
          </div>

          {/* History Breadcrumbs */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                State Mutation History
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Latest First</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {history.map((val, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyNewCount(val, `Restored historical state value ${val}`)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition ${
                    idx === 0
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 ring-2 ring-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200'
                  }`}
                  title="Click to time-travel back to this state value"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Understanding React State Batching:</strong> Calling <code className="text-indigo-500 dark:text-indigo-400">setCount(nextValue)</code> queues a state update with React. In React 18 & 19, multiple state updates are automatically batched into a single re-render cycle to guarantee peak rendering performance.
        </div>
      </div>
    </div>
  )
}