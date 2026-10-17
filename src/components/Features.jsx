import { useScrollReveal } from '../hooks/useScrollReveal'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

const features = [
  {
    wide: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Live pricing context from the web',
    body: 'Varsa searches Bayut and Property Finder in real time so you can see what comparable units are actually selling and renting for — not just what one portal happens to list.',
    extra: (
      <div className="flex items-end gap-1 mt-5 h-10" aria-label="Price trend chart">
        {[40, 55, 48, 65, 58, 74, 68, 85, 80, 100].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, backgroundColor: i >= 7 ? '#1A1A2E' : '#E8E3DB' }} />
        ))}
      </div>
    ),
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    title: 'Every corner of Dubai, mapped',
    body: 'School ratings, commute times, beach access, dining scene — all weighted to your actual priorities, not just what looks good on a listing.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: 'ROI forecasts, not vibes',
    body: 'AI-generated yield predictions built from rental history, capital appreciation trends, and infrastructure data. Numbers you can actually use.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Reach out when you\'re ready',
    body: 'Found something that fits? Use the enquiry form on any property page and the developer or agent will follow up directly — no cold calls, no obligation.',
  },
  {
    wide: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Ask anything about the market',
    body: 'Not sure where to start? Just ask: "Is Downtown Dubai overheated right now?" or "Which areas are seeing price drops?" You\'ll get a straight answer — not a search page.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: 'First on new launches',
    body: 'New from EMAAR, DAMAC, Meraas? We match new projects to your saved criteria the moment they drop. Before the WhatsApp forwards.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Dubai property explained plainly',
    body: 'Ask about DLD fees, mortgage eligibility, off-plan payment structures, or what a service charge actually covers — and get a straight answer, not a 10-page guide.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: 'Talk in your language',
    body: 'Arabic, English, Russian, Hindi, Chinese — our AI understands and responds fluently. Because Dubai is for everyone.',
  },
]

export default function Features() {
  return (
    <section id="features" className="px-6 md:px-10 xl:px-20 py-16 bg-white border-t border-[#E8E3DB]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-10">
          <Reveal>
            <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-4">Capabilities</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="font-display font-bold text-[#0D0D0D] leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Powered by real<br />market intelligence.
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E3DB]">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 40}>
              <div className={`bg-[#F8F5F0] p-8 hover:bg-white transition-colors duration-200 group cursor-default ${f.wide ? 'lg:col-span-2' : ''}`}>
                <div className="w-11 h-11 rounded-xl bg-[#1A1A2E] flex items-center justify-center text-white mb-5">
                  {f.icon}
                </div>
                <h3 className="font-display text-[1.05rem] font-semibold text-[#0D0D0D] mb-2.5">{f.title}</h3>
                <p className="text-[0.85rem] text-[#888480] leading-[1.75]">{f.body}</p>
                {f.extra}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
