import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react'
import { ShieldCheck, Lock, LogOut, LogIn, Home as HomeIcon, Info, Phone } from 'lucide-react'

export default function Header() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }

  const linkStyle = ({ isActive }) =>
    isActive
      ? 'px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
      : 'px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition'

  return (
    <header className="w-full p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-4 mb-4 shadow-md">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-indigo-500" />
        <h1 className="text-sm font-bold text-slate-900 dark:text-white">
          Secure Portal
        </h1>
      </div>

      <nav className="flex items-center gap-1.5">
        <NavLink to="/" className={linkStyle}>
          Home (Public)
        </NavLink>
        <NavLink to="/about" className={linkStyle}>
          About (Protected)
        </NavLink>
        <NavLink to="/contact" className={linkStyle}>
          Contact (Protected)
        </NavLink>

        {token ? (
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        ) : (
          <NavLink to="/login" className={linkStyle}>
            <LogIn className="w-3.5 h-3.5 inline mr-1" /> Login
          </NavLink>
        )}
      </nav>
    </header>
  )
}