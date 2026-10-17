import { useScrollReveal } from '../hooks/useScrollReveal'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const steps = [
  {
    num: '01',
    title: 'Say it like a human',
    body: `Not "2BR DXB MRN" — just "I want a 2-bedroom near the beach, with a gym, under AED 2 million." We understand plain language. Turns out that's kind of the whole point.`,
  },
  {
    num: '02',
    title: 'We do the heavy lifting',
    body: 'In seconds, our AI cross-references 48 live Dubai projects with pricing data, construction timelines, amenities, and location intel. You get tea. We get busy.',
  },
  {
    num: '03',
    title: 'A shortlist, not a scroll',
    body: `Instead of 400 half-relevant results, you get the best matches that genuinely fit — with context, fair price analysis, and a direct route to the right agent.`,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 md:px-10 xl:px-20 py-16 bg-[#F8F5F0]">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* Left */}
        <div className="lg:sticky lg:top-24">
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-4">How It Works</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display font-bold text-[#0D0D0D] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Three steps to your<br />perfect match.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[0.92rem] text-[#888480] leading-[1.8] max-w-md">
              No forms. No endless filters. No agents calling you before you've had coffee. Just a real conversation with AI that knows Dubai inside out.
            </p>
          </Reveal>

          {/* Demo chat card */}
          <Reveal delay={180}>
            <div className="mt-8 card rounded-2xl overflow-hidden" aria-label="Sample AI conversation">
              <div className="bg-[#1A1A2E] px-5 py-4 flex items-center gap-3">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{flexShrink:0}}>
                  <rect width="32" height="32" rx="10" fill="rgba(255,255,255,0.12)"/>
                  <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="white"/>
                  <path d="M12 9h8L16 17 12 9z" fill="white" opacity="0.35"/>
                </svg>
                <div>
                  <p className="text-white text-[0.8rem] font-semibold leading-none mb-0.5">Varsa</p>
                  <p className="text-[#9B8B72] text-[0.62rem]">Online · 48 live Dubai projects</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80]" aria-hidden="true" />
                  <span className="text-[0.6rem] text-[#4ADE80]">Live</span>
                </div>
              </div>
              <div className="p-5 bg-[#FAFAF8] flex flex-col gap-4">
                <div className="self-end bg-[#1A1A2E] text-white text-[0.8rem] px-4 py-2.5 rounded-xl rounded-br-sm leading-relaxed max-w-[85%]">
                  2BR beach apartment, under AED 1.8M, good for investment
                </div>
                <div className="flex gap-2.5 max-w-[90%]">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{flexShrink:0, marginTop:2}}>
                    <rect width="32" height="32" rx="9" fill="#1A1A2E"/>
                    <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="white"/>
                    <path d="M12 9h8L16 17 12 9z" fill="white" opacity="0.35"/>
                  </svg>
                  <div className="bg-white border border-[#E8E3DB] text-[#3A3A3A] text-[0.8rem] px-4 py-2.5 rounded-xl rounded-bl-sm leading-relaxed shadow-card">
                    Found 3 matching projects. Top pick: Marina Gate II — 2 Bed, 1,180 sqft, AED 1.72M.
                    <br /><span className="text-[#1A1A2E] font-semibold">~6% net yield</span> based on current Dubai rental market data.
                  </div>
                </div>
                <div className="self-end bg-[#1A1A2E] text-white text-[0.8rem] px-4 py-2.5 rounded-xl rounded-br-sm leading-relaxed max-w-[85%]">
                  Can I see the other two?
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: steps */}
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={180 + i * 80}>
              <div className={`flex gap-6 items-start py-7 ${i < steps.length - 1 ? 'border-b border-[#E8E3DB]' : ''}`}>
                <div className="font-display text-[2.5rem] font-bold text-[#E8E3DB] leading-none flex-shrink-0 w-14 text-right">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-display text-[1.25rem] font-semibold text-[#0D0D0D] mb-3">{s.title}</h3>
                  <p className="text-[0.88rem] text-[#888480] leading-[1.8]">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
