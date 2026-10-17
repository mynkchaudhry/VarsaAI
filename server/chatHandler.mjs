// import crypto from 'node:crypto'
// import { Pinecone } from '@pinecone-database/pinecone'

// ─── Pinecone (commented out) ────────────────────────────────────────────────
// const INDEX_NAME = 'varsaai-chat'
// let _pc = null
// let _index = null
//
// async function getIndex(apiKey) { ... }
// function hashQuery(q) { ... }
// async function getCached(question, apiKey) { ... }
// async function setCache(question, answer, cardIds, apiKey) { ... }

// ─── Reelly projects (server-side, cached 10 min) ────────────────────────────
let _projects = null
let _projectsAt = 0

async function getProjects(reellyKey) {
  if (_projects && Date.now() - _projectsAt < 10 * 60 * 1000) return _projects

  const res = await fetch('https://api-reelly.up.railway.app/api/v2/clients/projects?limit=100', {
    headers: { 'X-API-Key': reellyKey, accept: 'application/json' },
  })
  const data = await res.json()
  const all = data.results || data.projects || data.data || data || []
  _projects = Array.isArray(all) ? all.filter(p => p.is_published !== false) : []
  _projectsAt = Date.now()
  return _projects
}

// ─── Match Reelly projects to query ─────────────────────────────────────────
function matchProjects(query, projects) {
  const lower = query.toLowerCase()

  const AREAS = [
    'marina', 'downtown', 'palm', 'jbr', 'jumeirah beach',
    'business bay', 'difc', 'jumeirah', 'dubai hills', 'harbour',
    'creek', 'meydan', 'arabian ranches', 'city walk', 'bluewaters',
    'emaar beachfront', 'aljada', 'al barsha', 'jvc', 'mirdif',
  ]
  const reqAreas = AREAS.filter(a => lower.includes(a))
  const TYPES = ['apartment', 'villa', 'penthouse', 'townhouse', 'studio']
  const reqType = TYPES.find(t => lower.includes(t))

  const budgetM = lower.match(/(\d+(?:\.\d+)?)\s*m(?:illion)?\b/)
  const budgetK = lower.match(/(\d+(?:\.\d+)?)\s*k\b/)
  let budget = null
  if (budgetM) budget = parseFloat(budgetM[1]) * 1_000_000
  else if (budgetK) budget = parseFloat(budgetK[1]) * 1_000

  let pool = [...projects]

  if (reqType === 'studio') {
    pool = pool.filter(p => p.min_bedrooms === 0 || p.available_unit_types?.includes('studio'))
  } else if (reqType) {
    pool = pool.filter(p => p.available_unit_types?.includes(reqType))
  }

  if (reqAreas.length > 0) {
    const areaPool = pool.filter(p => {
      const d = (p.location?.district || p.location?.sector || '').toLowerCase()
      return reqAreas.some(a => d.includes(a.split(' ')[0]))
    })
    if (areaPool.length > 0) pool = areaPool
  }

  if (budget) pool = pool.filter(p => !p.min_price || p.min_price <= budget * 1.25)

  if (/invest|yield|roi|rental return/.test(lower)) {
    pool = pool.filter(p => p.sale_status === 'on_sale')
    pool.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
  }

  return pool.slice(0, 3)
}

