import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  FlaskConical,
  BookOpen,
  Sparkles,
  RotateCcw,
  ChevronLeft,
  Code2,
  Terminal,
  ListChecks,
  Moon,
  Sun,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import CodeEditorPanel from '../components/CodePractice/CodeEditorPanel'
import OutputPanel from '../components/CodePractice/OutputPanel'
import TestResultsPanel from '../components/CodePractice/TestResultsPanel'
import { ExplanationPanel, EfficiencyPanel } from '../components/CodePractice/AnalysisPanel'
import { LANGUAGES, DIFFICULTY_COLORS } from '../data/practiceConfig'
import {
  fetchProblems,
  fetchProblem,
  runCode,
  testCode,
  explainCode,
  analyzeCode,
  fetchHealth,
} from '../services/codePracticeApi'

import { FALLBACK_PROBLEMS, getFallbackProblem } from '../data/fallbackProblems'

const TABS = [
  { id: 'output', label: 'Output', icon: Terminal },
  { id: 'tests', label: 'Test Results', icon: ListChecks },
  { id: 'explain', label: 'Explanation', icon: BookOpen },
  { id: 'efficiency', label: 'Efficiency', icon: Sparkles },
]

export default function CodePracticePage() {
  const { theme, toggleTheme, showToast } = useDashboard()

  // Problem & editor state
  const [problems, setProblems] = useState(FALLBACK_PROBLEMS)
  const [selectedProblemId, setSelectedProblemId] = useState(FALLBACK_PROBLEMS[0].id)
  const [problem, setProblem] = useState(FALLBACK_PROBLEMS[0])
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(FALLBACK_PROBLEMS[0].starterCode.javascript)
  const [customInput, setCustomInput] = useState(FALLBACK_PROBLEMS[0].examples[0].input)

  // Results state
  const [activeTab, setActiveTab] = useState('output')
  const [runResult, setRunResult] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [explanationSource, setExplanationSource] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analysisSource, setAnalysisSource] = useState(null)

  // Loading flags
  const [loadingRun, setLoadingRun] = useState(false)
  const [loadingTest, setLoadingTest] = useState(false)
  const [loadingExplain, setLoadingExplain] = useState(false)
  const [loadingAnalyze, setLoadingAnalyze] = useState(false)
  const [services, setServices] = useState({ judge0: false, llm: false })

  // Load problem list on mount
  useEffect(() => {
    fetchProblems()
      .then((data) => {
        if (data.problems?.length > 0) {
          setProblems(data.problems)
        }
      })
      .catch(() => {})

    fetchHealth()
      .then((data) => setServices(data.services))
      .catch(() => {})
  }, [])

  // Load problem details when selection changes
  useEffect(() => {
    if (!selectedProblemId) return

    fetchProblem(selectedProblemId)
      .then((data) => {
        const p = data?.problem && data.problem.starterCode ? data.problem : getFallbackProblem(selectedProblemId)
        setProblem(p)
        setCode(p?.starterCode?.[language] || '')
        setCustomInput(p?.examples?.[0]?.input || '')
        setRunResult(null)
        setTestResult(null)
        setExplanation(null)
        setAnalysis(null)
      })
      .catch(() => {
        const fallback = getFallbackProblem(selectedProblemId)
        setProblem(fallback)
        setCode(fallback?.starterCode?.[language] || '')
        setCustomInput(fallback?.examples?.[0]?.input || '')
        setRunResult(null)
        setTestResult(null)
        setExplanation(null)
        setAnalysis(null)
      })
  }, [selectedProblemId, language])

  // Update starter code when language changes
  const handleLanguageChange = useCallback(
    (newLang) => {
      setLanguage(newLang)
      if (problem?.starterCode?.[newLang]) {
        setCode(problem.starterCode[newLang])
      }
      setRunResult(null)
      setTestResult(null)
    },
    [problem],
  )

  const handleResetCode = () => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language])
      showToast(`Code reset to ${language.toUpperCase()} starter template`)
    }
  }

  const handleRun = useCallback(async () => {
    setLoadingRun(true)
    setRunResult(null)
    setActiveTab('output')
    try {
      const data = await runCode({ sourceCode: code, language, stdin: customInput })
      setRunResult(data.result)
    } catch (err) {
      showToast(err.message, 'error')
      setRunResult({ success: false, status: 'Error', error: err.message })
    } finally {
      setLoadingRun(false)
    }
  }, [code, language, customInput, showToast])

  // Global Cmd+Enter / Ctrl+Enter shortcut to run code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun])

  const handleTest = async () => {
    setLoadingTest(true)
    setTestResult(null)
    setActiveTab('tests')
    try {
      const data = await testCode({
        sourceCode: code,
        language,
        problemId: selectedProblemId,
      })
      setTestResult(data.testResult)
      if (data.testResult.summary.allPassed) {
        showToast('All test cases passed!')
      } else {
        showToast(`${data.testResult.summary.failed} test(s) failed`, 'error')
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoadingTest(false)
    }
  }

  const handleExplain = async () => {
    setLoadingExplain(true)
    setExplanation(null)
    setActiveTab('explain')
    try {
      const data = await explainCode({
        sourceCode: code,
        language,
        problemTitle: problem?.title,
      })
      setExplanation(data.explanation)
      setExplanationSource(data.source)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoadingExplain(false)
    }
  }

  const handleAnalyze = async () => {
    setLoadingAnalyze(true)
    setAnalysis(null)
    setActiveTab('efficiency')
    try {
      const data = await analyzeCode({
        sourceCode: code,
        language,
        problemTitle: problem?.title,
      })
      setAnalysis(data.analysis)
      setAnalysisSource(data.source)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoadingAnalyze(false)
    }
  }

  const monacoLanguage = LANGUAGES.find((l) => l.id === language)?.monaco || 'javascript'

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0d1f1c] text-[#183630] dark:text-[#E3DAC9] transition-colors duration-300 relative">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 dark:opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E5C690]/25 via-transparent to-[#183630]/30 dark:from-[#E5C690]/15 dark:to-[#183630]/60" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#112420]/85 backdrop-blur-xl border-b border-[#183630]/15 dark:border-[#E5C690]/20 shadow-xs relative z-10">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-[1650px] mx-auto gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] transition bg-[#E3DAC9]/40 dark:bg-[#183630]/60 px-3 py-1.5 rounded-xl border border-[#183630]/15 dark:border-[#E5C690]/30"
            >
              <ChevronLeft className="w-4 h-4 text-[#E5C690]" />
              <span className="hidden sm:inline">Back to Curriculum</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#183630] via-[#244f46] to-[#E5C690] text-[#E3DAC9] flex items-center justify-center shadow-lg shadow-[#183630]/25 border border-[#E5C690]/30 shrink-0">
                <Code2 className="w-5 h-5 text-[#E5C690]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-[#183630] dark:text-[#E3DAC9] tracking-tight truncate">
                  Code Practice IDE
                </h1>
                <p className="text-xs text-[#415c54] dark:text-[#a6b8b0] font-medium hidden sm:block">Interactive Algorithm Execution & AI Tutor</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Service status indicators */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#183630]/60 border border-[#183630]/15 dark:border-[#E5C690]/30 text-[11px] font-semibold">
              <span className="text-[#415c54] dark:text-[#a6b8b0]">Execution:</span>
              <span
                className={`flex items-center gap-1 ${
                  services.judge0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#183630] dark:text-[#E5C690]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${services.judge0 ? 'bg-emerald-500' : 'bg-[#E5C690]'}`} />
                {services.judge0 ? 'Judge0 Cloud' : 'Local Sandbox'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#183630]/60 border border-[#183630]/15 dark:border-[#E5C690]/30 text-[11px] font-semibold">
              <span className="text-[#415c54] dark:text-[#a6b8b0]">AI Tutor:</span>
              <span
                className={`flex items-center gap-1 ${
                  services.llm ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#183630] dark:text-[#E5C690]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${services.llm ? 'bg-emerald-500' : 'bg-[#E5C690]'}`} />
                {services.llm ? 'Active' : 'Offline Guide'}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#183630] dark:text-[#E5C690] bg-[#E3DAC9]/40 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] border border-[#183630]/15 dark:border-[#E5C690]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#E5C690]" /> : <Moon className="w-4 h-4 text-[#183630]" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1650px] mx-auto p-4 sm:p-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Left Column: Problem description */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Problem selector */}
            <div className="rounded-2xl bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 p-4 shadow-md">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#415c54] dark:text-[#a6b8b0] mb-2">
                Select Problem
              </label>
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#E3DAC9]/40 dark:bg-[#0d1f1c] border border-[#183630]/15 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9] focus:outline-none focus:ring-2 focus:ring-[#E5C690] transition cursor-pointer"
              >
                {problems.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* Problem details card */}
            {problem && (
              <div className="rounded-2xl bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 p-5 shadow-md space-y-4">
                <div className="space-y-2 border-b border-[#183630]/10 dark:border-[#E5C690]/20 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-[#183630] dark:text-[#E3DAC9] tracking-tight">
                      {problem.title}
                    </h2>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : problem.difficulty === 'Medium'
                          ? 'bg-[#E5C690]/25 text-[#183630] dark:text-[#E5C690] border border-[#E5C690]/40'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#415c54] dark:text-[#d2c7b5] leading-relaxed">
                  {problem.description}
                </p>

                {problem.examples?.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#415c54] dark:text-[#a6b8b0]">
                      Examples
                    </p>
                    {problem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="text-xs font-mono p-3 rounded-xl bg-[#E3DAC9]/40 dark:bg-[#081513] border border-[#183630]/10 dark:border-[#E5C690]/20 space-y-1"
                      >
                        <div>
                          <span className="text-[#415c54] dark:text-[#a6b8b0] font-sans font-semibold">Input: </span>
                          <span className="text-[#183630] dark:text-[#E3DAC9] whitespace-pre-wrap">
                            {ex.input}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#415c54] dark:text-[#a6b8b0] font-sans font-semibold">Output: </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-pre-wrap">
                            {ex.output}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* Center Column: Code Editor & Primary Controls */}
          <section className="lg:col-span-5 flex flex-col gap-3">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-md">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[#E3DAC9]/40 dark:bg-[#0d1f1c] border border-[#183630]/15 dark:border-[#E5C690]/30 font-bold text-[#183630] dark:text-[#E3DAC9] focus:outline-none focus:ring-2 focus:ring-[#E5C690] cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleResetCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#183630]/15 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E3DAC9] hover:bg-[#E3DAC9] dark:hover:bg-[#183630] transition"
                title="Reset code template"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E5C690]" />
                <span>Reset</span>
              </button>

              <div className="flex-1" />

              <button
                type="button"
                onClick={handleRun}
                disabled={loadingRun}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loadingRun ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={loadingTest}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-[#183630] dark:bg-[#E5C690] text-[#E5C690] dark:text-[#183630] hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-[#183630]/20"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{loadingTest ? 'Testing...' : 'Submit Tests'}</span>
              </button>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-[440px] lg:min-h-[500px]">
              <CodeEditorPanel
                value={code}
                onChange={setCode}
                language={monacoLanguage}
                onRunCode={handleRun}
              />
            </div>

            {/* AI Tutor Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExplain}
                disabled={loadingExplain}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-[#183630]/20 dark:border-[#E5C690]/30 bg-[#E3DAC9]/40 dark:bg-[#183630]/60 text-[#183630] dark:text-[#E5C690] hover:bg-[#E3DAC9] dark:hover:bg-[#1f4840] disabled:opacity-50 active:scale-98 transition shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-[#E5C690]" />
                <span>{loadingExplain ? 'Generating...' : 'AI Code Explanation'}</span>
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loadingAnalyze}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-[#E5C690]/40 bg-[#E5C690]/15 dark:bg-[#183630]/60 text-[#183630] dark:text-[#E5C690] hover:bg-[#E5C690]/30 dark:hover:bg-[#1f4840] disabled:opacity-50 active:scale-98 transition shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#E5C690]" />
                <span>{loadingAnalyze ? 'Analyzing...' : 'AI Efficiency Analysis'}</span>
              </button>
            </div>
          </section>

          {/* Right Column: Console Output & Analysis Tabs */}
          <section className="lg:col-span-4">
            <div className="rounded-2xl bg-white/85 dark:bg-[#112420]/85 backdrop-blur-2xl border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-md overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-[#183630]/10 dark:border-[#E5C690]/20 overflow-x-auto bg-[#FAF7F2]/60 dark:bg-[#0d1f1c]/60">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                        isActive
                          ? 'border-[#183630] dark:border-[#E5C690] text-[#183630] dark:text-[#E5C690] bg-white dark:bg-[#112420] shadow-xs'
                          : 'border-transparent text-[#415c54] dark:text-[#a6b8b0] hover:text-[#183630] dark:hover:text-[#E3DAC9]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E5C690]' : ''}`} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Body */}
              <div className="p-4 sm:p-5">
                {activeTab === 'output' && (
                  <OutputPanel
                    result={runResult}
                    customInput={customInput}
                    onCustomInputChange={setCustomInput}
                    loading={loadingRun}
                    problem={problem}
                  />
                )}
                {activeTab === 'tests' && (
                  <TestResultsPanel testResult={testResult} loading={loadingTest} />
                )}
                {activeTab === 'explain' && (
                  <ExplanationPanel
                    explanation={explanation}
                    source={explanationSource}
                    loading={loadingExplain}
                  />
                )}
                {activeTab === 'efficiency' && (
                  <EfficiencyPanel
                    analysis={analysis}
                    source={analysisSource}
                    loading={loadingAnalyze}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
