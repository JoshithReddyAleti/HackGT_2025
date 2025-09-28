'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pin, 
  X, 
  ChevronDown, 
  Eye, 
  Clock, 
  Bookmark,
  Archive,
  RotateCw,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import PanelShell from './PanelShell'
import { ConfidenceChip } from './ConfidenceChip'

interface RelevanceItem {
  id: string
  kind: 'alert' | 'trend' | 'reminder' | 'insight'
  title: string
  description: string
  confidence: number
  timestamp: Date
  pinned: boolean
  dismissed: boolean
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
  metadata?: {
    patientId?: string
    department?: string
    source?: string
  }
}

interface RelevanceDigestProps {
  patientId?: string
  loading?: boolean
  onRefresh?: () => void
}

const mockRelevanceData: RelevanceItem[] = [
  {
    id: '1',
    kind: 'alert',
    title: 'Critical Lab Values',
    description: 'Elevated creatinine levels (2.3 mg/dL) - immediate attention required',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    pinned: true,
    dismissed: false,
    priority: 'high',
    tags: ['lab', 'urgent'],
    metadata: { department: 'Nephrology', source: 'LabSystem' }
  },
  {
    id: '2',
    kind: 'trend',
    title: 'Blood Pressure Trend',
    description: 'Systolic BP trending upward over past 3 visits (140→155→168)',
    confidence: 0.87,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    pinned: false,
    dismissed: false,
    priority: 'medium',
    tags: ['vitals', 'trend'],
    metadata: { department: 'Cardiology', source: 'VitalSigns' }
  },
  {
    id: '3',
    kind: 'reminder',
    title: 'Medication Review Due',
    description: 'Annual medication reconciliation overdue by 14 days',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    pinned: false,
    dismissed: false,
    priority: 'medium',
    tags: ['medication', 'review'],
    metadata: { department: 'Pharmacy', source: 'MedReconciliation' }
  },
  {
    id: '4',
    kind: 'insight',
    title: 'Care Gap Identified',
    description: 'Patient eligible for diabetes screening based on risk factors',
    confidence: 0.78,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    pinned: false,
    dismissed: false,
    priority: 'low',
    tags: ['screening', 'diabetes'],
    metadata: { department: 'Preventive Care', source: 'RiskAssessment' }
  }
]

