import React, { useState } from 'react'
import {
  User,
  GraduationCap,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Shuffle,
  RotateCcw,
  Code2,
  Info,
} from 'lucide-react'

const PRESETS = [
  {
    name: 'Aarav Patel',
    age: 24,
    course: 'Full Stack React & Node',
    contact: '+91 98765 12340',
    role: 'Frontend Architect',
    theme: 'indigo',
  },
  {
    name: 'Priya Sharma',
    age: 26,
    course: 'Distributed Systems & Cloud',
    contact: '+91 91234 56789',
    role: 'AI / ML Engineer',
    theme: 'emerald',
  },
  {
    name: 'Rohan Gupta',
    age: 22,
    course: 'UI/UX & Design Engineering',
    contact: '+91 98989 45454',
    role: 'Design System Lead',
    theme: 'purple',
  },
]

const THEMES = {
  indigo: {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    avatar: 'from-indigo-500 to-violet-600',
    border: 'border-indigo-500/30',
    card: 'from-indigo-950/60 via-slate-900 to-violet-950/60',
    accent: 'text-indigo-400',
  },
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    avatar: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/30',
    card: 'from-emerald-950/60 via-slate-900 to-teal-950/60',
    accent: 'text-emerald-400',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    avatar: 'from-purple-500 to-pink-600',
    border: 'border-purple-500/30',
    card: 'from-purple-950/60 via-slate-900 to-pink-950/60',
    accent: 'text-purple-400',
  },
  rose: {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    avatar: 'from-rose-500 to-amber-600',
    border: 'border-rose-500/30',
    card: 'from-rose-950/60 via-slate-900 to-amber-950/60',
    accent: 'text-rose-400',
  },
}

export default function PropsDemo() {
  const [studentData, setStudentData] = useState(PRESETS[0])
  const [updateTicker, setUpdateTicker] = useState(0)

  const handleApplyPreset = (preset) => {
    setStudentData(preset)
    setUpdateTicker((t) => t + 1)
  }

  const handleRandomize = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)]
    const randomAge = Math.floor(Math.random() * 10) + 20
    setStudentData({
      ...randomPreset,
      age: randomAge,
    })
    setUpdateTicker((t) => t + 1)
  }

  const handleFieldChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
    setUpdateTicker((t) => t + 1)
  }

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-emerald-50/80 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-emerald-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold shadow-xs">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span>Parent (State Owner)</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-700/70 text-[11px] font-mono text-slate-600 dark:text-slate-300 shadow-xs">
          <span>Props Transfer</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Read-Only Object</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span>Child (UI Consumer)</span>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Palette className="w-4 h-4 text-indigo-500" />
          <span>Quick Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.role}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                studentData.role === p.role
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {p.role}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRandomize}
            className="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parent Controls */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
              Parent State Controller
            </h3>
            <span className="text-[11px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50">
              Mutations: {updateTicker}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Student Name (<code className="text-indigo-400">props.name</code>)
              </label>
              <input
                type="text"
                value={studentData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Age (<code className="text-indigo-400">props.age</code>)
                </label>
                <input
                  type="number"
                  value={studentData.age}
                  onChange={(e) => handleFieldChange('age', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Role Title (<code className="text-indigo-400">props.role</code>)
                </label>
                <input
                  type="text"
                  value={studentData.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Course Enrolled (<code className="text-indigo-400">props.course</code>)
              </label>
              <input
                type="text"
                value={studentData.course}
                onChange={(e) => handleFieldChange('course', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1.5">
                Card Theme Prop (<code className="text-indigo-400">props.theme</code>)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(THEMES).map((themeKey) => (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => handleFieldChange('theme', themeKey)}
                    className={`py-1.5 px-2 rounded-xl capitalize font-semibold transition flex items-center justify-center gap-1.5 border ${
                      studentData.theme === themeKey
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-indigo-500 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        themeKey === 'indigo'
                          ? 'bg-indigo-500'
                          : themeKey === 'emerald'
                          ? 'bg-emerald-500'
                          : themeKey === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{themeKey}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Child Profile Card & Live Prop Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <StudentProfileCard data={studentData} />

          {/* Dynamic Prop Inspector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Code2 className="w-3.5 h-3.5" />
                Live JSX Prop Binding
              </span>
              <span className="text-emerald-400">Immutable Flow ✓</span>
            </div>
            <pre className="text-[11px] leading-relaxed text-indigo-300 overflow-x-auto p-2 bg-slate-900/60 rounded-xl">
              {`<StudentProfileCard
  name="${studentData.name}"
  age={${studentData.age}}
  role="${studentData.role}"
  course="${studentData.course}"
  theme="${studentData.theme || 'indigo'}"
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Behind the scenes callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">How Props Work Behind the Scenes:</strong> When you modify the Parent state controls above, React executes the parent function, creates a new props object reference, and passes it into <code className="text-indigo-500 dark:text-indigo-400">StudentProfileCard(props)</code>. The child receives this read-only data without ever mutating the original state.
        </div>
      </div>
    </div>
  )
}

function StudentProfileCard({ data }) {
  const currentTheme = THEMES[data.theme] || THEMES.indigo

  return (
    <div
      className={`p-6 rounded-3xl bg-gradient-to-br ${currentTheme.card} border ${currentTheme.border} text-white shadow-2xl space-y-5 relative overflow-hidden transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentTheme.avatar} text-white flex items-center justify-center font-extrabold text-xl shadow-lg ring-2 ring-white/20 shrink-0`}
          >
            {data.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h4 className="text-lg font-bold leading-tight tracking-tight">
              {data.name || 'Anonymous Student'}
            </h4>
            <span
              className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-[11px] font-semibold border ${currentTheme.badge}`}
            >
              {data.role}
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm">
          Child Component
        </span>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs font-mono">
        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/60 border border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5 font-sans">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Student Age
          </span>
          <span className="font-bold text-white">{data.age} years old</span>
        </div>

        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/60 border border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5 font-sans">
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Current Track
          </span>
          <span className="font-bold text-purple-300">{data.course}</span>
        </div>

        <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950/60 border border-white/10">
          <span className="text-slate-400 flex items-center gap-1.5 font-sans">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Info
          </span>
          <span className="font-bold text-emerald-300">{data.contact}</span>
        </div>
      </div>
    </div>
  )
}