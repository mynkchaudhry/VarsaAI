import { useState, useMemo, lazy, Suspense } from 'react'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { useProjects } from '../hooks/useProjects'

const PropertiesMapView = lazy(() => import('../components/PropertiesMapView'))

const TYPE_FILTERS = ['All', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio']
const SORT_OPTIONS = [
  { value: 'default',     label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'completion', label: 'Completion Date' },
]

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

export default function PropertiesPage() {
  const { projects, loading, error } = useProjects()

  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [maxBudget,  setMaxBudget]  = useState('')
  const [saleStatus, setSaleStatus] = useState('all')
  const [sortBy,     setSortBy]     = useState('default')
  const [visible,    setVisible]    = useState(12)
  const [viewMode,   setViewMode]   = useState('grid') // 'grid' | 'map'

  const filtered = useMemo(() => {
    let pool = [...projects]

    if (search.trim()) {
      const q = search.toLowerCase()
      pool = pool.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.developer?.toLowerCase().includes(q) ||
        p.location?.district?.toLowerCase().includes(q) ||
        p.location?.sector?.toLowerCase().includes(q)
      )
    }

    if (typeFilter !== 'All') {
      pool = pool.filter(p => p.available_unit_types?.includes(typeFilter.toLowerCase()))
    }

    if (saleStatus !== 'all') {
      pool = pool.filter(p => p.sale_status === saleStatus)
    }

    if (maxBudget) {
      const cap = parseFloat(maxBudget) * 1_000_000
      pool = pool.filter(p => !p.min_price || p.min_price <= cap)
    }

    if (sortBy === 'price_asc')  pool.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
    if (sortBy === 'price_desc') pool.sort((a, b) => (b.min_price || 0) - (a.min_price || 0))
    if (sortBy === 'completion')
      pool.sort((a, b) => new Date(a.construction_end_date || '9999') - new Date(b.construction_end_date || '9999'))

    return pool
  }, [projects, search, typeFilter, saleStatus, maxBudget, sortBy])

  const shown = filtered.slice(0, visible)
  const hasFilters = search || typeFilter !== 'All' || maxBudget || saleStatus !== 'all'

  function reset() {
    setSearch(''); setTypeFilter('All'); setMaxBudget('')
    setSaleStatus('all'); setSortBy('default'); setVisible(12)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F5F0]">

        {/* Page header */}
        <div className="bg-white border-b border-[#E8E3DB] px-6 md:px-10 xl:px-20 pt-20 pb-5">
          <div className="max-w-screen-2xl mx-auto">
            <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#1A1A2E] mb-2">All Listings</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0D0D0D] leading-tight">
                  Dubai Properties
                </h1>
                <p className="text-[#888480] text-sm mt-2">
                  {loading ? 'Loading…' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex rounded-lg border border-[#E8E3DB] overflow-hidden bg-white shadow-card">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2.5 flex items-center gap-1.5 text-[0.75rem] font-medium transition-colors cursor-pointer border-none ${viewMode === 'grid' ? 'bg-[#1A1A2E] text-white' : 'bg-white text-[#888480] hover:text-[#0D0D0D]'}`}
                    aria-label="Grid view"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-2.5 flex items-center gap-1.5 text-[0.75rem] font-medium transition-colors cursor-pointer border-none ${viewMode === 'map' ? 'bg-[#1A1A2E] text-white' : 'bg-white text-[#888480] hover:text-[#0D0D0D]'}`}
                    aria-label="Map view"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
                    </svg>
                    Map
                  </button>
                </div>

                {viewMode === 'grid' && (
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-white border border-[#E8E3DB] rounded-lg px-4 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#1A1A2E] cursor-pointer font-sans shadow-card"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 xl:px-20 py-6 max-w-screen-2xl mx-auto">

          {/* Search + filters */}
          <div className="bg-white card rounded-2xl p-4 mb-6">
            {/* Search bar */}
            <div className="relative mb-3">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888480]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisible(12) }}
                placeholder="Search by name, developer, or area…"
                className="w-full bg-[#F8F5F0] border border-[#E8E3DB] rounded-xl pl-11 pr-4 py-3 text-sm text-[#0D0D0D] placeholder:text-[#B8B3AC] outline-none focus:border-[#1A1A2E] transition-colors font-sans"
              />
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type pills */}
              <div className="flex gap-1.5 flex-wrap">
                {TYPE_FILTERS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTypeFilter(t); setVisible(12) }}
                    className={`text-[0.72rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer font-sans ${
                      typeFilter === t
                        ? 'bg-[#1A1A2E] border-[#1A1A2E] text-white'
                        : 'bg-white border-[#E8E3DB] text-[#3A3A3A] hover:border-[#1A1A2E] hover:text-[#1A1A2E]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="h-5 w-px bg-[#E8E3DB] mx-1 hidden sm:block" aria-hidden="true" />

              {/* Sale status */}
              <select
                value={saleStatus}
                onChange={e => { setSaleStatus(e.target.value); setVisible(12) }}
                className="bg-white border border-[#E8E3DB] rounded-full px-3.5 py-1.5 text-[0.72rem] text-[#3A3A3A] outline-none cursor-pointer font-sans hover:border-[#1A1A2E] transition-colors"
              >
                <option value="all">Any Status</option>
                <option value="on_sale">On Sale</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="sold_out">Sold Out</option>
              </select>

              {/* Max budget */}
              <div className="flex items-center gap-2 bg-white border border-[#E8E3DB] rounded-full px-3.5 py-1.5 hover:border-[#1A1A2E] transition-colors">
                <span className="text-[0.72rem] text-[#888480] font-sans">Max AED</span>
                <input
                  type="number"
                  value={maxBudget}
                  onChange={e => { setMaxBudget(e.target.value); setVisible(12) }}
                  placeholder="e.g. 5 (M)"
                  className="w-20 bg-transparent border-none outline-none text-[0.72rem] text-[#0D0D0D] font-sans placeholder:text-[#B8B3AC]"
                />
                <span className="text-[0.72rem] text-[#888480]">M</span>
              </div>

              {hasFilters && (
                <button
                  onClick={reset}
                  className="text-[0.72rem] text-[#888480] hover:text-[#1A1A2E] transition-colors font-sans cursor-pointer bg-transparent border-none underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {error ? (
            <div className="text-center py-24">
              <p className="text-[#888480] text-sm">Couldn't load listings right now. Try refreshing.</p>
            </div>
          ) : viewMode === 'map' ? (
            <Suspense fallback={<div className="h-[560px] rounded-2xl bg-[#F0EBE3] animate-pulse" />}>
              <PropertiesMapView projects={filtered} />
              <p className="text-center text-[0.75rem] text-[#888480] mt-3">
                {filtered.length} project{filtered.length !== 1 ? 's' : ''} shown · Click a pin to preview
              </p>
            </Suspense>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading
                  ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)
                  : shown.length > 0
                    ? shown.map(p => <ProjectCard key={p.id} project={p} />)
                    : (
                      <div className="col-span-3 text-center py-24">
                        <p className="text-[#888480] text-sm mb-4">No projects match those filters.</p>
                        <button onClick={reset} className="text-[#1A1A2E] text-sm font-semibold underline cursor-pointer bg-transparent border-none font-sans underline-offset-2">
                          Clear all filters
                        </button>
                      </div>
                    )
                }
              </div>

              {!loading && visible < filtered.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisible(v => v + 12)}
                    className="bg-[#1A1A2E] text-white text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl cursor-pointer hover:bg-[#252545] transition-colors border-none font-sans"
                  >
                    Load more ({filtered.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
