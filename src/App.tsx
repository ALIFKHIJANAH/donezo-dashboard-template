import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3, Bell, Calendar, CheckSquare, Code2, Globe2, HelpCircle,
  Layout, LayoutDashboard, LogOut, Mail, Menu, Moon, Pause, Play, Plus,
  Search, Settings, Smartphone, Square, Sun, Users, Video, X, Zap, type LucideIcon,
} from 'lucide-react'
import { AuthPage } from './AuthPage'
import { DashboardButton } from './components/DashboardButton'
import { DashboardChart, type ChartDatum } from './components/DashboardChart'
import { DashboardSidebar, type SidebarGroup } from './components/DashboardSidebar'
import { StatCard } from './components/StatCard'
import { getUser, logout } from './lib/auth'
import { applyTheme, getTheme, type Theme } from './lib/theme'
import './dashboard.css'

type Project = { name: string; due: string; icon: LucideIcon; color: string }
type Member = { name: string; task: string; avatar: string; status: string }

const projectItems: Project[] = [
  { name: 'Develop API Endpoints', due: 'Nov 26, 2024', icon: Code2, color: 'blue' },
  { name: 'Onboarding Flow', due: 'Nov 28, 2024', icon: Users, color: 'teal' },
  { name: 'Build Dashboard', due: 'Nov 30, 2024', icon: Layout, color: 'green' },
  { name: 'Optimize Page Load', due: 'Dec 5, 2024', icon: Zap, color: 'yellow' },
  { name: 'Cross-Browser Testing', due: 'Dec 6, 2024', icon: Globe2, color: 'purple' },
]

const members: Member[] = [
  { name: 'Alexandra Deff', task: 'Github Project Repository', avatar: '47', status: 'Completed' },
  { name: 'Edwin Adenike', task: 'Integrate User Auth System', avatar: '11', status: 'In Progress' },
  { name: 'Isaac Oluwatemilorun', task: 'Develop Search Functionality', avatar: '59', status: 'Pending' },
  { name: 'David Oshodi', task: 'Responsive Layout for Homepage', avatar: '12', status: 'In Progress' },
]

const navItems: Array<{ label: string; icon: LucideIcon; count?: string; target: string }> = [
  { label: 'Dashboard', icon: LayoutDashboard, target: 'dashboard' },
  { label: 'Tasks', icon: CheckSquare, count: '14+', target: 'projects' },
  { label: 'Calendar', icon: Calendar, target: 'reminders' },
  { label: 'Analytics', icon: BarChart3, target: 'analytics' },
  { label: 'Team', icon: Users, target: 'team' },
]

const weeklyActivity: ChartDatum[] = [
  { id: 'sun', label: 'S', value: 64, pattern: 'striped' },
  { id: 'mon', label: 'M', value: 88, color: 'var(--chart-light)' },
  { id: 'tue', label: 'T', value: 74, color: 'var(--chart-green)', tooltip: '74%' },
  { id: 'wed', label: 'W', value: 100, color: 'var(--gauge-running)' },
  { id: 'thu', label: 'T', value: 79, pattern: 'striped' },
  { id: 'fri', label: 'F', value: 65, pattern: 'striped' },
  { id: 'sat', label: 'S', value: 86, pattern: 'striped' },
]
const projectProgress: ChartDatum[] = [
  { id: 'completed', label: 'Completed', value: 41, color: 'var(--gauge-completed)' },
  { id: 'running', label: 'In Progress', value: 32, color: 'var(--gauge-running)' },
  { id: 'pending', label: 'Pending', value: 27, pattern: 'striped' },
]

