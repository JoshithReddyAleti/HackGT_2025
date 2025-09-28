import React from 'react'

export default function PanelShell({ 
  title, 
  description, 
  children,
  actions,
  className = ""
}:{
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}){
  return (
    <div className={`silk-card p-4 rounded-2xl shadow-sm border border-white/10 ${className}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          {description && <div className="text-sm text-slate-400">{description}</div>}
          <div className="text-lg font-semibold text-slate-100">{title}</div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}