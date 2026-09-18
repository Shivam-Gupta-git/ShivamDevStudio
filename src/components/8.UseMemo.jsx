import React, { useMemo, useState, useRef } from 'react'
import {
  Cpu,
  Zap,
  Activity,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'

// Expensive mathematical prime computation helper
function computePrimes(targetNumber) {
  const start = performance.now()
  let count = 0
  let num = 2
  while (count < targetNumber * 4500) {
    let isPrime = true
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) count++
    num++
  }
  const duration = performance.now() - start
  return { lastPrime: num - 1, duration: Math.round(duration) }
}

export default function UseMemoDemo() {
  const [targetNumber, setTargetNumber] = useState(5)
  const [unrelatedCounter, setUnrelatedCounter] = useState(0)
  const [isMemoEnabled, setIsMemoEnabled] = useState(true)
  const [lastComputeTime, setLastComputeTime] = useState(0)
  const calculationTickerRef = useRef(0)

  // 1. Memoized calculation
  const memoizedPrimeResult = useMemo(() => {
    calculationTickerRef.current += 1
    const res = computePrimes(targetNumber)
    return res
  }, [targetNumber])

  // 2. Un-memoized calculation (runs on every render if toggle disabled)
  let unmemoizedResult = null
  if (!isMemoEnabled) {
    calculationTickerRef.current += 1
    unmemoizedResult = computePrimes(targetNumber)
  }

  const activeResult = isMemoEnabled ? memoizedPrimeResult : unmemoizedResult

  return (
    <div className="space-y-6">
      {/* Top Banner & Optimization Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Cpu className="w-4 h-4 text-indigo-500" />
          <span>useMemo Computation Benchmark:</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMemoEnabled(!isMemoEnabled)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
            isMemoEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isMemoEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{isMemoEnabled ? 'useMemo Active (Optimized)' : 'useMemo Disabled (Uncached)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Controls Card */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              Heavy Calculation Controller
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notice how incrementing the unrelated counter is instant when useMemo is on, but freezes when off!
            </p>
          </div>

          {/* Target Input Slider (Dependencies) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Calculation Intensity (Dep Factor):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {targetNumber * 4500} Primes
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={targetNumber}
              onChange={(e) => setTargetNumber(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Unrelated State Counter Button */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                Unrelated State Counter
              </span>
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                Count: {unrelatedCounter}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setUnrelatedCounter((c) => c + 1)}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Click to Update Unrelated State (+1)</span>
            </button>
          </div>
        </div>

        {/* Computation Monitor */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Benchmark Telemetry
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isMemoEnabled
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                }`}
              >
                {isMemoEnabled ? 'Cached 0ms' : 'Uncached Work'}
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Prime Result:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {activeResult?.lastPrime?.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Heavy Loop Executions:</span>
                <span className="text-indigo-400 font-mono font-bold">
                  {calculationTickerRef.current} times
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Execution Cost:</span>
                <span className="text-amber-400 font-mono font-bold">
                  ~{activeResult?.duration}ms calculation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">When to use useMemo:</strong> Only use <code className="text-indigo-500 dark:text-indigo-400">useMemo</code> for computationally intensive transformations (sorting 10,000 items, expensive math, regex parsing) or when preserving object reference equality for child components wrapped in <code>React.memo</code>.
        </div>
      </div>
    </div>
  )
}