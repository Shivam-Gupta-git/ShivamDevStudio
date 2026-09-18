import React, { forwardRef, useRef, useState } from 'react'
import {
  ArrowRight,
  Layers,
  Sparkles,
  Focus,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  Info,
  Code2,
} from 'lucide-react'

export default function ForwardRefDemo() {
  const customInputRef = useRef(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [lastAction, setLastAction] = useState('Parent initialized ref conduit')

  const handleFocusOnly = () => {
    customInputRef.current?.focus()
    setLastAction('Parent called: customInputRef.current.focus()')
  }

  const handleSelectText = () => {
    customInputRef.current?.focus()
    customInputRef.current?.select()
    setLastAction('Parent called: customInputRef.current.select()')
  }

  const handleApplyPromo = () => {
    if (customInputRef.current) {
      customInputRef.current.value = 'PRO-ARCHITECT-2026'
      customInputRef.current.focus()
      customInputRef.current.style.borderColor = '#10b981'
      customInputRef.current.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.25)'
      setLastAction('Parent set value = "PRO-ARCHITECT-2026" & applied green glow')
    }
  }

  const handleShakeAnimation = () => {
    if (customInputRef.current) {
      customInputRef.current.classList.add('animate-bounce')
      setLastAction('Parent triggered bounce animation on Child DOM node')
      setTimeout(() => {
        customInputRef.current?.classList.remove('animate-bounce')
      }, 1000)
    }
  }

  const handleClear = () => {
    if (customInputRef.current) {
      customInputRef.current.value = ''
      customInputRef.current.style.borderColor = ''
      customInputRef.current.style.boxShadow = ''
      setLastAction('Parent cleared Child input value')
    }
  }

  return (
    <div className="space-y-6">
      {/* Ref Forwarding Conduit Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-emerald-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-emerald-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Parent Component (<code className="text-indigo-400">useRef</code>)</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px] bg-white/70 dark:bg-slate-900/70 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          <span>Forwarding Conduit</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span className="text-purple-400 font-bold">forwardRef((props, ref) =&gt; ...)</span>
        </div>

        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          <span>Child CustomInput (&lt;input ref={'{ref}'}/&gt;)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parent Controls & Child Component */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Parent Controlling Encapsulated Child Input
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
              Imperative API
            </span>
          </div>

          {/* Forwarded Child Input Instance */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
              Encapsulated CustomInput Component
            </span>
            <CustomInput
              ref={customInputRef}
              label="Promo / Voucher Code"
              disabled={isDisabled}
              defaultValue="DEVSTUDIO-SPECIAL"
            />
          </div>

          {/* Parent Action Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={handleFocusOnly}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <Focus className="w-3.5 h-3.5" />
              <span>.focus()</span>
            </button>

            <button
              type="button"
              onClick={handleSelectText}
              className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>.select()</span>
            </button>

            <button
              type="button"
              onClick={handleApplyPromo}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Set Promo</span>
            </button>

            <button
              type="button"
              onClick={handleShakeAnimation}
              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>.bounce()</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
            <button
              type="button"
              onClick={() => setIsDisabled(!isDisabled)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 transition"
            >
              {isDisabled ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-rose-500" />}
              <span>{isDisabled ? 'Enable Input' : 'Disable Input'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 font-semibold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Value
            </button>
          </div>
        </div>

        {/* Code & Execution Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> forwardRef Pattern
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                React HOC
              </span>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-900 text-purple-300 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{`const CustomInput = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
    />
  )
})`}
            </pre>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Last Executed Action:
              </span>
              <p className="text-emerald-400 text-xs font-mono">{lastAction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Why forwardRef is Essential:</strong> Functional components do not have DOM instances of their own. By default, passing <code>ref</code> to a custom component results in a warning. <code>forwardRef</code> explicitly intercepts the <code>ref</code> argument and passes it directly to internal DOM nodes or custom imperative handles.
        </div>
      </div>
    </div>
  )
}

const CustomInput = forwardRef(({ label, disabled, defaultValue }, ref) => {
  return (
    <div className="space-y-1 text-left">
      <label className="block text-xs text-slate-400 font-semibold">{label}</label>
      <input
        ref={ref}
        type="text"
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder="Type or use parent buttons..."
        className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  )
})