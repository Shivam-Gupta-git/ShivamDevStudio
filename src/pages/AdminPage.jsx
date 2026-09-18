import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  UserCheck,
  Code2,
  HelpCircle,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Check,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  Eye,
  EyeOff,
  Sliders,
  Database,
  ArrowLeft,
  Settings,
} from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import {
  getAllCombinedProblems,
  getCustomProblems,
  saveProblem,
  deleteProblem,
  resetProblemsToDefault,
  getCustomQuizzes,
  getCombinedTopicQuizzes,
  saveTopicQuizQuestion,
  deleteTopicQuizQuestion,
  getCustomFlashcards,
  saveTopicFlashcard,
  deleteTopicFlashcard,
  exportAllAdminData,
  importAllAdminData,
} from '../services/adminService'
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  getStoredAdminCredentials,
  updateAdminCredentials,
} from '../services/adminAuthService'
import { topics } from '../data/topics'

const CATEGORIES = [
  'Basics',
  'Strings',
  'Arrays',
  'Math',
  'Dynamic Programming',
  'Trees & Graphs',
  'React & Web',
  'Algorithms',
]

const DEFAULT_STARTER_CODES = {
  javascript: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
// Your code here
console.log(input);`,
  python: `# Read input and print output
s = input().strip()
print(s)`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
        System.out.println("Hello");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello";
    return 0;
}`,
}

