import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCatalogHandler } from './server/catalog.mjs'

const root = fileURLToPath(new URL('.', import.meta.url))
const distRoot = resolve(root, 'dist')
const port = Number(process.env.PORT ?? 4173)
const catalogHandler = createCatalogHandler()
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname

  if (pathname === '/api/mtn/promotions') {
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' })
      response.end()
      return
    }
    await catalogHandler(request, response)
    return
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end()
    return
  }

  let filePath
  try {
    const decodedPath = decodeURIComponent(pathname)
    filePath = resolve(distRoot, `.${decodedPath === '/' ? '/index.html' : decodedPath}`)
  } catch {
    response.writeHead(400)
    response.end('Invalid path')
    return
  }

  if (filePath !== distRoot && !filePath.startsWith(`${distRoot}${sep}`)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  try {
    const file = await readFile(filePath)
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : file)
  } catch {
    try {
      const index = await readFile(resolve(distRoot, 'index.html'))
      response.writeHead(200, { 'Content-Type': contentTypes['.html'] })
      response.end(request.method === 'HEAD' ? undefined : index)
    } catch {
      response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Build the application with npm run build before starting the server.')
    }
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`MTN site listening on http://localhost:${port}`)
})
