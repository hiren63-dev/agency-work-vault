const { defineConfig, loadEnv } = require('vite')
const react = require('@vitejs/plugin-react').default
const { resolve } = require('path')
const { pathToFileURL } = require('url')

// ─── Local /api handler ────────────────────────────────────────────────────────
// api/buddy.js is a Vercel serverless function. Plain `vite` does not serve
// /api/*, so BuddyBot returned 404 in `npm run dev` no matter what key was set.
// This middleware runs the same handler in-process, giving it the Vercel-style
// (req.body / res.status().json()) surface it expects.
function apiDevMiddleware(env) {
  return {
    name: 'buddydesk-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/buddy', async (req, res) => {
        const send = (code, body) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        const key = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY
        if (!key) {
          return send(503, {
            error: 'OPENROUTER_API_KEY is not set in .env — generate one at openrouter.ai/keys',
          })
        }
        process.env.OPENROUTER_API_KEY = key

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}

          // Shim the bits of the Vercel response object the handler uses.
          res.status = (code) => { res.statusCode = code; return res }
          res.json = (body) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
            return res
          }

          const mod = await import(pathToFileURL(resolve(__dirname, 'api/buddy.js')).href)
          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[api/buddy] ${err.stack || err.message}`)
          if (!res.writableEnded) send(500, { error: err.message || 'Handler failed' })
        }
      })
    },
  }
}

module.exports = defineConfig(({ mode }) => {
  // '' prefix so unprefixed server-side vars (OPENROUTER_API_KEY) load too.
  // These stay in the Node process and are never exposed to the client bundle.
  const env = loadEnv(mode, __dirname, '')

  return {
    plugins: [react(), apiDevMiddleware(env)],
    root: resolve(__dirname, 'src/renderer'),
    envDir: resolve(__dirname),
    base: './',
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
      },
    },
  }
})
