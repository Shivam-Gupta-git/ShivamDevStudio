import React, { useState, useRef } from 'react'
import {
  Layers,
  Sparkles,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowDown,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react'

export default function VirtualListDemo() {
  const [totalItems, setTotalItems] = useState(100000)
  const ITEM_HEIGHT = 48
  const CONTAINER_HEIGHT = 320

  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  const handleJumpToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = index * ITEM_HEIGHT
    }
  }

  // Calculate visible slice range dynamically
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 3)
  const endIndex = Math.min(
    totalItems - 1,
    Math.floor((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + 3
  )

  const visibleItems = []
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      top: i * ITEM_HEIGHT,
      label: `Virtual User Record #${(i + 1).toLocaleString()} — Memory Node`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Windowed Virtualization Engine</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Virtual Dataset:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-xs">
            {totalItems.toLocaleString()} Elements
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Virtualized Container & Controls */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              60 FPS Virtual Viewport
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              Only {visibleItems.length} Real DOM Nodes!
            </span>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold">Quick Jump:</span>
            <button
              type="button"
              onClick={() => handleJumpToIndex(0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition"
            >
              Start (#1)
            </button>
            <button
              type="button"
              onClick={() => handleJumpToIndex(Math.floor(totalItems / 2))}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition"
            >
              Middle (#{(totalItems / 2).toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => handleJumpToIndex(totalItems - 10)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition"
            >
              End (#{totalItems.toLocaleString()})
            </button>
          </div>

          {/* Virtual Scroll Window */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ height: CONTAINER_HEIGHT }}
            className="w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-y-auto relative custom-scrollbar shadow-inner"
          >
            {/* Full Height Placeholder Container */}
            <div style={{ height: totalItems * ITEM_HEIGHT, width: '100%' }} className="relative">
              {visibleItems.map((item) => (
                <div
                  key={item.index}
                  style={{
                    position: 'absolute',
                    top: item.top,
                    left: 0,
                    right: 0,
                    height: ITEM_HEIGHT - 4,
                  }}
                  className="mx-3 my-0.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-200 shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    DOM Index #{item.index}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DOM Node Monitor */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Memory & DOM Telemetry
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Constant O(1) Memory
              </span>
            </div>

            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Total Virtual Array Size:</span>
                <span className="text-indigo-400 font-mono font-bold">{totalItems.toLocaleString()} items</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Physical DOM Nodes in Browser:</span>
                <span className="text-emerald-400 font-mono font-bold">{visibleItems.length} Nodes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">DOM Nodes Saved from Render:</span>
                <span className="text-purple-400 font-mono font-bold">
                  {(totalItems - visibleItems.length).toLocaleString()} saved!
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Scroll Offset:</span>
                <span className="text-amber-400 font-mono font-bold">{Math.round(scrollTop)}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">How Virtualization Achieves Constant Memory:</strong> Instead of inserting 100,000 <code>&lt;div&gt;</code> tags into the DOM (which causes severe browser freezing), virtualization calculates <code className="text-indigo-500 dark:text-indigo-400">Math.floor(scrollTop / itemHeight)</code> and renders <em>only the ~10 items</em> currently inside the scroll window with absolute positioning.
        </div>
      </div>
    </div>
  )
}
