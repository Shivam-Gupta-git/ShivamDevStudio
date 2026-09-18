import React, { useMemo, useState, useRef } from 'react'
import {
  Cpu,
  RefreshCw,
  ShieldCheck,
  Layers,
  Zap,
  Clock,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react'

const ExpensiveChildComponent = ({ count, enableMemo, iterations }) => {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  // Compute with or without useMemo based on toggle
  const startTime = performance.now()

  const calculation = enableMemo
    ? useMemo(() => {
        let sum = 0
        for (let i = 0; i < iterations; i++) {
          sum += Math.sqrt(i) * Math.sin(i)
        }
        return { sum: sum.toFixed(2), calculatedAt: new Date().toLocaleTimeString() }
      }, [iterations])
    : (() => {
        let sum = 0
        for (let i = 0; i < iterations; i++) {
          sum += Math.sqrt(i) * Math.sin(i)
        }
        return { sum: sum.toFixed(2), calculatedAt: new Date().toLocaleTimeString() }
      })()

  const executionTimeMs = (performance.now() - startTime).toFixed(2)

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 text-white space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-4 h-4 text-emerald-400" /> Expensive Computation Child
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
              enableMemo
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-rose-950/80 text-rose-300 border-rose-800'
            }`}
          >
            {enableMemo ? 'Memoized (useMemo)' : 'Unmemoized (Re-calculates)'}
          </span>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
            Renders: {renderCountRef.current}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[11px] text-slate-400 font-mono">Calculated Checksum</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 truncate">
            {calculation.sum}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">Timestamp: {calculation.calculatedAt}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-center">
          <span className="text-[11px] text-slate-400 font-mono">Exec Time This Render</span>
          <div
            className={`text-xl sm:text-2xl font-black font-mono ${
              Number(executionTimeMs) > 1 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {executionTimeMs} ms
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            {enableMemo ? '0ms cached on prop equality' : 'Recomputed on every tick'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MemoParentComponent() {
  const [parentCount, setParentCount] = useState(0)
  const [enableMemo, setEnableMemo] = useState(true)
  const [iterations, setIterations] = useState(500000)
  const [unrelatedInput, setUnrelatedInput] = useState('')

  const handleReset = () => {
    setParentCount(0)
    setUnrelatedInput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Parent Card */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Parent Component State Owner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Trigger unrelated parent state changes to observe child performance.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Reset state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Child Component Instance */}
          <ExpensiveChildComponent
            count={parentCount}
            enableMemo={enableMemo}
            iterations={iterations}
          />

          {/* Parent Interactive Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setParentCount((c) => c + 1)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Increment Parent State ({parentCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setEnableMemo((m) => !m)}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                  enableMemo
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{enableMemo ? 'useMemo: ACTIVE' : 'useMemo: DISABLED'}</span>
              </button>
            </div>

            {/* Unrelated Keystroke Input to test input lag */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Type Fast in Unrelated Input (Test typing lag):
              </label>
              <input
                type="text"
                value={unrelatedInput}
                onChange={(e) => setUnrelatedInput(e.target.value)}
                placeholder="Type here to re-render parent on every character..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Configuration & Telemetry Sidebar */}
        <div className="md:col-span-5 space-y-4">
          {/* Iteration Workload Slider */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" /> Workload Intensity
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {iterations.toLocaleString()} loops
              </span>
            </div>

            <input
              type="range"
              min="100000"
              max="2000000"
              step="100000"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>100k (Fast)</span>
              <span>1M (Heavy)</span>
              <span>2M (Extreme)</span>
            </div>
          </div>

          {/* Render Monitor */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Telemetry & Memo Status
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  enableMemo
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                    : 'text-rose-400 bg-rose-950/60 border-rose-800/60'
                }`}
              >
                {enableMemo ? 'OPTIMIZED' : 'UNOPTIMIZED'}
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Parent Re-renders:</span>
                <span className="text-indigo-400 font-mono font-bold">{parentCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Child useMemo Cache:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {enableMemo ? 'Active (Retains Ref)' : 'Bypassed'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">UI Keystroke Responsiveness:</span>
                <span className={enableMemo ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {enableMemo ? 'Smooth 60 FPS' : 'Laggy UI'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}