import React, { useState, useEffect } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  GitBranch,
  Layers,
} from 'lucide-react'

export default function Workflow({ workflow, topicTitle = 'React Concept' }) {
  if (!workflow) return null

  const { purpose, steps = [], execution = [], useCase, bestPractices = [], mistakes = [] } = workflow

  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [checkedPractices, setCheckedPractices] = useState({})
  const [checkedMistakes, setCheckedMistakes] = useState({})

  // Auto-play stepper player
  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length)
      }, 2000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, steps.length])

  const togglePractice = (idx) => {
    setCheckedPractices((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const toggleMistake = (idx) => {
    setCheckedMistakes((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const masteredPracticesCount = Object.values(checkedPractices).filter(Boolean).length

  return (
    <section className="space-y-4" aria-labelledby="workflow-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] border border-[#E5C690]/30">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 id="workflow-title" className="text-lg sm:text-xl font-bold text-[#183630] dark:text-[#E3DAC9]">
              Execution Workflow & Lifecycle
            </h2>
            <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
              Interactive visual pipeline for {topicTitle}
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="p-2 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#112420] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] disabled:opacity-40 text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/25 transition"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-[#E5C690] text-[#183630] shadow-xs'
                : 'bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] shadow-md shadow-[#183630]/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={activeStep === steps.length - 1}
            className="p-2 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#112420] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] disabled:opacity-40 text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/25 transition"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false)
              setActiveStep(0)
            }}
            className="p-2 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#112420] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/25 transition"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Step-by-Step Flow Pipeline */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#183630]/10 dark:border-[#E5C690]/20 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E5C690]">
              Interactive Execution Pipeline
            </h3>
            <span className="text-[11px] font-mono font-bold bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] px-2.5 py-0.5 rounded-full border border-[#E5C690]/30">
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((step, i) => {
              const isActive = activeStep === i
              const isPassed = activeStep > i

              return (
                <div key={step} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      setActiveStep(i)
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                      isActive
                        ? 'bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] border-[#E5C690]/40 shadow-lg shadow-[#183630]/25 font-bold translate-x-1'
                        : isPassed
                        ? 'bg-[#E3DAC9]/60 dark:bg-[#183630]/60 text-[#183630] dark:text-[#E3DAC9] border-[#183630]/20 dark:border-[#E5C690]/30'
                        : 'bg-[#FAF7F2]/60 dark:bg-[#0d1f1c]/40 text-[#415c54] dark:text-[#a6b8b0] border-[#183630]/10 dark:border-[#E5C690]/15 hover:bg-[#E3DAC9]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#E5C690] text-[#183630] dark:bg-[#183630] dark:text-[#E5C690]'
                            : isPassed
                            ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630]'
                            : 'bg-[#E3DAC9] dark:bg-[#0d1f1c] text-[#415c54] dark:text-[#a6b8b0]'
                        }`}
                      >
                        {isPassed ? '✓' : i + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">{step}</span>
                    </div>

                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-current/20 text-current animate-pulse">
                        Active Stage
                      </span>
                    )}
                  </button>

                  {/* Contextual snippet for active step */}
                  {isActive && execution[i] && (
                    <div className="p-3 mx-2 rounded-xl bg-[#081513] border border-[#E5C690]/30 text-[#E5C690] font-mono text-xs animate-fade-in space-y-1">
                      <span className="text-[10px] text-[#a6b8b0] uppercase tracking-wider block font-sans font-bold">
                        Behind the scenes code logic:
                      </span>
                      <p className="text-emerald-400 font-semibold">{execution[i]}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Real-World Context & Interactive Mastery Checklist */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl p-5 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E5C690]" />
              Core Architecture Purpose
            </h3>
            <p className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] leading-relaxed">
              {purpose}
            </p>
          </div>

          <div className="rounded-3xl p-5 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#E5C690]" />
              Real-World Industry Use Case
            </h3>
            <p className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] leading-relaxed">
              {useCase}
            </p>
          </div>

          {/* Interactive Best Practices Checklist */}
          {bestPractices.length > 0 && (
            <div className="rounded-3xl p-5 bg-emerald-500/10 dark:bg-[#183630]/50 border border-emerald-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Best Practices Checklist
                </h3>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  {masteredPracticesCount} / {bestPractices.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {bestPractices.map((bp, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-500/10 cursor-pointer transition text-xs text-[#183630] dark:text-[#E3DAC9]"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedPractices[idx]}
                      onChange={() => togglePractice(idx)}
                      className="mt-0.5 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span className={checkedPractices[idx] ? 'line-through opacity-60' : 'font-medium'}>
                      {bp}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Pitfalls & Anti-Patterns */}
          {mistakes.length > 0 && (
            <div className="rounded-3xl p-5 bg-rose-500/10 dark:bg-[#183630]/50 border border-rose-500/30 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Anti-Patterns to Avoid
              </h3>

              <div className="space-y-2">
                {mistakes.map((m, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-rose-500/10 cursor-pointer transition text-xs text-[#183630] dark:text-[#E3DAC9]"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedMistakes[idx]}
                      onChange={() => toggleMistake(idx)}
                      className="mt-0.5 rounded accent-rose-600 cursor-pointer"
                    />
                    <span className={checkedMistakes[idx] ? 'line-through opacity-60' : 'font-medium'}>
                      {m}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
