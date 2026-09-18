import React, { useState, useEffect } from 'react'
import {
  FileText,
  Save,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  Code2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

export default function TopicNotes({ topicId, topicTitle }) {
  const { getTopicNote, saveTopicNote, showToast } = useDashboard()
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  // Load note when topicId changes
  useEffect(() => {
    setNote(getTopicNote(topicId))
  }, [topicId, getTopicNote])

  // Handle note text changes & auto-save
  const handleChange = (e) => {
    const text = e.target.value
    setNote(text)
    saveTopicNote(topicId, text)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleCopy = async () => {
    if (!note.trim()) return
    try {
      await navigator.clipboard.writeText(note)
      setCopied(true)
      showToast('Personal notes copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy notes', 'error')
    }
  }

  const handleDownload = () => {
    if (!note.trim()) return
    try {
      const blob = new Blob([note], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${topicId}-notes.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast(`Downloaded ${topicTitle} notes as Markdown!`)
    } catch {
      showToast('Failed to download notes', 'error')
    }
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes for this topic?')) {
      setNote('')
      saveTopicNote(topicId, '')
      showToast('Personal notes cleared')
    }
  }

  const appendSnippet = (snippet) => {
    const newText = note.trim() ? `${note.trim()}\n\n${snippet}` : snippet
    setNote(newText)
    saveTopicNote(topicId, newText)
    showToast('Template inserted into notes!')
  }

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0
  const lineCount = note ? note.split('\n').length : 0

  return (
    <section className="space-y-4" aria-labelledby="notes-section-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 id="notes-section-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Personal Study Notes & Scratchpad
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-saved to your browser. Use this space for your custom interview cheat-sheet notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs font-mono font-semibold text-emerald-400 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{isExpanded ? 'Collapse' : 'Expand Notes'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl space-y-3 shadow-xl">
          {/* Quick Insert Templates Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-xs font-medium mr-1">Insert Template:</span>
              <button
                type="button"
                onClick={() =>
                  appendSnippet(`## Personal Summary for ${topicTitle}\n- 💡 Core Takeaway: \n- ⚠️ Pitfall to Avoid: \n- ❓ Key Interview Question: `)
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Cheat-Sheet
              </button>

              <button
                type="button"
                onClick={() =>
                  appendSnippet(`### ⚠️ Common Bug & Fix:\n- Problem: \n- Cause: \n- Solution: `)
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
              >
                <AlertCircle className="w-3 h-3" /> Bug & Fix
              </button>

              <button
                type="button"
                onClick={() =>
                  appendSnippet(`### ❓ Interview Q&A:\n**Q**: \n**A**: \n- Key talking point 1: \n- Key talking point 2: `)
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-medium transition-colors"
              >
                <HelpCircle className="w-3 h-3" /> Interview Q&A
              </button>

              <button
                type="button"
                onClick={() =>
                  appendSnippet(`\`\`\`javascript\n// Code snippet for ${topicTitle}\nconst example = () => {\n  // Implementation\n};\n\`\`\``)
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
              >
                <Code2 className="w-3 h-3" /> Code Block
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!note.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors"
                title="Copy notes"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!note.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors"
                title="Download as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!note.trim()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 disabled:opacity-40 text-slate-400 hover:text-rose-300 text-xs font-medium transition-colors"
                title="Clear personal notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={note}
            onChange={handleChange}
            placeholder={`Type your custom notes, key insights, or questions for ${topicTitle}...`}
            rows={6}
            className="w-full p-4 text-xs sm:text-sm font-mono rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>
              {wordCount} words · {note.length} characters · {lineCount} lines
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Save className="w-3 h-3 text-emerald-500" /> Auto-saved to LocalStorage
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
