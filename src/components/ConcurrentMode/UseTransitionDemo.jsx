import React, { useState, useTransition, useDeferredValue, useRef } from 'react'
import {
  Zap,
  Clock,
  Sparkles,
  Activity,
  ShieldCheck,
  Loader2,
  Sliders,
  Info,
  Layers,
} from 'lucide-react'

export default function UseTransitionDemo() {
  const [query, setQuery] = useState('')
  const [list, setList] = useState([])
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState('with-transition')
  const [latencyMetric, setLatencyMetric] = useState(0)

  const handleChange = (e) => {
    const value = e.target.value
    const t0 = performance.now()
    setQuery(value)

    if (mode === 'with-transition') {
      // Non-urgent background transition
      startTransition(() => {
        const items = []
        for (let i = 0; i < 10000; i++) {
          if (`Dataset Item #${i} - ${value}`.toLowerCase().includes(value.toLowerCase())) {
            items.push(`Search Hit #${i}: "${value}" Record Payload`)
          }
        }
        setList(items)
        setLatencyMetric(Math.round(performance.now() - t0))
      })
    } else {
      // Synchronous blocking render
      const items = []
      for (let i = 0; i < 10000; i++) {
        if (`Dataset Item #${i} - ${value}`.toLowerCase().includes(value.toLowerCase())) {
          items.push(`Search Hit #${i}: "${value}" Record Payload`)
        }
      }
      setList(items)
      setLatencyMetric(Math.round(performance.now() - t0))
    }
  }

  const handleQuickPreset = (term) => {
    const fakeEvent = { target: { value: term } }
    handleChange(fakeEvent)
  }

  return (
    <div className="space-y-6">
      {/* Top Mode Selector Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span>Concurrent Mode Priority Engine:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('with-transition')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              mode === 'with-transition'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> With useTransition (Smooth)
          </button>
          <button
            type="button"
            onClick={() => setMode('without-transition')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              mode === 'without-transition'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Without Transition (Blocking)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input & Controls */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Heavy Dataset Filter (10,000 Records)
            </h3>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                isPending
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              {isPending ? 'Background Transitioning...' : 'Input Responsive ✓'}
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs text-slate-600 dark:text-slate-300 font-bold">
              Type rapidly into the input to test responsiveness:
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Type 'react', 'code', 'data'..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {isPending && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Presets:</span>
            {['React', 'Algorithm', 'State', 'Studio'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickPreset(term)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results List & Telemetry */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Filter Hits ({list.length.toLocaleString()})
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              ~{latencyMetric}ms Latency
            </span>
          </div>

          <div className="max-h-[170px] overflow-auto space-y-1 text-[11px] text-slate-300 pr-1">
            {list.length === 0 ? (
              <p className="text-slate-500 italic p-2 font-sans">
                Type in search input above to filter 10,000 background records...
              </p>
            ) : (
              list.slice(0, 40).map((item, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 truncate">
                  {item}
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] font-sans text-slate-400 pt-2 border-t border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
            <code className="text-indigo-400">startTransition</code> keeps the browser main thread unblocked so user keystrokes never drop frames.
          </p>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Urgent vs Non-Urgent Updates:</strong> In React 18 & 19, typing in an input, clicking, or dragging is an <strong>Urgent Update</strong> that users expect immediate tactile feedback on. Heavy DOM searches or tab transitions are <strong>Non-Urgent Transitions</strong> that React can interrupt and re-schedule without lagging the typing experience.
        </div>
      </div>
    </div>
  )
}
