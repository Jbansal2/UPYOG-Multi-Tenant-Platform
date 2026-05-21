import React from 'react'
import ChatAssistant from '../components/ChatAssistant'

export default function ChatPage({ dataSummary }) {
  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-lg font-semibold mb-3">AI Chat Assistant</h3>
      <ChatAssistant dataSummary={dataSummary} />
    </div>
  )
}
