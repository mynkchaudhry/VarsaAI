import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const ref = useScrollReveal()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  return (
    <section id="get-started" className="px-6 md:px-10 xl:px-20 py-12">
      <div ref={ref} className="max-w-screen-2xl mx-auto">
        <div className="bg-[#1A1A2E] rounded-3xl px-10 md:px-14 py-12 md:py-14 overflow-hidden relative">

          {/* Subtle texture */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white opacity-[0.025]" style={{ transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white opacity-[0.015]" style={{ transform: 'translate(-20%, 30%)' }} />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#9B8B72] mb-4">Get Started</p>
              <h2 className="font-display font-bold text-white leading-[1.1] mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Ready to find your<br />place in Dubai?
              </h2>
              <p className="text-[0.9rem] text-[#9B9BAA] leading-[1.78] mb-0">
                Skip the endless portals. Describe what you need and let Varsa search Bayut, live project data, and the wider web — all at once.
              </p>
            </div>

            <div>
              {done ? (
                <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-6 py-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span className="text-white text-[0.9rem]">We've got you — check your inbox</span>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4" aria-label="Get started form">
                    <input
                      type="email" required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      aria-label="Email address"
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white font-sans text-[0.9rem] outline-none focus:border-white/50 transition-colors placeholder:text-[#6E6E8A]"
                    />
                    <button
                      type="submit"
                      className="bg-white text-[#1A1A2E] font-semibold text-[0.85rem] border-none rounded-xl px-6 py-3.5 cursor-pointer whitespace-nowrap hover:bg-[#F0EBE3] transition-colors"
                    >
                      Start Free
                    </button>
                  </form>
                  <div className="flex items-center gap-3">
                    <Link to="/chat" className="text-[#9B8B72] text-[0.8rem] no-underline hover:text-white transition-colors underline-offset-2 hover:underline">
                      Or just start chatting →
                    </Link>
                  </div>
                  <p className="text-[0.68rem] text-[#555566] mt-3">No credit card · No spam · RERA compliant</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
