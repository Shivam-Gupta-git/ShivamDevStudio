import { Terminal, AlertCircle, CheckCircle2, Clock, HardDrive } from 'lucide-react'

export default function OutputPanel({ result, customInput, onCustomInputChange, loading, problem }) {
  if (loading) {
    return (
      <div className="space-y-4 py-6 animate-fade-in">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
          <Terminal className="w-4 h-4 animate-spin" />
          <span>Executing Program...</span>
        </div>
        <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Custom Testcase Input (stdin)
            </label>
            <span className="text-[10px] font-mono text-slate-500">Press ⌘Enter to Run</span>
          </div>

          {problem?.examples?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Quick Presets:</span>
              {problem.examples.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onCustomInputChange(ex.input)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/90 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 transition-all flex items-center gap-1 active:scale-95"
                  title="Click to fill stdin"
                >
                  <span>Preset {idx + 1}:</span>
                  <code className="text-slate-200 font-bold">{ex.input}</code>
                </button>
              ))}
            </div>
          )}

          <textarea
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            placeholder="Enter input for your solution..."
            rows={4}
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
          />
        </div>
        <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click <strong className="text-slate-800 dark:text-slate-200">&quot;Run Code&quot;</strong> or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">⌘Enter</kbd> to execute your solution.
          </p>
        </div>
      </div>
    )
  }

  const hasError = Boolean(result.error || result.compileOutput || result.stderr)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Execution status & metrics header */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          {result.success ? (
            <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {result.status}
          </span>
        </div>

        {result.time && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              {result.time}s
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-purple-400" />
              {result.memory} KB
            </span>
          </div>
        )}
      </div>

      {/* Stdout Output */}
      {result.stdout && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            Standard Output (stdout)
          </p>
          <pre className="text-xs font-mono p-3.5 rounded-xl bg-slate-950 text-emerald-400 whitespace-pre-wrap border border-slate-800 shadow-inner max-h-60 overflow-auto">
            {result.stdout}
          </pre>
        </div>
      )}

      {/* Errors */}
      {hasError && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Execution Error / Compiler Output
          </p>
          <pre className="text-xs font-mono p-3.5 rounded-xl bg-rose-950/40 text-rose-300 whitespace-pre-wrap border border-rose-800/60 max-h-52 overflow-auto">
            {result.error || result.compileOutput || result.stderr}
          </pre>
        </div>
      )}

      {!result.stdout && !hasError && (
        <p className="text-xs text-slate-400 italic text-center py-4">Program executed cleanly with no stdout output.</p>
      )}
    </div>
  )
}
