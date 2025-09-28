'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Edit3, 
  Save, 
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { useCedarStore, useMessages } from 'cedar-os'

interface MessageActionsProps {
  message: any
  onApprove?: (content: string) => void
  onReject?: () => void
  onEdit?: (newContent: string) => void
  onAddToStream?: (content: string) => void
}

export const MessageActions: React.FC<MessageActionsProps> = ({ 
  message, 
  onApprove, 
  onReject, 
  onEdit,
  onAddToStream
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content || '')
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'edited'>('pending')
  const store = useCedarStore()

  const handleApprove = () => {
    setStatus('approved')
    onApprove?.(message.content)
    
    // Add the content to the dashboard stream
    onAddToStream?.(message.content)
    
    // Add success feedback
    store.addMessage({
      role: 'system',
      type: 'text',
      content: '✅ Response approved and added to content stream.',
      timestamp: new Date()
    })
  }

  const handleReject = () => {
    setStatus('rejected')
    onReject?.()
    
    // Add rejection feedback - no content added to stream
    store.addMessage({
      role: 'system',
      type: 'text', 
      content: '❌ Response rejected and not added to content stream.',
      timestamp: new Date()
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(message.content || '')
  }

  const handleSaveEdit = () => {
    setStatus('edited')
    setIsEditing(false)
    onEdit?.(editedContent)
    
    // Add the edited content to the dashboard stream
    onAddToStream?.(editedContent)
    
    // Add edit confirmation
    store.addMessage({
      role: 'system',
      type: 'text',
      content: '📝 Response edited and added to content stream.',
      timestamp: new Date()
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedContent(message.content || '')
  }

  // Don't show actions if already handled or if it's a system message
  if (status !== 'pending' || message.role === 'system') {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="mt-3 space-y-3"
      >
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-24 p-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              placeholder="Edit the response..."
            />
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-400 rounded-lg border border-blue-500/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-300 flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-3 h-3" />
                Save
              </motion.button>
              
              <motion.button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-3 h-3" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-600/30 rounded-xl backdrop-blur-sm"
          >
            <span className="text-xs text-slate-400 flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              How would you like to handle this response?
            </span>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleApprove}
                className="group px-3 py-1.5 bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-400 rounded-lg border border-emerald-500/40 hover:from-emerald-500/40 hover:to-green-500/40 transition-all duration-300 flex items-center gap-1 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className="w-3 h-3" />
                Approve
              </motion.button>
              
              <motion.button
                onClick={handleEdit}
                className="group px-3 py-1.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-400 rounded-lg border border-blue-500/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-300 flex items-center gap-1 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </motion.button>
              
              <motion.button
                onClick={handleReject}
                className="group px-3 py-1.5 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-400 rounded-lg border border-red-500/40 hover:from-red-500/40 hover:to-orange-500/40 transition-all duration-300 flex items-center gap-1 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown className="w-3 h-3" />
                Reject
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default MessageActions