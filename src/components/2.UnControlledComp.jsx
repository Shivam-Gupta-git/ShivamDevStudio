import React, { useRef, useState } from 'react'
import {
  HardDrive,
  CheckCircle2,
  Mail,
  Lock,
  FileCode,
  Zap,
  RotateCcw,
  Search,
  Layers,
  Info,
  Sliders,
} from 'lucide-react'

export default function UncontrolledCompDemo() {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const fileRef = useRef(null)
  const [submittedData, setSubmittedData] = useState(null)
  const [inspectedDOM, setInspectedDOM] = useState(null)
  const [renderCount, setRenderCount] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = emailRef.current?.value || ''
    const password = passwordRef.current?.value || ''
    const fileName = fileRef.current?.files?.[0]?.name || 'No file attached'
    setSubmittedData({
      email,
      passwordMasked: '•'.repeat(password.length),
      fileName,
      readTime: new Date().toLocaleTimeString(),
    })
    setRenderCount((c) => c + 1)
  }

  const handleInspectDOMNow = () => {
    setInspectedDOM({
      emailDOMValue: emailRef.current?.value || '(empty)',
      passwordDOMValueLength: emailRef.current ? passwordRef.current?.value?.length : 0,
      fileName: fileRef.current?.files?.[0]?.name || '(no file selected)',
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  const handleClearDOM = () => {
    if (emailRef.current) emailRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (fileRef.current) fileRef.current.value = ''
    setSubmittedData(null)
    setInspectedDOM(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
          <HardDrive className="w-4 h-4 text-purple-500" />
          <span>Uncontrolled Inputs: Direct DOM State Storage</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Form Re-renders on Keystroke:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-xs">
            0 (Zero)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Uncontrolled Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-500" />
              Uncontrolled Form (useRef + defaultValue)
            </h3>
            <button
              type="button"
              onClick={handleClearDOM}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              Clear DOM Nodes
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Email Address (<code className="text-purple-400">defaultValue</code> via DOM)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  ref={emailRef}
                  defaultValue="senior.architect@devstudio.io"
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Password (<code className="text-purple-400">defaultValue</code> via DOM)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  ref={passwordRef}
                  defaultValue="uncontrolledRefPass2026"
                  placeholder="Enter secret token"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Inherent Uncontrolled Element: File Upload */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                File Input (<span className="text-purple-400 font-semibold">Always Uncontrolled in React</span>)
              </label>
              <div className="relative">
                <input
                  type="file"
                  ref={fileRef}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleInspectDOMNow}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Inspect DOM (No Re-render)</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit via Refs</span>
            </button>
          </div>
        </form>

        {/* DOM Ref Monitor & Comparison */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" /> DOM Query Result
              </span>
              <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                ref.current.value
              </span>
            </div>

            {inspectedDOM ? (
              <pre className="p-3 rounded-2xl bg-slate-900 text-purple-300 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(inspectedDOM, null, 2)}
              </pre>
            ) : (
              <p className="text-[11px] font-sans text-slate-400 italic p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                Type anything in the form above and click "Inspect DOM" or "Submit via Refs" to read the live values directly from the browser DOM!
              </p>
            )}
          </div>

          {submittedData && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs space-y-1 font-mono animate-fade-in">
              <p className="font-bold font-sans flex items-center gap-1 text-purple-400">
                <CheckCircle2 className="w-4 h-4" /> Form Submission Payload (via Refs):
              </p>
              <pre className="text-[10px] bg-slate-950 p-2.5 rounded-xl border border-purple-800/40 text-purple-200 overflow-auto">
{JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Controlled vs Uncontrolled Comparison
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 space-y-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Controlled (Recommended)</span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Values pushed into React state. Instant validation, dynamic UI changes, and formatting as user types.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400">Uncontrolled (DOM Ref)</span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Values pulled from DOM on submit. Best for simple one-off forms, non-React library integration, or file inputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}