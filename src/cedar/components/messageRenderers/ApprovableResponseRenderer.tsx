'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  X, 
  Edit3, 
  Save, 
  RotateCcw,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'
import { createMessageRenderer, CustomMessage, useCedarStore } from 'cedar-os'
import MarkdownRenderer from '@/cedar/components/chatMessages/MarkdownRenderer'

// Define message type for responses that need approval
type ApprovableMessage = CustomMessage<
  'approvable_response',
  {
    content: string
    originalContent?: string
    status: 'pending' | 'approved' | 'rejected' | 'edited'
    canEdit?: boolean
    onApprove?: () => void
    onReject?: () => void
    onEdit?: (newContent: string) => void
  }
>

interface ApprovableResponseProps {
  message: ApprovableMessage
}

const ApprovableResponse: React.FC<ApprovableResponseProps> = ({ message }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.payload?.content || '')
  const [status, setStatus] = useState(message.payload?.status || 'pending')
  const store = useCedarStore()

  const handleApprove = () => {
    setStatus('approved')
    message.payload?.onApprove?.()
    
    // Add a success message to the chat
    store.addMessage({
      role: 'system',
      type: 'text',
      content: '✅ Response approved and accepted.'
    })
  }

  const handleReject = () => {
    setStatus('rejected')
    message.payload?.onReject?.()
    
    // Add a rejection message
    store.addMessage({
      role: 'system', 
      type: 'text',
      content: '❌ Response rejected and dismissed.'
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(message.payload?.content || '')
  }

  const handleSaveEdit = () => {
    setStatus('edited')
    setIsEditing(false)
    message.payload?.onEdit?.(editedContent)
    
    // Update the message content and add confirmation
    store.addMessage({
      role: 'assistant',
      type: 'text', 
      content: editedContent
    })
    
    store.addMessage({
      role: 'system',
      type: 'text',
      content: '📝 Response edited and updated.'
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedContent(message.payload?.content || '')
  }

  // Don't render if rejected
  if (status === 'rejected') {
    return (
      <motion.div
        initial={{ opacity: 1, height: 'auto' }}
        animate={{ opacity: 0, height: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          Response was rejected and removed
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {/* Main Response Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
          status === 'approved' 
            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20' 
            : status === 'edited'
            ? 'bg-blue-500/10 border-blue-500/30 shadow-blue-500/20'
            : 'bg-slate-700/30 border-slate-600/40'
        }`}
      >
        {/* Status Badge */}
        <AnimatePresence>
          {status !== 'pending' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium border ${
                status === 'approved' 
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : status === 'edited'
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                  : ''
              }`}
            >
              {status === 'approved' && (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Approved
                </span>
              )}
              {status === 'edited' && (
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  Edited
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 p-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Edit the response..."
              />
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-400 rounded-lg border border-blue-500/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
                
                <motion.button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50 hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="flex-shrink-0"
                >
                  <Sparkles className="w-5 h-5 text-cyan-400 mt-1" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <MarkdownRenderer content={message.payload?.content || ''} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons - Only show if pending */}
      <AnimatePresence>
        {status === 'pending' && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3 p-3 bg-slate-800/30 border border-slate-600/30 rounded-xl backdrop-blur-sm"
          >
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              How would you like to handle this response?
            </span>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleApprove}
                className="group px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-400 rounded-lg border border-emerald-500/40 hover:from-emerald-500/40 hover:to-green-500/40 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Approve
              </motion.button>
              
              {message.payload?.canEdit !== false && (
                <motion.button
                  onClick={handleEdit}
                  className="group px-4 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-400 rounded-lg border border-blue-500/40 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Edit
                </motion.button>
              )}
              
              <motion.button
                onClick={handleReject}
                className="group px-4 py-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-400 rounded-lg border border-red-500/40 hover:from-red-500/40 hover:to-orange-500/40 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Reject
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Create the message renderer
export const ApprovableResponseRenderer = createMessageRenderer<ApprovableMessage>({
  type: 'approvable_response',
  namespace: 'response-actions',
  render: (message) => <ApprovableResponse message={message} />,
  validateMessage: (msg): msg is ApprovableMessage => {
    return msg.type === 'approvable_response'
  }
})

export default ApprovableResponseRenderer