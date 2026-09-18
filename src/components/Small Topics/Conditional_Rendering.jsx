import React, { useState } from 'react'
import {
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Bell,
  Shield,
  Layers,
  Crown,
  Sparkles,
  RefreshCw,
  Eye,
  Info,
  Sliders,
  Code2,
  XCircle,
  Clock,
} from 'lucide-react'

const ROLES = {
  admin: {
    title: 'Super Administrator',
    color: 'from-purple-500 to-indigo-600',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    permissions: ['Full Access', 'Delete Records', 'Billing Control', 'API Keys'],
  },
  pro: {
    title: 'Pro Developer',
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    permissions: ['Unlimited Projects', 'AI Code Explanations', 'Custom Themes'],
  },
  free: {
    title: 'Community Member',
    color: 'from-indigo-500 to-blue-600',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    permissions: ['Basic IDE', 'Community Forum'],
  },
  guest: {
    title: 'Unauthenticated Guest',
    color: 'from-slate-600 to-slate-700',
    badge: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    permissions: ['Read-only Preview'],
  },
}

export default function ConditionalRenderingDemo() {
  const [activeTab, setActiveTab] = useState('ternary')
  const [role, setRole] = useState('pro')
  const [unreadCount, setUnreadCount] = useState(3)
  const [fetchState, setFetchState] = useState('success') // 'idle' | 'loading' | 'error' | 'success'
  const [score, setScore] = useState(88)

  const handleSimulateFetch = () => {
    setFetchState('loading')
    setTimeout(() => {
      const outcomes = ['success', 'error', 'success']
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
      setFetchState(outcome)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Pattern Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Eye className="w-4 h-4 text-indigo-500" />
          <span>Select Technique:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ternary', label: '1. Ternary (? :)' },
            { id: 'logical', label: '2. Logical (&&)' },
            { id: 'early-return', label: '3. Early Return (Guard)' },
            { id: 'switch-map', label: '4. Strategy / Enum Map' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Ternary Operator Auth & Role Switcher */}
      {activeTab === 'ternary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                Ternary Role Gate
              </h3>
              <span className="text-[11px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200/50">
                condition ? A : B
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Simulate Authentication State:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['admin', 'pro', 'free', 'guest'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-2.5 rounded-xl text-xs capitalize font-semibold transition ${
                      role === r
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Rendered Card based on Ternary */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ROLES[role].color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {role !== 'guest' ? `Welcome, ${ROLES[role].title}` : 'Guest Visitor'}
                    </h4>
                    <span
                      className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold border ${ROLES[role].badge}`}
                    >
                      {role !== 'guest' ? 'Authenticated Session' : 'No Token'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5">
                  Unlocked Permissions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES[role].permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-800 text-indigo-300 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                  <Code2 className="w-3.5 h-3.5" />
                  JSX Ternary Pattern
                </span>
                <span className="text-emerald-400">Clean 2-way Branching</span>
              </div>
              <pre className="p-3 rounded-2xl bg-slate-900/80 text-indigo-300 text-[11px] leading-relaxed overflow-x-auto">
{`{isLoggedIn ? (
  <Dashboard role="${role}" permissions={${JSON.stringify(ROLES[role].permissions)}} />
) : (
  <GuestLoginBanner prompt="Please sign in to proceed" />
)}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Short-Circuit Logical && */}
      {activeTab === 'logical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                Short-Circuit && Notifications
              </h3>
              <span className="text-[11px] font-mono text-purple-500 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-200/50">
                condition && &lt;Component /&gt;
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">System Notifications</h4>
                  <p className="text-slate-400 text-[11px]">
                    {unreadCount > 0 ? `You have ${unreadCount} unread messages` : 'Inbox is all caught up!'}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Badge Rendered ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUnreadCount((c) => c + 1)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-md shadow-purple-600/20"
              >
                + Push Notification
              </button>
              <button
                type="button"
                onClick={() => setUnreadCount(0)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition"
              >
                Clear All (0)
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-2 text-xs">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-400">
                <AlertCircle className="w-4 h-4" /> Common Gotcha: The 0 Value Trap
              </h4>
              <p className="text-[11px] leading-relaxed text-amber-200/80">
                Writing <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">count && &lt;Badge/&gt;</code> when count is <strong>0</strong> will render the number <code>0</code> on the screen because 0 is falsy! Always use <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">count &gt; 0 && &lt;Badge/&gt;</code> or <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">Boolean(count) && &lt;Badge/&gt;</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Early Return Guard */}
      {activeTab === 'early-return' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                Async Data Lifecycle Guard
              </h3>
              <span className="text-[11px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200/50">
                if (!data) return &lt;Fallback /&gt;
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateFetch}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchState === 'loading' ? 'animate-spin' : ''}`} />
                <span>Trigger Network Simulation</span>
              </button>
            </div>

            {/* Simulated Lifecycle Component Output */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 min-h-[140px] flex items-center justify-center">
              {fetchState === 'loading' && (
                <div className="flex flex-col items-center gap-2 text-indigo-400 animate-pulse">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <span className="text-xs font-mono">Fetching remote records from server...</span>
                </div>
              )}

              {fetchState === 'error' && (
                <div className="flex flex-col items-center gap-2 text-rose-400">
                  <XCircle className="w-8 h-8" />
                  <span className="text-xs font-bold">Failed to load data (Network 500 Error)</span>
                  <button
                    type="button"
                    onClick={handleSimulateFetch}
                    className="px-3 py-1 rounded-lg text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 font-semibold mt-1"
                  >
                    Retry Request
                  </button>
                </div>
              )}

              {fetchState === 'success' && (
                <div className="w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> 200 OK — Data Payload Ready
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Synced</span>
                  </div>
                  <p className="text-slate-300">
                    Successfully loaded 24 developer profiles and system telemetry records into React state.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs space-y-2 shadow-xl">
              <span className="text-slate-400 font-bold block border-b border-slate-800 pb-2">
                Guard Clause Clean Code:
              </span>
              <pre className="p-3 rounded-2xl bg-slate-900/80 text-emerald-300 text-[11px] leading-relaxed overflow-x-auto">
{`if (loading) return <SkeletonLoader />;
if (error) return <ErrorMessage err={error} />;
if (!data) return <EmptyState />;

return <DataListView records={data} />;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Strategy / Enum Score Evaluator */}
      {activeTab === 'switch-map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Score & Grade Strategy Map
              </h3>
              <span className="text-[11px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-200/50">
                Lookup Map Pattern
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Assessment Score Slider:</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {score} / 100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Live Result Tag */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Computed Result:</span>
                <h4 className="text-lg font-bold text-white">
                  {score >= 90
                    ? '🏆 Master Architect (Grade A+)'
                    : score >= 75
                    ? '⭐ Senior Engineer (Grade A)'
                    : score >= 50
                    ? '📘 Solid Practitioner (Grade B)'
                    : '🛠️ Learning in Progress (Grade F)'}
                </h4>
              </div>
              <span
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                  score >= 75
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : score >= 50
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {score >= 50 ? 'PASSED ✓' : 'NEEDS PRACTICE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Senior Engineering Tip:</strong> In production React apps, favor <strong>Early Returns (Guard clauses)</strong> for loading and error states to keep main JSX clean, and use <strong>Lookup Tables / Strategy Objects</strong> when branching on more than 2 conditions rather than nesting multiple ternaries.
        </div>
      </div>
    </div>
  )
}