import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500',
        outline: 'border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700/70 dark:bg-[#151e2e] dark:text-slate-100 dark:hover:bg-[#1c273b] dark:hover:border-slate-600',
        ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70',
        soft: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-[#151e2e] dark:text-slate-100 dark:hover:bg-[#1c273b]',
        danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
