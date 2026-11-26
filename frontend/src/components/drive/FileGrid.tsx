import { MoreVertical } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Card } from '@/components/ui/card'
import { FileIcon } from '@/components/drive/FileIcon'
import type { FileItem } from '@/data/drive-data'
import { cn } from '@/lib/utils'

export type FileSizeScale = 'xs' | 'sm' | 'md' | 'lg'

const scaleConfig: Record<FileSizeScale, {
  grid: string
  card: string
  checkbox: string
  menuBtn: string
  iconShell: string
  icon: string
  title: string
  date: string
  tagsShell: string
  tag: string
  mtCard: string
}> = {
  xs: {
    grid: 'grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-2',
    card: 'p-2.5',
    checkbox: 'h-4 w-4',
    menuBtn: '-mr-1 -mt-1 h-7 w-7',
    iconShell: 'h-10 w-10 mt-1',
    icon: 'h-5 w-5 p-1',
    title: 'text-xs min-h-8 mt-2',
    date: 'text-[10px] mt-0.5',
    tagsShell: 'mt-1.5 gap-1',
    tag: 'px-1.5 py-0.5 text-[10px]',
    mtCard: 'mt-2',
  },
  sm: {
    grid: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3',
    card: 'p-3',
    checkbox: 'h-4 w-4',
    menuBtn: '-mr-1 -mt-1 h-7 w-7',
    iconShell: 'h-12 w-12 mt-2',
    icon: 'h-7 w-7 p-1.5',
    title: 'text-xs min-h-8 mt-3',
    date: 'text-[11px] mt-1',
    tagsShell: 'mt-2 gap-1.5',
    tag: 'px-2 py-0.5 text-[11px]',
    mtCard: 'mt-3',
  },
  md: {
    grid: 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4',
    card: 'p-4',
    checkbox: 'h-4 w-4',
    menuBtn: '-mr-1 -mt-1 h-8 w-8',
    iconShell: 'h-14 w-14 sm:h-16 sm:w-16 mt-2',
    icon: 'h-8 w-8 rounded-lg p-1.5 sm:h-10 sm:w-10',
    title: 'line-clamp-2 min-h-10 text-sm font-semibold text-slate-900 mt-4 dark:text-slate-100',
    date: 'mt-1 truncate font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400',
    tagsShell: 'mt-3 flex flex-wrap justify-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300',
    tag: 'rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800',
    mtCard: 'mt-4',
  },
  lg: {
    grid: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6',
    card: 'p-6',
    checkbox: 'h-5 w-5',
    menuBtn: '-mr-2 -mt-2 h-9 w-9',
    iconShell: 'h-20 w-20 sm:h-24 sm:w-24 mt-4',
    icon: 'h-12 w-12 rounded-lg p-2.5 sm:h-14 sm:w-14',
    title: 'line-clamp-2 min-h-12 text-base font-semibold text-slate-900 mt-5 sm:text-lg dark:text-slate-100',
    date: 'mt-1.5 truncate font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400',
    tagsShell: 'mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300',
    tag: 'rounded-md bg-slate-100 px-2.5 py-1 dark:bg-slate-800',
    mtCard: 'mt-5',
  },
}

export function FileGrid({
  files,
  selectedFileIds = new Set<string>(),
  sizeScale = 'md',
  onFileContextMenu,
  onToggleFile
}: {
  files: FileItem[]
  selectedFileIds?: Set<string>
  sizeScale?: FileSizeScale
  onFileContextMenu?: (event: MouseEvent<HTMLElement>, file: FileItem) => void
  onToggleFile?: (file: FileItem) => void
}) {
  const cfg = scaleConfig[sizeScale]
  return (
    <div className={cn("mt-4 grid", cfg.grid)}>
      {files.map((file) => {
        const selected = selectedFileIds.has(file.id ?? '')
        return (
          <Card
            key={file.id ?? file.name}
            draggable
            onDragStart={(event) => { event.dataTransfer.setData('text/plain', file.id ?? ''); event.dataTransfer.effectAllowed = 'move' }}
            onClick={() => onToggleFile?.(file)}
            onContextMenu={(event) => onFileContextMenu?.(event, file)}
            className={cn(
              selected
                ? 'relative cursor-grab active:cursor-grabbing overflow-hidden file-selected transition-colors duration-150'
                : 'relative cursor-grab active:cursor-grabbing overflow-hidden transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/40',
              cfg.card
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <input type="checkbox" className={cn("shrink-0 accent-blue-600", cfg.checkbox)} checked={selected} onChange={() => onToggleFile?.(file)} onClick={(event) => event.stopPropagation()} />
              <button className={cn("flex shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800", cfg.menuBtn)} onClick={(event) => { event.stopPropagation(); onFileContextMenu?.(event, file) }} aria-label={`Open ${file.name} menu`}><MoreVertical className="h-4 w-4" /></button>
            </div>

            <div className="flex justify-center mt-2">
              <div className={cn("flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200", cfg.iconShell)}>
                <FileIcon kind={file.kind} className={cfg.icon} />
              </div>
            </div>

            <div className={cn("min-w-0 text-center", cfg.mtCard)}>
              <h3 className={cn("font-semibold text-slate-900 line-clamp-2 dark:text-slate-100", cfg.title)} title={file.name}>{file.name}</h3>
              <p className={cfg.date}>{file.date}</p>
              <div className={cn("flex flex-wrap justify-center font-medium text-slate-600 dark:text-slate-300", cfg.tagsShell)}>
                <span className={cn("rounded-md bg-slate-100 font-mono tabular-nums dark:bg-slate-800", cfg.tag)}>{file.size}</span>
                <span className={cn("max-w-full truncate rounded-md bg-slate-100 dark:bg-slate-800", cfg.tag)}>{file.access}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
