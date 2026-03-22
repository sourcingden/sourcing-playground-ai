import { useState, type ReactNode } from 'react'

interface PanelProps {
  title: string
  icon: string
  children: ReactNode
  loading?: boolean
  className?: string
}

export function Panel({ title, icon, children, loading, className = '' }: PanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`bg-surface-light rounded-xl border border-border flex flex-col overflow-hidden ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer select-none hover:bg-surface-lighter/50 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          <span className="text-text-muted text-xs">{collapsed ? '▸' : '▾'}</span>
        </div>
      </div>
      {!collapsed && (
        <div className="p-4 flex-1 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  )
}
