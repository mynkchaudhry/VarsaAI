import Layout from '../components/Layout'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const team = [
  {
    initials: 'MR',
    name: 'Maya Rashid',
    role: 'Co-founder & CEO',
    bio: 'Spent 8 years as a Dubai property agent watching buyers drown in listings and bad advice. Built VarsaAI so nobody else has to go through that.',
  },
  {
    initials: 'JP',
    name: 'James Park',
    role: 'Co-founder & CTO',
    bio: 'Ex-Google engineer obsessed with making data useful for real people. Turned Dubai\'s DLD transaction database into something actually actionable.',
  },
  {
    initials: 'SA',
    name: 'Sara Al-Mansoori',
    role: 'Head of Market Intelligence',
    bio: 'Former real estate analyst at CBRE Dubai. If there\'s a trend in the market, Sara spotted it three months before anyone else did.',
  },
]

const values = [
  {
    title: 'No fluff, just data',
    body: 'We don\'t have a "luxury lifestyle" pitch. We have 48 real projects, live pricing, and AI that tells you the truth — even if that means saying "that property is overpriced."',
  },
  {
    title: 'We\'re on your side',
    body: 'We don\'t earn commissions. We don\'t have developer partnerships that bias our results. We connect you to agents only when you ask us to. Our incentive is your best outcome.',
  },
  {
    title: 'Built for humans',
    body: 'Dubai property speaks in jargon. We translate it. No confusing filters, no 400-result pages. Just a conversation with something that actually understands what you\'re asking.',
  },
]

export default function AboutPage() {
  return (
    <Layout>
      <div className="bg-[#F8F5F0] min-h-screen">

        {/* Hero */}
        <div className="bg-white border-b border-[#E8E3DB] px-6 md:px-10 xl:px-20 pt-24 pb-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-5">Our Story</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="font-display font-bold text-[#0D0D0D] leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                We built this because<br />finding a home is hard enough.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-[#888480] text-[1rem] leading-[1.8] max-w-2xl">
                Dubai has one of the world's most exciting property markets. It also has one of the most overwhelming. Hundreds of portals, thousands of listings, agents calling at 7am, prices that change weekly. We started VarsaAI because we were tired of it too.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Story section */}
        <section className="px-6 md:px-10 xl:px-20 py-14">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Visual */}
            <Reveal>
              <div className="card rounded-3xl overflow-hidden">
                <div className="bg-[#1A1A2E] px-10 py-16 text-center">
                  <div className="font-display text-[6rem] font-bold text-white/10 leading-none mb-2">2024</div>
                  <p className="text-[#9B8B72] text-sm">Founded in Dubai</p>
                </div>
                <div className="p-8 grid grid-cols-2 gap-4">
                  {[
                    { n: '48', l: 'Live projects' },
                    { n: '12K+', l: 'Buyers helped' },
                    { n: 'AED 0', l: 'Commission earned' },
                    { n: '100%', l: 'On your side' },
                  ].map(s => (
                    <div key={s.l} className="bg-[#F8F5F0] rounded-xl p-4 text-center">
                      <div className="font-display text-xl font-bold text-[#1A1A2E]">{s.n}</div>
                      <div className="text-[0.7rem] text-[#888480] mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Story text */}
            <div>
              <Reveal>
                <h2 className="font-display text-2xl font-bold text-[#0D0D0D] mb-6">The problem we kept hitting</h2>
              </Reveal>
              {[
                'Our co-founder Maya spent 8 years as a property agent in Dubai. Every week she\'d watch buyers spend months scrolling listings, meeting agents optimised for commission — not for finding the right home.',
                'James had just moved to Dubai from London. He tried every portal, called a dozen agents, and still ended up renting somewhere that wasn\'t quite right because he ran out of energy to keep looking.',
                'So we decided to fix it. Not with another listing portal. With something that actually listens.',
              ].map((text, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="text-[#888480] text-[0.92rem] leading-[1.8] mb-4">{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 md:px-10 xl:px-20 py-12 bg-white border-y border-[#E8E3DB]">
          <div className="max-w-screen-2xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-3">What We Believe</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display text-3xl font-bold text-[#0D0D0D] mb-8">Three things that drive us.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E8E3DB]">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="bg-white p-8">
                    <div className="font-display text-[3rem] font-bold text-[#E8E3DB] leading-none mb-5">{`0${i + 1}`}</div>
                    <h3 className="font-display text-[1.1rem] font-semibold text-[#0D0D0D] mb-3">{v.title}</h3>
                    <p className="text-[#888480] text-[0.88rem] leading-[1.75]">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-6 md:px-10 xl:px-20 py-14">
          <div className="max-w-screen-2xl mx-auto">
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-3">The Team</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display text-3xl font-bold text-[#0D0D0D] mb-8">Real people. Real obsession.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <Reveal key={member.name} delay={i * 80}>
                  <div className="card card-hover rounded-2xl p-7 cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E] flex items-center justify-center font-display text-xl font-bold text-white mb-5">
                      {member.initials}
                    </div>
                    <h3 className="font-display text-[1.05rem] font-semibold text-[#0D0D0D] mb-0.5">{member.name}</h3>
                    <p className="text-[0.72rem] font-semibold text-[#1A1A2E] tracking-wide uppercase mb-4">{member.role}</p>
                    <p className="text-[#888480] text-[0.88rem] leading-[1.72]">{member.bio}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-10 xl:px-20 py-12 bg-white border-t border-[#E8E3DB]">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <h2 className="font-display text-3xl font-bold text-[#0D0D0D] mb-4">Ready to see what we built?</h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="text-[#888480] text-sm mb-6 leading-relaxed">
                48 real Dubai projects. AI that actually listens. No cold calls. No nonsense.
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
