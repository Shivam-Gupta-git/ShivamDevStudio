import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import {
  Wrench,
  Sparkles,
  Focus,
  RotateCcw,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Code2,
  Info,
} from 'lucide-react'

// Custom Media Player Component exposing limited curated API methods to parent
const MediaPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 2))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Expose curated public imperative handle API
  useImperativeHandle(ref, () => ({
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    restart: () => {
      setProgress(0)
      setIsPlaying(true)
    },
    toggleMute: () => setIsMuted((m) => !m),
    triggerAttentionShake: () => {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 800)
    },
    getStatus: () => ({
      isPlaying,
      progressPercent: `${progress}%`,
      isMuted,
    }),
  }))

  return (
    <div
      className={`p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 text-white space-y-4 shadow-2xl transition-transform ${
        isShaking ? 'animate-bounce' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Encapsulated MediaPlayer Component</span>
        </div>
        <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
          {isPlaying ? 'Playing ▶' : 'Paused ⏸'}
        </span>
      </div>

      {/* Media Screen Visualization */}
      <div className="h-28 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-indigo-500/10 pointer-events-none transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-3xl font-extrabold font-mono text-indigo-400">
            {progress}%
          </span>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
            Audio: {isMuted ? 'Muted' : 'Stereo 100%'}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
})

MediaPlayer.displayName = 'MediaPlayer'

export default function UseImperativeHandleDemo() {
  const playerRef = useRef(null)
  const [telemetry, setTelemetry] = useState(null)

  const handleQueryStatus = () => {
    if (playerRef.current) {
      setTelemetry(playerRef.current.getStatus())
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Wrench className="w-4 h-4 text-indigo-500" />
          <span>useImperativeHandle: Custom Public APIs</span>
        </div>
        <span className="text-[11px] font-mono text-indigo-500 bg-indigo-100 dark:bg-indigo-900/60 px-2.5 py-0.5 rounded-full">
          Custom Ref Interface
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Encapsulated Component View */}
        <div className="lg:col-span-7 space-y-4">
          <MediaPlayer ref={playerRef} />

          {/* Parent Imperative Remote Control */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Parent Imperative Remote Control (Calling Ref Methods)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => playerRef.current?.play()}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Play className="w-3.5 h-3.5" /> .play()
              </button>

              <button
                type="button"
                onClick={() => playerRef.current?.pause()}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Pause className="w-3.5 h-3.5" /> .pause()
              </button>

              <button
                type="button"
                onClick={() => playerRef.current?.restart()}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> .restart()
              </button>

              <button
                type="button"
                onClick={() => playerRef.current?.toggleMute()}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Volume2 className="w-3.5 h-3.5" /> .toggleMute()
              </button>

              <button
                type="button"
                onClick={() => playerRef.current?.triggerAttentionShake()}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> .shake()
              </button>

              <button
                type="button"
                onClick={handleQueryStatus}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> .getStatus()
              </button>
            </div>
          </div>
        </div>

        {/* API Inspector Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" /> Exposed Ref API
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-bold">
                Controlled Surface
              </span>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-indigo-300 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{`useImperativeHandle(ref, () => ({
  play: () => ...,
  pause: () => ...,
  restart: () => ...,
  toggleMute: () => ...,
  getStatus: () => ...
}))`}
            </pre>

            {telemetry && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-800/40 text-emerald-300 space-y-1">
                <span className="text-[10px] text-slate-400 font-sans font-bold">
                  Telemetry from playerRef.current.getStatus():
                </span>
                <pre className="text-[10px]">{JSON.stringify(telemetry, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Why use useImperativeHandle?</strong> Instead of exposing raw underlying DOM nodes (which breaks component encapsulation), <code className="text-indigo-500 dark:text-indigo-400">useImperativeHandle</code> allows children to expose a clean, strictly controlled API to parent components.
        </div>
      </div>
    </div>
  )
}
