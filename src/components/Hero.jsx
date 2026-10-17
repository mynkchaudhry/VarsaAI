import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const placeholders = [
  '2-bedroom near Dubai Marina, under AED 2M…',
  'Villa with a pool on Palm Jumeirah, family of 4…',
  'Best rental yield apartment under AED 800K…',
  'Studio near DIFC, furnished preferred…',
  'Penthouse with Burj Khalifa views…',
]

const areas = ['Marina', 'Downtown', 'Palm', 'JBR', 'Business Bay', 'DIFC', 'Dubai Hills']

export default function Hero() {
  const [value, setValue] = useState('')
  const [phIdx, setPhIdx] = useState(0)
  const [phText, setPhText] = useState('')
  const deletingRef = useRef(false)
  const chIdxRef = useRef(0)
  const timerRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function type() {
      const cur = placeholders[phIdx]
      if (deletingRef.current) {
        chIdxRef.current--
        setPhText(cur.slice(0, chIdxRef.current))
        if (chIdxRef.current === 0) {
          deletingRef.current = false
          setPhIdx(i => (i + 1) % placeholders.length)
          timerRef.current = setTimeout(type, 450)
          return
        }
        timerRef.current = setTimeout(type, 22)
      } else {
        chIdxRef.current++
        setPhText(cur.slice(0, chIdxRef.current))
        if (chIdxRef.current === cur.length) {
          deletingRef.current = true
          timerRef.current = setTimeout(type, 2800)
          return
        }
        timerRef.current = setTimeout(type, 48)
      }
    }
    timerRef.current = setTimeout(type, 500)
    return () => clearTimeout(timerRef.current)
  }, [phIdx])

  function handleSearch(msg) {
    const q = msg || value
    if (!q.trim()) { inputRef.current?.focus(); return }
    navigate('/chat', { state: { initialMessage: q.trim() } })
  }

  return (
    <section className="bg-[#F8F5F0] px-6 md:px-10 xl:px-20 pt-24 pb-16 relative overflow-hidden">

      {/* Background texture marks */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#1A1A2E] opacity-[0.025]" style={{ transform: 'translate(30%, -20%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1A1A2E] opacity-[0.02]" style={{ transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left: text + search */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-[#EEEEF6] rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-hidden="true" />
            <span className="text-[0.72rem] font-semibold text-[#1A1A2E] tracking-wide">48 Live Dubai Projects</span>
          </div>

          <h1 className="font-display font-bold text-[#0D0D0D] leading-[1.08] tracking-tight mb-5" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
            Find your<br />
            <em className="not-italic text-[#1A1A2E]">Dubai home</em><br />
            by just talking.
          </h1>

          <p className="text-[#888480] text-[1rem] leading-[1.75] mb-7 max-w-md">
            Describe what you want in plain English. Our AI reads 48 real Dubai projects, real prices, real data — and surfaces exactly what fits.
          </p>

          {/* Search box */}
          <div className="rounded-2xl bg-white border border-[#E8E3DB] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
            <textarea
              ref={inputRef}
              rows={2}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch() } }}
              placeholder={phText || 'Tell us what you want…'}
              aria-label="Describe your property requirements"
              className="w-full bg-transparent border-none outline-none text-[#0D0D0D] font-sans text-[0.95rem] leading-[1.6] resize-none px-5 pt-4 pb-3 placeholder:text-[#B8B3AC]"
            />
            <div className="flex items-center justify-between px-4 pb-3.5 pt-0">
              <div className="flex gap-2 flex-wrap">
                {['Apartment', 'Villa', 'Penthouse'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setValue(v => v ? `${v}, ${tag.toLowerCase()}` : tag.toLowerCase())}
                    className="text-[0.68rem] font-medium bg-[#F0EBE3] text-[#3A3A3A] border border-[#E8E3DB] px-3 py-1 rounded-full cursor-pointer hover:bg-[#E8E3DB] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleSearch()}
                className="bg-[#1A1A2E] text-white w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none hover:bg-[#252545] transition-colors flex-shrink-0"
                aria-label="Search"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Area pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-[0.72rem] text-[#888480] py-1.5 mr-1">Browse by area:</span>
            {areas.map(a => (
              <button
                key={a}
                onClick={() => handleSearch(`Show me properties in ${a}`)}
                className="text-[0.72rem] font-medium text-[#3A3A3A] border border-[#E8E3DB] bg-white px-3 py-1.5 rounded-full cursor-pointer hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-colors"
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Right: visual block */}
        <div className="hidden lg:block animate-[fade-up_.6s_.15s_ease_both]">
          <div className="relative">
            {/* Big stat card */}
            <div className="card rounded-3xl p-8 mb-4">
              <p className="text-[0.7rem] font-semibold text-[#888480] uppercase tracking-widest mb-2">Market Pulse · Live</p>
              <div className="font-display text-[3.5rem] font-bold text-[#0D0D0D] leading-none mb-3">48</div>
              <p className="text-[0.88rem] text-[#888480]">Active project listings across Dubai's prime districts — updated in real time.</p>
              <div className="mt-6 flex items-end gap-1 h-12" aria-label="Activity chart">
                {[35, 52, 44, 68, 55, 82, 70, 90, 78, 100, 88, 96].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i >= 9 ? '#1A1A2E' : '#E8E3DB',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Two small stat tiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card rounded-2xl p-5">
                <div className="font-display text-[2rem] font-bold text-[#1A1A2E] leading-none mb-1">6.4%</div>
                <p className="text-[0.75rem] text-[#888480]">Dubai avg. rental yield</p>
              </div>
              <div className="card rounded-2xl p-5">
                <div className="font-display text-[2rem] font-bold text-[#1A1A2E] leading-none mb-1">AED 0</div>
                <p className="text-[0.75rem] text-[#888480]">Commission charged</p>
              </div>
            </div>

            {/* Floating AI bubble */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 card rounded-2xl p-4 max-w-[200px] shadow-card-lg" aria-hidden="true">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[0.5rem] font-bold">AI</span>
                </div>
                <span className="text-[0.65rem] font-semibold text-[#0D0D0D]">Varsa</span>
              </div>
              <p className="text-[0.7rem] text-[#888480] leading-relaxed">Found 3 exact matches — all under budget, Marina views.</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  )
}
