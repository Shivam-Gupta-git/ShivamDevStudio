import { CheckCircle2, XCircle, ListChecks } from 'lucide-react'

export default function TestResultsPanel({ testResult, loading }) {
  if (loading) {
    return (
      <div className="space-y-4 py-6 animate-fade-in">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500">
          <ListChecks className="w-4 h-4 animate-bounce" />
          <span>Executing Test Suites...</span>
        </div>
        <div className="space-y-2">
          <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer w-full" />
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="text-center py-10 px-4 space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 mx-auto flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/50">
          <ListChecks className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Click <strong className="text-slate-800 dark:text-slate-200">&quot;Run Tests&quot;</strong> to evaluate your solution against all test cases.
        </p>
      </div>
    )
  }

  const { results, summary } = testResult
  const passPercentage = Math.round((summary.passed / summary.total) * 100)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary progress bar */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          summary.allPassed
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60'
            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {summary.allPassed ? (
              <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            )}
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {summary.allPassed ? 'Accepted — All Test Cases Passed!' : `${summary.failed} Test Case(s) Failed`}
            </span>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/50">
            {summary.passed} / {summary.total} Passed ({passPercentage}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              summary.allPassed ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${passPercentage}%` }}
          />
        </div>
      </div>

      {/* Individual Test Cases list */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
        {results.map((tc) => (
          <div
            key={tc.index}
            className={`p-3.5 rounded-xl border transition-all text-xs ${
              tc.passed
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80'
                : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tc.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Test Case {tc.index}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  tc.passed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                }`}
              >
                {tc.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            <div className="grid gap-2 font-mono text-[11px] p-2.5 rounded-lg bg-white/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/50">
              <div>
                <span className="text-slate-400 font-sans font-semibold">Input: </span>
                <span className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {tc.input}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-sans font-semibold">Expected: </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                  {tc.expectedOutput}
                </span>
              </div>
              {!tc.passed && (
                <div>
                  <span className="text-slate-400 font-sans font-semibold">Output: </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold whitespace-pre-wrap">
                    {tc.actualOutput}
                  </span>
                </div>
              )}
              {tc.error && (
                <div className="pt-1 text-rose-500 font-sans">
                  <strong>Error: </strong>{tc.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