function App() {
  const path = window.location.pathname
  if (path === '/login' || path === '/register') return <AuthPage mode={path.slice(1) as 'login' | 'register'} />
  if (!getUser()) return <AuthPage mode="login" />
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
  const dialog = useRef<HTMLDialogElement>(null)
  const navigation = useRef<HTMLDialogElement>(null)
  const search = useRef<HTMLInputElement>(null)

  useEffect(() => { applyTheme(theme) }, [theme])
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])
  useEffect(() => {
    if (!importing) return
    const timer = window.setTimeout(() => { setImporting(false); setNotice('Demo import complete. No external data was imported.') }, 1100)
    return () => window.clearTimeout(timer)
  }, [importing])
  useEffect(() => {
    if (modal) dialog.current?.showModal()
    else dialog.current?.close()
  }, [modal])
  useEffect(() => {
    if (mobileOpen) navigation.current?.showModal()
    else navigation.current?.close()
  }, [mobileOpen])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f' && !dialog.current?.open && !navigation.current?.open) {
        event.preventDefault()
        search.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filteredProjects = useMemo(() => projectItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase())), [query])
  const filteredMembers = useMemo(() => members.filter(item => `${item.name} ${item.task}`.toLowerCase().includes(query.toLowerCase())), [query])
  const time = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map(part => String(part).padStart(2, '0')).join(':')
  const navigate = (label: string, target: string) => {
    setActive(label)
    setMobileOpen(false)
    document.getElementById(target)?.scrollIntoView({ block: 'nearest' })
  }
  const sidebarGroups: SidebarGroup[] = [
    { id: 'menu', label: 'Menu', items: navItems.map(({ label, icon, count, target }) => ({ id: label, label, icon, count, onSelect: () => navigate(label, target) })) },
    { id: 'general', label: 'General', items: [
      { id: 'settings', label: 'Settings', icon: Settings, onSelect: () => setNotice('Use the sun or moon button in the header to change your theme.') },
      { id: 'help', label: 'Help', icon: HelpCircle, onSelect: () => setNotice('Demo workspace: search tasks, preview forms, and track your time.') },
      { id: 'logout', label: 'Logout', icon: LogOut, onSelect: () => { logout(); window.location.href = '/login' } },
    ] },
  ]
  const sidebarProps = {
    groups: sidebarGroups, activeId: active,
    brand: <a className="donezo-brand" href="/" aria-label="Donezo dashboard"><span className="donezo-mark" aria-hidden="true" /><span>Donezo</span></a>,
    footer: <div className="mobile-promo green-texture"><Smartphone size={25} /><h2>Download our<br />Mobile App</h2><p>Get easy in another way</p><DashboardButton variant="secondary" className="promo-button" onClick={() => setNotice('The mobile app is a demo preview. A download is not available yet.')}>Download</DashboardButton></div>,
  }

  return <div className="donezo-workspace">
    <DashboardSidebar {...sidebarProps} />
    <dialog ref={navigation} aria-label="Workspace navigation" className="mobile-navigation" onClose={() => setMobileOpen(false)} onClick={event => { if (event.target === event.currentTarget) setMobileOpen(false) }}>
      <button type="button" className="icon-button navigation-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={20} /></button><DashboardSidebar {...sidebarProps} contentOnly />
    </dialog>
    <div className="dashboard-main">
      <header className="dashboard-header">
        <button type="button" className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
        <div className="task-search"><Search size={19} /><input ref={search} aria-label="Search task" placeholder="Search task" value={query} onChange={event => setQuery(event.target.value)} /><kbd>⌘ F</kbd></div>
        <div className="header-actions">
          <button type="button" className="icon-button theme-button" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button type="button" className="icon-button" aria-label="Open messages" onClick={() => setNotice('You have 3 unread demo messages.')}><Mail size={19} /></button>
          <button type="button" className="icon-button" aria-label="Open notifications" onClick={() => setNotice('No new notifications.')}><Bell size={19} /></button>
          <div className="profile"><img src="https://i.pravatar.cc/100?img=32" alt="" width="42" height="42" /><div><p>Oluwatunmise</p><span>{getUser()}</span></div></div>
        </div>
      </header>
      <main id="dashboard" className="dashboard-content">
        <div className="dashboard-heading"><div><h1>Dashboard</h1><p>Plan, prioritize, and accomplish your tasks with ease.</p></div><div className="heading-actions"><DashboardButton icon={<Plus size={18} />} onClick={() => setModal('project')}>Add Project</DashboardButton><DashboardButton variant="outline" state={importing ? 'loading' : 'default'} stateLabels={{ loading: 'Importing...' }} onClick={() => setImporting(true)}>Import Data</DashboardButton></div></div>
        <div className="dashboard-stats">
          <StatCard featured title="Total Projects" value="24" trend="5" caption="Increased from last month" onDetails={() => setNotice('Total Projects: 24 projects in this demo workspace.')} />
          <StatCard title="Ended Projects" value="10" trend="6" caption="Increased from last month" onDetails={() => setNotice('Ended Projects: 10 completed demo projects.')} />
          <StatCard title="Running Projects" value="12" trend="2" caption="Increased from last month" onDetails={() => setNotice('Running Projects: 12 demo projects in progress.')} />
          <StatCard title="Pending Project" value="2" caption="On Discuss" onDetails={() => setNotice('Pending Project: 2 demo projects awaiting discussion.')} />
        </div>
        <div className="dashboard-panels">
          <section id="analytics" className="dashboard-panel analytics-panel"><h2>Project Analytics</h2><DashboardChart type="bar" data={weeklyActivity} max={100} ariaLabel="Weekly demo project activity." /></section>
          <section id="reminders" className="dashboard-panel reminders-panel"><h2>Reminders</h2><h3>Meeting with Arc Company</h3><p>Time : 02.00 pm - 04.00 pm</p><DashboardButton state={meetingStarted ? 'success' : 'default'} aria-pressed={meetingStarted} icon={<Video size={18} />} onClick={() => { setMeetingStarted(value => !value); setNotice(meetingStarted ? 'Demo meeting ended.' : 'Demo meeting started.') }}>{meetingStarted ? 'End Meeting' : 'Start Meeting'}</DashboardButton></section>
          <section id="projects" className="dashboard-panel projects-panel"><div className="panel-heading"><h2>Project</h2><DashboardButton variant="outline" size="small" icon={<Plus size={14} />} onClick={() => setModal('project')}>New</DashboardButton></div><div className="project-list">{filteredProjects.length ? filteredProjects.map(({ name, due, icon: Icon, color }) => <div className="project-row" key={name}><span className={`project-icon ${color}`}><Icon size={19} /></span><div><h3>{name}</h3><p>Due date: {due}</p></div></div>) : <p className="empty-state">No projects found. Try another search.</p>}</div></section>
          <section id="team" className="dashboard-panel team-panel"><div className="panel-heading"><h2>Team Collaboration</h2><DashboardButton variant="outline" size="small" icon={<Plus size={14} />} onClick={() => setModal('member')}>Add Member</DashboardButton></div><div className="team-list">{filteredMembers.length ? filteredMembers.map(member => <div className="member-row" key={member.name}><img src={`https://i.pravatar.cc/100?img=${member.avatar}`} alt="" width="37" height="37" /><div className="member-details"><h3>{member.name}</h3><p>Working on <strong>{member.task}</strong></p></div><span className={`member-status status-${member.status.toLowerCase().replace(' ', '-')}`}>{member.status}</span></div>) : <p className="empty-state">No team members found. Try another search.</p>}</div></section>
          <section className="dashboard-panel progress-panel"><h2>Project Progress</h2><DashboardChart type="gauge" data={projectProgress} value={41} label="Project Ended" ariaLabel="Demo project progress:" /></section>
          <section className="dashboard-panel timer-panel green-texture"><h2>Time Tracker</h2><p className="timer-display" role="timer" aria-label="Tracked time">{time}</p><div className="timer-controls"><button type="button" className="timer-toggle" aria-label={running ? 'Pause timer' : 'Start timer'} onClick={() => setRunning(value => !value)}>{running ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}</button><button type="button" className="timer-stop" aria-label="Stop and reset timer" onClick={() => { setRunning(false); setSeconds(0); setNotice('Timer stopped and reset.') }}><Square size={17} fill="currentColor" /></button></div></section>
        </div>
      </main>
    </div>
    {notice && <div className="dashboard-toast" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={17} /></button></div>}
    <dialog ref={dialog} aria-label={modal === 'member' ? 'Add a team member' : 'Add a project'} className="workspace-dialog" onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null) }}><div className="panel-heading"><h2>{modal === 'member' ? 'Add a team member' : 'Add a project'}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={() => setModal(null)}><X size={20} /></button></div><p className="dialog-description">Preview a new item in this demo workspace.</p><form onSubmit={event => { event.preventDefault(); setModal(null); setNotice('Demo form submitted. Changes are not saved.') }}><label>{modal === 'member' ? 'Full name' : 'Project name'}<input name="name" required autoFocus /></label><label>{modal === 'member' ? 'Role' : 'Category'}<input name="category" required /></label><div className="dialog-actions"><DashboardButton variant="outline" onClick={() => setModal(null)}>Cancel</DashboardButton><DashboardButton type="submit">Save</DashboardButton></div></form></dialog>
  </div>
}

export default App
