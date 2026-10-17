import { Link } from 'react-router-dom'
import { deriveTags, TAG_COLORS } from '../utils/tags'

function fmtPrice(n) {
  if (!n && n !== 0) return null
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `AED ${Math.round(n / 1_000)}K`
  return `AED ${Math.round(n).toLocaleString()}`
}

const STATUS = {
  on_sale:            { dot: '#16A34A', label: 'On Sale' },
  coming_soon:        { dot: '#7C3AED', label: 'Coming Soon' },
  sold_out:           { dot: '#DC2626', label: 'Sold Out' },
  under_construction: { dot: '#D97706', label: 'Under Construction' },
  completed:          { dot: '#0284C7', label: 'Completed' },
}

function SmartTag({ tag }) {
  const { bg, text, border } = TAG_COLORS[tag.color] || TAG_COLORS.gray
  return (
    <span
      className="text-[0.62rem] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ backgroundColor: bg, color: text, borderColor: border }}
    >
      {tag.label}
    </span>
  )
}

export default function ProjectCard({ project }) {
  const {
    name, developer, location,
    min_price, max_price, min_bedrooms, max_bedrooms,
    sale_status, cover_image,
  } = project

  const district = location?.district || location?.sector || location?.region || 'Dubai'
  const loPrice  = fmtPrice(min_price)
  const hiPrice  = fmtPrice(max_price)
  const priceStr = !loPrice ? null : loPrice === hiPrice ? loPrice : `${loPrice} – ${hiPrice}`

  const bedsStr = min_bedrooms != null
    ? min_bedrooms === 0 && max_bedrooms === 0 ? 'Studio'
    : min_bedrooms === max_bedrooms ? `${Math.round(min_bedrooms)} Bed`
    : `${Math.round(min_bedrooms)}–${Math.round(max_bedrooms)} Bed`
    : null

  const { dot, label } = STATUS[sale_status] || { dot: '#888480', label: sale_status }
  const tags = deriveTags(project)

  return (
    <Link to={`/properties/${project.id}`} className="block no-underline group" aria-label={`View ${name}`}>
      <article className="card card-hover rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer">

        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F0EBE3] flex-shrink-0">
          {cover_image?.url ? (
            <img
              src={cover_image.url}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CCC7BF" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}

          {/* Smart tags overlay — top-left */}
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
              {tags.slice(0, 2).map(tag => (
                <SmartTag key={tag.label} tag={tag} />
              ))}
            </div>
          )}

          {/* Status dot — top-right */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[#E8E3DB]">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
            <span className="text-[0.6rem] font-semibold text-[#3A3A3A]">{label}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2.5 flex-1">
          <p className="text-[0.7rem] font-medium text-[#888480] uppercase tracking-wide truncate">{developer}</p>

          <h3 className="font-display text-[1.05rem] font-semibold text-[#0D0D0D] leading-snug">{name}</h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#888480]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-[0.78rem]">{district}</span>
          </div>

          {/* Price */}
          {priceStr && (
            <p className="font-display text-[1rem] font-semibold text-[#1A1A2E]">{priceStr}</p>
          )}

          {/* Bottom tags row */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#F0EBE3]">
            {bedsStr && (
              <span className="text-[0.62rem] font-semibold uppercase px-2.5 py-1 rounded-full bg-[#EEEEF6] text-[#1A1A2E]">
                {bedsStr}
              </span>
            )}
            {tags.slice(2).map(tag => <SmartTag key={tag.label} tag={tag} />)}
          </div>
        </div>
      </article>
    </Link>
  )
}
