import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';

const QUICK_QUESTIONS = [
  'Which city has the highest total collection?',
  'How many properties are rejected in Mumbai?',
  'What percentage of Delhi properties are approved?',
  'Which city has the most pending properties?',
  'Compare total registrations between Pune and Jaipur.',
  'What is the overall recovery rate?',
];

function buildSystemPrompt(dataSummary) {
  return `You are an AI assistant for the UPYOG Property Tax Analytics platform.
You have access to property records data for 10 Indian cities. Answer questions concisely and factually.

DATASET SUMMARY (1,000 properties total):
${dataSummary}

Rules:
- Answer only based on the data above.
- Format currency as Indian Rupees (₹) with Lakh/Crore abbreviations when large.
- Be concise — 2-4 sentences max unless a detailed comparison is asked.
- If asked about something not in the data, say so politely.`;
}

export default function ChatAssistant({ dataSummary }) {
  const API = import.meta.env.VITE_API || 'http://localhost:4000';
  const MIN_THINK_TIME_MS = 900;
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can answer questions about UPYOG property records across all 10 cities — collections, approval rates, comparisons, and more. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const question = (text || input).trim();
    if (!question || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const startedAt = Date.now();

    try {
      // Build conversation history for API (skip the welcome message)
      const history = [...messages.slice(1), userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${API}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, summary: dataSummary, messages: history }),
      });

      if (!response.ok) throw new Error(`AI api error: ${response.status}`);
      const json = await response.json();
      if (!json.ok) throw new Error(json.error || 'No answer');
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINK_TIME_MS) {
        await wait(MIN_THINK_TIME_MS - elapsed);
      }
      const reply = json.answer || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINK_TIME_MS) {
        await wait(MIN_THINK_TIME_MS - elapsed);
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message}. Make sure your GROQ_API_KEY is configured in the server .env file.`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-wrapper">
      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.role} msg-row-animate`}>
            <div className={`msg-avatar ${msg.role}`}>
              {msg.role === 'assistant' ? '🏛' : '👤'}
            </div>
            <div className={`msg-bubble ${msg.role} msg-bubble-animate`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-row assistant msg-row-animate">
            <div className="msg-avatar assistant">🏛</div>
            <div className="msg-bubble assistant typing thinking-bubble">
              <div className="thinking-label">Thinking</div>
              <div className="thinking-dots">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="quick-qs">
        {QUICK_QUESTIONS.map(q => (
          <button
            key={q}
            className="quick-q"
            onClick={() => sendMessage(q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="chat-input-row">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about property data across cities…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className="chat-send"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
