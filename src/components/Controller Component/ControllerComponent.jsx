import React, { useState } from 'react'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  Mail,
  CheckSquare,
  Layers,
  Code2,
  RotateCcw,
  Tag,
  Info,
} from 'lucide-react'

const PRESETS = [
  {
    fullName: 'Aarav Mehta',
    email: 'aarav.mehta@devstudio.io',
    role: 'Staff Frontend Architect',
    experienceLevel: 'Lead',
    skills: ['React', 'TypeScript', 'TailwindCSS'],
    notifications: true,
  },
  {
    fullName: 'Sophia Lin',
    email: 'sophia.lin@cloudeng.com',
    role: 'Full Stack Engineer',
    experienceLevel: 'Senior',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    notifications: false,
  },
]

const AVAILABLE_SKILLS = ['React', 'TypeScript', 'Node.js', 'Next.js', 'TailwindCSS', 'GraphQL', 'Docker']

export default function FormsDemo() {
  const [form, setForm] = useState(PRESETS[0])
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  // Single Universal Change Handler for all input types
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSkillToggle = (skill) => {
    setForm((prev) => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills }
    })
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: null }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      errs.fullName = 'Full Name must be at least 3 characters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please provide a valid email address.'
    }
    if (form.skills.length === 0) {
      errs.skills = 'Select at least one technical skill.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted({
      ...form,
      timestamp: new Date().toLocaleTimeString(),
    })
  }

  const handleApplyPreset = (p) => {
    setForm(p)
    setErrors({})
    setSubmitted(null)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Unified Multi-Field Form Controller</span>
        </div>
        <div className="flex items-center gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            >
              Load {p.experienceLevel} Preset
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Developer Registration Form
            </h3>
            <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
              Single Dynamic Handler
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-rose-500 text-[11px] mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="developer@domain.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-500 text-[11px] mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                </p>
              )}
            </div>

            {/* Role & Experience */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Role Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Experience Tier
                </label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Junior">Junior Developer (0-2 yrs)</option>
                  <option value="Mid">Mid-Level Engineer (3-5 yrs)</option>
                  <option value="Senior">Senior Architect (6+ yrs)</option>
                  <option value="Lead">Staff / Tech Lead</option>
                </select>
              </div>
            </div>

            {/* Technical Skills Multi-Tag Selection */}
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1.5">
                Technical Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = form.skills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{skill}</span>
                    </button>
                  )
                })}
              </div>
              {errors.skills && (
                <p className="text-rose-500 text-[11px] mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.skills}
                </p>
              )}
            </div>

            {/* Notifications Checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={form.notifications}
                onChange={handleChange}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <label
                htmlFor="notifications"
                className="text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Receive Technical Bulletins & Release Updates
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate & Submit Form</span>
          </button>
        </form>

        {/* Live Form State Object Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> Reactive State Object
              </span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Single State Hook
              </span>
            </div>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 text-[11px] overflow-auto leading-relaxed">
{JSON.stringify(form, null, 2)}
            </pre>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1 animate-fade-in font-mono">
              <p className="font-bold font-sans flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Verified Submission Payload:
              </p>
              <pre className="text-[10px] bg-slate-950 p-2.5 rounded-xl border border-emerald-800/40 text-emerald-200 overflow-auto">
{JSON.stringify(submitted, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Handling Multi-Input Forms with One State:</strong> Using dynamic computed property names like <code className="text-indigo-500 dark:text-indigo-400">{'setForm(prev => ({ ...prev, [e.target.name]: value }))'}</code> eliminates the need to create 10 separate <code className="text-indigo-500 dark:text-indigo-400">useState</code> hooks for 10 form inputs.
        </div>
      </div>
    </div>
  )
}