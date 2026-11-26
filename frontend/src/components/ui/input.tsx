import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700/70 dark:bg-[#151e2e] dark:text-slate-100 dark:placeholder:text-slate-500',
        className,
      )}
      {...props}
    />
  )
}
