import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}
