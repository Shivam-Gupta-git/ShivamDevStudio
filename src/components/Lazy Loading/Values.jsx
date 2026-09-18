import React from 'react'
import { Sparkles, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react'

export default function Values({ loadDuration }) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-950/60 border border-amber-500/30 text-white shadow-2xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Sparkles className="w-5 h-5" />
          <span>LazyLoadedModule.js</span>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          Chunk 28.4 KB
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        This component's JavaScript code was <strong>NOT</strong> part of the initial page bundle! It was downloaded over the network only after you requested it.
      </p>

      <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Network Latency</span>
          <span className="text-amber-400 font-bold">{loadDuration}ms</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Execution Status</span>
          <span className="text-emerald-400 font-bold">Mounted ✓</span>
        </div>
      </div>
    </div>
  )
}