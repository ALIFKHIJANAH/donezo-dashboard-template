import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight, BarChart3, Bell, Calendar, CheckSquare, Code2, FileDown, Globe2, HelpCircle,
  Layout, LayoutDashboard, LogOut, Mail, Menu, Moon, MoreHorizontal, MoreVertical, Play, Plus,
  Search, Settings, Smartphone, Square, Sun, TrendingUp, Users, X, Zap, type LucideIcon,
} from 'lucide-react'
import { Button, Card, Input } from './components/ui'
import { AuthPage } from './AuthPage'
import { getUser, logout } from './lib/auth'
import { applyTheme, getTheme, type Theme } from './lib/theme'

type Project = { name: string; due: string; icon: LucideIcon; color: string }
type Member = { name: string; task: string; avatar: string; status: string; statusClass: string }

const projectItems: Project[] = [
  { name: 'Develop API Endpoints', due: 'Nov 26, 2024', icon: Code2, color: 'bg-blue-500' },
  { name: 'Onboarding Flow', due: 'Nov 28, 2024', icon: Users, color: 'bg-teal-500' },
  { name: 'Build Dashboard', due: 'Nov 30, 2024', icon: Layout, color: 'bg-green-500' },
  { name: 'Optimize Page Load', due: 'Dec 5, 2024', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Cross-Browser Testing', due: 'Dec 6, 2024', icon: Globe2, color: 'bg-purple-500' },
]

const members: Member[] = [
  { name: 'Alexandra Deff', task: 'Working on Github Project Repository', avatar: 'https://i.pravatar.cc/150?img=47', status: 'Completed', statusClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900' },
  { name: 'Edwin Adenike', task: 'Working on Integrate User Auth System', avatar: 'https://i.pravatar.cc/150?img=11', status: 'In Progress', statusClass: 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900' },
  { name: 'Isaac Oluwatemilorun', task: 'Working on Develop Search Functionality', avatar: 'https://i.pravatar.cc/150?img=59', status: 'Pending', statusClass: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900' },
  { name: 'David Oshodi', task: 'Working on Responsive Layout for Homepage', avatar: 'https://i.pravatar.cc/150?img=12', status: 'In Progress', statusClass: 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900' },
]

const navItems: Array<{ label: string; icon: LucideIcon; count?: string }> = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Tasks', icon: CheckSquare, count: '14+' },
  { label: 'Calendar', icon: Calendar }, { label: 'Analytics', icon: BarChart3 }, { label: 'Team', icon: Users },
]

function App() {
  const path = window.location.pathname
  const authed = Boolean(getUser())
  if (path === '/login' || path === '/register') return <AuthPage mode={path.slice(1) as 'login' | 'register'} />
  if (!authed) return <AuthPage mode="login" />
  return <Dashboard />
}

function Dashboard() {
  const [active, setActive] = useState('Dashboard')
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modal, setModal] = useState<'project' | 'member' | null>(null)
  const [notice, setNotice] = useState('')
  const [meetingStarted, setMeetingStarted] = useState(false)
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(5048)
  const [importing, setImporting] = useState(false)
  const [theme, setTheme] = useState<Theme>(getTheme)

  useEffect(() => { applyTheme(theme) }, [theme])

  const toggleTheme = () => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  const showNotice = (message: string) => setNotice(message)
  const filteredProjects = useMemo(() => projectItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [query])
  const filteredMembers = useMemo(() => members.filter((item) => `${item.name} ${item.task}`.toLowerCase().includes(query.toLowerCase())), [query])
  const formatTime = (value: number) => [Math.floor(value / 3600), Math.floor((value % 3600) / 60), value % 60].map((part) => String(part).padStart(2, '0')).join(':')
  const importData = () => { setImporting(true); window.setTimeout(() => { setImporting(false); showNotice('Import complete') }, 1100) }

  return <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 dark:bg-slate-950 dark:text-slate-200">
    <button className="fixed left-4 top-4 z-40 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-emerald-900 text-white lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-2 flex items-center gap-2 p-6"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white"><CheckSquare size={18} /></div><span className="text-xl font-bold tracking-tight">Donezo</span><button className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <div className="mb-6 px-4"><p className="mb-4 px-2 text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500">MENU</p><nav className="space-y-1" aria-label="Menu">{navItems.map(({ label, icon: Icon, count }) => <button key={label} className={`flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-left transition-colors ${active === label ? 'border-r-2 border-emerald-800 bg-emerald-50 font-medium text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`} onClick={() => { setActive(label); setMobileOpen(false); showNotice(`${label} selected`) }}><span className="flex items-center gap-3"><Icon size={20} />{label}</span>{count && <span className="rounded-full bg-emerald-800 px-2 py-0.5 text-[10px] text-white">{count}</span>}</button>)}</nav></div>
      <div className="flex-1 px-4"><p className="mb-4 px-2 text-xs font-semibold tracking-wider text-gray-400 dark:text-slate-500">GENERAL</p><nav className="space-y-1" aria-label="General">{[[Settings, 'Settings'], [HelpCircle, 'Help'], [LogOut, 'Logout']].map(([Icon, label]) => <button key={label as string} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100" onClick={() => { if (label === 'Logout') { logout(); window.location.href = '/login' } else { showNotice(`${label} selected`) } }}><Icon size={20} />{label as string}</button>)}</nav></div>
      <div className="mt-auto p-4"><div className="relative overflow-hidden rounded-2xl bg-emerald-900 p-4 text-white shadow-lg"><div className="relative z-10"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"><Smartphone size={16} /></div><h4 className="mb-1 text-sm font-semibold">Download our Mobile App</h4><p className="mb-4 text-xs text-emerald-200">Get easy in another way</p><Button className="w-full bg-white text-xs text-emerald-900 hover:bg-gray-100" onClick={() => showNotice('Download link copied')}>Download</Button></div></div></div>
    </aside>
    <main className="min-w-0 flex-1 p-5 pt-20 sm:p-8 sm:pt-8 lg:ml-64"><header className="mb-8 flex items-center justify-between gap-4"><div className="relative hidden w-96 max-w-full items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex"><Search className="mr-2 text-gray-400 dark:text-slate-500" size={16} /><input aria-label="Search task" placeholder="Search task" className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-200 dark:placeholder:text-slate-500" value={query} onChange={(event) => setQuery(event.target.value)} /><span className="ml-2 shrink-0 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">⌘ F</span></div><div className="ml-auto flex items-center gap-2 sm:gap-4"><button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button><button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open messages" onClick={() => showNotice('You have 3 unread messages')}><Mail size={16} /></button><button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Open notifications" onClick={() => showNotice('No new notifications')}><Bell size={16} /></button><div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-slate-800"><img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-slate-800" /><div className="hidden md:block"><p className="text-sm font-semibold leading-tight">Totok Michael</p><p className="text-xs text-gray-500 dark:text-slate-400">tmichael20@mail.com</p></div></div></div></header>
      <div className="flex flex-col justify-between gap-5 mb-8 sm:flex-row sm:items-end"><div><h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1><p className="text-sm text-gray-500 dark:text-slate-400">Plan, prioritize, and accomplish your tasks with ease.</p></div><div className="flex flex-wrap gap-3"><Button onClick={() => setModal('project')}><Plus size={16} />Add Project</Button><Button variant="outline" onClick={importData} disabled={importing}><FileDown size={16} />{importing ? 'Importing...' : 'Import Data'}</Button></div></div>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"><StatCard dark title="Total Projects" value="24" /><StatCard title="Ended Projects" value="10" /><StatCard title="Running Projects" value="12" /><StatCard title="Pending Project" value="2" caption="On Discuss" /></div>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3"><Card className="p-6"><h3 className="mb-6 text-lg font-semibold">Project Analytics</h3><div className="flex h-40 items-end justify-between">{[16, 24, 32, 28, 20, 16, 12].map((height, index) => <div key={index} className="group flex flex-col items-center gap-2"><div className={`w-8 rounded-full ${index === 1 || index === 2 ? 'bg-emerald-500' : index === 3 ? 'bg-emerald-800' : 'striped-bar border border-gray-200 dark:border-slate-700'}`} style={{ height: `${height * 4}px` }} /><span className="text-xs font-medium text-gray-400 dark:text-slate-500">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}</span></div>)}</div></Card><Card className="flex h-full flex-col justify-between p-6"><div><h3 className="mb-4 text-lg font-semibold">Reminders</h3><h4 className="text-lg font-semibold">Meeting with Arc Company</h4><p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Time : 02.00 pm - 04.00 pm</p></div><Button className="mt-6 w-full" onClick={() => { setMeetingStarted(true); showNotice('Meeting started') }}><Play size={16} fill="currentColor" />{meetingStarted ? 'Meeting Started' : 'Start Meeting'}</Button></Card><Card className="p-6"><div className="mb-6 flex items-center justify-between"><h3 className="text-lg font-semibold">Project</h3><Button variant="outline" className="min-h-9 px-3 py-1.5 text-xs" onClick={() => setModal('project')}><Plus size={12} />New</Button></div><div className="space-y-5">{filteredProjects.length ? filteredProjects.map(({ name, due, icon: Icon, color }) => <div key={name} className="flex items-start gap-3"><div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-white ${color}`}><Icon size={13} /></div><div><p className="text-sm font-medium">{name}</p><p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">Due date: {due}</p></div></div>) : <p className="text-sm text-gray-500 dark:text-slate-400">No projects found.</p>}</div></Card></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><Card className="p-6"><div className="mb-6 flex items-center justify-between"><h3 className="text-lg font-semibold">Team Collaboration</h3><Button variant="outline" className="min-h-9 px-3 py-1.5 text-xs" onClick={() => setModal('member')}><Plus size={12} />Add Member</Button></div><div className="space-y-5">{filteredMembers.length ? filteredMembers.map((member) => <div key={member.name} className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full object-cover" /><div className="min-w-0"><p className="text-sm font-semibold">{member.name}</p><p className="mt-0.5 truncate text-xs text-gray-500 dark:text-slate-400">{member.task}</p></div></div><span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium ${member.statusClass}`}>{member.status}</span></div>) : <p className="text-sm text-gray-500 dark:text-slate-400">No team members found.</p>}</div></Card><Card className="relative flex flex-col items-center justify-center p-6"><h3 className="mb-6 self-start text-lg font-semibold">Project Progress</h3><div className="relative flex h-48 w-48 items-center justify-center"><svg viewBox="0 0 100 100" className="h-full w-full -rotate-90"><circle cx="50" cy="50" r="40" fill="transparent" className="stroke-gray-200 dark:stroke-slate-700" strokeWidth="15" /><circle cx="50" cy="50" r="40" fill="transparent" className="stroke-emerald-800 dark:stroke-emerald-400" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="148.2" strokeLinecap="round" /></svg><div className="absolute flex flex-col items-center"><span className="text-3xl font-bold">41%</span><span className="text-xs text-gray-500 dark:text-slate-400">Project Ended</span></div></div><div className="mt-8 flex w-full justify-center gap-4 text-xs font-medium text-gray-600 dark:text-slate-300"><span>● Completed</span><span className="text-emerald-800 dark:text-emerald-400">● In Progress</span><span className="text-gray-400 dark:text-slate-500">● Pending</span></div></Card><Card className="relative flex min-h-[250px] flex-col justify-between overflow-hidden border-emerald-900 bg-emerald-950 p-6 text-white"><div className="relative z-10 flex items-start justify-between"><h3 className="text-lg font-semibold">Time Tracker</h3><button aria-label="More time tracker options" onClick={() => showNotice('Time tracker options opened')}><MoreVertical size={20} className="text-emerald-300" /></button></div><div className="relative z-10 my-4 text-center"><span className="text-4xl font-bold tracking-widest">{formatTime(seconds)}</span></div><div className="relative z-10 flex items-center justify-center gap-4"><button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-900 shadow-lg" aria-label={running ? 'Pause timer' : 'Start timer'} onClick={() => setRunning((value) => !value)}>{running ? <Square size={16} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg" aria-label="Stop timer" onClick={() => { setRunning(false); showNotice('Timer stopped') }}><Square size={16} fill="currentColor" /></button></div></Card></div>
    </main>
    {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg" role="status">{notice}</div>}
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="flex items-start justify-between"><div><h2 id="modal-title" className="text-xl font-bold">{modal === 'project' ? 'Add a project' : 'Add a team member'}</h2><p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Save a new item to your workspace.</p></div><button className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-400 dark:text-slate-500" aria-label="Close dialog" onClick={() => setModal(null)}><X size={18} /></button></div><form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); setModal(null); showNotice(`${modal === 'project' ? 'Project' : 'Team member'} added`) }}><label className="block text-sm font-semibold">{modal === 'project' ? 'Project name' : 'Full name'}<Input className="mt-2" required autoFocus /></label><label className="block text-sm font-semibold">{modal === 'project' ? 'Category' : 'Role'}<Input className="mt-2" required /></label><div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button type="submit">Save</Button></div></form></div></div>}
  </div>
}

function StatCard({ title, value, dark = false, caption = 'Increased from last month' }: { title: string; value: string; dark?: boolean; caption?: string }) {
  return <Card className={`flex flex-col justify-between rounded-2xl border border-gray-100 p-6 shadow-sm dark:border-slate-800 ${dark ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 text-white' : ''}`}><div className="mb-4 flex items-start justify-between"><h3 className={`text-sm font-medium ${dark ? 'text-emerald-100' : 'text-gray-500 dark:text-slate-400'}`}>{title}</h3><button className={`flex h-8 w-8 items-center justify-center rounded-full ${dark ? 'bg-emerald-700 text-white' : 'border border-gray-200 bg-white text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`} aria-label={`${title} details`} onClick={() => undefined}><ArrowUpRight size={16} /></button></div><div><p className="mb-2 text-4xl font-bold">{value}</p><p className={`flex items-center gap-1 text-xs ${dark ? 'text-emerald-200' : 'text-gray-500 dark:text-slate-400'}`}>{caption !== 'On Discuss' && <TrendingUp size={12} className="text-emerald-500" />}{caption}</p></div></Card>
}

export default App
