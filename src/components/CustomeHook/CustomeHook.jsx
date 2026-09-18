import React from 'react'
import useToggle from './useToggle'
import useLocalStorage from './useLocalStorage'
import useWindowSize from './useWindowSize'
import {
  Star,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  HardDrive,
  Monitor,
  CheckCircle2,
  Info,
  Code2,
} from 'lucide-react'

export default function CustomHookDemo() {
  const [showCardA, toggleCardA] = useToggle(true)
  const [showCardB, toggleCardB] = useToggle(false)
  const [persistedNote, setPersistedNote] = useLocalStorage('custom_hook_note', 'Custom Hooks make code elegant!')
  const { width, height } = useWindowSize()

  const breakpoint =
    width < 640 ? 'Mobile (< 640px)' : width < 1024 ? 'Tablet (640px - 1024px)' : 'Desktop (>= 1024px)'

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Encapsulating Stateful Logic into Custom Hooks</span>
        </div>
        <span className="text-[11px] font-mono text-indigo-500 bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-0.5 rounded-full">
          Prefix with "use"
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hook 1: useToggle Showcase */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              1. useToggle(defaultVal)
            </h3>
            <span className="text-[11px] font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50">
              Isolated State Instances
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300">Instance A:</span>
              <button
                type="button"
                onClick={() => toggleCardA()}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                {showCardA ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCardA ? 'Hide A' : 'Show A'}</span>
              </button>
            </div>

            {showCardA && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <Star className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Instance A state is completely independent of Instance B!</span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300">Instance B:</span>
              <button
                type="button"
                onClick={() => toggleCardB()}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                {showCardB ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showCardB ? 'Hide B' : 'Show B'}</span>
              </button>
            </div>

            {showCardB && (
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Instance B rendered with zero prop drilling!</span>
              </div>
            )}
          </div>
        </div>

        {/* Hook 2: useLocalStorage Showcase */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              2. useLocalStorage(key, initial)
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/50">
              Persistent Cache
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block text-slate-600 dark:text-slate-300 font-bold">
              Type anything (Saves automatically to browser localStorage):
            </label>
            <textarea
              rows="2"
              value={persistedNote}
              onChange={(e) => setPersistedNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
              <span>Synced Key: "custom_hook_note"</span>
              <span className="text-emerald-400 font-bold">✓ Synced in Real-Time</span>
            </div>
          </div>
        </div>

        {/* Hook 3: useWindowSize Showcase */}
        <div className="lg:col-span-12 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-500" />
              3. useWindowSize() Reactive Viewport Hook
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50">
              Auto-Event Cleanup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">Viewport Width</span>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">{width}px</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">Viewport Height</span>
              <div className="text-2xl font-extrabold text-purple-400 font-mono">{height}px</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">Current Responsive Tier</span>
              <div className="text-xs font-bold text-emerald-400 pt-2">{breakpoint}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">The Power of Custom Hooks:</strong> Custom hooks allow you to extract component logic into reusable JavaScript functions. Each call to a custom hook creates a completely isolated state instance with its own lifecycle.
        </div>
      </div>
    </div>
  )
}