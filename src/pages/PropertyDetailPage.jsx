import { useState, lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useForm, ValidationError } from '@formspree/react'
import Layout from '../components/Layout'
import { useProject } from '../hooks/useProject'

const PropertyMap = lazy(() => import('../components/PropertyMap'))

function fmtPrice(n) {
  if (!n) return null
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`
  return `AED ${Math.round(n / 1000)}K`
}

function fmtArea(n) {
  if (!n) return null
  return `${Math.round(n).toLocaleString()} sqft`
}

const STATUS_STYLE = {
  on_sale:            { bg: '#DCFCE7', text: '#15803D', label: 'On Sale' },
  coming_soon:        { bg: '#EDE9FE', text: '#7C3AED', label: 'Coming Soon' },
  sold_out:           { bg: '#FEE2E2', text: '#DC2626', label: 'Sold Out' },
  under_construction: { bg: '#FEF3C7', text: '#D97706', label: 'Under Construction' },
  completed:          { bg: '#DBEAFE', text: '#1D4ED8', label: 'Completed' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: '#F0EBE3', text: '#888480', label: status }
  return (
    <span className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
}

function ImageGallery({ images = [], label }) {
  const [active, setActive] = useState(0)
  if (!images.length) return null
  return (
    <div className="mb-2">
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#F0EBE3] mb-3">
        <img
          src={images[active]?.url}
          alt={`${label} ${active + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${i === active ? 'border-[#1A1A2E]' : 'border-[#E8E3DB] opacity-60 hover:opacity-100'}`}
            >
              <img src={img?.url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="card rounded-xl p-4">
      <p className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#888480] mb-1">{label}</p>
      <p className="font-display text-[1rem] font-semibold text-[#0D0D0D] leading-snug">{value}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse max-w-screen-2xl mx-auto pt-24 pb-20 px-6 md:px-10 xl:px-20">
      <div className="h-4 bg-[#F0EBE3] rounded w-48 mb-6" />
      <div className="h-10 bg-[#E8E3DB] rounded w-2/3 mb-3" />
      <div className="aspect-[21/9] bg-[#F0EBE3] rounded-2xl my-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#F0EBE3] rounded-xl" />)}
      </div>
    </div>
  )
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { project: p, loading, error } = useProject(id)

  const [galleryTab, setGalleryTab] = useState('lobby')
  const [enquiryState, handleEnquiry] = useForm('moejybyj')

  if (loading) return <Layout><Skeleton /></Layout>

  if (error || !p) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#F8F5F0]">
          <div className="font-display text-[5rem] font-bold text-[#E8E3DB] leading-none mb-4">!</div>
          <h1 className="font-display text-2xl font-bold text-[#0D0D0D] mb-3">Project not found</h1>
          <p className="text-[#888480] text-sm mb-8">We couldn't load this project. It may have been removed.</p>
          <Link to="/properties" className="bg-[#1A1A2E] text-white font-semibold text-[0.82rem] px-8 py-3.5 rounded-xl no-underline hover:bg-[#252545] transition-colors">
            Back to properties
          </Link>
        </div>
      </Layout>
    )
  }

  // Correct field names from API
  const lobbyImages    = p.lobby || []
  const interiorImages = p.interior || []
  const archImages     = p.architecture || []
  const coverUrl       = p.cover_image?.url

  const galleryTabs = [
    { key: 'lobby',        label: 'Lobby',        images: lobbyImages },
    { key: 'interior',     label: 'Interior',      images: interiorImages },
    { key: 'architecture', label: 'Architecture',  images: archImages },
  ].filter(t => t.images.length > 0)

  const bedsLabel = () => {
    if (p.min_bedrooms == null) return null
    if (p.min_bedrooms === 0 && p.max_bedrooms === 0) return 'Studio'
    if (Math.round(p.min_bedrooms) === Math.round(p.max_bedrooms)) return `${Math.round(p.min_bedrooms)} Bed`
    if (p.max_bedrooms != null) return `${Math.round(p.min_bedrooms)}–${Math.round(p.max_bedrooms)} Bed`
    return `${Math.round(p.min_bedrooms)}+ Bed`
  }

  const completionDate = p.construction_end_date
    ? new Date(p.construction_end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : p.completion_date || null

  return (
    <Layout>
      <div className="bg-[#F8F5F0] min-h-screen">

        {/* Header bar */}
        <div className="bg-white border-b border-[#E8E3DB] px-6 md:px-10 xl:px-20 pt-20 pb-4">
          <div className="max-w-screen-2xl mx-auto">
            <nav className="flex items-center gap-2 text-[0.72rem] text-[#888480] font-sans mb-4">
              <Link to="/" className="hover:text-[#0D0D0D] transition-colors no-underline text-[#888480]">Home</Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-[#0D0D0D] transition-colors no-underline text-[#888480]">Properties</Link>
              <span>/</span>
              <span className="text-[#0D0D0D] font-medium truncate max-w-[200px]">{p.name}</span>
            </nav>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[0.7rem] font-semibold text-[#888480] uppercase tracking-wide mb-1">{p.developer}</p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0D0D0D]">{p.name}</h1>
                {(p.location?.district || p.location?.sector) && (
                  <div className="flex items-center gap-1.5 text-[#888480] mt-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="text-sm">{[p.location.district, p.location.sector].filter(Boolean).join(', ')} · Dubai</span>
                  </div>
                )}
              </div>
              <StatusBadge status={p.sale_status} />
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 xl:px-20 py-6 max-w-screen-2xl mx-auto">

          {/* Cover image */}
          {coverUrl && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-6">
              <img src={coverUrl} alt={p.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            <StatCard label="Starting Price"   value={fmtPrice(p.min_price)} />
            <StatCard label="Unit Size"        value={fmtArea(p.min_size)} />
            <StatCard label="Bedrooms"         value={bedsLabel()} />
            <StatCard label="Completion"       value={completionDate} />
            <StatCard label="Service Charge"   value={p.service_charge} />
            <StatCard label="Furnishing"       value={p.furnishing_display} />
            {p.readiness_progress != null && (
              <StatCard label="Progress" value={`${Math.round(p.readiness_progress)}% done`} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Image gallery */}
              {galleryTabs.length > 0 && (
                <div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {galleryTabs.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setGalleryTab(t.key)}
                        className={`text-[0.72rem] font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer font-sans ${
                          galleryTab === t.key
                            ? 'bg-[#1A1A2E] border-[#1A1A2E] text-white'
                            : 'bg-white border-[#E8E3DB] text-[#3A3A3A] hover:border-[#1A1A2E]'
                        }`}
                      >
                        {t.label} ({t.images.length})
                      </button>
                    ))}
                  </div>
                  {galleryTabs.map(t => galleryTab === t.key && <ImageGallery key={t.key} images={t.images} label={t.label} />)}
                </div>
              )}

              {/* Overview */}
              {p.overview && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">About this project</h2>
                  <div className="prose-estate text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.overview}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {p.project_amenities?.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.project_amenities.map((a, i) => (
                      <span key={i} className="text-[0.72rem] font-medium bg-white border border-[#E8E3DB] text-[#3A3A3A] px-3.5 py-1.5 rounded-full">
                        {a.amenity?.name || a.name || a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit types */}
              {p.available_unit_types?.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Available Units</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.available_unit_types.map((t, i) => (
                      <span key={i} className="text-[0.72rem] font-semibold uppercase tracking-wide px-4 py-2 rounded-lg bg-[#EEEEF6] text-[#1A1A2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Typical units */}
              {p.typical_units?.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Unit Details</h2>
                  <div className="space-y-2">
                    {p.typical_units.map((u, i) => (
                      <div key={i} className="card rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                        <div>
                          <p className="font-semibold text-[0.9rem] text-[#0D0D0D]">
                            {u.bedrooms === 0 ? 'Studio' : `${u.bedrooms} Bedroom${u.bedrooms > 1 ? 's' : ''}`}
                          </p>
                        </div>
                        <div className="flex gap-6 text-right">
                          {u.from_size_sqft && (
                            <div>
                              <p className="font-semibold text-[#0D0D0D] text-sm">{fmtArea(u.from_size_sqft)}</p>
                              <p className="text-[#888480] text-[0.65rem] uppercase tracking-wide">Area</p>
                            </div>
                          )}
                          {u.from_price_aed && (
                            <div>
                              <p className="font-display font-bold text-[#1A1A2E] text-sm">{fmtPrice(u.from_price_aed)}</p>
                              <p className="text-[#888480] text-[0.65rem] uppercase tracking-wide">From</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment plans */}
              {p.payment_plans?.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Payment Plans</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {p.payment_plans.map((plan, i) => (
                      <div key={i} className="card rounded-xl p-5">
                        <h4 className="font-semibold text-[0.88rem] text-[#1A1A2E] mb-3">{plan.name || 'Payment Plan'}</h4>
                        {plan.steps?.length > 0 && (
                          <div className="space-y-2">
                            {plan.steps.map((step, j) => (
                              <div key={j} className="flex items-center justify-between">
                                <span className="text-[0.78rem] text-[#888480]">{step.name}</span>
                                <span className="font-display font-bold text-[#0D0D0D] text-sm">{step.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location map */}
              {p.location?.latitude && p.location?.longitude && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Location</h2>
                  <Suspense fallback={<div className="h-[340px] rounded-2xl bg-[#F0EBE3] animate-pulse" />}>
                    <PropertyMap project={p} />
                  </Suspense>
                </div>
              )}

              {/* Nearby places */}
              {p.project_map_points?.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0D0D0D] mb-4">Nearby</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {p.project_map_points.slice(0, 8).map((pt, i) => (
                      <div key={i} className="card rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EEEEF6] flex items-center justify-center flex-shrink-0">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" aria-hidden="true">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-[0.82rem] font-medium text-[#0D0D0D]">{pt.map_point_name}</p>
                          <p className="text-[#888480] text-[0.7rem]">
                            {pt.distance != null ? `${pt.distance} km` : ''}
                            {pt.time != null ? ` · ${Math.round(pt.time)} min` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Price + CTA */}
              <div className="card rounded-2xl p-6">
                {p.min_price && (
                  <div className="mb-5">
                    <p className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#888480] mb-1">Starting From</p>
                    <p className="font-display text-2xl font-bold text-[#1A1A2E]">{fmtPrice(p.min_price)}</p>
                    {p.max_price && p.max_price !== p.min_price && (
                      <p className="text-[#888480] text-sm mt-0.5">Up to {fmtPrice(p.max_price)}</p>
                    )}
                  </div>
                )}
                <Link
                  to="/chat"
                  className="block w-full bg-[#1A1A2E] text-white text-[0.8rem] font-semibold text-center py-3 rounded-xl no-underline hover:bg-[#252545] transition-colors mb-3"
                >
                  Ask AI about this project
                </Link>
                <Link
                  to="/properties"
                  className="block w-full border border-[#E8E3DB] text-[#3A3A3A] text-[0.8rem] font-semibold text-center py-3 rounded-xl no-underline hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-all"
                >
                  Browse all properties
                </Link>
              </div>

              {/* Enquiry form */}
              <div className="card rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold text-[#0D0D0D] mb-4">Request more info</h3>
                {enquiryState.succeeded ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="text-[#0D0D0D] text-sm font-semibold mb-1">Got it!</p>
                    <p className="text-[#888480] text-xs">We'll be in touch about {p.name}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquiry} className="space-y-3">
                    <input type="hidden" name="property" value={p.name} />
                    <input type="hidden" name="developer" value={p.developer} />

                    <input
                      id="name" type="text" name="name" required
                      placeholder="Your name"
                      className="w-full bg-[#F8F5F0] border border-[#E8E3DB] rounded-lg px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B8B3AC] outline-none focus:border-[#1A1A2E] transition-colors font-sans"
                    />
                    <ValidationError prefix="Name" field="name" errors={enquiryState.errors} className="text-[0.72rem] text-red-500 font-sans" />

                    <input
                      id="email" type="email" name="email" required
                      placeholder="Email address"
                      className="w-full bg-[#F8F5F0] border border-[#E8E3DB] rounded-lg px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B8B3AC] outline-none focus:border-[#1A1A2E] transition-colors font-sans"
                    />
                    <ValidationError prefix="Email" field="email" errors={enquiryState.errors} className="text-[0.72rem] text-red-500 font-sans" />

                    <input
                      id="phone" type="tel" name="phone"
                      placeholder="Phone (optional)"
                      className="w-full bg-[#F8F5F0] border border-[#E8E3DB] rounded-lg px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B8B3AC] outline-none focus:border-[#1A1A2E] transition-colors font-sans"
                    />

                    <textarea
                      id="message" name="message"
                      placeholder={`I'm interested in ${p.name}…`}
                      rows={3}
                      className="w-full bg-[#F8F5F0] border border-[#E8E3DB] rounded-lg px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#B8B3AC] outline-none focus:border-[#1A1A2E] transition-colors font-sans resize-none"
                    />
                    <ValidationError prefix="Message" field="message" errors={enquiryState.errors} className="text-[0.72rem] text-red-500 font-sans" />

                    <button
                      type="submit"
                      disabled={enquiryState.submitting}
                      className="w-full bg-[#1A1A2E] text-white text-[0.8rem] font-semibold py-3 rounded-lg cursor-pointer hover:bg-[#252545] disabled:opacity-60 disabled:cursor-not-allowed transition-colors border-none font-sans flex items-center justify-center gap-2"
                    >
                      {enquiryState.submitting ? (
                        <>
                          <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                          Sending…
                        </>
                      ) : 'Send enquiry'}
                    </button>
                  </form>
                )}
              </div>

              {/* Developer */}
              {p.developer && (
                <div className="card rounded-2xl p-5">
                  <p className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[#888480] mb-2">Developer</p>
                  <p className="font-display text-base font-semibold text-[#0D0D0D]">{p.developer}</p>
                </div>
              )}

              {/* Brochure */}
              {p.marketing_brochure && (
                <a
                  href={p.marketing_brochure}
                  target="_blank"
                  rel="noreferrer"
                  className="card rounded-2xl p-5 flex items-center gap-3 no-underline hover:border-[#1A1A2E] transition-colors group cursor-pointer block"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EEEEF6] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A1A2E] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" className="group-hover:stroke-white" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-semibold text-[#0D0D0D]">Download Brochure</p>
                    <p className="text-[#888480] text-[0.7rem]">Marketing PDF</p>
                  </div>
                </a>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
