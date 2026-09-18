import { useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast() {
  const { toast } = useDashboard()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {}, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 animate-scale-in text-slate-900 dark:text-slate-100"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
      </div>
      <span className="text-xs font-semibold">{toast.message}</span>
    </div>
  )
}