// ─── OpenAI call (gpt-4o-mini + web search + Bayut + image) ─────────────────
async function callOpenAI(userMessage, imageBase64, projects, history, openaiKey) {
  const fmtPrice = n => !n ? 'Price on request'
    : n >= 1e9 ? `AED ${(n/1e9).toFixed(1)}B`
    : n >= 1e6 ? `AED ${(n/1e6).toFixed(1)}M`
    : `AED ${Math.round(n/1000)}K`

  const projectContext = projects.slice(0, 48).map(p =>
    `• **${p.name}** by ${p.developer} | ${p.location?.district || p.location?.sector || 'Dubai'} | ${fmtPrice(p.min_price)} | ${
      p.min_bedrooms != null
        ? (p.min_bedrooms === 0 ? 'Studio' : `${p.min_bedrooms}${p.max_bedrooms && p.max_bedrooms !== p.min_bedrooms ? '–' + p.max_bedrooms : ''} bed`)
        : 'Various'
    } | Status: ${(p.sale_status || '').replace(/_/g, ' ')} | Types: ${p.available_unit_types?.join(', ') || 'various'}`
  ).join('\n')

  const instructions = `You are Varsa — an expert real estate AI. Your primary market is Dubai, but you handle any real estate question globally with the same depth.

## Your expertise covers
- Property search, comparison, and shortlisting
- Investment analysis: ROI, rental yield, capital appreciation, market cycles
- Buying vs renting decisions with financial reasoning
- Mortgages, financing, LTV ratios, affordability calculations
- Legal & regulatory: ownership types, visa eligibility, DLD fees, title deeds, RERA rules
- Off-plan vs ready property trade-offs
- Area/neighbourhood guides, infrastructure, schools, transport
- Market trends, price indices, supply/demand dynamics
- Property valuation methods (comparable sales, income approach, cost approach)
- General real estate concepts explained simply for any experience level

## How to respond
- **Always reason first**: explain the "why" behind your answer, not just what
- Be direct and data-driven — use numbers, percentages, and ranges where possible
- Use markdown: headers for sections, **bold** for key figures, tables to compare options
- Match depth to the question: a quick factual question gets a sharp 2–3 line answer; an investment analysis gets a structured breakdown
- Never make up prices or data — use web search for live figures, or state when data is approximate
- For Dubai queries: always check Bayut (https://www.bayut.com) for live listings and the DLD/Property Finder for market data
- For any query: cite every source with its URL and title

## Web search strategy
- Dubai property search → search Bayut.com first, then Property Finder
- Market data → search DLD, REIDIN, Betterhomes, Knight Frank Dubai reports
- General real estate concepts → authoritative sources (Investopedia, RICS, NAR)
- News/trends → search recent articles (filter to last 6–12 months)
- Always run a search before answering price or availability questions

## Image analysis
If the user shares a property image: identify the property type, estimate quality tier, spot notable features (view, finishes, layout), and suggest where to find similar listings.

## Our platform's live project data (Dubai)
${projectContext}`

  // Build history context
  const historyMsgs = history.slice(-6).map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text,
  }))

  // Build current user content (text + optional image)
  let userContent
  if (imageBase64) {
    userContent = [
      { type: 'input_image', image_url: imageBase64 },
      { type: 'input_text', text: userMessage || 'What can you tell me about this property?' },
    ]
  } else {
    userContent = userMessage
  }

  const input = [
    ...historyMsgs,
    { role: 'user', content: userContent },
  ]

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      tools: [{ type: 'web_search_preview' }],
      instructions,
      input,
      max_output_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI: ${res.status} ${err}`)
  }

  const data = await res.json()

  // Extract text + annotations (citations) from response
  const messageOutput = data.output?.find(o => o.type === 'message')
  const textContent = messageOutput?.content?.find(c => c.type === 'output_text')
  const text = textContent?.text || ''
  const annotations = textContent?.annotations || []

  // Deduplicated citations
  const seen = new Set()
  const citations = annotations
    .filter(a => a.type === 'url_citation' && a.url)
    .map(a => ({
      url: a.url,
      title: a.title || new URL(a.url).hostname,
    }))
    .filter(c => {
      if (seen.has(c.url)) return false
      seen.add(c.url)
      return true
    })

  return { text, citations }
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function handleChat(body, env) {
  const { message, image, history = [] } = body
  if (!message?.trim() && !image) throw new Error('Empty message')

  // ── Pinecone cache check (commented out) ──
  // if (env.PINECONE_API_KEY) {
  //   const cached = await getCached(message, env.PINECONE_API_KEY)
  //   if (cached) {
  //     const projects = await getProjects(env.VITE_REELLY_KEY)
  //     const cards = projects.filter(p => cached.cardIds.includes(String(p.id)))
  //     return { text: cached.answer, cards, citations: [], fromCache: true }
  //   }
  // }

  const projects = await getProjects(env.VITE_REELLY_KEY)
  const matched = matchProjects(message || '', projects)

  const { text, citations } = await callOpenAI(
    message, image, projects, history, env.OPENAI_API_KEY
  )

  // ── Pinecone cache store (commented out) ──
  // if (env.PINECONE_API_KEY) {
  //   const cardIds = matched.map(p => String(p.id))
  //   setCache(message, text, cardIds, env.PINECONE_API_KEY)
  // }

  return { text, cards: matched, citations, fromCache: false }
}