export default function AdminPage() {
  const { showToast } = useDashboard()
  const navigate = useNavigate()

  // -------------------------------------------------------------
  // Admin Authentication State
  // -------------------------------------------------------------
  const [adminSession, setAdminSession] = useState(getAdminSession())
  const [authMode, setAuthMode] = useState('credentials') // 'credentials' | 'pin'
  const [loginEmail, setLoginEmail] = useState('admin@shivamdev.studio')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginPin, setLoginPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)

  // Security settings state
  const [securityForm, setSecurityForm] = useState(() => getStoredAdminCredentials())

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('problems') // 'problems' | 'quizzes' | 'flashcards' | 'data' | 'security'

  // Problems state
  const [problemsList, setProblemsList] = useState([])
  const [editingProblemId, setEditingProblemId] = useState(null)
  const [problemSearch, setProblemSearch] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('All')

  // Problem Form state
  const [problemForm, setProblemForm] = useState({
    id: '',
    title: '',
    difficulty: 'Easy',
    category: 'Arrays',
    description: '',
    examples: [{ input: '', output: '' }],
    testCases: [
      { input: '', expectedOutput: '' },
      { input: '', expectedOutput: '' },
    ],
    starterCode: { ...DEFAULT_STARTER_CODES },
  })
  const [activeCodeLang, setActiveCodeLang] = useState('javascript')

  // Quiz state
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 'useState')
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizForm, setQuizForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
  })

  // Flashcards state
  const [flashcardTopicId, setFlashcardTopicId] = useState(topics[0]?.id || 'useState')
  const [flashcardsList, setFlashcardsList] = useState([])
  const [flashcardForm, setFlashcardForm] = useState({
    question: '',
    summary: '',
    points: ['', '', ''],
  })

  // Import/Export state
  const [jsonImportText, setJsonImportText] = useState('')

  // -------------------------------------------------------------
  // Data Refresh Helpers
  // -------------------------------------------------------------
  const refreshProblems = () => {
    setProblemsList(getAllCombinedProblems())
  }

  const refreshQuizzes = (topicId) => {
    setQuizQuestions(getCombinedTopicQuizzes(topicId))
  }

  const refreshFlashcards = (topicId) => {
    const custom = getCustomFlashcards()[topicId] || []
    setFlashcardsList(custom)
  }

  useEffect(() => {
    if (adminSession) {
      refreshProblems()
      refreshQuizzes(selectedTopicId)
      refreshFlashcards(flashcardTopicId)
    }
  }, [adminSession, selectedTopicId, flashcardTopicId])

  // -------------------------------------------------------------
  // Authentication Handlers
  // -------------------------------------------------------------
  const handleLoginSubmit = (e) => {
    e?.preventDefault()
    setLoginError('')
    setIsSubmittingAuth(true)

    setTimeout(() => {
      const credInput = authMode === 'pin' ? loginPin : loginEmail
      const pwdInput = authMode === 'pin' ? loginPin : loginPassword

      const result = loginAdmin({
        emailOrPin: credInput,
        password: pwdInput,
        rememberMe: true,
      })

      if (result.success) {
        setAdminSession(result.session)
        showToast(`Welcome back, ${result.session.user.name}! 🛡️`)
      } else {
        setLoginError(result.error)
      }
      setIsSubmittingAuth(false)
    }, 300)
  }

  const handleDemoLogin = () => {
    const creds = getStoredAdminCredentials()
    setLoginEmail(creds.email)
    setLoginPassword(creds.password)
    const result = loginAdmin({
      emailOrPin: creds.email,
      password: creds.password,
      rememberMe: true,
    })
    if (result.success) {
      setAdminSession(result.session)
      showToast(`Logged in as Demo Super Admin! 🛡️`)
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    setAdminSession(null)
    setLoginPassword('')
    setLoginPin('')
    showToast('Admin session logged out safely.')
  }

  const handleSaveSecuritySettings = (e) => {
    e.preventDefault()
    updateAdminCredentials(securityForm)
    showToast('Admin security credentials updated successfully!')
  }

  // -------------------------------------------------------------
  // Problem Form Actions
  // -------------------------------------------------------------
  const handleResetProblemForm = () => {
    setEditingProblemId(null)
    setProblemForm({
      id: '',
      title: '',
      difficulty: 'Easy',
      category: 'Arrays',
      description: '',
      examples: [{ input: '', output: '' }],
      testCases: [
        { input: '', expectedOutput: '' },
        { input: '', expectedOutput: '' },
      ],
      starterCode: { ...DEFAULT_STARTER_CODES },
    })
  }

  const handleEditProblem = (prob) => {
    setEditingProblemId(prob.id)
    setProblemForm({
      id: prob.id,
      title: prob.title || '',
      difficulty: prob.difficulty || 'Easy',
      category: prob.category || 'Basics',
      description: prob.description || '',
      examples: prob.examples?.length ? prob.examples : [{ input: '', output: '' }],
      testCases: prob.testCases?.length ? prob.testCases : [{ input: '', expectedOutput: '' }],
      starterCode: {
        javascript: prob.starterCode?.javascript || DEFAULT_STARTER_CODES.javascript,
        python: prob.starterCode?.python || DEFAULT_STARTER_CODES.python,
        java: prob.starterCode?.java || DEFAULT_STARTER_CODES.java,
        cpp: prob.starterCode?.cpp || DEFAULT_STARTER_CODES.cpp,
      },
    })
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleSaveProblem = (e) => {
    e.preventDefault()
    if (!problemForm.title.trim()) {
      showToast('Please enter a problem title', 'error')
      return
    }

    const slug =
      problemForm.id.trim() ||
      problemForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const payload = {
      ...problemForm,
      id: slug,
      testCases: problemForm.testCases.filter((tc) => tc.input || tc.expectedOutput),
      examples: problemForm.examples.filter((ex) => ex.input || ex.output),
    }

    saveProblem(payload)
    refreshProblems()
    showToast(`Question "${payload.title}" saved successfully! 🎉`)
    handleResetProblemForm()
  }

  const handleDeleteProblem = (probId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProblem(probId)
      refreshProblems()
      showToast(`Deleted "${title}"`)
    }
  }

  const handleApplyProblemTemplate = (templateType) => {
    if (templateType === 'two-sum') {
      setProblemForm((prev) => ({
        ...prev,
        title: 'Two Sum Problem',
        difficulty: 'Easy',
        category: 'Arrays',
        description:
          'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. Input: Line 1 has array numbers, Line 2 has target.',
        examples: [{ input: '2 7 11 15\n9', output: '0 1' }],
        testCases: [
          { input: '2 7 11 15\n9', expectedOutput: '0 1' },
          { input: '3 2 4\n6', expectedOutput: '1 2' },
          { input: '3 3\n6', expectedOutput: '0 1' },
        ],
        starterCode: {
          javascript: `const fs = require('fs');
const lines = fs.readFileSync(0, 'utf8').trim().split('\\n');
const nums = lines[0].split(/\\s+/).map(Number);
const target = Number(lines[1]);

const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) {
    console.log(map.get(complement) + " " + i);
    break;
  }
  map.set(nums[i], i);
}`,
          python: `nums = list(map(int, input().split()))
target = int(input())
m = {}
for i, n in enumerate(nums):
    diff = target - n
    if diff in m:
        print(f"{m[diff]} {i}")
        break
    m[n] = i`,
          java: DEFAULT_STARTER_CODES.java,
          cpp: DEFAULT_STARTER_CODES.cpp,
        },
      }))
      showToast('Loaded "Two Sum" template!')
    } else if (templateType === 'palindrome') {
      setProblemForm((prev) => ({
        ...prev,
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        category: 'Strings',
        description:
          'Read a string from input and print "true" if it is a palindrome, otherwise "false". Ignore case and spaces.',
        examples: [
          { input: 'racecar', output: 'true' },
          { input: 'hello', output: 'false' },
        ],
        testCases: [
          { input: 'racecar', expectedOutput: 'true' },
          { input: 'hello', expectedOutput: 'false' },
          { input: 'madam', expectedOutput: 'true' },
          { input: 'a', expectedOutput: 'true' },
        ],
        starterCode: {
          javascript: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf8').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const isPal = s === s.split('').reverse().join('');
console.log(isPal ? 'true' : 'false');`,
          python: `s = ''.join(c.lower() for c in input() if c.isalnum())
print('true' if s == s[::-1] else 'false')`,
          java: DEFAULT_STARTER_CODES.java,
          cpp: DEFAULT_STARTER_CODES.cpp,
        },
      }))
      showToast('Loaded "Valid Palindrome" template!')
    }
  }

  // -------------------------------------------------------------
  // Quiz Form Actions
  // -------------------------------------------------------------
  const handleSaveQuizQuestion = (e) => {
    e.preventDefault()
    if (!quizForm.question.trim()) {
      showToast('Please enter a question statement', 'error')
      return
    }
    if (quizForm.options.some((opt) => !opt.trim())) {
      showToast('Please fill all 4 options', 'error')
      return
    }

    saveTopicQuizQuestion(selectedTopicId, quizForm)
    refreshQuizzes(selectedTopicId)
    showToast('Topic quiz question added successfully!')
    setQuizForm({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
    })
  }

  const handleDeleteQuiz = (qId) => {
    deleteTopicQuizQuestion(selectedTopicId, qId)
    refreshQuizzes(selectedTopicId)
    showToast('Quiz question removed')
  }

  // -------------------------------------------------------------
  // Flashcard Form Actions
  // -------------------------------------------------------------
  const handleSaveFlashcard = (e) => {
    e.preventDefault()
    if (!flashcardForm.question.trim() || !flashcardForm.summary.trim()) {
      showToast('Please enter question and summary', 'error')
      return
    }

    saveTopicFlashcard(flashcardTopicId, {
      question: flashcardForm.question,
      summary: flashcardForm.summary,
      points: flashcardForm.points.filter((p) => p.trim()),
    })
    refreshFlashcards(flashcardTopicId)
    showToast('Flashcard created!')
    setFlashcardForm({
      question: '',
      summary: '',
      points: ['', '', ''],
    })
  }

  const handleDeleteFlashcard = (cardId) => {
    deleteTopicFlashcard(flashcardTopicId, cardId)
    refreshFlashcards(flashcardTopicId)
    showToast('Flashcard removed')
  }

  // -------------------------------------------------------------
  // Export / Import Actions
  // -------------------------------------------------------------
  const handleExportData = () => {
    const data = exportAllAdminData()
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shivamdev-studio-content-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Exported all custom content!')
  }

  const handleImportData = () => {
    try {
      const parsed = JSON.parse(jsonImportText)
      importAllAdminData(parsed)
      refreshProblems()
      refreshQuizzes(selectedTopicId)
      refreshFlashcards(flashcardTopicId)
      showToast('Content imported successfully! 🎉')
      setJsonImportText('')
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'error')
    }
  }

  const handleResetDefaults = () => {
    if (
      window.confirm('Reset all coding problems to defaults? This will restore original questions.')
    ) {
      resetProblemsToDefault()
      refreshProblems()
      showToast('Reset problems to default')
    }
  }

  // Filtered problems list
  const filteredProblems = problemsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(problemSearch.toLowerCase())
    const matchesDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty
    return matchesSearch && matchesDiff
  })

  // =============================================================
  // SCREEN 1: UNAUTHENTICATED ADMIN LOGIN GATE
  // =============================================================
  if (!adminSession) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#071310] text-[#183630] dark:text-[#E3DAC9] font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#183630]/20 dark:bg-[#183630]/40 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#E5C690]/20 dark:bg-[#E5C690]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Return to Dashboard Link */}
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#112420] text-[#183630] dark:text-[#E3DAC9] hover:border-[#E5C690]/50 border border-[#183630]/15 dark:border-[#E5C690]/20 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio</span>
          </Link>
        </div>

        {/* Login Container Box */}
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#112420]/90 border border-[#183630]/20 dark:border-[#E5C690]/30 backdrop-blur-2xl shadow-2xl space-y-6 relative z-10 animate-fade-in">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#183630] to-[#244f46] text-[#E5C690] border border-[#E5C690]/40 flex items-center justify-center shadow-lg shadow-[#183630]/30">
              <Shield className="w-7 h-7 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#183630] dark:text-white tracking-tight">
              Admin Studio Portal
            </h1>
            <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
              Authenticate with your Admin Credentials or Passcode to author questions and manage
              system content.
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex rounded-xl bg-[#FAF7F2] dark:bg-[#091714] p-1 border border-[#183630]/15 dark:border-[#E5C690]/20">
            <button
              type="button"
              onClick={() => {
                setAuthMode('credentials')
                setLoginError('')
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'credentials'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow'
                  : 'text-[#415c54] dark:text-[#a6b8b0]'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('pin')
                setLoginError('')
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === 'pin'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow'
                  : 'text-[#415c54] dark:text-[#a6b8b0]'
              }`}
            >
              Quick Passcode (PIN)
            </button>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {authMode === 'credentials' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Admin Email / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@shivamdev.studio"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#415c54] dark:text-[#a6b8b0] hover:text-[#183630] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                  4-Digit Admin Passcode (PIN)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#415c54] dark:text-[#a6b8b0]" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="Enter PIN (Default: 8899)"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm tracking-widest font-mono rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 rounded-2xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-xl shadow-[#183630]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmittingAuth ? 'Verifying...' : 'Unlock Admin Studio'}</span>
            </button>
          </form>

          {/* Demo 1-Click Access Box */}
          <div className="pt-2 border-t border-[#183630]/10 dark:border-[#E5C690]/20 text-center space-y-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#E5C690]/20 hover:bg-[#E5C690]/30 text-[#183630] dark:text-[#E5C690] border border-[#E5C690]/40 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E5C690]" />
              <span>1-Click Demo Admin Sign In</span>
            </button>
            <p className="text-[11px] text-[#415c54] dark:text-[#a6b8b0] font-mono">
              Default credentials: <span className="font-bold">admin@shivamdev.studio</span> /{' '}
              <span className="font-bold">admin</span> (PIN: <span className="font-bold">8899</span>)
            </p>
          </div>
        </div>
      </div>
    )
  }

  // =============================================================
  // SCREEN 2: AUTHENTICATED ADMIN STUDIO
  // =============================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#071310] text-[#183630] dark:text-[#E3DAC9] font-sans antialiased pb-20">
      {/* Top Admin Header */}
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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#183630] dark:text-white leading-none">
                    ShivamDev Studio
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    AUTHENTICATED ✓
                  </span>
                </div>
                <p className="text-[11px] text-[#415c54] dark:text-[#a6b8b0]">
                  Logged in as{' '}
                  <span className="font-bold text-[#183630] dark:text-[#E5C690]">
                    {adminSession.user.name} ({adminSession.user.role})
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 hover:scale-105 active:scale-95 transition"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Practice IDE</span>
            </Link>

            <button
              type="button"
              onClick={handleExportData}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] dark:hover:bg-[#183630] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/30 transition"
              title="Download backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition"
              title="Sign Out Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white/70 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 shadow-md">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('problems')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'problems'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow-md'
                  : 'text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Coding & DSA Questions</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#E5C690]/20">
                {problemsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quizzes')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quizzes'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow-md'
                  : 'text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Topic Quizzes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow-md'
                  : 'text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards & Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'data'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow-md'
                  : 'text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Import</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630] shadow-md'
                  : 'text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40 dark:hover:bg-[#183630]/40'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Security & Passcode</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#415c54] dark:text-[#a6b8b0] px-3">
            <span>🛡️ Super Admin Session Active</span>
          </div>
        </div>

        {/* ============================================================= */}
        {/* TAB 1: CODING & DSA PROBLEMS                                  */}
        {/* ============================================================= */}
        {activeTab === 'problems' && (
          <div className="space-y-6 animate-fade-in">
            {/* Authoring & Editor Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#183630]/10 dark:border-[#E5C690]/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 shadow-md">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#183630] dark:text-white">
                      {editingProblemId
                        ? `Edit Question: ${problemForm.title}`
                        : 'Author New Coding Problem'}
                    </h2>
                    <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                      Add custom algorithmic challenges, starter codes, and test cases that run in
                      the Practice IDE.
                    </p>
                  </div>
                </div>

                {/* Template Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-[#415c54] dark:text-[#a6b8b0]">
                    Autofill Preset:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyProblemTemplate('two-sum')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/20"
                  >
                    Two Sum
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyProblemTemplate('palindrome')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#183630]/60 hover:bg-[#E3DAC9] text-[#183630] dark:text-[#E3DAC9] border border-[#183630]/15 dark:border-[#E5C690]/20"
                  >
                    Palindrome
                  </button>
                  {editingProblemId && (
                    <button
                      type="button"
                      onClick={handleResetProblemForm}
                      className="px-3 py-1 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProblem} className="space-y-6">
                {/* Basic Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Two Sum, Binary Search, Flatten Array"
                      value={problemForm.title}
                      onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white placeholder:text-[#415c54]/60 focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                    />
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Difficulty
                    </label>
                    <select
                      value={problemForm.difficulty}
                      onChange={(e) =>
                        setProblemForm({ ...problemForm, difficulty: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Category / Topic
                    </label>
                    <select
                      value={problemForm.category}
                      onChange={(e) => setProblemForm({ ...problemForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Problem Statement & Constraints (Markdown Supported)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the problem, input format, output constraints, and edge cases..."
                    value={problemForm.description}
                    onChange={(e) =>
                      setProblemForm({ ...problemForm, description: e.target.value })
                    }
                    className="w-full p-3.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white placeholder:text-[#415c54]/60 focus:outline-none focus:ring-2 focus:ring-[#E5C690] font-sans"
                  />
                </div>

                {/* Test Cases Authoring Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Automated Test Cases (Input & Expected Output)
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProblemForm({
                          ...problemForm,
                          testCases: [...problemForm.testCases, { input: '', expectedOutput: '' }],
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#183630] dark:text-[#E5C690] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Another Test Case
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {problemForm.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-[#E3DAC9]/20 dark:bg-[#091714]/60 border border-[#183630]/15 dark:border-[#E5C690]/20 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#415c54] dark:text-[#a6b8b0]">
                          <span>Test Case #{idx + 1}</span>
                          {problemForm.testCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = problemForm.testCases.filter((_, i) => i !== idx)
                                setProblemForm({ ...problemForm, testCases: next })
                              }}
                              className="text-rose-400 hover:text-rose-500"
                              title="Delete test case"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-[#415c54] dark:text-[#a6b8b0] font-semibold">
                              Stdin Input:
                            </span>
                            <input
                              type="text"
                              placeholder="e.g. 5 3"
                              value={tc.input}
                              onChange={(e) => {
                                const next = [...problemForm.testCases]
                                next[idx].input = e.target.value
                                setProblemForm({ ...problemForm, testCases: next })
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[#FAF7F2] dark:bg-[#112420] border border-[#183630]/20 dark:border-[#E5C690]/25 text-[#183630] dark:text-white"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-[#415c54] dark:text-[#a6b8b0] font-semibold">
                              Expected Stdout:
                            </span>
                            <input
                              type="text"
                              placeholder="e.g. 8"
                              value={tc.expectedOutput}
                              onChange={(e) => {
                                const next = [...problemForm.testCases]
                                next[idx].expectedOutput = e.target.value
                                setProblemForm({ ...problemForm, testCases: next })
                              }}
                              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-[#FAF7F2] dark:bg-[#112420] border border-[#183630]/20 dark:border-[#E5C690]/25 text-[#183630] dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Starter Code Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Language Starter Code Boilerplate
                    </label>

                    <div className="flex items-center gap-1 bg-[#E3DAC9]/40 dark:bg-[#091714] p-0.5 rounded-xl border border-[#183630]/15 dark:border-[#E5C690]/20">
                      {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setActiveCodeLang(lang)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                            activeCodeLang === lang
                              ? 'bg-[#183630] text-[#E5C690] dark:bg-[#E5C690] dark:text-[#183630]'
                              : 'text-[#415c54] dark:text-[#a6b8b0]'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={problemForm.starterCode[activeCodeLang] || ''}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        starterCode: {
                          ...problemForm.starterCode,
                          [activeCodeLang]: e.target.value,
                        },
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-[#091714] text-[#E5C690] font-mono text-xs border border-[#183630]/30 dark:border-[#E5C690]/30 focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                  />
                </div>

                {/* Submit / Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#183630]/10 dark:border-[#E5C690]/20">
                  <button
                    type="button"
                    onClick={handleResetProblemForm}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#415c54] dark:text-[#a6b8b0] hover:bg-[#E3DAC9]/40"
                  >
                    Reset Fields
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-lg shadow-[#183630]/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProblemId ? 'Update Problem' : 'Publish Question to Studio'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Existing Problems */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#183630] dark:text-white">
                    Active Practice Questions ({filteredProblems.length})
                  </h3>
                  <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                    All questions live in the Practice IDE dropdown selector.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#415c54] dark:text-[#a6b8b0]" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={problemSearch}
                      onChange={(e) => setProblemSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/20 text-[#183630] dark:text-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/20 text-[#183630] dark:text-white focus:outline-none"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="p-2 rounded-xl text-xs text-[#415c54] dark:text-[#a6b8b0] hover:text-rose-500 border border-[#183630]/10 dark:border-[#E5C690]/20"
                    title="Restore Built-in Problems"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table / Grid */}
              <div className="space-y-2.5">
                {filteredProblems.map((prob) => {
                  const isCustom = prob.isCustom
                  return (
                    <div
                      key={prob.id}
                      className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#091714]/80 border border-[#183630]/10 dark:border-[#E5C690]/20 flex flex-wrap items-center justify-between gap-4 hover:border-[#E5C690]/50 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#183630] dark:text-white">
                            {prob.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#E3DAC9]/60 dark:bg-[#183630] font-mono text-[#415c54] dark:text-[#E3DAC9]">
                            {prob.category || 'General'}
                          </span>
                          {isCustom && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#E5C690]/20 text-[#183630] dark:text-[#E5C690] font-bold border border-[#E5C690]/30">
                              Custom Author
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#415c54] dark:text-[#a6b8b0] line-clamp-1 max-w-2xl">
                          {prob.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to="/practice"
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E5C690]/15 hover:bg-[#E5C690]/30 text-[#183630] dark:text-[#E5C690] border border-[#E5C690]/30 transition inline-flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Test
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEditProblem(prob)}
                          className="p-2 rounded-xl text-xs font-semibold bg-[#E3DAC9]/60 dark:bg-[#183630] text-[#183630] dark:text-[#E3DAC9] hover:text-[#E5C690] border border-[#183630]/15 dark:border-[#E5C690]/20 transition"
                          title="Edit Problem"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteProblem(prob.id, prob.title)}
                            className="p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: TOPIC INTERVIEW QUIZZES                                */}
        {/* ============================================================= */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6 animate-fade-in">
            {/* Topic Selector Bar */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#183630] dark:text-white">
                  Select Topic Module:
                </span>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E5C690] focus:outline-none"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs font-mono text-[#415c54] dark:text-[#a6b8b0]">
                {quizQuestions.length} Questions for this Topic
              </span>
            </div>

            {/* Authoring Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 backdrop-blur-xl shadow-xl space-y-5">
              <h3 className="text-base sm:text-lg font-bold text-[#183630] dark:text-white">
                Add Quiz Question for "
                {topics.find((t) => t.id === selectedTopicId)?.title || selectedTopicId}"
              </h3>

              <form onSubmit={handleSaveQuizQuestion} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Question Statement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What is the execution sequence when useEffect dependencies change?"
                    value={quizForm.question}
                    onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white placeholder:text-[#415c54]/60 focus:outline-none focus:ring-2 focus:ring-[#E5C690]"
                  />
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizForm.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-2xl border transition-all ${
                        quizForm.correct === oIdx
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                          : 'bg-[#FAF7F2] dark:bg-[#091714]/60 border-[#183630]/15 dark:border-[#E5C690]/20 text-[#183630] dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold">
                          Option {String.fromCharCode(65 + oIdx)}
                        </span>
                        <label className="flex items-center gap-1 text-[11px] font-bold cursor-pointer">
                          <input
                            type="radio"
                            name="correctOption"
                            checked={quizForm.correct === oIdx}
                            onChange={() => setQuizForm({ ...quizForm, correct: oIdx })}
                            className="accent-emerald-500"
                          />
                          <span>Correct Answer</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + oIdx)} text...`}
                        value={opt}
                        onChange={(e) => {
                          const next = [...quizForm.options]
                          next[oIdx] = e.target.value
                          setQuizForm({ ...quizForm, options: next })
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#112420] border border-[#183630]/20 dark:border-[#E5C690]/20 text-[#183630] dark:text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Senior Dev Explanation */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Senior Developer Explanation & Why It's Correct
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide in-depth architectural reasoning for interviewers..."
                    value={quizForm.explanation}
                    onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white placeholder:text-[#415c54]/60 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-md hover:scale-105 active:scale-95 transition"
                >
                  Save Quiz Question
                </button>
              </form>
            </div>

            {/* List of Questions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#183630] dark:text-white">
                Questions for Current Topic ({quizQuestions.length})
              </h4>
              {quizQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-[#112420]/70 border border-[#183630]/10 dark:border-[#E5C690]/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E5C690]">
                      #{idx + 1} {q.isCustom && '(Custom Author)'}
                    </span>
                    {q.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuiz(q.id)}
                        className="text-rose-400 hover:text-rose-500 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#183630] dark:text-white">{q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl text-xs ${
                          q.correct === oIdx
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                            : 'bg-[#FAF7F2] dark:bg-[#091714] text-[#415c54] dark:text-[#a6b8b0]'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-xs text-[#415c54] dark:text-[#a6b8b0] bg-[#E3DAC9]/30 dark:bg-[#091714] p-2 rounded-xl">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: TOPIC FLASHCARDS & CHEAT SHEETS                        */}
        {/* ============================================================= */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6 animate-fade-in">
            {/* Topic Selector Bar */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#183630] dark:text-white">
                  Select Topic Module:
                </span>
                <select
                  value={flashcardTopicId}
                  onChange={(e) => setFlashcardTopicId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-[#E5C690] focus:outline-none"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs font-mono text-[#415c54] dark:text-[#a6b8b0]">
                {flashcardsList.length} Custom Flashcards Added
              </span>
            </div>

            {/* Authoring Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#183630] dark:text-white">
                Create 3D Study Flashcard
              </h3>

              <form onSubmit={handleSaveFlashcard} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Front: Interview Question / Concept Prompt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How does Virtual DOM diffing algorithm optimize performance?"
                    value={flashcardForm.question}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, question: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Back: Senior Developer Model Answer Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Concise, senior-level answer definition..."
                    value={flashcardForm.summary}
                    onChange={(e) =>
                      setFlashcardForm({ ...flashcardForm, summary: e.target.value })
                    }
                    className="w-full p-3 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Key Takeaway Bullet Checklist
                  </label>
                  {flashcardForm.points.map((pt, pIdx) => (
                    <input
                      key={pIdx}
                      type="text"
                      placeholder={`Key takeaway point #${pIdx + 1}...`}
                      value={pt}
                      onChange={(e) => {
                        const next = [...flashcardForm.points]
                        next[pIdx] = e.target.value
                        setFlashcardForm({ ...flashcardForm, points: next })
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#E3DAC9]/20 dark:bg-[#091714] border border-[#183630]/15 dark:border-[#E5C690]/20 text-[#183630] dark:text-white focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-md hover:scale-105 active:scale-95 transition"
                >
                  Save Flashcard
                </button>
              </form>
            </div>

            {/* List of Custom Flashcards */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#183630] dark:text-white">
                Custom Flashcards for Current Topic ({flashcardsList.length})
              </h4>
              {flashcardsList.map((card) => (
                <div
                  key={card.id}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-[#112420]/70 border border-[#183630]/10 dark:border-[#E5C690]/20 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#E5C690] uppercase">
                      Interview Flashcard
                    </span>
                    <h5 className="text-sm font-bold text-[#183630] dark:text-white">
                      {card.question}
                    </h5>
                    <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">{card.summary}</p>
                    {card.points?.length > 0 && (
                      <ul className="text-xs text-[#415c54] dark:text-[#a6b8b0] list-disc list-inside pt-1">
                        {card.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteFlashcard(card.id)}
                    className="text-rose-400 hover:text-rose-500 text-xs shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: DATA MANAGER & BACKUP                                  */}
        {/* ============================================================= */}
        {activeTab === 'data' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 shadow-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#183630] dark:text-white">
                      Export Content Backup
                    </h3>
                    <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                      Save all custom questions, starter codes, and flashcards to a JSON backup
                      file.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full py-3 rounded-2xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-lg shadow-[#183630]/30 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  Download JSON Backup
                </button>
              </div>

              {/* Import Box */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#183630] dark:text-white">
                      Import Question Pack
                    </h3>
                    <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                      Paste JSON data to load new questions or restore a backup.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Paste backup JSON payload here..."
                  value={jsonImportText}
                  onChange={(e) => setJsonImportText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white font-mono"
                />

                <button
                  type="button"
                  onClick={handleImportData}
                  disabled={!jsonImportText.trim()}
                  className="w-full py-3 rounded-2xl text-xs font-bold bg-[#183630] text-[#E5C690] disabled:opacity-40 border border-[#E5C690]/40 shadow-lg transition"
                >
                  Import & Apply Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 5: SECURITY & PASSCODE SETTINGS                           */}
        {/* ============================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#112420]/80 border border-[#183630]/15 dark:border-[#E5C690]/25 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#183630]/10 dark:border-[#E5C690]/20">
                <div className="p-2.5 rounded-2xl bg-[#183630] text-[#E5C690] border border-[#E5C690]/30 shadow-md">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#183630] dark:text-white">
                    Admin Security & Passcode Configuration
                  </h3>
                  <p className="text-xs text-[#415c54] dark:text-[#a6b8b0]">
                    Update your Super Admin email, login password, and 4-digit quick passcode.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Admin Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={securityForm.name}
                    onChange={(e) => setSecurityForm({ ...securityForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={securityForm.email}
                    onChange={(e) => setSecurityForm({ ...securityForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      Login Password
                    </label>
                    <input
                      type="text"
                      required
                      value={securityForm.password}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, password: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#183630] dark:text-[#E3DAC9]">
                      4-Digit Quick Passcode (PIN)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={securityForm.pin}
                      onChange={(e) => setSecurityForm({ ...securityForm, pin: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#E3DAC9]/30 dark:bg-[#091714] border border-[#183630]/20 dark:border-[#E5C690]/30 text-[#183630] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl text-xs font-bold bg-[#183630] text-[#E5C690] border border-[#E5C690]/40 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition"
                  >
                    Save Security Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
