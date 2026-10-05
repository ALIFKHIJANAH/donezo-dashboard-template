import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export type SidebarItem = { id: string; label: string; icon: LucideIcon; count?: string | number; onSelect: () => void; disabled?: boolean }
export type SidebarGroup = { id: string; label: string; items: SidebarItem[] }
export type DashboardSidebarProps = {
  groups: SidebarGroup[]
  activeId?: string
  brand: ReactNode
  footer?: ReactNode
  className?: string
  contentOnly?: boolean
}

export function DashboardSidebar({ groups, activeId, brand, footer, className, contentOnly = false }: DashboardSidebarProps) {
  const content = <>{brand}{groups.map(group => <div className="navigation-group" key={group.id}>
    <p className="navigation-label">{group.label}</p><nav aria-label={group.label}>
      {group.items.map(({ id, label, icon: Icon, count, onSelect, disabled }) => <button type="button" key={id} disabled={disabled} className={cn('navigation-item', activeId === id && 'is-active')} aria-current={activeId === id ? 'page' : undefined} onClick={onSelect}>
        <Icon size={21} /><span>{label}</span>{count != null && <span className="task-count">{count}</span>}
      </button>)}
    </nav>
  </div>)}{footer}</>
  return contentOnly ? content : <aside className={cn('dashboard-sidebar', className)}>{content}</aside>
}
