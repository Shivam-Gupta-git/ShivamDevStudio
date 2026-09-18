import React, { useState } from 'react'
import { Lock, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ subject: 'API Rate Limit Upgrade', message: 'Requesting access to production endpoint.' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Protected Support & Ticket Dispatch (/contact)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authenticated endpoint allowing encrypted support ticket submission.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
          SSL Protected ✓
        </span>
      </div>

      {sent ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2 animate-fade-in">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-base font-bold">Encrypted Ticket Dispatched!</h4>
          <p className="text-xs text-emerald-400/80 font-mono">
            Ticket ID: #TICKET-{Math.floor(Math.random() * 900000 + 100000)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Ticket Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
              Message Payload
            </label>
            <textarea
              rows="3"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit Encrypted Support Ticket
          </button>
        </form>
      )}
    </div>
  )
}