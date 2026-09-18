import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useDashboard } from '../../hooks/useDashboard'
import { Code2, FileCode, Sparkles } from 'lucide-react'

/**
 * Monaco Editor wrapper with syntax highlighting, line numbers, auto-indent,
 * and graceful fast editor fallback if CDN loading fails or is delayed.
 */
export default function CodeEditorPanel({ value, onChange, language, onRunCode }) {
  const { theme } = useDashboard()
  const [editorError, setEditorError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [useFastEditor, setUseFastEditor] = useState(false)

  // Auto fallback if Monaco takes more than 4.5 seconds to load over CDN
  useEffect(() => {
    if (isMounted || useFastEditor) return
    const timeout = setTimeout(() => {
      if (!isMounted) {
        setUseFastEditor(true)
      }
    }, 4500)
    return () => clearTimeout(timeout)
  }, [isMounted, useFastEditor])

  if (editorError || useFastEditor) {
    return (
      <div className="h-full min-h-[440px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-xl flex flex-col relative">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <FileCode className="w-3.5 h-3.5" /> Fast Code Editor ({language.toUpperCase()})
          </span>
          <button
            type="button"
            onClick={() => {
              setUseFastEditor(false)
              setEditorError(false)
              setIsMounted(false)
            }}
            className="text-[11px] text-slate-400 hover:text-[#E5C690] underline"
          >
            Try Loading Monaco IDE
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full min-h-[400px] p-4 font-mono text-xs sm:text-sm bg-slate-950 text-[#E5C690] outline-none resize-none leading-relaxed selection:bg-[#E5C690] selection:text-[#183630]"
          placeholder="Type your code here..."
        />
      </div>
    )
  }

  return (
    <div className="h-full min-h-[440px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-xl relative">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        onError={() => {
          setEditorError(true)
          setUseFastEditor(true)
        }}
        onMount={(editor, monaco) => {
          setIsMounted(true)
          setEditorError(false)
          if (onRunCode) {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
              onRunCode()
            })
          }
        }}
        theme="vs-dark"
        options={{
          fontSize: 13,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 14, bottom: 14 },
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          bracketPairColorization: { enabled: true },
          fontFamily: 'JetBrains Mono, monospace',
        }}
        loading={
          <div className="flex flex-col items-center justify-center h-full min-h-[440px] gap-2 text-xs text-slate-400 bg-slate-950 font-mono">
            <span className="animate-pulse text-[#E5C690]">Loading Monaco Code Editor...</span>
            <button
              type="button"
              onClick={() => setUseFastEditor(true)}
              className="text-[11px] text-slate-500 hover:text-slate-300 underline"
            >
              Switch to Fast Code Editor
            </button>
          </div>
        }
      />
    </div>
  )
}
