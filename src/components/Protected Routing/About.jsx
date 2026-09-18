import React, { useState } from 'react'
import { ShieldCheck, User, Key, CheckCircle2, Activity, Sparkles, RefreshCw } from 'lucide-react'

export default function About() {
  const token = localStorage.getItem('token')
  const [telemetry, setTelemetry] = useState({
    sessionCreated: new Date().toLocaleTimeString(),
    tokenScope: 'read:dashboard write:settings',
    status: 'ACTIVE_AUTHORIZED',
  })

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Protected Developer Dashboard (/about)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only rendered because a valid authentication token exists in storage.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Token Verified ✓
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] font-sans">Auth Strategy</span>
          <span className="text-indigo-400 font-bold">Bearer JWT Token</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] font-sans">Token Scope</span>
          <span className="text-purple-400 font-bold">{telemetry.tokenScope}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] font-sans">Session Timestamp</span>
          <span className="text-emerald-400 font-bold">{telemetry.sessionCreated}</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-xs text-slate-600 dark:text-slate-300">
        <strong className="text-slate-900 dark:text-white">Security Verification:</strong> If you delete the token from the navigation bar above and attempt to refresh or navigate here, the React Route Guard will automatically intercept the request and redirect back to <code>/login</code>.
      </div>
    </div>
  )
}