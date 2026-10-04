import { useState } from 'react'
import { ArrowRight, CheckSquare, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from './components/ui'
import { login } from './lib/auth'

type AuthPageProps = { mode: 'login' | 'register' }

export function AuthPage({ mode }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const isRegister = mode === 'register'

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    login(String(data.get('email') || 'demo@donezo.app'))
    setNotice(isRegister ? 'Account created. Redirecting to your workspace.' : 'Welcome back. Redirecting to your workspace.')
    window.setTimeout(() => { window.location.href = '/' }, 700)
  }

  return <main className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-950 dark:text-slate-200">
    <section className="hidden w-1/2 flex-col justify-between bg-emerald-900 p-10 text-white lg:flex">
      <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-900"><CheckSquare size={20} /></div><span className="text-2xl font-bold tracking-tight">Donezo</span></div>
      <div className="max-w-md"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Workspace management</p><h1 className="text-5xl font-bold leading-tight">Plan clearly. Move projects forward.</h1><p className="mt-6 text-base leading-7 text-emerald-100">Keep tasks, projects, and team progress in one focused workspace.</p></div>
      <p className="text-sm text-emerald-200">A calmer way to manage the work that matters.</p>
    </section>
    <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
      <div className="w-full max-w-md">
        <div className="mb-10 flex items-center gap-2 lg:hidden"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-white"><CheckSquare size={20} /></div><span className="text-2xl font-bold tracking-tight">Donezo</span></div>
        <div className="mb-8"><h2 className="text-3xl font-bold text-gray-900 dark:text-white">{isRegister ? 'Create your account' : 'Welcome back'}</h2><p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{isRegister ? 'Start organizing your workspace today.' : 'Sign in to continue to your workspace.'}</p></div>
        <form className="space-y-5" onSubmit={submit}>
          {isRegister && <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Full name<Input className="mt-2" name="name" autoComplete="name" required placeholder="Your name" /></label>}
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Email address<Input className="mt-2" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Password<div className="relative mt-2"><Input className="pr-12" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={8} placeholder="At least 8 characters" /><button type="button" className="absolute right-1 top-1 inline-flex min-h-9 min-w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {isRegister && <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300"><input type="checkbox" required className="mt-1 h-4 w-4 accent-emerald-800" />I agree to the Donezo terms and privacy policy.</label>}
          {!isRegister && <div className="flex justify-end"><button type="button" className="text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300" onClick={() => setNotice('Password reset instructions requested.')}>Forgot password?</button></div>}
          <Button className="w-full" type="submit">{isRegister ? 'Create account' : 'Sign in'}<ArrowRight size={17} /></Button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">{isRegister ? 'Already have an account?' : 'New to Donezo?'} <a className="font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300" href={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</a></p>
        {notice && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" role="status">{notice}</p>}
      </div>
    </section>
  </main>
}
