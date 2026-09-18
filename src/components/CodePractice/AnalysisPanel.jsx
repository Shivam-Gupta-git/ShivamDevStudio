import { useState } from 'react'
import { BookOpen, Sparkles, Copy, Check, Bot, FileText } from 'lucide-react'

/**
 * Renders markdown-like AI explanation with clean visual formatting.
 */
function renderMarkdown(text) {
  if (!text) return null

  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mt-5 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          {line.replace('## ', '')}
        </h3>
      )
    }
    if (line.startsWith('### ')) {
      return (
        <h4 key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-1.5">
          {line.replace('### ', '')}
        </h4>
      )
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 ml-4 list-disc space-y-1">
          {line.replace(/^[-*] /, '')}
        </li>
      )
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 ml-4 list-decimal space-y-1">
          {line.replace(/^\d+\.\s/, '')}
        </li>
      )
    }
    if (line.trim() === '') return <div key={i} className="h-2" />
    // Bold inline markdown
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
    return (
      <p
        key={i}
        className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    )
  })
}

export default function AnalysisPanel({ title, icon, content, source, loading, emptyMessage }) {
  const IconComponent = icon
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (loading) {
    return (
      <div className="space-y-4 py-4 animate-fade-in">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Generating AI Analysis...</span>
        </div>
        <div className="space-y-2.5">
          <div className="h-4 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-3/4" />
          <div className="h-4 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full" />
          <div className="h-4 rounded-md bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-5/6" />
          <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full mt-4" />
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-10 px-4 space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 mx-auto flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
          <IconComponent className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          {source === 'llm' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              <Bot className="w-3 h-3 text-indigo-500" />
              AI Intelligence
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <FileText className="w-3 h-3 text-slate-400" />
              Guide Template
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto pr-1">
        {renderMarkdown(content)}
      </div>
    </div>
  )
}

export function ExplanationPanel(props) {
  return (
    <AnalysisPanel
      title="Explanation"
      icon={BookOpen}
      emptyMessage='Click "Explain Code" above to generate a beginner-friendly step-by-step breakdown.'
      {...props}
      content={props.explanation}
    />
  )
}

export function EfficiencyPanel(props) {
  return (
    <AnalysisPanel
      title="Efficiency Analysis"
      icon={Sparkles}
      emptyMessage='Click "Analyze Efficiency" to view Big O time/space complexity and optimization tips.'
      {...props}
      content={props.analysis}
    />
  )
}
