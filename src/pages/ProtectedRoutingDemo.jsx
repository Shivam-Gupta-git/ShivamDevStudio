import React, { useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  LogOut,
  LogIn,
  Home as HomeIcon,
  Info,
  Phone,
  ArrowRight,
  User,
  Key,
  Code2,
  CheckCircle2,
} from 'lucide-react'
import Home from '../components/Protected Routing/Home'
import About from '../components/Protected Routing/About'
import Contact from '../components/Protected Routing/Contact'

export default function ProtectedRoutingDemo() {
  const [currentPath, setCurrentPath] = useState('/')
  const [session, setSession] = useState({
    token: localStorage.getItem('token') || null,
    userRole: 'admin',
    userName: 'Shivam Gupta',
  })
  const [redirectNotice, setRedirectNotice] = useState(false)

  const navigateTo = (path) => {
    const isProtected = path === '/about' || path === '/contact'
    const activeToken = session.token

    if (isProtected && !activeToken) {
      setRedirectNotice(true)
      setCurrentPath('/login')
      setTimeout(() => setRedirectNotice(false), 4000)
    } else {
      setRedirectNotice(false)
      setCurrentPath(path)
    }
  }

  const handleLogin = (role) => {
    const mockToken = `jwt_signed_header.${btoa(JSON.stringify({ role, name: role === 'admin' ? 'Shivam Gupta' : 'Alex Dev' }))}.mock_signature`
    localStorage.setItem('token', mockToken)
    setSession({
      token: mockToken,
      userRole: role,
      userName: role === 'admin' ? 'Shivam Gupta (Admin)' : 'Alex Dev (Member)',
    })
    setRedirectNotice(false)
    setCurrentPath('/about')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setSession({
      token: null,
      userRole: 'guest',
      userName: 'Guest Visitor',
    })
    setCurrentPath('/login')
  }

  return (
    <div className="space-y-6">
      {/* Simulator Pipeline Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            Protected Routing & Auth Guard Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-mono">Session State:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              session.token
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {session.token ? `Authenticated (${session.userRole}) ✓` : 'Unauthenticated (Guest 🔒)'}
          </span>
        </div>
      </div>

      {redirectNotice && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-bounce flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Access Denied!</strong> Protected route requested without token. Guard redirected to <code>/login</code>.
            </span>
          </span>
          <button
            type="button"
            onClick={() => setRedirectNotice(false)}
            className="text-rose-400 font-bold hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl space-y-5">
        {/* Navigation Bar inside Simulator */}
        <header className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-xs">
          <div className="flex items-center gap-2 font-mono text-indigo-400 font-bold">
            <span>Route:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">
              {currentPath}
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5 font-sans">
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentPath === '/' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" /> Home (Public)
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentPath === '/about' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Dashboard (Protected)
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/contact')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentPath === '/contact' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Settings (Protected)
            </button>

            {session.token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('/login')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentPath === '/login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Login
              </button>
            )}
          </nav>
        </header>

        {/* Dynamic Route View */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
          {currentPath === '/' && <Home />}
          {currentPath === '/about' && session.token && <About />}
          {currentPath === '/contact' && session.token && <Contact />}
          {currentPath === '/login' && (
            <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Simulated Authentication Gateway</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a role to simulate token authorization:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleLogin('admin')}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4" /> Sign In as Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin('member')}
                  className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <User className="w-4 h-4" /> Sign In as Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Callout */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white">Protected Route Pattern in React Router:</strong> Wrap protected routes in a layout wrapper: <code className="text-indigo-500 dark:text-indigo-400">&lt;ProtectedRoute&gt; &lt;Dashboard /&gt; &lt;/ProtectedRoute&gt;</code> that reads auth context and returns <code className="text-indigo-500 dark:text-indigo-400">&lt;Navigate to="/login" replace /&gt;</code> if unauthenticated.
        </div>
      </div>
    </div>
  )
}
