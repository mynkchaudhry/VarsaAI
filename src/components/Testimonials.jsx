import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const examples = [
  {
    query: 'Which areas in Dubai give the best rental yield right now?',
    answer: 'Varsa searches Bayut listings and recent DLD data to compare yields across districts — Business Bay, JVC, and Dubai Silicon Oasis typically show strong returns, though it depends on unit type and floor. Ask and get a breakdown specific to your budget.',
  },
  {
    query: 'I have AED 2M — should I buy off-plan or a ready apartment?',
    answer: 'Both have trade-offs. Off-plan usually means lower entry prices and payment plans spread over construction, but carries developer and completion risk. Ready units generate rental income immediately. Varsa walks through both options based on your investment horizon.',
  },
  {
    query: 'What fees will I pay when buying a property in Dubai?',
    answer: 'Expect around 7–8% on top of the purchase price: 4% DLD transfer fee, 2% agent commission (if applicable), plus registration and trustee fees. Varsa breaks this down by property value so you know the exact cost before you commit.',
  },
  {
    query: 'Show me 2-bedroom apartments under AED 2.5M near the Metro',
    answer: 'Varsa cross-references metro proximity with available listings on Bayut and our live project data, filtering to your budget. It returns matched options with price-per-sqft context so you can judge whether a listing is priced fairly.',
  },
]

export default function Testimonials() {
  return (
    <section id="examples" className="px-6 md:px-10 xl:px-20 py-16 bg-[#F8F5F0]">
      <div className="max-w-screen-2xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-4">What You Can Ask</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display font-bold text-[#0D0D0D] leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                Real questions.<br />Useful answers.
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <p className="text-[0.85rem] text-[#888480] max-w-xs leading-relaxed">
              Varsa handles anything from basic property search to detailed investment analysis. Here are some examples of what people ask.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {examples.map((ex, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="bg-white border border-[#E8E3DB] rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#F0EBE3] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888480" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <p className="text-[0.85rem] font-medium text-[#0D0D0D] leading-snug">"{ex.query}"</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                      <rect width="32" height="32" rx="9" fill="#1A1A2E"/>
                      <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="white"/>
                      <path d="M12 9h8L16 17 12 9z" fill="white" opacity="0.35"/>
                    </svg>
                  </div>
                  <p className="text-[0.82rem] text-[#555] leading-[1.72]">{ex.answer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <Link to="/chat"
              className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white text-[0.82rem] font-semibold px-7 py-3.5 rounded-xl no-underline hover:bg-[#252545] transition-colors">
              Try asking Varsa
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
