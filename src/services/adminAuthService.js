/**
 * Admin Authentication & Session Management Service
 * Supports Email/Password, PIN, Demo 1-Click Access, and Session Expiration
 */

const AUTH_STORAGE_KEY = 'shivamdev_admin_auth'
const CREDS_STORAGE_KEY = 'shivamdev_admin_credentials'

const DEFAULT_ADMIN = {
  email: 'admin@shivamdev.studio',
  password: 'admin',
  pin: '8899',
  name: 'Shivam Gupta',
  role: 'Super Administrator',
  avatar: 'SG',
}

export function getStoredAdminCredentials() {
  try {
    const raw = localStorage.getItem(CREDS_STORAGE_KEY)
    return raw ? { ...DEFAULT_ADMIN, ...JSON.parse(raw) } : DEFAULT_ADMIN
  } catch {
    return DEFAULT_ADMIN
  }
}

export function updateAdminCredentials({ email, password, pin, name }) {
  const current = getStoredAdminCredentials()
  const updated = {
    ...current,
    email: email || current.email,
    password: password || current.password,
    pin: pin || current.pin,
    name: name || current.name,
  }
  localStorage.setItem(CREDS_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Check if session has expired (e.g. 24 hours validity)
    if (session.expiresAt && Date.now() > session.expiresAt) {
      logoutAdmin()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function loginAdmin({ emailOrPin, password, rememberMe = true }) {
  const creds = getStoredAdminCredentials()
  const input = (emailOrPin || '').trim().toLowerCase()
  const pwd = (password || '').trim()

  // Allow login by matching email + password OR by matching 4-digit PIN
  const isPinMatch = input === creds.pin || pwd === creds.pin
  const isEmailMatch =
    (input === creds.email.toLowerCase() || input === 'admin') &&
    pwd === creds.password

  if (isPinMatch || isEmailMatch) {
    const session = {
      token: `admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user: {
        email: creds.email,
        name: creds.name,
        role: creds.role,
        avatar: creds.avatar,
      },
      loginTime: new Date().toISOString(),
      expiresAt: rememberMe ? Date.now() + 7 * 24 * 60 * 60 * 1000 : Date.now() + 8 * 60 * 60 * 1000,
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    return { success: true, session }
  }

  return {
    success: false,
    error: 'Invalid credentials. Please verify your Email/Password or 4-digit PIN.',
  }
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  return true
}
