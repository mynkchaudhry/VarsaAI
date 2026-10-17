import Layout from '../components/Layout'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const capabilities = [
  {
    title: 'Conversational property search',
    body: 'Describe what you want in plain language — area, budget, bedrooms, lifestyle — and Varsa finds matching projects from its live database, cross-referenced with Bayut listings.',
  },
  {
    title: 'Investment and yield analysis',
    body: 'Ask about ROI, rental yields, capital appreciation trends, or how to compare off-plan vs ready property. Varsa pulls current market data from Bayut, DLD reports, and property research sources.',
  },
  {
    title: 'Market questions answered',
    body: "Which areas are seeing price growth? Is now a good time to buy? What's happening in Business Bay? Varsa searches recent news and market data to give you a grounded answer.",
  },
  {
    title: 'Image-based property analysis',
    body: 'Upload a screenshot of a listing or a property photo and Varsa will analyse what it sees — unit type, quality tier, notable features — and help you find similar options.',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Powered by OpenAI',
    body: "Varsa uses OpenAI's GPT-4o mini model — a capable, cost-efficient AI that handles both text and images. It's the same underlying technology as ChatGPT, applied specifically to Dubai real estate.",
  },
  {
    step: '02',
    title: 'Live data on every query',
    body: 'Every conversation triggers a real-time web search. Varsa looks at Bayut.com for current listings, searches for recent DLD and market reports, and pulls in relevant property news — not cached data from months ago.',
  },
  {
    step: '03',
    title: 'Our own project database',
    body: 'We maintain a live feed of 48 active Dubai development projects through the Reelly platform. These are cross-referenced with your query to surface relevant options alongside web results.',
  },
]

export default function AboutPage() {
  return (
    <Layout>
      <div className="bg-[#F8F5F0] min-h-screen">

        {/* Hero */}
        <div className="bg-white border-b border-[#E8E3DB] px-6 md:px-10 xl:px-20 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-5">About VarsaAI</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="font-display font-bold text-[#0D0D0D] leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
                A smarter way to search<br />Dubai real estate.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-[#888480] text-[1rem] leading-[1.8] max-w-2xl">
                VarsaAI is an AI-powered property search tool built for Dubai. Instead of scrolling through hundreds of listings and filtering by specs you're not sure about, you describe what you want — and Varsa finds it, explains the market context, and answers your follow-up questions.
              </p>
            </Reveal>
          </div>
        </div>

        {/* What it does */}
        <section className="px-6 md:px-10 xl:px-20 py-14">
          <div className="max-w-screen-2xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-3">What Varsa Can Do</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display text-2xl font-bold text-[#0D0D0D] mb-8">Useful for buyers, renters, and investors.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {capabilities.map((c, i) => (
                <Reveal key={c.title} delay={i * 60}>
                  <div className="bg-white border border-[#E8E3DB] rounded-2xl p-6">
                    <h3 className="font-display text-[1rem] font-semibold text-[#0D0D0D] mb-2">{c.title}</h3>
                    <p className="text-[#888480] text-[0.88rem] leading-[1.75]">{c.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — honest */}
        <section className="px-6 md:px-10 xl:px-20 py-12 bg-white border-y border-[#E8E3DB]">
          <div className="max-w-screen-2xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-3">How It Works</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display text-2xl font-bold text-[#0D0D0D] mb-8">What's actually running behind the scenes.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((h, i) => (
                <Reveal key={h.step} delay={i * 80}>
                  <div>
                    <div className="font-display text-[2.5rem] font-bold text-[#E8E3DB] leading-none mb-4">{h.step}</div>
                    <h3 className="font-display text-[1rem] font-semibold text-[#0D0D0D] mb-2">{h.title}</h3>
                    <p className="text-[#888480] text-[0.88rem] leading-[1.75]">{h.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Honest disclaimers */}
        <section className="px-6 md:px-10 xl:px-20 py-14">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-[#0D0D0D] mb-6">A few things worth knowing.</h2>
            </Reveal>
            {[
              {
                title: 'This is a search and research tool, not a licensed agent.',
                body: "VarsaAI helps you explore the market, understand pricing, and shortlist properties. For legal, financial, or transaction advice, always consult a qualified professional or RERA-registered agent.",
              },
              {
                title: 'Market data is sourced from the web in real time.',
                body: 'Varsa searches Bayut and other public sources each time you ask a question. Listings change frequently — always verify availability and pricing directly with the developer or agent before making decisions.',
              },
              {
                title: 'No commission, no referral fees.',
                body: 'VarsaAI does not earn commission from developers or agents. The enquiry form on property pages connects you directly — we have no financial relationship with who responds.',
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`py-6 ${i < 2 ? 'border-b border-[#E8E3DB]' : ''}`}>
                  <h3 className="font-display text-[0.95rem] font-semibold text-[#0D0D0D] mb-2">{item.title}</h3>
                  <p className="text-[#888480] text-[0.88rem] leading-[1.75]">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10 xl:px-20 py-12 bg-white border-t border-[#E8E3DB]">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-[#0D0D0D] mb-4">Try it for yourself.</h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="text-[#888480] text-sm mb-7 leading-relaxed">
                Ask a property question, search by area and budget, or upload an image — no account needed.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/chat" className="bg-[#1A1A2E] text-white text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl no-underline hover:bg-[#252545] transition-colors">
                  Start chatting
                </Link>
                <Link to="/properties" className="border border-[#1A1A2E] text-[#1A1A2E] text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl no-underline hover:bg-[#1A1A2E] hover:text-white transition-all">
                  Browse properties
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </Layout>
  )
}
