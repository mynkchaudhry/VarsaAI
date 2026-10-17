import { useState, useCallback } from 'react'

const WELCOME = {
  id: 1,
  role: 'ai',
  text: `Hi, I'm **Varsa** — your Dubai property AI. I have live data on 48 active projects and can search Bayut + the web in real time.\n\nAsk me anything, or upload a property image and I'll analyse it for you.`,
  cards: [],
  citations: [],
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (text, image = null) => {
    if ((!text?.trim() && !image) || loading) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text?.trim() || '',
      image,
      cards: [],
      citations: [],
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text?.trim() || '',
          image: image || undefined,
          history: messages.slice(-10).map(m => ({ role: m.role, text: m.text })),
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      const { text: replyText, cards, citations } = await res.json()

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: replyText,
        cards: cards || [],
        citations: citations || [],
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: `Sorry, something went wrong: ${e.message}. Please try again.`,
        cards: [],
        citations: [],
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  return { messages, loading, send }
}
