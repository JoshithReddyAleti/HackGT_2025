'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Filter, 
  Search,
  RotateCcw,
  CheckSquare,
  Square,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  SortDesc,
  Calendar,
  Tag,
  Eye
} from 'lucide-react'
import PanelShell from './PanelShell'
import { ConfidenceChip } from './ConfidenceChip'

interface EscalationItem {
  id: string
  title: string
  description: string
  confidence: number
  status: 'pending' | 'reviewed' | 'approved' | 'overridden'
  priority: 'low' | 'medium' | 'high' | 'critical'
  submittedBy: string
  submittedAt: Date
  slaDeadline: Date
  category: string
  patientId?: string
  tags: string[]
  selected?: boolean
  escalationType: 'clinical' | 'billing' | 'administrative' | 'technical'
}

interface EscalationInboxProps {
  loading?: boolean
  onRefresh?: () => void
}

const mockEscalations: EscalationItem[] = [
  {
    id: '1',
    title: 'Unusual medication interaction detected',
    description: 'Patient prescribed conflicting medications - warfarin and aspirin combination exceeds safety threshold',
    confidence: 0.94,
    status: 'pending',
    priority: 'critical',
    submittedBy: 'Dr. Sarah Chen',
    submittedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 30), // 30 min from now
    category: 'Drug Safety',
    patientId: 'PT-2024-001',
    tags: ['medication', 'interaction', 'safety'],
    escalationType: 'clinical'
  },
  {
    id: '2',
    title: 'Insurance authorization required',
    description: 'MRI scan requires pre-authorization - patient insurance plan change detected',
    confidence: 0.87,
    status: 'pending',
    priority: 'high',
    submittedBy: 'Billing System',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
    category: 'Insurance',
    patientId: 'PT-2024-002',
    tags: ['billing', 'authorization', 'mri'],
    escalationType: 'billing'
  },
  {
    id: '3',
    title: 'Lab result critical value',
    description: 'Troponin level 15.2 ng/mL (critical high) - possible cardiac event',
    confidence: 0.96,
    status: 'reviewed',
    priority: 'critical',
    submittedBy: 'Lab System',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    slaDeadline: new Date(Date.now() - 1000 * 60 * 60 * 3), // Overdue by 1 hour
    category: 'Lab Results',
    patientId: 'PT-2024-003',
    tags: ['lab', 'cardiac', 'critical'],
    escalationType: 'clinical'
  },
  {
    id: '4',
    title: 'Appointment scheduling conflict',
    description: 'Double booking detected for OR-3 tomorrow at 2 PM - two surgeries scheduled',
    confidence: 0.89,
    status: 'pending',
    priority: 'medium',
    submittedBy: 'Scheduling System',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 18), // 18 hours from now
    category: 'Scheduling',
    tags: ['scheduling', 'conflict', 'surgery'],
    escalationType: 'administrative'
  }
]

