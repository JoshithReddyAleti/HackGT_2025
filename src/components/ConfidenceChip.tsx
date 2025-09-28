import React from 'react'
import { CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'

interface ConfidenceChipProps {
  confidence: number
  variant?: 'default' | 'compact'
  showIcon?: boolean
}

export function ConfidenceChip({ confidence, variant = 'default', showIcon = true }: ConfidenceChipProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-emerald-400 bg-emerald-500/20'
    if (conf >= 0.7) return 'text-yellow-400 bg-yellow-500/20'
    if (conf >= 0.5) return 'text-orange-400 bg-orange-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 0.9) return <CheckCircle className="w-3 h-3" />
    if (conf >= 0.7) return <Clock className="w-3 h-3" />
    if (conf >= 0.5) return <AlertCircle className="w-3 h-3" />
    return <Zap className="w-3 h-3" />
  }

  const colorClass = getConfidenceColor(confidence)
  const icon = getConfidenceIcon(confidence)

  if (variant === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {showIcon && icon}
        {Math.round(confidence * 100)}%
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${colorClass}`}>
      {showIcon && icon}
      <span>Confidence: {Math.round(confidence * 100)}%</span>
    </div>
  )
}