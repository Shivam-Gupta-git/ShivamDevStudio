import React, { useState, useTransition } from 'react'
import {
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sliders,
  ShieldCheck,
  Flame,
} from 'lucide-react'

// Simulated Server API
const mockApiPostComment = (comment, shouldFail = false, delayMs = 1500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('500 Internal Server Error: Database transaction rejected.'))
      } else {
        resolve({
          id: Date.now(),
          text: comment.text,
          likes: comment.likes || 0,
          author: 'ShivamDev User',
          createdAt: 'Just now',
          status: 'confirmed',
        })
      }
    }, delayMs)
  })
}

export default function OptimisticDemo() {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: 'React 19 Server Actions and Optimistic UI provide instant 60 FPS user feedback!',
      likes: 42,
      author: 'Sarah Chen (Staff Engineer)',
      createdAt: '2 mins ago',
      status: 'confirmed',
    },
    {
      id: 2,
      text: 'Optimistic updates render immediately while network synchronization happens asynchronously.',
      likes: 18,
      author: 'Alex Rivera (Frontend Lead)',
      createdAt: '5 mins ago',
      status: 'confirmed',
    },
  ])

  const [inputText, setInputText] = useState('')
  const [shouldSimulateError, setShouldSimulateError] = useState(false)
  const [latencyMs, setLatencyMs] = useState(1500)
  const [isPending, startTransition] = useTransition()
  const [log, setLog] = useState(['Optimistic UI engine ready.'])

  const addLog = (msg) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)])
  }

  // Handle instant optimistic like
  const handleLike = async (commentId) => {
    // 1. Snapshot previous state for rollback
    const previousComments = [...comments]

    // 2. Apply optimistic update immediately
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes: c.likes + 1, status: 'syncing' }
          : c,
      ),
    )
    addLog(`✨ Optimistically incremented like on comment #${commentId}`)

    // 3. Sync with backend
    try {
      await mockApiPostComment({}, shouldSimulateError, latencyMs)
      // Confirmed by server
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, status: 'confirmed' } : c)),
      )
      addLog(`✓ Server confirmed like for comment #${commentId}`)
    } catch (err) {
      // 4. Automatic Rollback on failure
      setComments(previousComments)
      addLog(`⚠️ Server Error! Rolled back like on comment #${commentId}`)
    }
  }

  // Handle instant optimistic comment submission
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newText = inputText
    setInputText('')

    // Generate temporary optimistic ID
    const tempId = Date.now()
    const optimisticComment = {
      id: tempId,
      text: newText,
      likes: 0,
      author: 'You (Optimistic)',
      createdAt: 'Syncing...',
      status: 'optimistic',
    }

    // 1. Snapshot previous state
    const previousComments = [...comments]

    // 2. Render immediately in UI (0ms latency!)
    setComments((prev) => [optimisticComment, ...prev])
    addLog(`🚀 Rendered comment immediately in UI before server responded`)

    // 3. Sync with backend asynchronously
    try {
      const serverResponse = await mockApiPostComment({ text: newText }, shouldSimulateError, latencyMs)
      // Replace optimistic placeholder with real confirmed record
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? serverResponse : c)),
      )
      addLog(`✓ Server assigned permanent ID #${serverResponse.id}`)
    } catch (err) {
      // 4. Rollback
      setComments(previousComments)
      addLog(`❌ Server Error! Optimistic comment rolled back and removed`)
    }
  }

  const handleReset = () => {
    setComments([
      {
        id: 1,
        text: 'React 19 Server Actions and Optimistic UI provide instant 60 FPS user feedback!',
        likes: 42,
        author: 'Sarah Chen (Staff Engineer)',
        createdAt: '2 mins ago',
        status: 'confirmed',
      },
      {
        id: 2,
        text: 'Optimistic updates render immediately while network synchronization happens asynchronously.',
        likes: 18,
        author: 'Alex Rivera (Frontend Lead)',
        createdAt: '5 mins ago',
        status: 'confirmed',
      },
    ])
    setLog(['Reset state to default.'])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Live Optimistic Social Feed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click like or post comments to experience 0ms UI updates with automatic rollbacks.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a comment (renders instantly)..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-2xl border transition-all ${
                  comment.status === 'optimistic' || comment.status === 'syncing'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-500/40 ring-1 ring-indigo-500/30 animate-pulse'
                    : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                  <div className="flex items-center gap-2">
                    {comment.status === 'optimistic' && (
                      <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 animate-spin" /> Optimistic
                      </span>
                    )}
                    {comment.status === 'confirmed' && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Confirmed ✓
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">{comment.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {comment.text}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleLike(comment.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration & Telemetry Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Network Latency Slider */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" /> Simulated Latency
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">{latencyMs} ms</span>
            </div>

            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={latencyMs}
              onChange={(e) => setLatencyMs(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>300ms (Fast 4G)</span>
              <span>1500ms (Slow 3G)</span>
              <span>3000ms (Lag)</span>
            </div>

            {/* Error Simulator Toggle */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setShouldSimulateError((v) => !v)}
                className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border transition ${
                  shouldSimulateError
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Simulate Server Rejection (500)</span>
                </div>
                <span className="text-[10px] font-mono uppercase font-bold">
                  {shouldSimulateError ? 'FORCED FAIL' : 'HEALTHY'}
                </span>
              </button>
            </div>
          </div>

          {/* Real-time State Lifecycle Logs */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Optimistic Mutation Log
              </span>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                0ms Feedback
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {log.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2"
                >
                  <span className="text-indigo-400 font-bold">›</span>
                  <span>{entry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
