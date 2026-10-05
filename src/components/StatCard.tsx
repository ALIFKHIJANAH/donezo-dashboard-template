import type { HTMLAttributes, ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/utils'

export type StatCardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: string
  value: ReactNode
  featured?: boolean
  trend?: string | number
  trendDirection?: 'up' | 'down'
  caption?: ReactNode
  onDetails?: () => void
  detailsLabel?: string
}

export function StatCard({ title, value, featured = false, trend, trendDirection = 'up', caption, onDetails, detailsLabel = `${title} details`, className, ...props }: StatCardProps) {
  const TrendIcon = trendDirection === 'up' ? ArrowUpRight : ArrowDownRight
  return <section {...props} className={cn('stat-card', featured && 'featured-stat', className)}>
    <div className="stat-heading"><h2>{title}</h2>{onDetails && <button type="button" className="stat-detail" aria-label={detailsLabel} onClick={onDetails}><ArrowUpRight size={21} /></button>}</div>
    <p className="stat-value">{value}</p>
    {(trend != null || caption != null) && <p className="stat-caption">{trend != null && <span className="trend-badge">{trend}<TrendIcon size={10} /><span className="sr-only">{trendDirection === 'up' ? 'increase' : 'decrease'}</span></span>}{caption}</p>}
  </section>
}
