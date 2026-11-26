import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white shadow-[var(--shadow-card)] dark:border-slate-800/90 dark:bg-[#0f1623]',
        className,
      )}
      {...props}
    />
  )
}
