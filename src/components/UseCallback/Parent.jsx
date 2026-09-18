import React, { useCallback, useState, useRef } from 'react'
import Child from './Child'
import { RefreshCw, Zap, ShieldCheck, ShieldAlert, Sparkles, Layers, Info } from 'lucide-react'

export default function UseCallbackParentDemo() {
  const [parentCount, setParentCount] = useState(0)
  const [childCount, setChildCount] = useState(0)
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true)
  const [invocationLog, setInvocationLog] = useState([])

  // Store last function reference to verify reference identity across renders
  const lastFnRef = useRef(null)

  // 1. Memoized callback
  const memoizedHandler = useCallback(() => {
    setChildCount((c) => c + 1)
    setInvocationLog((prev) => [
      `[useCallback] Invoked at ${new Date().toLocaleTimeString()}`,
      ...prev.slice(0, 4),
    ])
  }, [])

  // 2. Inline un-memoized callback
  const unmemoizedHandler = () => {
    setChildCount((c) => c + 1)
    setInvocationLog((prev) => [
      `[Inline Callback] Invoked at ${new Date().toLocaleTimeString()}`,
      ...prev.slice(0, 4),
    ])
  }

  const activeHandler = useCallbackEnabled ? memoizedHandler : unmemoizedHandler

  const isSameReference = lastFnRef.current === activeHandler
  lastFnRef.current = activeHandler

  return (
    <div className="space-y-6">
      {/* Optimization Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Zap className="w-4 h-4 text-indigo-500" />
          <span>Callback Function Memoization:</span>
        </div>

        <button
          type="button"
          onClick={() => setUseCallbackEnabled(!useCallbackEnabled)}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
            useCallbackEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${useCallbackEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>{useCallbackEnabled ? 'useCallback ENABLED (Stable Ref)' : 'useCallback DISABLED (New Function Created)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Parent Controls */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Parent State Controller
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updating parent count forces a parent re-render.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-center space-y-2">
            <span className="text-xs font-bold text-slate-500">Parent Unrelated Counter</span>
            <div className="text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
              {parentCount}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setParentCount((c) => c + 1)}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-render Parent ({parentCount})</span>
          </button>
        </div>

        {/* Memoized Child Component */}
        <div className="md:col-span-6 space-y-4">
          <Child
            countChild={childCount}
            childHandler={activeHandler}
            useCallbackEnabled={useCallbackEnabled}
          />
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Why useCallback Matters:</strong> In JavaScript, <code className="text-indigo-500 dark:text-indigo-400">function() {} !== function() {}</code> because every re-render creates a brand new function instance in memory. Wrapping functions in <code className="text-indigo-500 dark:text-indigo-400">useCallback</code> caches the exact same function reference so that child components wrapped in <code>React.memo</code> don't re-render pointlessly!
        </div>
      </div>
    </div>
  )
}