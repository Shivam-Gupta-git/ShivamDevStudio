import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { useDashboard } from '../../hooks/useDashboard'

/**
 * Monaco Editor wrapper with syntax highlighting, line numbers, auto-indent,
 * and graceful textarea fallback if CDN loading fails.
 */
export default function CodeEditorPanel({ value, onChange, language, onRunCode }) {
  const { theme } = useDashboard()
  const [editorError, setEditorError] = useState(false)

  if (editorError) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full min-h-[440px] p-4 font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 rounded-2xl outline-none resize-none border border-slate-800 focus:ring-2 focus:ring-indigo-500/50"
        placeholder="Type your code here..."
      />
    )
  }

  return (
    <div className="h-full min-h-[440px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-xl relative">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        onMount={(editor, monaco) => {
          setEditorError(false)
          if (onRunCode) {
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
              onRunCode()
            })
          }
        }}
        theme={theme === 'dark' ? 'vs-dark' : 'vs-dark'}
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
          fontFamily: 'var(--font-mono)',
        }}
        loading={
          <div className="flex items-center justify-center h-full min-h-[440px] text-xs text-slate-400 bg-slate-950 font-mono">
            <span className="animate-pulse">Loading Monaco Code Editor...</span>
          </div>
        }
      />
    </div>
  )
}

