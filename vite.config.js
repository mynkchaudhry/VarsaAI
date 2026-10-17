import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),

      // Server-side /api/chat — runs in Node.js, keys never reach the browser
      {
        name: 'api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end('Method not allowed')
              return
            }

            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body)
                const { handleChat } = await import('./server/chatHandler.mjs')
                const result = await handleChat(parsed, env)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(result))
              } catch (e) {
                console.error('[/api/chat]', e.message)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: e.message }))
              }
            })
          })
        },
      },
    ],

    server: {
      proxy: {
        '/api-proxy': {
          target: 'https://api-reelly.up.railway.app',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api-proxy/, '/api/v2/clients'),
          headers: {
            'X-API-Key': env.VITE_REELLY_KEY,
            accept: 'application/json',
          },
        },
        '/rapidapi-proxy': {
          target: 'https://uae-real-estate2.p.rapidapi.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/rapidapi-proxy/, ''),
          headers: {
            'x-rapidapi-key': env.RAPIDAPI_KEY,
            'x-rapidapi-host': env.RAPIDAPI_HOST,
          },
        },
      },
    },
  }
})
