// Derive smart tags from project data
const WATERFRONT_DISTRICTS = ['palm jumeirah', 'dubai marina', 'jbr', 'jumeirah beach residence', 'dubai harbour', 'emaar beachfront', 'bluewaters', 'la mer', 'the beach']
const DOWNTOWN_DISTRICTS   = ['downtown dubai', 'difc', 'business bay', 'city walk', 'trade centre']
const FAMILY_DISTRICTS     = ['dubai hills', 'arabian ranches', 'jumeirah village', 'jvc', 'mirdif', 'damac hills', 'town square', 'al barsha', 'mudon', 'serena']
const LUXURY_DEVELOPERS    = ['emaar', 'nakheel', 'meraas', 'ellington', 'aldar', 'damac', 'omniyat', 'select group', 'binghatti']

export function deriveTags(project) {
  const tags = []
  const district = (project.location?.district || project.location?.sector || '').toLowerCase()
  const developer = (project.developer || '').toLowerCase()
  const amenities = (project.project_amenities || []).map(a => (a.amenity?.name || a.name || '').toLowerCase())
  const status    = project.sale_status
  const cStatus   = project.construction_status
  const price     = project.min_price || 0

  // Location character
  if (WATERFRONT_DISTRICTS.some(d => district.includes(d.split(' ')[0]))) {
    tags.push({ label: 'Waterfront', color: 'blue' })
  } else if (DOWNTOWN_DISTRICTS.some(d => district.includes(d.split(' ')[0]))) {
    tags.push({ label: 'City Centre', color: 'purple' })
  } else if (FAMILY_DISTRICTS.some(d => district.includes(d.split(' ')[0]))) {
    tags.push({ label: 'Family Area', color: 'green' })
  }

  // Amenity-based
  if (amenities.some(a => a.includes('beach') || a.includes('ocean'))) tags.push({ label: 'Beachfront', color: 'blue' })
  if (amenities.some(a => a.includes('golf'))) tags.push({ label: 'Golf', color: 'green' })
  if (amenities.some(a => a.includes('spa'))) tags.push({ label: 'Spa', color: 'pink' })
  if (amenities.some(a => a.includes('pool') || a.includes('infinity'))) tags.push({ label: 'Pool', color: 'blue' })
  if (amenities.some(a => a.includes('concierge'))) tags.push({ label: 'Concierge', color: 'amber' })
  if (amenities.some(a => a.includes('gym') || a.includes('fitness'))) tags.push({ label: 'Gym', color: 'gray' })

  // Developer prestige
  if (LUXURY_DEVELOPERS.some(d => developer.includes(d))) tags.push({ label: 'Top Developer', color: 'amber' })

  // Completion / off-plan
  if (cStatus === 'completed') tags.push({ label: 'Ready to Move', color: 'green' })
  if (cStatus === 'under_construction') {
    const endDate = project.construction_end_date
    if (endDate) {
      const year = new Date(endDate).getFullYear()
      tags.push({ label: `Handover ${year}`, color: 'navy' })
    } else {
      tags.push({ label: 'Off-Plan', color: 'navy' })
    }
  }

  // Price tier
  if (price > 0 && price < 1_000_000) tags.push({ label: 'Under AED 1M', color: 'green' })
  else if (price >= 50_000_000) tags.push({ label: 'Ultra Luxury', color: 'amber' })

  // Status
  if (status === 'coming_soon') tags.push({ label: 'Coming Soon', color: 'purple' })

  // District label (always include as last tag if not empty)
  const districtLabel = project.location?.district || project.location?.sector
  if (districtLabel) tags.push({ label: districtLabel, color: 'gray' })

  // Dedupe by label, max 4
  const seen = new Set()
  return tags.filter(t => { if (seen.has(t.label)) return false; seen.add(t.label); return true }).slice(0, 4)
}

export const TAG_COLORS = {
  blue:   { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  purple: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  green:  { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  amber:  { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  pink:   { bg: '#FDF2F8', text: '#9D174D', border: '#FBCFE8' },
  navy:   { bg: '#EEEEF6', text: '#1A1A2E', border: '#C7C7E8' },
  gray:   { bg: '#F9F9F9', text: '#4B5563', border: '#E5E7EB' },
}
