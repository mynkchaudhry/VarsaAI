import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Layout from '../components/Layout'
import { useChat } from '../hooks/useChat'

function fmtPrice(n) {
  if (!n) return null
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`
  return `AED ${Math.round(n / 1000)}K`
}

const CARD_W = 210

function VarsaAvatar({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="9" fill="#1A1A2E"/>
      <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="white"/>
      <path d="M12 9h8L16 17 12 9z" fill="white" opacity="0.35"/>
    </svg>
  )
}

function PropertyCard({ project: p }) {
  const img = p.lobby?.[0]?.url || p.interior?.[0]?.url || p.architecture?.[0]?.url || p.cover_image?.url
  return (
    <Link to={`/properties/${p.id}`} style={{ width: CARD_W, minWidth: CARD_W }}
      className="block no-underline flex-shrink-0 snap-start rounded-xl overflow-hidden border border-[#E8E3DB] bg-white hover:shadow-md transition-shadow duration-300 group cursor-pointer">
      <div className="aspect-[4/3] bg-[#F0EBE3] overflow-hidden">
        {img
          ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCC7BF" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>}
      </div>
      <div className="p-3">
        <p className="text-[0.6rem] font-medium text-[#888480] uppercase tracking-wide mb-0.5 truncate">{p.developer}</p>
        <p className="font-display text-[0.82rem] font-semibold text-[#0D0D0D] leading-snug truncate">{p.name}</p>
        {(p.location?.district || p.location?.sector) &&
          <p className="text-[0.67rem] text-[#888480] mt-0.5 truncate">{[p.location.district, p.location.sector].filter(Boolean).join(', ')}</p>}
        {p.min_price && <p className="font-display text-[0.82rem] font-bold text-[#1A1A2E] mt-1.5">{fmtPrice(p.min_price)}</p>}
      </div>
    </Link>
  )
}

function CardSlider({ cards }) {
  const ref = useRef(null)
  const [canL, setCanL] = useState(false)
  const [canR, setCanR] = useState(false)
  const sync = useCallback(() => {
    const el = ref.current; if (!el) return
    setCanL(el.scrollLeft > 4)
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])
  useEffect(() => {
    sync(); ref.current?.addEventListener('scroll', sync, { passive: true })
    return () => ref.current?.removeEventListener('scroll', sync)
  }, [sync, cards])
  const scroll = d => ref.current?.scrollBy({ left: d * (CARD_W + 12), behavior: 'smooth' })
  return (
    <div className="mt-3 relative">
      {canL && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-white border border-[#E8E3DB] shadow flex items-center justify-center cursor-pointer hover:bg-[#F8F5F0] transition-colors border-solid">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>}
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
        {cards.map(p => <PropertyCard key={p.id} project={p} />)}
      </div>
      {canR && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white border border-[#E8E3DB] shadow flex items-center justify-center cursor-pointer hover:bg-[#F8F5F0] transition-colors border-solid">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>}
    </div>
  )
}

function SourceBadges({ citations }) {
  if (!citations?.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 items-center">
      <span className="text-[0.6rem] text-[#B8B3AC] font-sans">Sources</span>
      {citations.map((c, i) => {
        const isBayut = c.url.includes('bayut.com')
        const domain = (() => { try { return new URL(c.url).hostname.replace('www.', '') } catch { return '' } })()
        return (
          <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.65rem] font-medium no-underline border transition-colors ${
              isBayut ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                      : 'bg-[#F0EBE3] border-[#E8E3DB] text-[#666] hover:bg-[#E8E3DB]'
            }`}>
            {isBayut
              ? <span className="w-3 h-3 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0" style={{fontSize:'6px'}}>B</span>
              : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20"/></svg>}
            <span className="truncate max-w-[120px]">{c.title || domain}</span>
          </a>
        )
      })}
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-start gap-3 mb-6">
      <VarsaAvatar size={32} />
      <div className="bg-white border border-[#E8E3DB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#1A1A2E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#1A1A2E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-[#1A1A2E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[0.68rem] text-[#B8B3AC] font-sans">Searching Bayut &amp; web…</span>
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isAI = msg.role === 'ai'
  return (
    <div className={`flex items-start gap-3 mb-6 ${isAI ? '' : 'flex-row-reverse'}`}>
      {isAI
        ? <div className="flex-shrink-0 mt-0.5"><VarsaAvatar size={30} /></div>
        : <div className="w-[30px] h-[30px] rounded-full bg-[#E8E3DB] border border-[#CCC7BF] flex-shrink-0 flex items-center justify-center mt-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888480" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>}
      <div className={`${isAI ? 'flex-1 min-w-0' : 'max-w-[70%] flex flex-col items-end'}`}>
        {!isAI && msg.image && (
          <img src={msg.image} alt="Uploaded" className="mb-2 rounded-xl max-w-[180px] object-cover border border-[#E8E3DB]" />
        )}
        <div className={`text-[0.875rem] leading-[1.72] font-sans overflow-x-auto ${
          isAI
            ? 'bg-white border border-[#E8E3DB] shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 text-[#1C1917]'
            : 'bg-[#1A1A2E] text-white rounded-2xl rounded-tr-sm px-4 py-3'
        }`}>
          {isAI
            ? <div className="prose-chat"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown></div>
            : msg.text}
        </div>
        {isAI && <SourceBadges citations={msg.citations} />}
        {isAI && msg.cards?.length > 0 && <CardSlider cards={msg.cards} />}
      </div>
    </div>
  )
}

