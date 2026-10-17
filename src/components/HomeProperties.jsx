import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useScrollReveal } from '../hooks/useScrollReveal'
import ProjectCard from './ProjectCard'

function Reveal({ children, delay = 0 }) {
  const ref = useScrollReveal()
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function Skeleton() {
  return (
    <div className="card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#F0EBE3]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 bg-[#F0EBE3] rounded w-1/3" />
        <div className="h-5 bg-[#E8E3DB] rounded w-3/4" />
        <div className="h-3 bg-[#F0EBE3] rounded w-1/2" />
        <div className="h-5 bg-[#E8E3DB] rounded w-2/5" />
      </div>
    </div>
  )
}

export default function HomeProperties() {
  const { projects, loading } = useProjects()
  const preview = projects.slice(0, 6)

  return (
    <section className="px-6 md:px-10 xl:px-20 py-16 bg-[#F8F5F0]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Reveal>
              <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-4">Live Listings</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="font-display font-bold text-[#0D0D0D] leading-[1.1]" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                Real projects,<br />right now in Dubai.
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-[#1A1A2E] no-underline border border-[#1A1A2E] rounded-lg px-5 py-2.5 hover:bg-[#1A1A2E] hover:text-white transition-all duration-150"
            >
              View all projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : preview.map(p => <ProjectCard key={p.id} project={p} />)
          }
        </div>

        <div className="text-center mt-8">
          <Link
            to="/properties"
            className="inline-block bg-[#1A1A2E] text-white text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl no-underline hover:bg-[#252545] transition-colors"
          >
            Explore all {projects.length || 48} projects
          </Link>
        </div>
      </div>
    </section>
  )
}
