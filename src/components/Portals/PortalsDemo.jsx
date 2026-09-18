import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Layers,
  ExternalLink,
  X,
  CheckCircle2,
  ShieldAlert,
  Info,
  Sparkles,
  MousePointer,
  RotateCcw,
} from 'lucide-react'

// Modal Component rendered into document.body or dedicated portal root
function ModalPortal({ isOpen, onClose, title, children, eventBubbleLog }) {
  if (!isOpen) return null

  // Ensure portal target exists in DOM
  let portalRoot = document.getElementById('portal-root')
  if (!portalRoot) {
    portalRoot = document.createElement('div')
    portalRoot.id = 'portal-root'
    document.body.appendChild(portalRoot)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 space-y-4 animate-scale-up relative overflow-hidden"
        onClick={(e) => {
          // Event bubbling demonstration
          e.stopPropagation()
          eventBubbleLog('Modal Content Clicked (e.stopPropagation prevented backdrop dismiss)')
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">{children}</div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Portal
          </button>
          <button
            type="button"
            onClick={() => {
              eventBubbleLog('Confirmed Action inside Portal!')
              onClose()
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            Confirm & Trigger Event
          </button>
        </div>
      </div>
    </div>,
    portalRoot,
  )
}

export default function PortalsDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [logs, setLogs] = useState([
    'Initialized Portal container at document.body level.',
  ])

  const addLog = (msg) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)])
  }

  // Handle click on parent container to prove React Event Bubbling works through portals
  const handleParentContainerClick = () => {
    setClickCount((c) => c + 1)
    addLog('⚡ React Event Bubbled up to Parent Container (even though DOM node is rendered in document.body!)')
  }

  return (
    <div className="space-y-6">
      {/* Outer Parent Container with click listener */}
      <div
        onClick={handleParentContainerClick}
        className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5 cursor-pointer group"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Parent Container (React Tree Node)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click anywhere in this card or trigger portal actions to observe React event bubbling!
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            Parent Bubbled Clicks: {clickCount}
          </span>
        </div>

        {/* DOM Hierarchy Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" /> 1. Standard DOM Nesting Problem
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If a parent element has <code className="text-indigo-500 font-mono">overflow: hidden</code> or <code className="text-indigo-500 font-mono">z-index: 1</code>, normal modals get clipped or buried behind other elements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> 2. React Portal Solution
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <code className="text-indigo-500 font-mono">createPortal(children, domNode)</code> renders the HTML outside the parent overflow box, while keeping React context and synthetic event bubbling intact!
            </p>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setModalOpen(true)
              addLog('Opened Modal via React Portal')
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Launch Modal Portal (document.body)</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setClickCount(0)
              setLogs(['Reset logs and counters.'])
            }}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Event Bubbling Console Log */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
            <MousePointer className="w-4 h-4 text-indigo-400" /> Synthetic Event Bubbling Log
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            Active Listener
          </span>
        </div>

        <div className="space-y-1 max-h-36 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
              <span className="text-indigo-400 font-bold">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>

      {/* The Portal Modal Instance */}
      <ModalPortal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          addLog('Closed Modal Portal')
        }}
        title="React createPortal Dialog"
        eventBubbleLog={addLog}
      >
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This modal is rendered directly inside <code className="text-emerald-400 font-mono">document.body</code>, escaping all parent CSS transforms, z-index stackings, and overflow clipping rules.
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Key React Feature:
          </div>
          <p>
            Clicks inside this modal still propagate up through the <strong>React Component Hierarchy</strong> (not just the physical HTML DOM tree).
          </p>
        </div>
      </ModalPortal>
    </div>
  )
}
