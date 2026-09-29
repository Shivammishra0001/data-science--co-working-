// Production server for DigitalOcean App Platform (Web Service).
// Serves the Vite build in dist/ with React Router SPA fallback.
// No framework and no runtime dependencies — Node's built-in http only.
//
//   npm run build && npm start      → http://0.0.0.0:${PORT:-8080}
//
// Holds no secrets: it reads only PORT and HOST, and never passes environment
// variables to the browser.

import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const PORT = Number(process.env.PORT) || 8080
const HOST = process.env.HOST || '0.0.0.0'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
}

// Resolve a URL path to a file inside dist/, refusing anything that escapes it.
function safePath(urlPath) {
  let decoded
  try {
    decoded = decodeURIComponent(urlPath)
  } catch {
    return null
  }
  const full = normalize(join(ROOT, decoded))
  return full === ROOT || full.startsWith(ROOT + sep) ? full : null
}

async function fileAt(path) {
  if (!path) return null
  try {
    const s = await stat(path)
    if (s.isFile()) return { path, size: s.size }
    if (s.isDirectory()) {
      const index = join(path, 'index.html')
      const i = await stat(index)
      if (i.isFile()) return { path: index, size: i.size }
    }
  } catch {
    // not found
  }
  return null
}

function send(req, res, file, status = 200) {
  const ext = extname(file.path).toLowerCase()
  const isHtml = ext === '.html'
  // Vite fingerprints everything under /assets → safe to cache for a year.
  // HTML must always be revalidated so new deploys are picked up.
  const cache = isHtml ? 'no-cache' : req.url.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Content-Length': file.size,
    'Cache-Control': cache,
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file.path)
    .on('error', () => res.destroy())
    .pipe(res)
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  const { pathname } = new URL(req.url, 'http://localhost')

  // lightweight health check for the platform
  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }).end('ok')
    return
  }

  const file = await fileAt(safePath(pathname))
  if (file) return send(req, res, file)

  // Missing files that look like assets → real 404 (don't serve HTML as JS/CSS).
  if (extname(pathname)) {
    res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain' }).end('Not found')
    return
  }

  // Client-side routes (/about, /community/openai, …) → the SPA shell.
  const shell = await fileAt(join(ROOT, 'index.html'))
  if (shell) return send(req, res, shell)

  res.writeHead(503, { 'Content-Type': 'text/plain' }).end('Build not found. Run `npm run build` first.')
})

server.on('error', (err) => {
  console.error(err.code === 'EADDRINUSE' ? `Port ${PORT} is already in use. Set PORT to a free port.` : err)
  process.exit(1)
})

server.listen(PORT, HOST, () => {
  console.log(`Serving ${ROOT} on http://${HOST}:${PORT}`)
})

// App Platform sends SIGTERM on redeploy — close cleanly.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)))
}
