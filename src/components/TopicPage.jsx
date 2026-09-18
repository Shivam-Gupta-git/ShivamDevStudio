import React, { useState, useEffect } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import Workflow from './Workflow'
import CodeViewer from './CodeViewer'
import TopicQuiz from './TopicQuiz'
import TopicNotes from './TopicNotes'
import TopicFlashcards from './TopicFlashcards'
import { getTopicCode } from '../data/topicCode'
import {
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Share2,
  BookmarkCheck,
  Layers,
  Filter,
  ArrowRight,
  Download,
} from 'lucide-react'

export default function TopicPage() {
  const { activeTopic, showToast } = useDashboard()
  const DemoComponent = activeTopic.component
  const code = getTopicCode(activeTopic.id)
  const { keyPoints } = activeTopic
  const Icon = activeTopic.icon

  // Dynamic filter tab state for Key Concepts
  const [activeConceptTab, setActiveConceptTab] = useState('all')
  const [checkedPoints, setCheckedPoints] = useState({})
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [copiedKey, setCopiedKey] = useState(null)

  // Load checked points from localStorage for this topic
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`topic-checked-${activeTopic.id}`)
      if (saved) {
        setCheckedPoints(JSON.parse(saved))
      } else {
        setCheckedPoints({})
      }
    } catch {
      setCheckedPoints({})
    }
    setActiveConceptTab('all')
    setExpandedQuestions({})
  }, [activeTopic.id])

  const toggleCheckPoint = (key) => {
    setCheckedPoints((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(`topic-checked-${activeTopic.id}`, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const toggleExpandQuestion = (idx) => {
    setExpandedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(id)
      showToast('Copied to clipboard!')
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  const handleExportCheatSheet = () => {
    const text = `# ${activeTopic.title} — ShivamDev Studio Cheat Sheet
Category: ${activeTopic.category} | Difficulty: ${activeTopic.difficulty || 'Intermediate'} | Read Time: ${activeTopic.readTime || '5 min'}

## Description
${activeTopic.description}

## Core Purpose & Usage
${keyPoints?.why || 'N/A'}

## Advantages
${(keyPoints?.advantages || []).map((a) => `- ${a}`).join('\n')}

## Trade-offs & Limitations
${(keyPoints?.limitations || []).map((l) => `- ${l}`).join('\n')}

## Frequent Interview Questions
${(keyPoints?.interviewQuestions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Pitfalls & Anti-Patterns
${(keyPoints?.mistakes || []).map((m) => `- ${m}`).join('\n')}
`
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTopic.id}-cheat-sheet.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Exported ${activeTopic.title} cheat sheet!`)
  }

  const difficultyColor =
    activeTopic.difficulty === 'Beginner'
      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
      : activeTopic.difficulty === 'Advanced'
      ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
      : 'bg-[#E5C690]/25 text-[#183630] dark:text-[#E5C690] border-[#E5C690]/40'

  // Calculate mastery for key points
  const totalConcepts =
    1 +
    (keyPoints?.advantages?.length || 0) +
    (keyPoints?.limitations?.length || 0) +
    (keyPoints?.interviewQuestions?.length || 0) +
    (keyPoints?.mistakes?.length || 0)
  const completedConcepts = Object.values(checkedPoints).filter(Boolean).length
  const conceptPercent = Math.round((completedConcepts / (totalConcepts || 1)) * 100)

  return (
    <article
      key={activeTopic.id}
      className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12"
      aria-labelledby="topic-title"
    >
      {/* Hero card themed with #183630, #E3DAC9, #E5C690 */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E5C690]/15 via-[#183630]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5 relative z-10">
          <div className="flex items-start gap-5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#183630] via-[#244f46] to-[#E5C690] text-[#E3DAC9] flex items-center justify-center shadow-lg shadow-[#183630]/30 border border-[#E5C690]/30 shrink-0">
              <Icon className="w-6 h-6 text-[#E5C690]" aria-hidden="true" />
            </div>
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#183630] text-[#183630] dark:text-[#E5C690] border border-[#183630]/15 dark:border-[#E5C690]/30">
                  {activeTopic.category}
                </span>
                {activeTopic.difficulty && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColor}`}>
                    {activeTopic.difficulty}
                  </span>
                )}
                {activeTopic.readTime && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E3DAC9]/40 dark:bg-[#0d1f1c] text-[#415c54] dark:text-[#a6b8b0] border border-[#183630]/10 dark:border-[#E5C690]/20">
                    <Clock className="w-3 h-3 text-[#E5C690]" />
                    {activeTopic.readTime}
                  </span>
                )}
              </div>
              <h1
                id="topic-title"
                className="text-2xl sm:text-3xl font-extrabold text-[#183630] dark:text-[#E3DAC9] tracking-tight"
              >
                {activeTopic.title}
              </h1>
              <p className="text-[#415c54] dark:text-[#d2c7b5] text-sm sm:text-base leading-relaxed max-w-3xl">
                {activeTopic.description}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCheatSheet}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#E3DAC9]/60 dark:bg-[#183630] hover:bg-[#E5C690]/40 text-[#183630] dark:text-[#E5C690] border border-[#183630]/20 dark:border-[#E5C690]/30 transition-all shadow-sm"
              title="Download Markdown Cheat Sheet"
            >
              <Download className="w-3.5 h-3.5 text-[#E5C690]" />
              <span>Cheat Sheet</span>
            </button>
          </div>
        </div>

        {/* Dynamic Concept Mastery Progress Meter */}
        <div className="mt-6 pt-4 border-t border-[#183630]/10 dark:border-[#E5C690]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#E5C690]" />
            <span className="font-semibold text-[#183630] dark:text-[#E3DAC9]">
              Takeaways Learned:
            </span>
            <span className="font-mono text-[#183630] dark:text-[#E5C690] font-bold">
              {completedConcepts} / {totalConcepts} ({conceptPercent}%)
            </span>
          </div>

          <div className="w-48 h-2 rounded-full bg-[#E3DAC9] dark:bg-[#0d1f1c] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#183630] via-[#2d6358] to-[#E5C690] transition-all duration-300"
              style={{ width: `${conceptPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <section className="space-y-4" aria-labelledby="demo-section-title">
        <div className="flex items-center justify-between">
          <h2 id="demo-section-title" className="text-lg sm:text-xl font-bold text-[#183630] dark:text-[#E3DAC9]">
            Interactive Playground
          </h2>
          <span className="text-xs text-[#415c54] dark:text-[#a6b8b0] font-medium">
            Live preview of {activeTopic.title} behavior
          </span>
        </div>
        <div className="p-4 sm:p-6 rounded-3xl bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl min-h-[220px]">
          <DemoComponent />
        </div>
      </section>

      {/* Workflow Diagram */}
      <Workflow workflow={activeTopic.workflow} topicTitle={activeTopic.title} />

      {/* Code Viewer */}
      <CodeViewer code={code} codePath={activeTopic.codePath} topicTitle={activeTopic.title} />

      {/* Dynamic Key Concepts & Interview Takeaways */}
      <section className="space-y-4" aria-labelledby="key-points-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="key-points-title" className="text-lg sm:text-xl font-bold text-[#183630] dark:text-[#E3DAC9]">
              Key Concepts & Interview Takeaways
            </h2>
            <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
              Interactive knowledge cards. Check off items you've mastered.
            </p>
          </div>

          {/* Tab Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#E3DAC9]/40 dark:bg-[#112420] border border-[#183630]/15 dark:border-[#E5C690]/25">
            {[
              { id: 'all', label: 'All' },
              { id: 'purpose', label: 'Purpose' },
              { id: 'advantages', label: 'Pros' },
              { id: 'tradeoffs', label: 'Cons' },
              { id: 'questions', label: 'Q&A' },
              { id: 'mistakes', label: 'Pitfalls' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveConceptTab(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeConceptTab === tab.id
                    ? 'bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] shadow-sm shadow-[#183630]/20'
                    : 'text-[#415c54] dark:text-[#a6b8b0] hover:text-[#183630] dark:hover:text-[#E3DAC9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(activeConceptTab === 'all' || activeConceptTab === 'purpose') && (
            <div className="rounded-2xl p-5 border backdrop-blur-xl bg-[#E5C690]/15 dark:bg-[#183630]/50 border-[#E5C690]/40 text-[#183630] dark:text-[#E3DAC9] transition-all duration-200 hover:shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E5C690]/30 text-[#183630] dark:text-[#E5C690]">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">Core Purpose & Usage</h3>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCheckPoint('why')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                    checkedPoints['why']
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-[#183630] text-[#E3DAC9] dark:bg-[#0d1f1c] dark:text-[#E5C690] border-[#E5C690]/30 hover:opacity-90'
                  }`}
                >
                  {checkedPoints['why'] ? 'Learned ✓' : 'Mark Learned'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] leading-relaxed">
                {keyPoints.why}
              </p>
            </div>
          )}

          {(activeConceptTab === 'all' || activeConceptTab === 'advantages') && (
            <div className="rounded-2xl p-5 border backdrop-blur-xl bg-emerald-500/10 dark:bg-[#183630]/50 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">Advantages & Strengths</h3>
              </div>
              <ul className="space-y-2 mt-2">
                {(keyPoints.advantages || []).map((item, idx) => {
                  const key = `adv-${idx}`
                  const isChecked = checkedPoints[key]
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleCheckPoint(key)}
                      className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] flex items-start gap-2 cursor-pointer group"
                    >
                      <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] font-bold border transition ${
                        isChecked ? 'bg-emerald-500 text-white border-emerald-500' : 'border-[#183630]/30 dark:border-[#E5C690]/40 group-hover:border-emerald-500'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {(activeConceptTab === 'all' || activeConceptTab === 'tradeoffs') && (
            <div className="rounded-2xl p-5 border backdrop-blur-xl bg-[#E3DAC9]/40 dark:bg-[#183630]/50 border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9] transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E5C690]/25 text-[#183630] dark:text-[#E5C690]">
                  <ThumbsDown className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">Trade-offs & Limitations</h3>
              </div>
              <ul className="space-y-2 mt-2">
                {(keyPoints.limitations || []).map((item, idx) => {
                  const key = `limit-${idx}`
                  const isChecked = checkedPoints[key]
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleCheckPoint(key)}
                      className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] flex items-start gap-2 cursor-pointer group"
                    >
                      <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] font-bold border transition ${
                        isChecked ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] border-current' : 'border-[#183630]/30 dark:border-[#E5C690]/40'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {(activeConceptTab === 'all' || activeConceptTab === 'questions') && (
            <div className="rounded-2xl p-5 border backdrop-blur-xl bg-[#FAF7F2] dark:bg-[#112420] border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9] transition-all duration-200 hover:shadow-md sm:col-span-2">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E5C690]/30 text-[#183630] dark:text-[#E5C690]">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">Frequent Interview Questions (Click to Reveal Model Answer)</h3>
                </div>
                <span className="text-[11px] font-mono text-[#183630] dark:text-[#E5C690] font-bold">
                  {keyPoints.interviewQuestions?.length || 0} Questions
                </span>
              </div>
              <div className="space-y-2.5 mt-3">
                {(keyPoints.interviewQuestions || []).map((item, idx) => {
                  const isExpanded = expandedQuestions[idx]
                  const key = `q-${idx}`
                  const isChecked = checkedPoints[key]
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#183630]/15 dark:border-[#E5C690]/25 bg-white/80 dark:bg-[#0d1f1c]/80 overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => toggleExpandQuestion(idx)}
                        className="p-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40 transition"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#E5C690]" /> : <ChevronDown className="w-4 h-4 text-[#415c54] dark:text-[#a6b8b0]" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-3.5 bg-[#FAF7F2] dark:bg-[#081513] border-t border-[#183630]/10 dark:border-[#E5C690]/20 space-y-2 animate-fade-in text-xs text-[#415c54] dark:text-[#d2c7b5]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#183630] dark:text-[#E5C690] uppercase tracking-wider">
                              💡 Senior Answer Talking Points:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(`Interview Question: ${item}\nConcept: ${activeTopic.title}`, `q-${idx}`)}
                                className="inline-flex items-center gap-1 text-[#415c54] dark:text-[#a6b8b0] hover:text-[#183630] dark:hover:text-white"
                              >
                                {copiedKey === `q-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedKey === `q-${idx}` ? 'Copied' : 'Copy'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleCheckPoint(key)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                  isChecked
                                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                    : 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] border-current'
                                }`}
                              >
                                {isChecked ? 'Mastered ✓' : 'Mark Mastered'}
                              </button>
                            </div>
                          </div>
                          <p className="leading-relaxed font-sans">
                            When answering <strong>"{item}"</strong>, explain the underlying React reconciliation / lifecycle mechanism, emphasize immutability, state predictability, and explain performance implications with a clear before/after comparison.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(activeConceptTab === 'all' || activeConceptTab === 'mistakes') && keyPoints.mistakes && (
            <div className="rounded-2xl p-5 border backdrop-blur-xl bg-rose-500/10 dark:bg-[#183630]/50 border-rose-500/30 text-rose-800 dark:text-rose-300 transition-all duration-200 hover:shadow-md sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#183630] dark:text-[#E3DAC9]">Pitfalls & Anti-Patterns</h3>
              </div>
              <ul className="space-y-2 mt-2">
                {(keyPoints.mistakes || []).map((item, idx) => {
                  const key = `mistake-${idx}`
                  const isChecked = checkedPoints[key]
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleCheckPoint(key)}
                      className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] flex items-start gap-2 cursor-pointer group"
                    >
                      <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-[10px] font-bold border transition ${
                        isChecked ? 'bg-rose-500 text-white border-rose-500' : 'border-[#183630]/30 dark:border-[#E5C690]/40 group-hover:border-rose-500'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Self-Assessment Quiz */}
      <TopicQuiz topicId={activeTopic.id} topicTitle={activeTopic.title} />

      {/* Interview Flashcards Drill */}
      <TopicFlashcards
        topicId={activeTopic.id}
        topicTitle={activeTopic.title}
        questions={keyPoints?.interviewQuestions}
        keyPoints={keyPoints}
      />

      {/* Personal Study Notes & Scratchpad */}
      <TopicNotes topicId={activeTopic.id} topicTitle={activeTopic.title} />
    </article>
  )
}
