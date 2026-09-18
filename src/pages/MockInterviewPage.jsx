import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Bot,
  User,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Play,
  ArrowLeft,
  Code2,
  Shield,
  Zap,
  Atom,
  Network,
  Download,
  Share2,
  HelpCircle,
  TrendingUp,
  Flame,
  Check,
  Trophy,
  Sliders,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { INTERVIEW_TRACKS, TRACK_QUESTIONS } from '../data/mockInterviewData'
import {
  evaluateAnswer,
  calculateFinalScorecard,
  getInterviewHistory,
} from '../services/mockInterviewService'

const TRACK_ICONS = {
  Atom: Atom,
  Zap: Zap,
  Network: Network,
  Code2: Code2,
}

export default function MockInterviewPage() {
  const { showToast } = useDashboard()
  const navigate = useNavigate()

  // Interview Stages: 'setup' | 'active' | 'results'
  const [stage, setStage] = useState('setup')

  // Setup state
  const [selectedTrackId, setSelectedTrackId] = useState('frontend-core')
  const [candidateName, setCandidateName] = useState('Shivam Gupta')
  const [difficultyLevel, setDifficultyLevel] = useState('Senior Staff Engineer')
  const [timerEnabled, setTimerEnabled] = useState(true)

  // Active interview state
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [candidateText, setCandidateText] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [answeredList, setAnsweredList] = useState([])
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpAnswer, setFollowUpAnswer] = useState('')

  // Timer state
  const [timeLeft, setTimeLeft] = useState(900) // 15 mins default
  const [timerActive, setTimerActive] = useState(false)

  // Results state
  const [scorecard, setScorecard] = useState(null)
  const [historyList, setHistoryList] = useState([])

  const activeTrack = INTERVIEW_TRACKS.find((t) => t.id === selectedTrackId) || INTERVIEW_TRACKS[0]
  const currentQuestions = TRACK_QUESTIONS[selectedTrackId] || []
  const currentQ = currentQuestions[currentQIndex]

  // Load past history
  useEffect(() => {
    setHistoryList(getInterviewHistory())
  }, [stage])

  // Timer countdown
  useEffect(() => {
    if (!timerActive || stage !== 'active' || !timerEnabled) return

    if (timeLeft <= 0) {
      handleCompleteInterview()
      showToast('Interview timer expired! Compiling Senior Readiness Scorecard...')
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timerActive, timeLeft, stage, timerEnabled])

  // -------------------------------------------------------------
  // Start Interview
  // -------------------------------------------------------------
  const handleStartInterview = () => {
    setCurrentQIndex(0)
    setCandidateText('')
    setCodeSnippet(currentQuestions[0]?.starterSnippet || '')
    setShowCodeEditor(Boolean(currentQuestions[0]?.starterSnippet))
    setAnsweredList([])
    setShowFollowUp(false)
    setFollowUpAnswer('')
    setTimeLeft(activeTrack.durationMinutes * 60)
    setTimerActive(true)
    setStage('active')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast(`Starting ${activeTrack.title} Interview! Good luck! 🚀`)
  }

  // -------------------------------------------------------------
  // Submit Current Answer & Advance
  // -------------------------------------------------------------
  const handleNextQuestion = () => {
    if (!candidateText.trim() && !codeSnippet.trim()) {
      showToast('Please type your response before continuing', 'error')
      return
    }

    setIsSubmittingAnswer(true)

    setTimeout(() => {
      const evaluation = evaluateAnswer({
        questionObj: currentQ,
        candidateText: `${candidateText} ${followUpAnswer}`,
        codeSnippet,
        trackId: selectedTrackId,
      })

      const answerRecord = {
        questionId: currentQ.id,
        question: currentQ.question,
        candidateText,
        followUpAnswer,
        codeSnippet,
        modelAnswer: currentQ.modelAnswer,
        evaluation,
      }

      const nextAnswered = [...answeredList, answerRecord]
      setAnsweredList(nextAnswered)

      if (currentQIndex < currentQuestions.length - 1) {
        const nextIdx = currentQIndex + 1
        setCurrentQIndex(nextIdx)
        setCandidateText('')
        setCodeSnippet(currentQuestions[nextIdx]?.starterSnippet || '')
        setShowCodeEditor(Boolean(currentQuestions[nextIdx]?.starterSnippet))
        setShowFollowUp(false)
        setFollowUpAnswer('')
        setIsSubmittingAnswer(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // All questions completed!
        setTimerActive(false)
        const finalCard = calculateFinalScorecard({
          trackId: selectedTrackId,
          trackTitle: activeTrack.title,
          candidateName,
          answersList: nextAnswered,
        })
        setScorecard(finalCard)
        setStage('results')
        setIsSubmittingAnswer(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        showToast('🎉 Interview Complete! Generating Readiness Scorecard...')
      }
    }, 400)
  }

  const handleCompleteInterview = () => {
    setTimerActive(false)
    const finalCard = calculateFinalScorecard({
      trackId: selectedTrackId,
      trackTitle: activeTrack.title,
      candidateName,
      answersList: answeredList.length > 0 ? answeredList : [
        {
          question: currentQ.question,
          candidateText: candidateText || '(Incomplete due to timeout)',
          modelAnswer: currentQ.modelAnswer,
          evaluation: { score: 70, feedback: 'Completed on time boundary.' },
        },
      ],
    })
    setScorecard(finalCard)
    setStage('results')
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainder = secs % 60
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#071310] text-[#183630] dark:text-[#E3DAC9] font-sans antialiased pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 dark:bg-[#071310]/90 backdrop-blur-xl border-b border-[#183630]/15 dark:border-[#E5C690]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-[#183630] text-[#E5C690] hover:scale-105 active:scale-95 transition-transform"
              title="Return to Main Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#183630] to-[#244f46] text-[#E5C690] border border-[#E5C690]/40 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#183630] dark:text-white leading-none">
                    ShivamDev Studio
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] border border-[#E5C690]/40">
                    AI Mock Interviewer
                  </span>
                </div>
                <p className="text-[11px] text-[#415c54] dark:text-[#a6b8b0]">
                  FAANG & Senior React Technical Simulator
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 hover:scale-105 transition"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Practice IDE</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E3DAC9]/60 dark:bg-[#112420] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/30 hover:bg-[#E3DAC9] transition"
            >
              <Shield className="w-3.5 h-3.5 text-[#E5C690]" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ============================================================= */}
        {/* STAGE 1: SETUP & TRACK SELECTION                              */}
        {/* ============================================================= */}
        {stage === 'setup' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#183630] via-[#1f4840] to-[#112420] text-[#E3DAC9] border border-[#E5C690]/30 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5C690]/20 text-[#E5C690] border border-[#E5C690]/30">
                  <Flame className="w-4 h-4" /> Live AI Technical Interview
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Simulate Real FAANG & Senior React Interviews
                </h2>
                <p className="text-xs sm:text-sm text-[#E3DAC9]/80 leading-relaxed">
                  Practice high-pressure technical questions with real-time AI evaluation, follow-up
                  probing, and a comprehensive Senior Developer Readiness Scorecard.
                </p>
              </div>

              {/* Decorative radial blur */}
              <div
                className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#E5C690]/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Candidate & Options Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 shadow-md">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                  Target Seniority Level
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white font-bold focus:outline-none"
                >
                  <option value="Senior Staff Engineer">Senior Staff Engineer</option>
                  <option value="Senior React Developer">Senior React Developer</option>
                  <option value="Mid-Level Frontend Engineer">Mid-Level Frontend Engineer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                  Interview Timer
                </label>
                <button
                  type="button"
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-between ${
                    timerEnabled
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300'
                  }`}
                >
                  <span>Speed Timer (15-25m)</span>
                  <span className="font-mono">{timerEnabled ? 'ENABLED ✓' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Choose Interview Track Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#183630] dark:text-white">
                Select Interview Track & Specialization
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTERVIEW_TRACKS.map((track) => {
                  const isSelected = selectedTrackId === track.id
                  const IconComponent = TRACK_ICONS[track.icon] || Atom

                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedTrackId(track.id)}
                      className={`p-6 rounded-3xl cursor-pointer select-none transition-all duration-300 border shadow-lg relative overflow-hidden flex flex-col justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#183630] text-[#E3DAC9] border-[#E5C690] ring-2 ring-[#E5C690]/50 scale-[1.02]'
                          : 'bg-white/80 dark:bg-[#112420]/80 border-[#183630]/15 dark:border-[#E5C690]/20 hover:border-[#E5C690]/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#E5C690] text-[#183630]'
                                : 'bg-[#183630] text-[#E5C690]'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-[#E5C690]/20 text-[#E5C690]'
                                : 'bg-[#E3DAC9]/60 dark:bg-[#091714] text-[#415c54] dark:text-[#a6b8b0]'
                            }`}
                          >
                            {track.durationMinutes} mins · {track.totalQuestions} Questions
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold">{track.title}</h4>
                        <p
                          className={`text-xs leading-relaxed ${
                            isSelected ? 'text-[#E3DAC9]/80' : 'text-[#415c54] dark:text-[#a6b8b0]'
                          }`}
                        >
                          {track.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs font-bold">
                        <span>{isSelected ? 'Track Selected ✓' : 'Click to Select'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartInterview}
                className="w-full py-4 rounded-3xl text-sm font-extrabold bg-gradient-to-r from-[#183630] via-[#244f46] to-[#E5C690] text-[#E3DAC9] border border-[#E5C690]/40 shadow-2xl shadow-[#183630]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 text-[#E5C690]" />
                <span>Begin Technical Interview as {candidateName}</span>
              </button>
            </div>

            {/* Past History */}
            {historyList.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-[#183630]/10 dark:border-[#E5C690]/20">
                <h4 className="text-sm font-bold text-[#183630] dark:text-white">
                  Recent Interview Scorecards ({historyList.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {historyList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white/70 dark:bg-[#112420]/70 border border-[#183630]/10 dark:border-[#E5C690]/20 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-[#415c54] dark:text-[#a6b8b0]">
                          {item.date} · {item.trackTitle}
                        </span>
                        <h5 className="text-xs font-bold text-[#183630] dark:text-white">
                          Score: {item.overallScore}% ({item.grade})
                        </h5>
                        <p className="text-[11px] text-[#E5C690] font-semibold">{item.readiness}</p>
                      </div>
                      <span className="w-10 h-10 rounded-xl bg-[#183630] text-[#E5C690] font-bold text-sm flex items-center justify-center border border-[#E5C690]/30">
                        {item.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* STAGE 2: ACTIVE INTERVIEW SESSION                             */}
        {/* ============================================================= */}
        {stage === 'active' && currentQ && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Interview HUD Bar */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/30">
                  QUESTION {currentQIndex + 1} OF {currentQuestions.length}
                </span>
                <span className="text-xs font-bold text-[#183630] dark:text-white hidden sm:inline">
                  {activeTrack.title}
                </span>
              </div>

              {timerEnabled && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                    timeLeft < 180
                      ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse'
                      : 'bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] border-[#E5C690]/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Remaining: {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* Stepper Dots */}
            <div className="flex gap-2">
              {currentQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i === currentQIndex
                      ? 'bg-[#E5C690] shadow-sm shadow-[#E5C690]/50'
                      : i < currentQIndex
                      ? 'bg-emerald-500'
                      : 'bg-[#E3DAC9] dark:bg-[#091714]'
                  }`}
                />
              ))}
            </div>

            {/* AI Interviewer Avatar & Question Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#112420]/90 border border-[#183630]/20 dark:border-[#E5C690]/30 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#183630] to-[#244f46] text-[#E5C690] border border-[#E5C690]/40 flex items-center justify-center shadow-lg shrink-0 mt-0.5">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#183630] dark:text-white">
                      AI Lead Interviewer
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] font-bold">
                      {difficultyLevel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#183630] dark:text-white leading-snug">
                    "{currentQ.question}"
                  </h3>
                </div>
              </div>

              {currentQ.context && (
                <p className="text-xs text-[#415c54] dark:text-[#a6b8b0] bg-[#FAF7F2] dark:bg-[#091714] p-3 rounded-2xl border border-[#183630]/10 dark:border-[#E5C690]/20">
                  🎯 <strong>Interviewer Context:</strong> {currentQ.context}
                </p>
              )}
            </div>

            {/* Candidate Response Editor Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#112420]/90 border border-[#183630]/20 dark:border-[#E5C690]/30 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E5C690]" />
                  <span className="text-xs font-bold text-[#183630] dark:text-white">
                    {candidateName}'s Technical Response
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCodeEditor(!showCodeEditor)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                      showCodeEditor
                        ? 'bg-[#183630] text-[#E5C690] border-[#E5C690]/40'
                        : 'bg-[#E3DAC9]/50 dark:bg-[#091714] text-[#415c54] dark:text-[#a6b8b0] border-[#183630]/15'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{showCodeEditor ? 'Code Sandbox: Active' : '+ Add Code Snippet'}</span>
                  </button>

                  <span className="text-xs font-mono text-[#415c54] dark:text-[#a6b8b0]">
                    {candidateText.trim() ? candidateText.trim().split(/\s+/).length : 0} words
                  </span>
                </div>
              </div>

              {/* Main Text Response Area */}
              <textarea
                rows={6}
                value={candidateText}
                onChange={(e) => setCandidateText(e.target.value)}
                placeholder="Explain the architectural concept clearly, covering principles, performance implications, and real-world edge cases..."
                className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-[#FAF7F2] dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white placeholder:text-[#415c54]/60 focus:outline-none focus:ring-2 focus:ring-[#E5C690] leading-relaxed font-sans"
              />

              {/* Code Snippet Editor if active */}
              {showCodeEditor && (
                <div className="space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    <span>Code / Hook Implementation (JavaScript / JSX)</span>
                  </div>
                  <textarea
                    rows={6}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Write your code or hook implementation here..."
                    className="w-full p-4 rounded-2xl bg-[#091714] text-[#E5C690] font-mono text-xs border border-[#183630]/30 dark:border-[#E5C690]/30 focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                  />
                </div>
              )}

              {/* AI Follow-up Option */}
              {currentQ.followUp && (
                <div className="pt-2 border-t border-[#183630]/10 dark:border-[#E5C690]/20 space-y-3">
                  {!showFollowUp ? (
                    <button
                      type="button"
                      onClick={() => setShowFollowUp(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183630] dark:text-[#E5C690] hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Take AI Follow-Up Probe (+ Bonus Score)</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#E5C690]/10 border border-[#E5C690]/30 space-y-2 animate-fade-in">
                      <span className="text-xs font-bold text-[#183630] dark:text-[#E5C690] flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" /> Follow-up Probe: "{currentQ.followUp}"
                      </span>
                      <textarea
                        rows={2}
                        value={followUpAnswer}
                        onChange={(e) => setFollowUpAnswer(e.target.value)}
                        placeholder="Answer the follow-up edge case..."
                        className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit & Next Button */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={isSubmittingAnswer}
                  className="px-6 py-3 rounded-2xl text-xs font-extrabold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-xl shadow-[#183630]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>
                    {isSubmittingAnswer
                      ? 'Evaluating...'
                      : currentQIndex < currentQuestions.length - 1
                      ? 'Submit & Next Question'
                      : 'Finish Interview & View Scorecard'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STAGE 3: FINAL SENIOR READINESS SCORECARD & CERTIFICATE       */}
        {/* ============================================================= */}
        {stage === 'results' && scorecard && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Big Scorecard Banner */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#183630] via-[#1f4840] to-[#112420] text-[#E3DAC9] border border-[#E5C690]/40 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5C690]/20 text-[#E5C690] border border-[#E5C690]/30">
                  <Award className="w-4 h-4" /> Official Technical Assessment
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {scorecard.candidateName}'s Interview Scorecard
                </h2>
                <p className="text-xs sm:text-sm text-[#E3DAC9]/80 font-mono">
                  Track: {scorecard.trackTitle} · Evaluated on {scorecard.date}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-[#E5C690] text-[#183630] shadow">
                    Status: {scorecard.readiness}
                  </span>
                </div>
              </div>

              {/* Big Score Gauge Badge */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#183630] text-[#E5C690] border-2 border-[#E5C690] flex flex-col items-center justify-center shadow-2xl shrink-0">
                <span className="text-3xl sm:text-4xl font-extrabold">{scorecard.overallScore}%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Grade {scorecard.grade}
                </span>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-2 shadow-md">
                <span className="text-xs font-bold text-[#415c54] dark:text-[#a6b8b0]">
                  React Internals
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#183630] dark:text-white">
                    {scorecard.categories.reactInternals}%
                  </span>
                  <span className="text-xs font-bold text-emerald-500">Mastery</span>
                </div>
                <div className="h-2 rounded-full bg-[#E3DAC9] dark:bg-[#091714] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${scorecard.categories.reactInternals}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-2 shadow-md">
                <span className="text-xs font-bold text-[#415c54] dark:text-[#a6b8b0]">
                  Performance & Profiling
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#183630] dark:text-white">
                    {scorecard.categories.performance}%
                  </span>
                  <span className="text-xs font-bold text-[#E5C690]">Strong</span>
                </div>
                <div className="h-2 rounded-full bg-[#E3DAC9] dark:bg-[#091714] overflow-hidden">
                  <div
                    className="h-full bg-[#E5C690] rounded-full"
                    style={{ width: `${scorecard.categories.performance}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-2 shadow-md">
                <span className="text-xs font-bold text-[#415c54] dark:text-[#a6b8b0]">
                  System Architecture
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#183630] dark:text-white">
                    {scorecard.categories.architecture}%
                  </span>
                  <span className="text-xs font-bold text-emerald-500">Optimal</span>
                </div>
                <div className="h-2 rounded-full bg-[#E3DAC9] dark:bg-[#091714] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${scorecard.categories.architecture}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-2 shadow-md">
                <span className="text-xs font-bold text-[#415c54] dark:text-[#a6b8b0]">
                  Code Quality & Cleanliness
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#183630] dark:text-white">
                    {scorecard.categories.codeQuality}%
                  </span>
                  <span className="text-xs font-bold text-emerald-500">Clear</span>
                </div>
                <div className="h-2 rounded-full bg-[#E3DAC9] dark:bg-[#091714] overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${scorecard.categories.codeQuality}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Official Branded Certificate Box */}
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#091714] border-4 border-[#E5C690] shadow-2xl space-y-6 text-center relative overflow-hidden">
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#183630] text-[#E5C690] border-2 border-[#E5C690] flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#E5C690] font-extrabold block">
                  ShivamDev Studio · Technical Accreditation
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#183630] dark:text-white">
                  Certificate of React Technical Mastery
                </h3>
                <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                  This certifies that candidate has successfully passed the Senior React Engineer
                  Technical Simulation.
                </p>
              </div>

              <div className="py-4 border-y border-[#183630]/10 dark:border-[#E5C690]/20 max-w-lg mx-auto space-y-1">
                <span className="text-xs text-[#415c54] dark:text-[#a6b8b0] uppercase font-bold">
                  Awarded To
                </span>
                <h4 className="text-2xl font-black text-[#183630] dark:text-[#E5C690]">
                  {scorecard.candidateName}
                </h4>
                <p className="text-xs font-mono text-[#415c54] dark:text-[#a6b8b0]">
                  Specialization: {scorecard.trackTitle} · Grade {scorecard.grade} ({scorecard.overallScore}%)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#415c54] dark:text-[#a6b8b0] pt-2 max-w-xl mx-auto">
                <span>Verification ID: {scorecard.certificateId}</span>
                <span>Date: {scorecard.date}</span>
                <span className="text-emerald-500 font-bold">VERIFIED AUTHENTIC ✓</span>
              </div>
            </div>

            {/* Question-by-Question Review Accordion */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#183630] dark:text-white">
                Detailed Question-by-Question Evaluation ({scorecard.answers.length})
              </h3>

              <div className="space-y-4">
                {scorecard.answers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-4 shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#183630]/10 dark:border-[#E5C690]/20">
                      <span className="text-xs font-mono font-bold text-[#E5C690]">
                        QUESTION #{idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Score: {item.evaluation?.score || 80}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#183630] dark:text-white">{item.question}</h4>

                    {/* Candidate Answer */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#091714] border border-[#183630]/10 dark:border-[#E5C690]/15 space-y-1 text-xs">
                      <span className="font-bold text-[#415c54] dark:text-[#a6b8b0] uppercase text-[10px]">
                        Your Answer:
                      </span>
                      <p className="leading-relaxed text-[#183630] dark:text-[#E3DAC9]">
                        {item.candidateText}
                      </p>
                    </div>

                    {/* Senior Dev Benchmark Model Answer */}
                    {item.modelAnswer && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] block">
                          💡 Senior Developer Model Answer & Key Takeaways:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {item.modelAnswer.summary}
                        </p>
                        {item.modelAnswer.keyPoints?.length > 0 && (
                          <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                            {item.modelAnswer.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#183630]/10 dark:border-[#E5C690]/20">
              <button
                type="button"
                onClick={() => setStage('setup')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-md hover:scale-105 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Mock Interview</span>
              </button>

              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#E3DAC9] text-[#183630] dark:bg-[#112420] dark:text-[#E5C690] border border-[#183630]/15 dark:border-[#E5C690]/30 shadow-md hover:scale-105 transition"
              >
                <Code2 className="w-4 h-4" />
                <span>Go to Code Practice IDE</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
