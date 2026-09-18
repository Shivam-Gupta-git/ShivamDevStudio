import React, { createContext, useContext, useState } from 'react'
import {
  Sun,
  Moon,
  User,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  GitBranch,
  Crown,
  Bell,
  Info,
  CheckCircle2,
} from 'lucide-react'

// 1. Context Definitions
const ThemeContext = createContext()
const AuthContext = createContext()

// 2. Intermediate components that pass ZERO props
function IntermediateLevelOne() {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
        <span className="font-bold">Level 1: LayoutContainer</span>
        <span className="text-emerald-400">Zero Props Received ✓</span>
      </div>
      <IntermediateLevelTwo />
    </div>
  )
}

function IntermediateLevelTwo() {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
        <span className="font-bold">Level 2: SidebarWidget</span>
        <span className="text-emerald-400">Zero Props Passed ✓</span>
      </div>
      <DeepConsumerLeaf />
    </div>
  )
}

// 3. Deep Leaf Consumer reading context directly
function DeepConsumerLeaf() {
  const { user, setUserRole } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
        theme === 'dark'
          ? 'bg-slate-950 border-indigo-500/40 text-slate-100'
          : 'bg-indigo-50/90 border-indigo-300 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Deep Leaf Consumer (Level 3)
          </span>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${
            user.role === 'admin'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
          }`}
        >
          Role: {user.role}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <p className="font-bold text-sm">{user.name}</p>
        <p className="opacity-75 font-mono text-[11px]">
          Direct Context Reader via <code className="font-bold">useContext(AuthContext)</code>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => setUserRole(user.role === 'admin' ? 'member' : 'admin')}
          className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs"
        >
          Toggle User Role ({user.role === 'admin' ? 'Set Member' : 'Set Admin'})
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>Toggle Theme ({theme})</span>
        </button>
      </div>
    </div>
  )
}

export default function UseContextDemo() {
  const [theme, setTheme] = useState('dark')
  const [user, setUser] = useState({ name: 'Shivam Gupta', role: 'admin' })

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  const setUserRole = (role) => setUser((prev) => ({ ...prev, role }))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, setUserRole }}>
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>React Context: Eliminating Prop Drilling</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
              Direct Subscriptions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Component Tree Showcase */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-500" />
                  Hierarchical Component Tree
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-500">
                  3 Levels Deep
                </span>
              </div>

              {/* Tree Root */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-xs font-mono flex items-center justify-between">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  &lt;AppProvider (Root Provider)&gt;
                </span>
                <span className="text-indigo-500">Holding Global State</span>
              </div>

              {/* Intermediate Levels */}
              <IntermediateLevelOne />
            </div>

            {/* Live Context Value Inspector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Global Context Inspector
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Live Synced
                  </span>
                </div>

                <pre className="p-3 rounded-2xl bg-slate-900 text-indigo-300 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(
  {
    themeContext: { theme },
    authContext: { user },
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          </div>

          {/* Educational Callout */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">When to use Context vs State:</strong> Context is ideal for truly ambient/global application state (e.g. Current User, Theme, Localization, Routing). For local component state or high-frequency updates, colocate state close to usage to avoid unnecessary tree re-renders.
            </div>
          </div>
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}
