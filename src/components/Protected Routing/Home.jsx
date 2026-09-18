import React from 'react'
import { ShieldCheck, Lock, Sparkles, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
          <Sparkles className="w-3.5 h-3.5" /> Public Unauthenticated Route (/)
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">ShivamDev Studio</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          This page is accessible to everyone without an authentication token. Try navigating to protected tabs in the menu above to test the React Route Guard!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-bold text-white">Public Route</h4>
          <p className="text-[11px] text-slate-400">
            Accessible to all visitors. No token check required.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <h4 className="text-xs font-bold text-white">Protected Dashboard</h4>
          <p className="text-[11px] text-slate-400">
            Guarded by token check. Unauthorized users are bounced to login.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h4 className="text-xs font-bold text-white">Role Authorization</h4>
          <p className="text-[11px] text-slate-400">
            Simulates Admin vs Member permission tokens in real-time.
          </p>
        </div>
      </div>
    </div>
  )
}