export function EscalationInbox({ loading = false, onRefresh }: EscalationInboxProps) {
  const [items, setItems] = useState<EscalationItem[]>(mockEscalations)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [slaFilter, setSlaFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'submitted'>('deadline')
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // Get all unique tags
  const allTags = Array.from(new Set(items.flatMap(item => item.tags)))

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false
      if (slaFilter === 'overdue' && item.slaDeadline > new Date()) return false
      if (slaFilter === 'due-soon' && (item.slaDeadline > new Date(Date.now() + 1000 * 60 * 60 * 4) || item.slaDeadline < new Date())) return false
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (selectedTags.size > 0 && !item.tags.some(tag => selectedTags.has(tag))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return a.slaDeadline.getTime() - b.slaDeadline.getTime()
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      if (sortBy === 'submitted') return b.submittedAt.getTime() - a.submittedAt.getTime()
      return 0
    })

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)))
    }
  }

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleQuickApprove = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: 'approved' } : item
    ))
  }

  const handleQuickOverride = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, status: 'overridden' } : item
    ))
  }

  const handleBulkApprove = () => {
    setItems(items.map(item => 
      selectedItems.has(item.id) ? { ...item, status: 'approved' } : item
    ))
    setSelectedItems(new Set())
    setShowBulkModal(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'reviewed': return 'text-blue-400'
      case 'approved': return 'text-emerald-400'
      case 'overridden': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getSlaStatus = (deadline: Date) => {
    const now = new Date()
    const timeLeft = deadline.getTime() - now.getTime()
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    
    if (timeLeft < 0) return { status: 'overdue', text: 'Overdue', color: 'text-red-400' }
    if (hoursLeft < 4) return { status: 'due-soon', text: `${hoursLeft}h left`, color: 'text-orange-400' }
    return { status: 'ok', text: `${hoursLeft}h left`, color: 'text-slate-400' }
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
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs text-slate-400">{selectedItems.size} selected</span>
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3 py-1.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
          >
            Bulk Action
          </button>
        </motion.div>
      )}
      
      <div className="flex items-center gap-1">
        <input
          type="text"
          placeholder="Search escalations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 w-40"
        />
        <Search className="w-3 h-3 text-slate-400 -ml-6" />
      </div>
      
      <button
        onClick={onRefresh}
        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        title="Refresh"
      >
        <RotateCcw className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  )

  return (
    <PanelShell
      title="Escalation Inbox"
      description={`${filteredItems.filter(i => i.status === 'pending').length} pending escalations`}
      actions={actions}
    >
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="overridden">Overridden</option>
        </select>
        
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select
          value={slaFilter}
          onChange={(e) => setSlaFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
        >
          <option value="all">All SLA</option>
          <option value="overdue">Overdue</option>
          <option value="due-soon">Due Soon</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 text-sm bg-slate-800/50 border border-slate-600/50 rounded text-white"
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="submitted">Sort by Submitted</option>
        </select>
      </div>

      {/* Tag Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              const newSelected = new Set(selectedTags)
              if (newSelected.has(tag)) {
                newSelected.delete(tag)
              } else {
                newSelected.add(tag)
              }
              setSelectedTags(newSelected)
            }}
            className={`px-2 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 ${
              selectedTags.has(tag)
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3 h-3" />
            {tag}
          </button>
        ))}
      </div>

      {/* Selection Header */}
      {filteredItems.length > 0 && (
        <div className="flex items-center gap-2 py-2 border-b border-slate-700/50 mb-4">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {selectedItems.size === filteredItems.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All ({filteredItems.length})
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            <SortDesc className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Sorted by {sortBy}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-700/30 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No escalations match current filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const slaStatus = getSlaStatus(item.slaDeadline)
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group p-4 rounded-lg border transition-all duration-200 ${
                    selectedItems.has(item.id)
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleSelectItem(item.id)}
                      className="mt-1"
                    >
                      {selectedItems.has(item.id) ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 hover:text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-medium text-white line-clamp-1">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(item.id)}
                                className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400"
                                title="Quick Approve"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleQuickOverride(item.id)}
                                className="p-1 hover:bg-red-500/20 rounded text-red-400"
                                title="Quick Override"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          
                          <button className="p-1 hover:bg-slate-600/50 rounded">
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                          
                          <button className="p-1 hover:bg-slate-600/50 rounded">
                            <MoreHorizontal className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                          
                          <span className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          
                          <ConfidenceChip confidence={item.confidence} variant="compact" />
                          
                          <span className={`text-xs ${slaStatus.color}`}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {slaStatus.text}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <User className="w-3 h-3" />
                          <span>{item.submittedBy}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(item.submittedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {item.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-xs bg-slate-600/50 text-slate-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Bulk Action Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowBulkModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Bulk Actions ({selectedItems.size} items)
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleBulkApprove}
                  className="w-full p-3 text-left bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Approve All Selected
                </button>
                
                <button
                  onClick={() => {
                    setItems(items.map(item => 
                      selectedItems.has(item.id) ? { ...item, status: 'overridden' } : item
                    ))
                    setSelectedItems(new Set())
                    setShowBulkModal(false)
                  }}
                  className="w-full p-3 text-left bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                >
                  <Flag className="w-4 h-4 inline mr-2" />
                  Override All Selected
                </button>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PanelShell>
  )
}
