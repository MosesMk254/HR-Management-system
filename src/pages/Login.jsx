import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const DEMO_USERS = [
  { dept: 'Registry', username: 'registry',     password: 'registry123' },
  { dept: 'POA',      username: 'poa.officer',  password: 'poa123' },
  { dept: 'POB',      username: 'pob.officer',  password: 'pob123' },
  { dept: 'POC',      username: 'poc.officer',  password: 'poc123' },
  { dept: 'POS',      username: 'pos.officer',  password: 'pos123' },
  { dept: 'DHRM',     username: 'dhrm.officer', password: 'dhrm123' },
]

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 300))
    const result = login(username.trim(), password)
    setIsLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error)
    }
  }

  const quickLogin = (u) => {
    setUsername(u.username)
    setPassword(u.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-400 mt-1 mb-8">
          Enter your credentials to access your department
        </p>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder=""
              required
              autoComplete="username"
              className="w-full bg-indigo-50 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-300 transition-all border-0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=""
                required
                autoComplete="current-password"
                className="w-full bg-indigo-50 rounded-xl px-4 py-3.5 pr-11 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-300 transition-all border-0"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-wait text-white font-semibold text-sm py-3.5 rounded-xl transition-colors"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Demo — click to auto-fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map(u => (
              <button
                key={u.dept}
                onClick={() => quickLogin(u)}
                className="text-left bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-xl px-3.5 py-3 transition-all"
              >
                <p className="text-sm font-bold text-gray-800">{u.dept}</p>
                <p className="text-xs text-gray-400 mt-0.5">{u.username}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
