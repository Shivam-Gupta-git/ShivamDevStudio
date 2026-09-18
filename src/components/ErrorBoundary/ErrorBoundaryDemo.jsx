import React, { Component, useState } from 'react'
import {
  ShieldAlert,
  RefreshCw,
  AlertOctagon,
  Bug,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Info,
} from 'lucide-react'

// Error Boundary Class Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Synchronously update state to render fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error telemetry to monitoring service (e.g. Sentry)
    this.setState({ errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-slate-100 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-rose-300 text-sm">Error Boundary Caught Render Crash</h4>
                <p className="text-[11px] text-rose-400/80">
                  The boundary stopped the crash from unmounting the entire application.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={this.resetError}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recover & Reset
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 font-mono text-xs text-rose-300 border border-rose-800/40 space-y-1">
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
              Captured Exception:
            </span>
            <p className="font-bold">{this.state.error?.toString()}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Child Component that can be intentionally triggered to crash
function BuggyChild({ bugType, triggerCrash, onResetBug }) {
  if (triggerCrash) {
    if (bugType === 'null-pointer') {
      const user = null
      return <div>{user.name.toUpperCase()}</div>
    }
    if (bugType === 'range-error') {
      const arr = new Array(-1)
      return <div>{arr.length}</div>
    }
    throw new Error('Simulated Critical Crash: Corrupt data received from remote API!')
  }

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Protected Child Module
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60 font-bold font-mono">
          Healthy & Running ✓
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        This component is actively protected by the parent <code className="text-indigo-400">&lt;ErrorBoundary&gt;</code>. Select a bug scenario below to test crash interception.
      </p>

      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Child Internal State:</span>
        <span className="text-indigo-400 font-bold">Stable (0 Runtime Errors)</span>
      </div>
    </div>
  )
}

export default function ErrorBoundaryDemo() {
  const [triggerCrash, setTriggerCrash] = useState(false)
  const [bugType, setBugType] = useState('null-pointer')

  const handleTrigger = (type) => {
    setBugType(type)
    setTriggerCrash(true)
  }

  const handleReset = () => {
    setTriggerCrash(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <AlertOctagon className="w-4 h-4 text-rose-500" />
          <span>Error Boundary Resilience Engine</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
          Graceful Degradation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Protected View Container */}
        <div className="lg:col-span-7 space-y-4">
          <ErrorBoundary key={triggerCrash ? 'errored' : 'healthy'}>
            <BuggyChild
              bugType={bugType}
              triggerCrash={triggerCrash}
              onResetBug={handleReset}
            />
          </ErrorBoundary>

          {/* Bug Trigger Controls */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Simulate Runtime Component Exceptions:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleTrigger('null-pointer')}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Bug className="w-3.5 h-3.5" /> TypeError Null
              </button>

              <button
                type="button"
                onClick={() => handleTrigger('range-error')}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <AlertOctagon className="w-3.5 h-3.5" /> RangeError
              </button>

              <button
                type="button"
                onClick={() => handleTrigger('custom')}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> API Exception
              </button>
            </div>
          </div>
        </div>

        {/* Code & Explanation Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Lifecycle Implementation
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                Class Component
              </span>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-purple-300 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{`static getDerivedStateFromError(error) {
  // Update state so the next render
  // shows the fallback UI.
  return { hasError: true, error }
}

componentDidCatch(error, errorInfo) {
  // Log error to telemetry service
  logErrorToService(error, errorInfo)
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">What Error Boundaries Catch:</strong> Error Boundaries catch errors during <strong>rendering</strong>, in <strong>lifecycle methods</strong>, and in <strong>constructors</strong> of the whole tree below them. Note: they do <em>not</em> catch errors inside async callbacks (e.g. <code>setTimeout</code> or <code>fetch</code> promises) or event handlers (use <code>try/catch</code> for those).
        </div>
      </div>
    </div>
  )
}
