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
  Clock,
  Check,
  X,
} from 'lucide-react'

export default function UseStateDeepDiveDemo() {
  const [activeTab, setActiveTab] = useState('object') // 'object' | 'functional' | 'lazy'

  // Tab 1: Object State with spread
  const [userProfile, setUserProfile] = useState({
    username: 'alex_architect',
    email: 'alex@devstudio.io',
    bio: 'Building reactive interfaces with modern React.',
    theme: 'dark',
  })
  const [submittedProfile, setSubmittedProfile] = useState(null)

  // Tab 2: Functional updates vs direct updates
  const [countDirect, setCountDirect] = useState(0)
  const [countFunctional, setCountFunctional] = useState(0)

  // Tab 3: Lazy initial state
  const [expensiveCount, setExpensiveCount] = useState(() => {
    // Computes only on initial mount
    return 100
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    // Proper immutable object update
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Stale update demo: 3 calls to setCountDirect(countDirect + 1)
  const handleTripleDirect = () => {
    setCountDirect(countDirect + 1)
    setCountDirect(countDirect + 1)
    setCountDirect(countDirect + 1)
  }

  // Functional update demo: 3 calls to setCountFunctional(prev => prev + 1)
  const handleTripleFunctional = () => {
    setCountFunctional((prev) => prev + 1)
    setCountFunctional((prev) => prev + 1)
    setCountFunctional((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>useState Deep Dive Topics:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'object', label: '1. Object State & Spread' },
            { id: 'functional', label: '2. Functional Updates (Batching)' },
            { id: 'lazy', label: '3. Lazy Initialization' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Object State with Spread */}
      {activeTab === 'object' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Immutable Object State (...prev)
              </h3>
              <span className="text-[11px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200/50">
                useState({'{ ... }'})
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={userProfile.username}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Biography
                </label>
                <textarea
                  name="bio"
                  rows="2"
                  value={userProfile.bio}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmittedProfile({ ...userProfile, time: new Date().toLocaleTimeString() })}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Profile Object
            </button>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
              <span className="text-slate-400 font-bold block border-b border-slate-800 pb-2">
                Live State Object JSON
              </span>
              <pre className="p-3 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Direct vs Functional Updates */}
      {activeTab === 'functional' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
                <X className="w-4 h-4" /> Direct Updates (Stale Closure)
              </h4>
              <span className="text-xs font-mono font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
                Count: {countDirect}
              </span>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed font-sans">
              Calling <code className="bg-rose-950/80 text-rose-300 px-1 py-0.5 rounded font-mono">setCount(count + 1)</code> 3 times consecutively in one event loop uses the same stale <code>count</code> value!
            </p>

            <button
              type="button"
              onClick={handleTripleDirect}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Trigger 3x Direct: setCount(count + 1)
            </button>
            <span className="text-[10px] text-rose-400 font-mono block text-center">
              Increments by only +1 instead of +3!
            </span>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Functional Updates (Safe)
              </h4>
              <span className="text-xs font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Count: {countFunctional}
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed font-sans">
              Calling <code className="bg-emerald-950/80 text-emerald-300 px-1 py-0.5 rounded font-mono">setCount(prev =&gt; prev + 1)</code> 3 times correctly chains each state transition queue!
            </p>

            <button
              type="button"
              onClick={handleTripleFunctional}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              Trigger 3x Functional: setCount(p =&gt; p + 1)
            </button>
            <span className="text-[10px] text-emerald-400 font-mono block text-center">
              Correctly increments by +3!
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Lazy Initialization */}
      {activeTab === 'lazy' && (
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Lazy Initial State Function
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200/50">
              useState(() =&gt; compute())
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            If your initial state requires heavy computation (e.g. reading from <code className="text-indigo-400">localStorage</code> or parsing large JSON), pass a callback function to <code className="text-indigo-400">useState(() =&gt; ...)</code> so it runs <strong>only on initial mount</strong>, and never on subsequent re-renders!
          </p>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
            {`const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('cachedSettings')) || defaultSettings
})`}
          </div>
        </div>
      )}

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Senior React Rule:</strong> Always use the functional form <code className="text-indigo-500 dark:text-indigo-400">setState(prev =&gt; ...)</code> whenever the next state depends on the previous state to protect against stale closures and asynchronous React batching.
        </div>
      </div>
    </div>
  )
}