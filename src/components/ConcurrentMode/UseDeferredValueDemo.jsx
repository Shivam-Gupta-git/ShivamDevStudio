import React, { useState, useDeferredValue, useMemo, useRef } from 'react'
import {
  Sparkles,
  Zap,
  Sliders,
  Activity,
  Layers,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react'

// Slow, CPU-heavy List Item
function HeavyChildList({ query, enableDeferred }) {
  const renderStartTime = performance.now()

  // Generate 8,000 heavy simulated items
  const items = useMemo(() => {
    const list = []
    for (let i = 0; i < 8000; i++) {
      list.push(`Search Record #${i + 1} · Optimization Kernel Algorithm Demo [Query: ${query || 'None'}]`)
    }
    return list
  }, [query])

  // Filter based on query
  const filtered = useMemo(() => {
    if (!query) return items.slice(0, 50)
    return items.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 50)
  }, [items, query])

  const renderDurationMs = (performance.now() - renderStartTime).toFixed(1)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Filtered {filtered.length} of 8,000 heavy records</span>
        <span className="text-emerald-400">Render pass: {renderDurationMs}ms</span>
      </div>

      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 truncate"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UseDeferredValueDemo() {
  const [text, setText] = useState('')
  const [enableDeferred, setEnableDeferred] = useState(true)

  // useDeferredValue creates a non-urgent version of text
  const deferredText = useDeferredValue(text)

  // When text !== deferredText, React is rendering the deferred UI in the background
  const isStale = enableDeferred && text !== deferredText

  const handleReset = () => {
    setText('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Interactive Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Concurrent useDeferredValue Demo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type rapidly in the search input to see urgent keystrokes stay 60 FPS while heavy list renders yield.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search Input Field */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type rapidly (e.g., '123', 'React', 'Demo')..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
              <span>Urgent Input: <strong className="text-slate-200">"{text}"</strong></span>
              <span>Deferred Background Query: <strong className="text-purple-400">"{enableDeferred ? deferredText : text}"</strong></span>
            </div>
          </div>

          {/* Heavy Child List with Stale Visual Cue */}
          <div
            className={`transition-opacity duration-200 ${
              isStale ? 'opacity-50 blur-[0.5px]' : 'opacity-100'
            }`}
          >
            <HeavyChildList query={enableDeferred ? deferredText : text} enableDeferred={enableDeferred} />
          </div>
        </div>

        {/* Telemetry & Mode Settings Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mode Switch Card */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-500" /> Concurrency Mode Setting
            </span>

            <button
              type="button"
              onClick={() => setEnableDeferred((v) => !v)}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-between border transition ${
                enableDeferred
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>{enableDeferred ? 'useDeferredValue: ENABLED' : 'Synchronous Blocking Mode'}</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold">
                {enableDeferred ? 'CONCURRENT' : 'BLOCKING'}
              </span>
            </button>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              When enabled, React keeps the user's keystrokes responsive at 60 FPS while deferring the 8,000 item re-calculation to the background.
            </p>
          </div>

          {/* Real-time Status Card */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> Concurrent Render Inspector
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isStale
                    ? 'text-amber-400 bg-amber-950/60 border-amber-800/60 animate-pulse'
                    : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                }`}
              >
                {isStale ? 'DEFERRING...' : 'UP TO DATE'}
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Input Frame Latency:</span>
                <span className="text-emerald-400 font-mono font-bold">0ms (Immediate)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Deferred State Status:</span>
                <span className={isStale ? 'text-amber-400 font-mono font-bold' : 'text-slate-300 font-mono'}>
                  {isStale ? 'Yielding to User Input' : 'Synchronized'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-[11px] text-purple-300 font-sans leading-relaxed">
              💡 <strong>useDeferredValue</strong> differs from debouncing: it doesn't wait for an arbitrary timeout (like 500ms); it renders immediately as soon as the main thread is idle!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
