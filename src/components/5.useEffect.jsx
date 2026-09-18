import React, { useEffect, useState, useRef } from 'react'
import {
  Clock,
  Play,
  Pause,
  RefreshCw,
  Activity,
  ShieldCheck,
  MousePointer,
  Trash2,
  Zap,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react'

export default function UseEffectDemo() {
  const [activeMode, setActiveMode] = useState('timer') // 'timer' | 'window' | 'deps'
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [isRunning, setIsRunning] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [trackMouse, setTrackMouse] = useState(false)
  const [category, setCategory] = useState('React')
  const [effectLogs, setEffectLogs] = useState([])

  const logRef = useRef([])
  const appendLog = (type, message) => {
    const entry = { id: Date.now() + Math.random(), type, message, time: new Date().toLocaleTimeString() }
    setEffectLogs((prev) => [entry, ...prev].slice(0, 7))
  }

  // Effect 1: Interval Timer with Cleanup
  useEffect(() => {
    if (!isRunning || activeMode !== 'timer') return

    appendLog('setup', 'Timer effect setup: setInterval initialized')
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => {
      appendLog('cleanup', 'Timer cleanup: clearInterval executed')
      clearInterval(interval)
    }
  }, [isRunning, activeMode])

  // Effect 2: Window Mouse Listener with Cleanup
  useEffect(() => {
    if (!trackMouse || activeMode !== 'window') return

    appendLog('setup', 'Window event listener: window.addEventListener("mousemove")')
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      appendLog('cleanup', 'Window event cleanup: window.removeEventListener("mousemove")')
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [trackMouse, activeMode])

  // Effect 3: Specific Dependency Trigger
  useEffect(() => {
    if (activeMode !== 'deps') return
    appendLog('setup', `Dependency effect triggered: category changed to "${category}"`)
  }, [category, activeMode])

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Activity className="w-4 h-4 text-indigo-500" />
          <span>useEffect Scenarios:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'timer', label: '1. Timer & Cleanup' },
            { id: 'window', label: '2. DOM Event Subscription' },
            { id: 'deps', label: '3. Dependency Array [prop]' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeMode === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Scenario Visualizer */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          {activeMode === 'timer' && (
            <div className="space-y-5 text-center flex flex-col items-center">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Real-time Timer Side Effect
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subscribes on mount, cleans up interval on unmount / pause.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white w-full max-w-sm shadow-xl space-y-1">
                <span className="text-xs font-mono text-indigo-300">Live Clock</span>
                <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-widest text-emerald-400">
                  {time}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`py-2.5 px-6 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause Timer (Triggers Cleanup)' : 'Resume Timer (Runs Setup)'}</span>
              </button>
            </div>
          )}

          {activeMode === 'window' && (
            <div className="space-y-4">
              <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-purple-500" />
                  Window Event Subscription (addEventListener)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Crucial for preventing memory leaks when components unmount.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-purple-300">
                <span>Coordinates:</span>
                <span className="font-bold text-white text-sm">
                  X: {mousePos.x}px | Y: {mousePos.y}px
                </span>
              </div>

              <button
                type="button"
                onClick={() => setTrackMouse(!trackMouse)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  trackMouse
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                }`}
              >
                <MousePointer className="w-4 h-4" />
                <span>{trackMouse ? 'Unsubscribe Event Listener' : 'Subscribe to window.onmousemove'}</span>
              </button>
            </div>
          )}

          {activeMode === 'deps' && (
            <div className="space-y-4">
              <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  Dependency Array Trigger [category]
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Effect executes only when values in dependency array change.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['React', 'TypeScript', 'Next.js', 'Tailwind', 'GraphQL', 'Docker'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                      category === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Effect Lifecycle Audit Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Effect Audit Trail
              </span>
              <button
                type="button"
                onClick={() => setEffectLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="space-y-1.5 min-h-[160px] max-h-56 overflow-auto">
              {effectLogs.length === 0 ? (
                <p className="text-slate-500 italic text-[11px] p-2">No effect events recorded yet...</p>
              ) : (
                effectLogs.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-xl text-[11px] border leading-tight ${
                      item.type === 'cleanup'
                        ? 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                    }`}
                  >
                    <span className="font-bold uppercase text-[9px] mr-1.5 opacity-75">
                      [{item.type}]
                    </span>
                    {item.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">The Cleanup Function Lifecycle:</strong> The cleanup function returned from <code className="text-indigo-500 dark:text-indigo-400">useEffect</code> runs <strong>before</strong> the effect runs again on the next render, and once more when the component is unmounted from the DOM.
        </div>
      </div>
    </div>
  )
}