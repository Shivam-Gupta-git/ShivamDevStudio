import React, { useState, useRef } from 'react'
import {
  Shield,
  ShieldCheck,
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Info,
  Layers,
} from 'lucide-react'

// 1. Standard Un-memoized Child Component
const StandardChild = ({ count }) => {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-2 relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between text-xs font-bold font-sans">
        <span className="flex items-center gap-1.5 text-rose-400">
          <AlertOctagon className="w-4 h-4" /> Standard Child (Un-memoized)
        </span>
        <span className="text-[10px] bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/60 text-rose-300 font-mono font-bold">
          Renders: #{renderCountRef.current}
        </span>
      </div>
      <p className="text-xs text-slate-300 font-mono">
        Parent Count Prop: <strong className="text-white">{count}</strong>
      </p>
      <span className="text-[11px] text-rose-300/70 block">
        ⚠️ Always re-renders whenever Parent re-renders, even with identical props.
      </span>
    </div>
  )
}

// 2. Memoized Child with React.memo (Static Props)
const MemoizedStaticChild = React.memo(({ title }) => {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-2 relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between text-xs font-bold font-sans">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> React.memo(StaticChild)
        </span>
        <span className="text-[10px] bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 text-emerald-300 font-mono font-bold">
          Renders: #{renderCountRef.current}
        </span>
      </div>
      <p className="text-xs text-slate-300 font-mono">
        Static Title Prop: <strong className="text-white">{title}</strong>
      </p>
      <span className="text-[11px] text-emerald-300/80 block">
        ✓ Skipped! Shallow prop comparison evaluated true (<code className="text-emerald-400">prevProps === nextProps</code>).
      </span>
    </div>
  )
})

// 3. Memoized Child with Dynamic Prop Trigger
const MemoizedDynamicChild = React.memo(({ tag, onIncrement }) => {
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 space-y-2 relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between text-xs font-bold font-sans">
        <span className="flex items-center gap-1.5 text-purple-400">
          <ShieldCheck className="w-4 h-4" /> React.memo(DynamicChild)
        </span>
        <span className="text-[10px] bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/60 text-purple-300 font-mono font-bold">
          Renders: #{renderCountRef.current}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
        <span>Child Prop: <strong className="text-white">v{tag}</strong></span>
        <button
          type="button"
          onClick={onIncrement}
          className="px-2.5 py-1 rounded-lg text-xs font-sans font-bold bg-purple-600 hover:bg-purple-500 text-white transition"
        >
          Update Prop (+1)
        </button>
      </div>
      <span className="text-[11px] text-purple-300/80 block">
        Re-renders <em>only</em> when this specific prop reference changes.
      </span>
    </div>
  )
})

export default function ReactMemoDemo() {
  const [parentCount, setParentCount] = useState(0)
  const [childTag, setChildTag] = useState(1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Parent Controls */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              React.memo Component Memoization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Higher Order Component (HOC) that shallowly compares props to avoid wasteful re-renders.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-center space-y-2">
            <span className="text-xs font-bold text-slate-500">Parent State Counter</span>
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
            <span>Increment Parent State ({parentCount})</span>
          </button>
        </div>

        {/* Side-by-Side Child Visualizers */}
        <div className="md:col-span-6 space-y-4">
          <StandardChild count={parentCount} />
          <MemoizedStaticChild title="Global Header Brand" />
          <MemoizedDynamicChild tag={childTag} onIncrement={() => setChildTag((t) => t + 1)} />
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">How React.memo Compares Props:</strong> By default, <code>React.memo</code> performs a shallow strict equality comparison (<code className="text-indigo-500 dark:text-indigo-400">Object.is</code>) on each prop. If passing functions as props, pair with <code>useCallback</code> to avoid breaking memoization!
        </div>
      </div>
    </div>
  )
}