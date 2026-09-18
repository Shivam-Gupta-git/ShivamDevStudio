import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Timer,
  Search,
  Zap,
  Activity,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react'

// Custom Hook: useDebounce
function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debouncedValue
}

// Sample search dataset
const SAMPLE_PRODUCTS = [
  'React Hooks Mastery Guide',
  'Redux Toolkit State Architecture',
  'Next.js Fullstack Deployment',
  'TypeScript Advanced Generics',
  'Tailwind CSS UI Component Library',
  'GraphQL Relay Modern Client',
  'Vite Build Speed Optimizations',
  'Concurrent Mode & Fiber Architecture',
  'Virtual List 100k Records Demo',
  'Web Workers Parallel Calculation',
]

export default function DebounceDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [delayMs, setDelayMs] = useState(500)
  const [immediateCalls, setImmediateCalls] = useState(0)
  const [debouncedCalls, setDebouncedCalls] = useState(0)
  const [throttledCalls, setThrottledCalls] = useState(0)

  // Use the custom debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, delayMs)

  // Throttle simulation ref
  const lastThrottleTimeRef = useRef(0)

  // Track raw keystroke events
  const handleInputChange = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    setImmediateCalls((c) => c + 1)

    // Simulate throttle (max 1 call per delayMs)
    const now = Date.now()
    if (now - lastThrottleTimeRef.current >= delayMs) {
      lastThrottleTimeRef.current = now
      setThrottledCalls((c) => c + 1)
    }
  }

  // Effect triggered only when debounced value settles
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setDebouncedCalls((c) => c + 1)
    }
  }, [debouncedSearchTerm])

  const handleReset = () => {
    setSearchTerm('')
    setImmediateCalls(0)
    setDebouncedCalls(0)
    setThrottledCalls(0)
  }

  const filteredItems = SAMPLE_PRODUCTS.filter((item) =>
    item.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )

  const savedApiPercent =
    immediateCalls > 0 ? Math.round(((immediateCalls - debouncedCalls) / immediateCalls) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Search & Interactive Controls Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-500" />
                Live Debounced Search Box
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type rapidly to see API requests batched until typing stops.
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
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Type rapidly (e.g. 'React', 'Hooks', 'Vite')..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
              <span>Raw Keystroke Value: <strong className="text-slate-200">"{searchTerm}"</strong></span>
              <span>Debounced Active Query: <strong className="text-emerald-400">"{debouncedSearchTerm}"</strong></span>
            </div>
          </div>

          {/* Search Results List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Query Results ({filteredItems.length}):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">Match ✓</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl text-center text-xs text-slate-400 border border-dashed border-slate-700">
                  No matches for "{debouncedSearchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry & Delay Settings Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Delay Slider Card */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" /> Debounce Delay Interval
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">{delayMs} ms</span>
            </div>

            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>100ms (Fast)</span>
              <span>500ms (Standard)</span>
              <span>1500ms (Lazy)</span>
            </div>
          </div>

          {/* Network API Comparison Telemetry */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" /> API Requests Comparison
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                {savedApiPercent}% Saved
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">1. Without Debounce (Every Key):</span>
                <span className="text-rose-400 font-mono font-bold">{immediateCalls} calls</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">2. Throttled (Max 1 per {delayMs}ms):</span>
                <span className="text-amber-400 font-mono font-bold">{throttledCalls} calls</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">3. Debounced (Only After Pause):</span>
                <span className="text-emerald-400 font-mono font-bold">{debouncedCalls} calls</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-300 font-sans leading-relaxed">
              💡 <strong>Debounce</strong> waits for silence before firing, while <strong>Throttle</strong> limits execution rate to fixed intervals.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
