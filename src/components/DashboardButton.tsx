import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, CircleAlert, LoaderCircle } from 'lucide-react'
import { cn } from '../lib/utils'

export type DashboardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'
  state?: 'default' | 'loading' | 'success' | 'error'
  size?: 'default' | 'small'
  icon?: ReactNode
  stateLabels?: Partial<Record<'loading' | 'success' | 'error', string>>
}

export function DashboardButton({ variant = 'primary', state = 'default', size = 'default', icon, stateLabels, children, className, disabled, type = 'button', ...props }: DashboardButtonProps) {
  const StateIcon = state === 'loading' ? LoaderCircle : state === 'success' ? Check : state === 'error' ? CircleAlert : null
  return <button {...props} type={type} disabled={disabled || state === 'loading'} aria-busy={state === 'loading' || undefined} data-state={state} className={cn('dashboard-button', `${variant}-button`, size === 'small' && 'small-button', className)}>
    {StateIcon ? <StateIcon size={18} className={state === 'loading' ? 'button-spinner' : undefined} aria-hidden="true" /> : icon}
    {variant === 'icon' ? children : <span aria-live="polite">{state !== 'default' ? stateLabels?.[state] ?? children : children}</span>}
  </button>
}
