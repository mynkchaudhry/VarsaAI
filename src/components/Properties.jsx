import { useState, useMemo } from 'react'
import { useProjects } from '../hooks/useProjects'
import { useScrollReveal } from '../hooks/useScrollReveal'
import ProjectCard from './ProjectCard'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'On Sale', value: 'on_sale' },
]

const PAGE_SIZE = 9

function SkeletonCard() {
  return (
    <div className="glass-card rounded-[18px] overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-[rgba(255,255,255,0.05)]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-[rgba(255,255,255,0.06)] rounded w-3/4" />
        <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded w-1/2" />
        <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded w-2/3" />
        <div className="h-5 bg-[rgba(255,255,255,0.06)] rounded w-1/2 mt-1" />
        <div className="flex gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <div className="h-5 w-16 bg-[rgba(201,169,110,0.08)] rounded-full" />
          <div className="h-5 w-12 bg-[rgba(255,255,255,0.04)] rounded-full" />
        </div>
      </div>
    </div>
  )
}

function Reveal({ children }) {
  const ref = useScrollReveal()
  return <div ref={ref}>{children}</div>
}

export default function Properties() {
  const { projects, loading, error } = useProjects()
  const [activeFilter, setActiveFilter] = useState('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return projects
    if (activeFilter === 'on_sale') return projects.filter(p => p.sale_status === 'on_sale')
    return projects.filter(p =>
      p.available_unit_types?.includes(activeFilter)
    )
  }, [projects, activeFilter])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  function handleFilter(val) {
    setActiveFilter(val)
    setVisible(PAGE_SIZE)
  }

  return (
    <section id="properties" className="px-6 py-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[#C9A96E] font-medium mb-3">
                Live Listings
              </p>
            </Reveal>
            <Reveal>
              <h2
                className="font-display font-semibold leading-[1.18]"
                style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.7rem)' }}
              >
                Real projects,<br />
                <span className="text-[#C9A96E]">right now in Dubai</span>
              </h2>
            </Reveal>
          </div>
          {!loading && (
            <Reveal>
              <p className="text-muted-c text-[0.85rem]">
                {filtered.length} {filtered.length === 1 ? 'project' : 'projects'} found
              </p>
            </Reveal>
          )}
        </div>

        {/* Filter pills */}
        <Reveal>
          <div className="flex gap-2 flex-wrap mt-7" role="group" aria-label="Filter by property type">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value)}
                aria-pressed={activeFilter === f.value}
                className={`text-[0.72rem] font-medium tracking-[0.08em] uppercase px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer font-sans ${
                  activeFilter === f.value
                    ? 'bg-[#C9A96E] border-[#C9A96E] text-[#080500]'
                    : 'bg-transparent border-[rgba(255,255,255,0.1)] text-muted-c hover:border-[rgba(201,169,110,0.35)] hover:text-[#EDE9E3]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-5xl mx-auto text-center py-16">
          <p className="text-muted-c text-[0.9rem]">
            Couldn't load projects right now. The API might be taking a moment.
          </p>
          <p className="text-[0.75rem] text-muted-c mt-2 opacity-60">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
            : shown.length > 0
              ? shown.map((p) => <ProjectCard key={p.id} project={p} />)
              : (
                <div className="col-span-3 text-center py-16">
                  <p className="text-muted-c text-[0.9rem]">
                    No projects match that filter right now.
                  </p>
                </div>
              )
          }
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="bg-transparent border border-[rgba(201,169,110,0.35)] text-[#C9A96E] text-[0.78rem] font-semibold tracking-[0.1em] uppercase px-8 py-3.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-[rgba(201,169,110,0.08)] hover:border-[rgba(201,169,110,0.6)] font-sans"
          >
            Show more projects ({filtered.length - visible} remaining)
          </button>
        </div>
      )}
    </section>
  )
}
