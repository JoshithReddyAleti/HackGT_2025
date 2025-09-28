'use client'
import React, { useEffect } from 'react'
import { useCedarStore, useMessages } from 'cedar-os'
import { ApprovableResponseRenderer } from './ApprovableResponseRenderer'

// Component to enhance Cedar chat with approve/reject/edit functionality
export const EnhancedCedarChat: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { messages } = useMessages()
  const store = useCedarStore()

  // Register the approvable response renderer
  useEffect(() => {
    store.registerMessageRenderer(ApprovableResponseRenderer)
    
    // Cleanup function to unregister renderer if needed
    return () => {
      // Note: Cedar might not have an unregister function, this is just for completeness
    }
  }, [store])

  // Intercept assistant messages and convert them to approvable ones
  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    
    // Check if the latest message is from assistant and is a regular text message
    if (
      latestMessage && 
      (latestMessage.role === 'assistant' || latestMessage.role === 'bot') &&
      latestMessage.type === 'text' &&
      latestMessage.content &&
      !latestMessage.content.startsWith('✅') && // Skip system confirmations
      !latestMessage.content.startsWith('❌') &&
      !latestMessage.content.startsWith('📝')
    ) {
      // Remove the original message and replace with approvable version
      const messageIndex = messages.length - 1
      
      // Create approvable message
      const approvableMessage = {
        id: `approvable-${Date.now()}`,
        role: 'assistant' as const,
        type: 'approvable_response' as const,
        content: latestMessage.content,
        timestamp: new Date(),
        payload: {
          content: latestMessage.content,
          originalContent: latestMessage.content,
          status: 'pending' as const,
          canEdit: true,
          onApprove: () => {
            console.log('Response approved:', latestMessage.content)
          },
          onReject: () => {
            console.log('Response rejected:', latestMessage.content)
          },
          onEdit: (newContent: string) => {
            console.log('Response edited from:', latestMessage.content, 'to:', newContent)
          }
        }
      }
      
      // Replace the message in the store
      // Note: This is a simplified approach - in a real implementation,
      // you might want to use a more sophisticated message replacement strategy
      setTimeout(() => {
        // Remove original message
        const currentMessages = store.getState().messages
        const filteredMessages = currentMessages.slice(0, -1)
        
        // Update messages array
        store.setState((state) => ({
          ...state,
          messages: [...filteredMessages, approvableMessage]
        }))
      }, 100)
    }
  }, [messages, store])

  return <>{children}</>
}

export default EnhancedCedarChat