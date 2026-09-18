import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'admin@shivamdevstudio.io',
    password: 'secureTokenPassword',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFormValue = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormData = (event) => {
    event.preventDefault()
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.')
      return
    }
    setError('')
    localStorage.setItem('token', 'userLoggedIn')
    navigate('/about')
  }

  return (
    <div className="p-6 max-w-md mx-auto rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 shadow-xl space-y-4 font-mono text-xs">
      <div className="text-center space-y-1">
        <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="text-base font-bold font-sans text-white">
          Simulated Authentication Login
        </h2>
        <p className="text-[11px] font-sans text-slate-400">
          Submitting sets a mock auth token in <code className="text-indigo-400">localStorage</code>
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 font-sans text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleFormData} className="space-y-3 font-sans">
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-xs">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormValue}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-xs">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormValue}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
        >
          <LogIn className="w-4 h-4" />
          <span>Authenticate & Set Token</span>
        </button>
      </form>
    </div>
  )
}