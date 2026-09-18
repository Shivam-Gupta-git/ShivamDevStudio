import React, { Suspense, lazy, useState, useTransition } from 'react'
import {
  Layers,
  Download,
  Loader2,
  Sparkles,
  CheckCircle2,
  Wifi,
  RotateCcw,
  Sliders,
  Info,
} from 'lucide-react'

const Values = lazy(() => import('./Values'))

export default function LazyLoadingDemo() {
  const [load, setLoad] = useState(false)
  const [latency, setLatency] = useState(1200)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleTriggerLoad = () => {
    setIsDownloading(true)
    setDownloadProgress(0)

    const interval = setInterval(() => {
      setDownloadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setIsDownloading(false)
          setLoad(true)
          return 100
        }
        return p + 20
      })
    }, latency / 5)
  }

  const handleReset = () => {
    setLoad(false)
    setIsDownloading(false)
    setDownloadProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Latency Slider */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Wifi className="w-4 h-4 text-amber-500" />
          <span>Simulated Network Latency:</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <input
            type="range"
            min="200"
            max="3000"
            step="200"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-32 sm:w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="font-mono font-bold text-amber-500 text-xs w-16">
            {latency}ms
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Controls Card */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="space-y-1 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              Code-Splitting via React.lazy & Suspense
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Splits heavy code into separate bundles loaded on demand.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerLoad}
              disabled={load || isDownloading}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading Chunk ({downloadProgress}%)...</span>
                </>
              ) : load ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chunk Module Loaded ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Fetch & Load Module Chunk</span>
                </>
              )}
            </button>

            {load && (
              <button
                type="button"
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                title="Unload module to test Suspense again"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suspense Container */}
        <div className="md:col-span-6">
          {isDownloading ? (
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 flex flex-col items-center justify-center gap-3 text-xs font-mono min-h-[160px] shadow-xl">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <div className="text-center space-y-1">
                <span className="text-amber-400 font-bold block">Downloading Remote Chunk...</span>
                <span className="text-slate-500 text-[11px] font-sans">
                  &lt;Suspense fallback={'{<SkeletonLoader />}'}&gt; Active
                </span>
              </div>
            </div>
          ) : load ? (
            <Suspense
              fallback={
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 flex items-center justify-center gap-2 text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Loading...</span>
                </div>
              }
            >
              <Values loadDuration={latency} />
            </Suspense>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-100/60 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 flex flex-col items-center justify-center min-h-[160px]">
              <Sparkles className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Component bundle chunk is not loaded yet. Click the button to fetch dynamically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Why Code-Splitting is Crucial for Performance:</strong> Without <code className="text-indigo-500 dark:text-indigo-400">React.lazy</code>, users must download every route, chart, and modal upfront before the page can load. Lazy loading reduces initial bundle size drastically, boosting Largest Contentful Paint (LCP) and Time to Interactive (TTI).
        </div>
      </div>
    </div>
  )
}