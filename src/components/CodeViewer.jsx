import React, { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Download,
  Code2,
  Search,
  Maximize2,
  Minimize2,
  WrapText,
  Type,
  ExternalLink,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { useNavigate } from 'react-router-dom'

export default function CodeViewer({ code, filename = 'Component.jsx', topicTitle = 'React Component' }) {
  const [expanded, setExpanded] = useState(true)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState('text-xs') // text-xs, text-sm, text-base
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [wrapLines, setWrapLines] = useState(false)

  const { showToast } = useDashboard()
  const navigate = useNavigate()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      showToast(`Copied ${filename} code to clipboard!`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy code', 'error')
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast(`Downloaded ${filename}`)
    } catch {
      showToast('Failed to download file', 'error')
    }
  }

  const handleOpenInIDE = () => {
    navigate('/practice')
    showToast(`Opening ${topicTitle} in Practice IDE...`)
  }

  // Count search query matches
  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    return (code.match(regex) || []).length
  }, [code, searchQuery])

  // Custom line highlighter when searching
  const customLineProps = (lineNumber) => {
    if (!searchQuery.trim()) return {}
    const lines = code.split('\n')
    const lineText = lines[lineNumber - 1] || ''
    if (lineText.toLowerCase().includes(searchQuery.toLowerCase())) {
      return {
        style: {
          backgroundColor: 'rgba(234, 179, 8, 0.15)',
          display: 'block',
          borderLeft: '3px solid #eab308',
          paddingLeft: '6px',
        },
      }
    }
    return {}
  }

  const lineCount = code ? code.split('\n').length : 0

  return (
    <section className="space-y-4" aria-labelledby="code-section-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 id="code-section-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Full Source Code
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive code inspector with live search, custom typography, and IDE integration.
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenInIDE}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-bold transition"
            title="Open algorithm/code playground"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Practice IDE</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Copy full component code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-200">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="hidden sm:inline">{expanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Editor Header Bar with dynamic controls */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Window Dots & Filename */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-slate-300 font-bold">{filename}</span>
              <span className="text-[11px] font-mono text-slate-500">
                ({lineCount} lines)
              </span>
            </div>

            {/* In-Code Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code..."
                  className="w-32 sm:w-44 pl-8 pr-2 py-1 text-xs rounded-lg bg-slate-950 text-slate-200 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500 font-mono"
                />
              </div>
              {searchQuery.trim() && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {matchCount} match{matchCount !== 1 ? 'es' : ''}
                </span>
              )}
            </div>

            {/* Dynamic View Settings */}
            <div className="flex items-center gap-2 text-slate-400">
              {/* Font Size Toggle */}
              <button
                type="button"
                onClick={() =>
                  setFontSize((s) => (s === 'text-xs' ? 'text-sm' : s === 'text-sm' ? 'text-base' : 'text-xs'))
                }
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
                title={`Font Size: ${fontSize}`}
              >
                <Type className="w-3.5 h-3.5" />
              </button>

              {/* Line Numbers Toggle */}
              <button
                type="button"
                onClick={() => setShowLineNumbers((v) => !v)}
                className={`p-1.5 rounded-lg transition ${showLineNumbers ? 'text-indigo-400 bg-indigo-500/10' : 'hover:bg-slate-800'}`}
                title="Toggle Line Numbers"
              >
                #
              </button>

              {/* Wrap Lines Toggle */}
              <button
                type="button"
                onClick={() => setWrapLines((v) => !v)}
                className={`p-1.5 rounded-lg transition ${wrapLines ? 'text-indigo-400 bg-indigo-500/10' : 'hover:bg-slate-800'}`}
                title="Toggle Wrap Lines"
              >
                <WrapText className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Syntax Highlighter View */}
          <div className="p-1 max-h-[500px] overflow-auto">
            <SyntaxHighlighter
              language="javascript"
              style={oneDark}
              showLineNumbers={showLineNumbers}
              wrapLines={wrapLines}
              lineProps={customLineProps}
              customStyle={{
                margin: 0,
                padding: '1.25rem',
                backgroundColor: 'transparent',
                fontSize: fontSize === 'text-xs' ? '0.8rem' : fontSize === 'text-sm' ? '0.9rem' : '1rem',
                fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                lineHeight: '1.6',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </section>
  )
}