const CATEGORIES = [
  {
    label: 'Find',
    prompts: ['2BR under AED 3M near Marina', 'Studios under AED 1M in JVC', 'Villas in Dubai Hills', 'Penthouses on Palm Jumeirah'],
  },
  {
    label: 'Invest',
    prompts: ['Best areas for rental yield 2025', 'Off-plan vs ready — which is better?', 'ROI in Business Bay?', 'Dubai vs Abu Dhabi investment'],
  },
  {
    label: 'Market',
    prompts: ["Dubai property trend right now?", 'Are prices going up or down?', 'Highest growth area in Dubai?', 'Dubai vs London real estate'],
  },
  {
    label: 'Advice',
    prompts: ['How does Dubai mortgage work?', 'Fees when buying in Dubai?', 'Can expats get a property visa?', 'DLD registration process'],
  },
]

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file)
  })
}

export default function ChatPage() {
  const { messages, loading, send } = useChat()
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleImageFile(file) {
    if (!file?.type.startsWith('image/')) return
    setImage(await fileToBase64(file))
  }

  async function handlePaste(e) {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'))
    if (item) { e.preventDefault(); handleImageFile(item.getAsFile()) }
  }

  function handleSend(text) {
    const msg = text ?? input
    if (!msg?.trim() && !image) return
    send(msg?.trim() || '', image)
    setInput('')
    setImage(null)
    inputRef.current?.focus()
  }

  const hasMessages = messages.length > 1

  return (
    <Layout noFooter>
      <div className="flex bg-white" style={{ height: 'calc(100vh - 4rem)', marginTop: '4rem' }}>

        {/* ── Left sidebar ─────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-[#E8E3DB] bg-[#FAFAF8]">

          {/* Varsa identity */}
          <div className="px-5 py-5 border-b border-[#E8E3DB]">
            <div className="flex items-center gap-2.5 mb-3">
              <VarsaAvatar size={30} />
              <div>
                <p className="font-display text-[0.9rem] font-bold text-[#0D0D0D] leading-none">Varsa</p>
                <p className="text-[0.6rem] text-[#B8B3AC] font-sans mt-0.5">by VarsaAI</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F0EBE3] rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[0.6rem] text-[#888480] font-sans leading-tight">Bayut · Web search · 48 live projects</span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex border-b border-[#E8E3DB] px-4 pt-4">
            {CATEGORIES.map((c, i) => (
              <button key={c.label} onClick={() => setActiveTab(i)}
                className={`flex-1 text-center text-[0.68rem] font-semibold font-sans pb-3 border-b-2 transition-all cursor-pointer bg-transparent border-x-0 border-t-0 ${
                  activeTab === i
                    ? 'border-[#1A1A2E] text-[#1A1A2E]'
                    : 'border-transparent text-[#B8B3AC] hover:text-[#888480]'
                }`}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Prompts list */}
          <div className="flex-1 overflow-y-auto py-3 px-3" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES[activeTab].prompts.map(p => (
              <button key={p} onClick={() => handleSend(p)}
                className="w-full text-left text-[0.73rem] text-[#555] hover:text-[#0D0D0D] font-sans px-3 py-2.5 rounded-xl hover:bg-[#F0EBE3] transition-all cursor-pointer border-none bg-transparent leading-snug mb-0.5">
                {p}
              </button>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="px-3 pb-4 pt-2 border-t border-[#E8E3DB] space-y-0.5">
            <Link to="/properties" className="flex items-center gap-2 text-[0.7rem] text-[#888480] hover:text-[#0D0D0D] no-underline transition-colors py-2 px-3 rounded-xl hover:bg-[#F0EBE3]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Browse properties
            </Link>
            <Link to="/about" className="flex items-center gap-2 text-[0.7rem] text-[#888480] hover:text-[#0D0D0D] no-underline transition-colors py-2 px-3 rounded-xl hover:bg-[#F0EBE3]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              About VarsaAI
            </Link>
          </div>
        </aside>

        {/* ── Main chat column ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8F5F0]">

          {/* Top bar */}
          <div className="bg-white border-b border-[#E8E3DB] px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[0.7rem] text-[#888480] font-sans">Online · searching Bayut &amp; web for every query</span>
            </div>
            <Link to="/properties" className="hidden sm:flex items-center gap-1 text-[0.7rem] font-medium text-[#888480] hover:text-[#1A1A2E] no-underline transition-colors">
              Browse all
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Messages / empty state */}
          <div className="flex-1 overflow-y-auto">
            {!hasMessages ? (
              /* ── Welcome state ── */
              <div className="flex flex-col items-center justify-center h-full px-6 pb-10">
                <div className="mb-5">
                  <VarsaAvatar size={48} />
                </div>
                <h2 className="font-display text-[1.5rem] font-bold text-[#0D0D0D] mb-2 text-center">
                  What are you looking for?
                </h2>
                <p className="text-[#888480] text-[0.84rem] text-center max-w-xs leading-relaxed mb-8">
                  Ask anything about Dubai real estate — properties, investment, market trends, or upload an image.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                  {[
                    'Best investment areas in Dubai 2025',
                    '2BR apartment under AED 3M near Marina',
                    'How does buying in Dubai work?',
                    "What's the current market trend?",
                  ].map(q => (
                    <button key={q} onClick={() => handleSend(q)}
                      className="text-left px-4 py-3 rounded-xl border border-[#E8E3DB] bg-white hover:border-[#1A1A2E] hover:shadow-sm text-[0.78rem] text-[#3A3A3A] font-sans transition-all cursor-pointer leading-snug">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto w-full px-4 md:px-6 py-8">
                {messages.map(msg => <Message key={msg.id} msg={msg} />)}
                {loading && <TypingDots />}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* ── Input bar ── */}
          <div className="bg-white border-t border-[#E8E3DB] px-4 md:px-6 py-4 flex-shrink-0">
            <div className="max-w-2xl mx-auto">

              {/* Image preview */}
              {image && (
                <div className="mb-2.5 relative inline-block">
                  <img src={image} alt="Attached" className="h-14 w-auto rounded-lg border border-[#E8E3DB] object-cover" />
                  <button onClick={() => setImage(null)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1A1A2E] flex items-center justify-center cursor-pointer border-none">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                {/* Attach image */}
                <button onClick={() => fileRef.current?.click()} disabled={loading} title="Attach image"
                  className="w-10 h-10 rounded-xl border border-[#E8E3DB] bg-[#F8F5F0] hover:bg-[#F0EBE3] disabled:opacity-40 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888480" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleImageFile(e.target.files?.[0])} />

                {/* Text input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  onPaste={handlePaste}
                  placeholder="Ask about properties, investment, market trends…"
                  rows={1}
                  style={{ maxHeight: '120px', overflowY: 'auto' }}
                  className="flex-1 bg-[#F8F5F0] border border-[#E8E3DB] focus:border-[#1A1A2E] rounded-xl px-4 py-2.5 text-[0.875rem] text-[#0D0D0D] placeholder:text-[#C0BAB3] outline-none transition-colors font-sans resize-none leading-relaxed"
                />

                {/* Send */}
                <button onClick={() => handleSend()} disabled={(!input.trim() && !image) || loading}
                  className="w-10 h-10 rounded-xl bg-[#1A1A2E] hover:bg-[#252545] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0 cursor-pointer border-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>

              <p className="text-center text-[0.6rem] text-[#C8C3BC] mt-2 font-sans">
                Enter to send · Shift+Enter for new line · Paste image to analyse
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