export function RelevanceDigest({ patientId = 'Unknown', loading = false, onRefresh }: RelevanceDigestProps) {
  const [items, setItems] = useState<RelevanceItem[]>(mockRelevanceData)
  const [groupBy, setGroupBy] = useState<'kind' | 'priority' | 'none'>('kind')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKinds, setSelectedKinds] = useState<Set<string>>(new Set(['alert', 'trend', 'reminder', 'insight']))
  const [showDismissed, setShowDismissed] = useState(false)
  const [recentlyDismissed, setRecentlyDismissed] = useState<Set<string>>(new Set())

  // Filter items
  const filteredItems = items.filter(item => {
    if (!selectedKinds.has(item.kind)) return false
    if (!showDismissed && item.dismissed) return false
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Group items
  const groupedItems = React.useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Items': filteredItems }
    }
    
    return filteredItems.reduce((groups, item) => {
      let key = ''
      if (groupBy === 'kind') {
        key = item.kind.charAt(0).toUpperCase() + item.kind.slice(1) + 's'
      } else if (groupBy === 'priority') {
        key = item.priority.charAt(0).toUpperCase() + item.priority.slice(1) + ' Priority'
      }
      
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    }, {} as Record<string, RelevanceItem[]>)
  }, [filteredItems, groupBy])

  const handlePin = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, pinned: !item.pinned } : item
    ))
  }

  const handleDismiss = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, dismissed: true } : item
    ))
    setRecentlyDismissed(new Set([...recentlyDismissed, itemId]))
    
    // Auto-remove from recently dismissed after 10 seconds
    setTimeout(() => {
      setRecentlyDismissed(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 10000)
  }

  const handleUndoDismiss = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, dismissed: false } : item
    ))
    setRecentlyDismissed(prev => {
      const newSet = new Set(prev)
      newSet.delete(itemId)
      return newSet
    })
  }

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-400" />
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-400" />
      case 'reminder': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'insight': return <CheckCircle className="w-4 h-4 text-emerald-400" />
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10'
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'low': return 'border-slate-500/30 bg-slate-500/10'
      default: return 'border-slate-600/30 bg-slate-700/30'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return timestamp.toLocaleDateString()
  }

  const actions = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 w-32"
        />
        <Search className="w-3 h-3 text-slate-400 -ml-6" />
      </div>
      
      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value as any)}
        className="px-2 py-1.5 text-xs bg-slate-800/50 border border-slate-600/50 rounded text-white"
      >
        <option value="kind">Group by Kind</option>
        <option value="priority">Group by Priority</option>
        <option value="none">No Grouping</option>
      </select>
      
      <button
        onClick={onRefresh}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        title="Refresh"
      >
        <RotateCw className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  )

  return (
    <PanelShell
      title="Relevance Digest"
      description={`Contextual insights for Patient ${patientId}`}
      actions={actions}
    >
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['alert', 'trend', 'reminder', 'insight'] as const).map(kind => (
          <button
            key={kind}
            onClick={() => {
              const newSelected = new Set(selectedKinds)
              if (newSelected.has(kind)) {
                newSelected.delete(kind)
              } else {
                newSelected.add(kind)
              }
              setSelectedKinds(newSelected)
            }}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors flex items-center gap-1 ${
              selectedKinds.has(kind)
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-white'
            }`}
          >
            {getKindIcon(kind)}
            {kind.charAt(0).toUpperCase() + kind.slice(1)}s
          </button>
        ))}
        
        <button
          onClick={() => setShowDismissed(!showDismissed)}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
            showDismissed
              ? 'bg-slate-500/20 border-slate-500/30 text-slate-400'
              : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-white'
          }`}
        >
          <Archive className="w-3 h-3 mr-1" />
          Show Dismissed
        </button>
      </div>

      {/* Recently Dismissed Undo Bar */}
      <AnimatePresence>
        {recentlyDismissed.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-between"
          >
            <span className="text-sm text-orange-400">
              {recentlyDismissed.size} item(s) dismissed
            </span>
            <div className="flex gap-2">
              {Array.from(recentlyDismissed).map(itemId => (
                <button
                  key={itemId}
                  onClick={() => handleUndoDismiss(itemId)}
                  className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 transition-colors"
                >
                  Undo
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-slate-700/30 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No relevant items found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([groupName, groupItems]) => (
            <div key={groupName}>
              {groupBy !== 'none' && (
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  {groupName}
                  <span className="text-xs text-slate-500">({groupItems.length})</span>
                </h3>
              )}
              
              <div className="space-y-2">
                <AnimatePresence>
                  {groupItems
                    .sort((a, b) => {
                      // Pinned items first
                      if (a.pinned && !b.pinned) return -1
                      if (!a.pinned && b.pinned) return 1
                      // Then by priority
                      const priorityOrder = { high: 3, medium: 2, low: 1 }
                      return priorityOrder[b.priority] - priorityOrder[a.priority]
                    })
                    .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative p-4 rounded-lg border transition-all duration-200 ${getPriorityColor(item.priority)} ${
                        item.pinned ? 'ring-1 ring-blue-400/30' : ''
                      } hover:border-slate-500/50`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-1">
                          {getKindIcon(item.kind)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white line-clamp-1">
                              {item.title}
                              {item.pinned && <Pin className="w-3 h-3 inline ml-2 text-blue-400" />}
                            </h4>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handlePin(item.id)}
                                className="p-1 hover:bg-slate-600/50 rounded"
                                title={item.pinned ? 'Unpin' : 'Pin'}
                              >
                                <Pin className={`w-3 h-3 ${item.pinned ? 'text-blue-400' : 'text-slate-400'}`} />
                              </button>
                              
                              <button className="p-1 hover:bg-slate-600/50 rounded" title="Quick action">
                                <Eye className="w-3 h-3 text-slate-400" />
                              </button>
                              
                              <button
                                onClick={() => handleDismiss(item.id)}
                                className="p-1 hover:bg-slate-600/50 rounded"
                                title="Dismiss"
                              >
                                <X className="w-3 h-3 text-slate-400" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ConfidenceChip confidence={item.confidence} variant="compact" />
                              <span className="text-xs text-slate-400">
                                {formatTimeAgo(item.timestamp)}
                              </span>
                              {item.metadata?.source && (
                                <span className="text-xs text-slate-500">
                                  via {item.metadata.source}
                                </span>
                              )}
                            </div>
                            
                            {item.tags && (
                              <div className="flex items-center gap-1">
                                {item.tags.slice(0, 2).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 text-xs bg-slate-600/50 text-slate-400 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 2 && (
                                  <span className="text-xs text-slate-500">
                                    +{item.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  )
}
