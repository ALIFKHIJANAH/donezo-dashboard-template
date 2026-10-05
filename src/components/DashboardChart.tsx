import { useId, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../lib/utils'

export type ChartDatum = { id: string; label: string; value: number; color?: string; pattern?: 'solid' | 'striped'; tooltip?: ReactNode }
export type ChartLegendItem = { id: string; label: string; color?: string; pattern?: 'solid' | 'striped' }
type ChartBaseProps = {
  data: ChartDatum[]
  ariaLabel: string
  legend?: ChartLegendItem[]
  showLabels?: boolean
  className?: string
  style?: CSSProperties
  state?: 'ready' | 'loading' | 'error'
  emptyLabel?: string
  loadingLabel?: string
  errorLabel?: string
}
export type DashboardChartProps = ChartBaseProps & (
  { type: 'bar'; max?: number; height?: number; formatValue?: (value: number) => string }
  | { type: 'gauge'; value: number; label?: string; max?: number; formatValue?: (value: number) => string; strokeWidth?: number }
)

const safeValue = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0

export function DashboardChart(props: DashboardChartProps) {
  const patternId = useId().replaceAll(':', '')
  const { data, ariaLabel, legend, showLabels = true, className, style, state = 'ready', emptyLabel = 'No chart data available.', loadingLabel = 'Loading chart...', errorLabel = 'Chart could not be loaded.' } = props
  if (state !== 'ready' || !data.length) return <div className={cn('chart-state', className)} style={style} role={state === 'error' ? 'alert' : 'status'} aria-busy={state === 'loading' || undefined}>{state === 'loading' ? loadingLabel : state === 'error' ? errorLabel : emptyLabel}</div>
  const max = safeValue(props.max ?? (props.type === 'bar' ? Math.max(...data.map(item => safeValue(item.value))) : 100)) || 1
  const format = props.formatValue ?? ((value: number) => `${value}%`)
  const legendItems = legend ?? (props.type === 'gauge' ? data : [])
  let remaining = max
  const segments: Array<ChartDatum & { amount: number; end: number }> = []
  for (const item of data) {
    const amount = Math.min(safeValue(item.value), remaining)
    remaining -= amount
    segments.push({ ...item, amount, end: (max - remaining) / max * 100 })
  }
  return <div className={cn('dashboard-chart', `${props.type}-chart`, className)} style={style}>
    {props.type === 'bar' ? <div className="analytics-chart" role="img" aria-label={`${ariaLabel} ${data.map(item => `${item.label}: ${format(item.value)}`).join('. ')}`} style={props.height != null ? { height: props.height } : undefined}>
      {data.map(item => <div className="chart-column" key={item.id}><div className="chart-track"><div className={cn('chart-bar', item.pattern === 'striped' && 'chart-striped')} style={{ height: `${Math.min(safeValue(item.value) / max, 1) * 100}%`, background: item.pattern === 'striped' ? undefined : item.color ?? 'var(--chart-green)', '--chart-color': item.color ?? 'var(--stripe)' } as CSSProperties}>{item.tooltip != null && <span className="chart-tooltip">{item.tooltip}</span>}</div></div>{showLabels && <span className="chart-day">{item.label}</span>}</div>)}
    </div> : <div className="progress-gauge">
      <svg viewBox="0 0 240 135" role="img" aria-label={`${ariaLabel} ${format(Math.min(safeValue(props.value), max))}. ${data.map(item => `${item.label}: ${format(item.value)}`).join('. ')}`}>
        <defs>{data.filter(item => item.pattern === 'striped').map(item => <pattern key={item.id} id={`${patternId}-${item.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="6" height="6" className="gauge-pattern-background" /><line x1="0" y1="0" x2="0" y2="6" stroke={item.color ?? 'var(--stripe)'} strokeWidth="2" /></pattern>)}</defs>
        <path d="M 25 120 A 95 95 0 0 1 215 120" fill="none" stroke="var(--line)" strokeWidth={props.strokeWidth ?? 26} strokeLinecap="round" />
        {[...segments].reverse().filter(item => item.amount > 0).map(item => <path key={item.id} d="M 25 120 A 95 95 0 0 1 215 120" pathLength="100" fill="none" stroke={item.pattern === 'striped' ? `url(#${patternId}-${item.id})` : item.color ?? 'var(--chart-green)'} strokeWidth={props.strokeWidth ?? 26} strokeDasharray={`${item.end} 100`} strokeLinecap="round" />)}
      </svg>
      {showLabels && <div className="gauge-label"><strong>{format(Math.min(safeValue(props.value), max))}</strong>{props.label && <span>{props.label}</span>}</div>}
    </div>}
    {legendItems.length > 0 && <div className="progress-legend">{legendItems.map(item => <span key={item.id}><i aria-hidden="true" className={item.pattern === 'striped' ? 'chart-striped' : undefined} style={{ background: item.pattern === 'striped' ? undefined : item.color ?? 'var(--chart-green)', '--chart-color': item.color ?? 'var(--stripe)' } as CSSProperties} />{item.label}</span>)}</div>}
  </div>
}
