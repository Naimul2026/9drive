import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cloud, FolderSync, Lock, ShieldCheck } from 'lucide-react'
import { BrandLogo } from '@/components/drive/BrandLogo'
import { Button } from '@/components/ui/button'
import { GoogleLogo } from '@/components/auth/GoogleLogo'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import { setAuthSession, type AuthUser } from '@/lib/auth'

type AuthResponse = { accessToken: string; refreshToken: string; user: AuthUser }

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function continueWithGoogle() {
    setGoogleLoading(true)
    setError('')
    try {
      const data = await apiFetch<{ url: string }>('/auth/google/url', { skipAuth: true })
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
      setGoogleLoading(false)
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', skipAuth: true, body: JSON.stringify({ email, password }) })
      setAuthSession(data.accessToken, data.refreshToken, data.user)
      navigate('/all-files')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen md:grid-cols-12 bg-[#f6f8fb] dark:bg-[#090d16]">
      {/* Left Showcase Panel */}
      <section className="relative hidden md:flex md:col-span-6 xl:col-span-7 flex-col justify-between overflow-hidden border-r border-slate-200/80 bg-[#0d1424] p-8 lg:p-12 xl:p-14 text-slate-100 dark:border-slate-800/80">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <BrandLogo className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-white">9Drive</span>
          <span className="ml-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue-300">
            GATEWAY v2
          </span>
        </div>

        <div className="relative z-10 max-w-xl my-auto py-8">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
            One unified workspace for all your cloud storage.
          </h2>
          <p className="mt-4 text-sm lg:text-base text-slate-400 leading-relaxed">
            Pool multiple Google Drive and S3 accounts behind a single file tree, route uploads automatically by available quota, and share links with zero friction.
          </p>

          {/* Product Telemetry Card Preview */}
          <div className="mt-8 rounded-xl border border-slate-800 bg-[#11192c]/90 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200">Pooled Storage Mesh</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">3 nodes online</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-800/90 bg-[#0c1220] p-3">
                <p className="text-[11px] text-slate-400">Total Pool</p>
                <p className="mt-1 font-mono text-sm lg:text-base font-semibold text-white tabular-nums">45.0 GB</p>
              </div>
              <div className="rounded-lg border border-slate-800/90 bg-[#0c1220] p-3">
                <p className="text-[11px] text-slate-400">Routing</p>
                <p className="mt-1 font-mono text-sm lg:text-base font-semibold text-blue-400">Auto-Free</p>
              </div>
              <div className="rounded-lg border border-slate-800/90 bg-[#0c1220] p-3">
                <p className="text-[11px] text-slate-400">Stream Cap</p>
                <p className="mt-1 font-mono text-sm lg:text-base font-semibold text-white tabular-nums">5.0 GB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 lg:gap-6 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Private-first Drive ACLs</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderSync className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Two-way Drive sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Direct stream proxy</span>
          </div>
        </div>
      </section>

      {/* Right Auth Form Panel */}
      <section className="relative flex md:col-span-6 xl:col-span-5 flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20 bg-[#f6f8fb] md:bg-white dark:bg-[#090d16] md:dark:bg-[#0f1623]">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 md:hidden" />
        <div className="relative z-10 mx-auto w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-7 shadow-lg md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-slate-800/90 dark:bg-[#0f1623] md:dark:bg-transparent">
          <div className="flex items-center gap-3 md:hidden mb-7">
            <BrandLogo className="h-9 w-9" />
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">9Drive</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Sign in to 9Drive
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Enter your workspace credentials to access your files.
            </p>
          </div>

          <div className="mt-7 grid gap-3">
            <Button
              variant="outline"
              disabled={googleLoading}
              onClick={continueWithGoogle}
              className="h-11 w-full justify-center font-semibold"
            >
              <GoogleLogo />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span>or with email</span>
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email address
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            ) : null}

            <Button disabled={loading} className="mt-1 h-11 w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Need an account?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" to="/register">
              Create workspace
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
