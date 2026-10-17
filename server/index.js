import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { handleChat } from './chatHandler.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json({ limit: '20mb' }))

// ─── API: chat ────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const result = await handleChat(req.body, process.env)
    res.json(result)
  } catch (e) {
    console.error('[/api/chat]', e.message)
    res.status(500).json({ error: e.message })
  }
})

// ─── Proxy: Reelly (/api-proxy/*) ────────────────────────────────────────────
app.use('/api-proxy', async (req, res) => {
  try {
    const target = `https://api-reelly.up.railway.app/api/v2/clients${req.url}`
    const upstream = await fetch(target, {
      headers: {
        'X-API-Key': process.env.VITE_REELLY_KEY,
        accept: 'application/json',
      },
    })
    const data = await upstream.json()
    res.status(upstream.status).json(data)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

// ─── Proxy: RapidAPI (/rapidapi-proxy/*) ─────────────────────────────────────
app.use('/rapidapi-proxy', async (req, res) => {
  try {
    const target = `https://${process.env.RAPIDAPI_HOST}${req.url}`
    const upstream = await fetch(target, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
    })
    const data = await upstream.json()
    res.status(upstream.status).json(data)
  } catch (e) {
    res.status(502).json({ error: e.message })
  }
})

// ─── Serve built Vite frontend ────────────────────────────────────────────────
const distPath = join(__dirname, '../dist')
app.use(express.static(distPath))

// SPA fallback — all other routes serve index.html
app.get('/{*splat}', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`VarsaAI running on port ${PORT}`))
