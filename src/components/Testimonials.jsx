import { useScrollReveal } from '../hooks/useScrollReveal'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const testimonials = [
  {
    initials: 'SK',
    name: 'Sarah K.',
    detail: 'Purchased in Jumeirah Village Circle',
    quote: 'I told the AI I needed something near my kids\' school in Jumeirah, max AED 3M, with a garden. Within seconds it showed me 8 villas I would never have found on my own. We closed in three weeks.',
  },
  {
    initials: 'AM',
    name: 'Ahmed M.',
    detail: 'Investor · 2 units in Business Bay',
    quote: 'I asked which 1BRs give more than 7% net yield in Dubai. Got a ranked shortlist with DLD proof. Bought two. It\'s the best financial decision I\'ve made in Dubai — and I\'ve made a few.',
  },
  {
    initials: 'EP',
    name: 'Elena P.',
    detail: 'Relocated from London · Al Barsha',
    quote: 'Moved from London with zero clue where to live. VarsaAI asked about my commute, lifestyle, budget. It suggested Al Barsha — I\'d never heard of it. Now I can\'t imagine living anywhere else.',
  },
]

export default function Testimonials() {
  return (
    <section id="stories" className="px-6 md:px-10 xl:px-20 py-16 bg-[#F8F5F0]">
      <div className="max-w-screen-2xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-4">Client Stories</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display font-bold text-[#0D0D0D] leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                Real people.<br />Real results.
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <p className="text-[0.85rem] text-[#888480] max-w-xs">No stock photo clients. No fake reviews. These are actual people, unedited.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="card card-hover rounded-2xl p-7 flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#1A1A2E" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[0.9rem] text-[#3A3A3A] leading-[1.78] mb-6 flex-1 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center font-display text-[0.75rem] font-bold text-white flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[0.85rem] font-semibold text-[#0D0D0D]">{t.name}</p>
                    <p className="text-[0.7rem] text-[#888480]">{t.detail}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
