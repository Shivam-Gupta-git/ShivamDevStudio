import React, { useState, useRef } from 'react'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Layers,
  Zap,
  RotateCcw,
  Info,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'

export default function ControlledCompDemo() {
  const [name, setName] = useState('Shivam Gupta')
  const [email, setEmail] = useState('shivam@devstudio.io')
  const [password, setPassword] = useState('DevStudio@2026')
  const [capitalizeName, setCapitalizeName] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const renderTickerRef = useRef(1)
  renderTickerRef.current += 1

  // Dynamic Validation calculations derived synchronously during render
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10
      ? 2
      : 3

  const handleNameInput = (e) => {
    let val = e.target.value
    if (capitalizeName) {
      val = val.toUpperCase()
    }
    setName(val)
  }

  const handleAutofill = () => {
    setName('Alex Rivers')
    setEmail('alex.rivers@engineering.dev')
    setPassword('ReactPro#99')
    setSubmittedData(null)
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setPassword('')
    setSubmittedData(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmittedData({
      name,
      email,
      password: '•'.repeat(password.length),
      submittedAt: new Date().toLocaleTimeString(),
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Controlled Inputs: Single Source of Truth</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Live Renders:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-xs">
            #{renderTickerRef.current}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controlled Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              Controlled Interactive Form
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAutofill}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
              >
                Autofill Sample
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500"
                title="Reset fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Name Input with Direct Value Transform Option */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-600 dark:text-slate-300 font-bold">
                  Developer Name
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capitalizeName}
                    onChange={(e) => {
                      setCapitalizeName(e.target.checked)
                      if (e.target.checked) setName((n) => n.toUpperCase())
                    }}
                    className="rounded accent-indigo-600"
                  />
                  <span>Enforce UPPERCASE on change</span>
                </label>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameInput}
                  placeholder="Enter your name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email Input with Real-time Regex Validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-600 dark:text-slate-300 font-bold">
                  Email Address
                </label>
                <span
                  className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                    !email
                      ? 'text-slate-400'
                      : isEmailValid
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}
                >
                  {isEmailValid ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" /> Valid Format
                    </>
                  ) : email ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" /> Invalid Email
                    </>
                  ) : null}
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 ${
                    !email
                      ? 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                      : isEmailValid
                      ? 'border-emerald-500/50 focus:ring-emerald-500'
                      : 'border-rose-500/50 focus:ring-rose-500'
                  }`}
                />
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-600 dark:text-slate-300 font-bold">
                  Security Password
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Length: {password.length} chars
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Password strength bar */}
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    passwordStrength >= 1 ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    passwordStrength >= 2 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Controlled Form</span>
          </button>
        </form>

        {/* Live Re-render & State Mirror */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> React State Mirror
              </span>
              <span className="text-xs text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60 font-bold">
                Controlled State
              </span>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(
  {
    name,
    email,
    passwordMasked: '•'.repeat(password.length),
    isEmailValid,
    passwordStrength: ['Empty', 'Weak', 'Medium', 'Strong'][passwordStrength],
    renderCount: renderTickerRef.current,
  },
  null,
  2
)}
            </pre>
          </div>

          {submittedData && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1 font-mono animate-fade-in">
              <p className="font-bold font-sans flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Form Submission Payload:
              </p>
              <pre className="text-[10px] bg-slate-950 p-2.5 rounded-xl border border-emerald-800/40 text-emerald-200 overflow-auto">
{JSON.stringify(submittedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Why Controlled Components?</strong> In a controlled component, the input element's value is always driven by the React state. This gives you instant validation capabilities, input masking, uppercase transformations, and disabled submit button logic on every single keystroke.
        </div>
      </div>
    </div>
  )
}