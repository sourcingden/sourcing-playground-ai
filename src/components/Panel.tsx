import { useState, type ReactNode } from 'react'

interface PanelProps {
  title: string
  icon: string
  children: ReactNode
  loading?: boolean
  className?: string
}

export function Panel({ title, icon, children, loading, className = '' }: PanelProps) {
  const [collapsed, setCollapsed] = useState(true)
  const panelId = title.toLowerCase().replace(/\s+/g, '-')

  return (
    <section
      role="region"
      aria-label={title}
      className={`glass-panel rounded-xl flex flex-col overflow-hidden transition-all duration-300 ${className}`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        aria-controls={`${panelId}-content`}
        className="flex items-center justify-between px-4 py-3 border-b border-border/50 cursor-pointer select-none hover:bg-white/5 active:bg-white/10 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setCollapsed(!collapsed)
          }
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl opacity-90" aria-hidden="true">{icon}</span>
          <h3 className="text-lg font-bold text-text tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <div
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <span className="text-text-muted text-xs" aria-hidden="true">{collapsed ? '▸' : '▾'}</span>
        </div>
      </div>
      <div 
        id={`${panelId}-content`} 
        className={`grid transition-all duration-300 ease-in-out ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}
      >
        <div className="overflow-hidden">
          <div className="p-4 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
