import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const localNotesRoot = 'F:/desktop/note'
const ignoredNoteEntries = new Set(['.git', '.obsidian', '.DS_Store'])

function noteTree(directory = localNotesRoot, relative = '') {
  const children = fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => !ignoredNoteEntries.has(entry.name) && !entry.name.startsWith('.'))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name, 'zh-CN'))
    .map(entry => {
      const childRelative = path.posix.join(relative, entry.name)
      if (entry.isDirectory()) return { name: entry.name, type: 'directory', children: noteTree(path.join(directory, entry.name), childRelative).children }
      return { name: entry.name, type: 'file', path: `note/${childRelative}` }
    })
  return { name: relative ? path.basename(directory) : 'note', type: 'directory', source: 'local', children }
}

function localNotesPlugin() {
  return {
    name: 'local-notes-preview',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname
        if (pathname === '/__local_notes_index') {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify(noteTree()))
          return
        }
        if (!pathname.startsWith('/local-note/')) return next()
        const relative = decodeURIComponent(pathname.slice('/local-note/'.length))
        const file = path.resolve(localNotesRoot, relative)
        const root = path.resolve(localNotesRoot)
        if (file !== root && !file.startsWith(`${root}${path.sep}`)) { response.statusCode = 403; response.end('Forbidden'); return }
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.statusCode = 404; response.end('Not found'); return }
        const mime = { '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }[path.extname(file).toLowerCase()] || 'application/octet-stream'
        const size = fs.statSync(file).size
        const range = request.headers.range
        response.setHeader('Accept-Ranges', 'bytes')
        response.setHeader('Content-Type', mime)
        if (range) {
          const [startText, endText] = range.replace('bytes=', '').split('-')
          const start = Number(startText); const end = endText ? Number(endText) : size - 1
          response.statusCode = 206
          response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
          response.setHeader('Content-Length', end - start + 1)
          fs.createReadStream(file, { start, end }).pipe(response)
        } else {
          response.setHeader('Content-Length', size)
          fs.createReadStream(file).pipe(response)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localNotesPlugin()],
  build: { target: 'es2020', sourcemap: true },
})
