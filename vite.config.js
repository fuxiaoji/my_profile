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

const biliName = process.env.BILIBILI_NAME || '三只阿基'
const biliMid = process.env.BILIBILI_MID || ''
const biliHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
  Referer: 'https://www.bilibili.com/',
}

async function biliJson(url) {
  const response = await fetch(url, { headers: biliHeaders })
  if (!response.ok) throw new Error(`Bilibili request failed: ${response.status}`)
  const data = await response.json()
  if (data.code !== 0) throw new Error(data.message || 'Bilibili API error')
  return data.data
}

async function resolveBiliMid() {
  if (biliMid) return biliMid
  const data = await biliJson(`https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&keyword=${encodeURIComponent(biliName)}`)
  const users = data?.result || []
  const exact = users.find(user => user.uname === biliName) || users[0]
  return exact?.mid || ''
}

async function bilibiliSummary() {
  const mid = await resolveBiliMid()
  if (!mid) throw new Error('Bilibili mid not found')
  const [card, upstat] = await Promise.all([
    biliJson(`https://api.bilibili.com/x/web-interface/card?mid=${mid}`),
    biliJson(`https://api.bilibili.com/x/space/upstat?mid=${mid}`).catch(() => null),
  ])
  let latest = []
  try {
    const archive = await biliJson(`https://api.bilibili.com/x/space/arc/search?mid=${mid}&pn=1&ps=4&order=pubdate`)
    latest = (archive?.list?.vlist || []).map(video => ({
      title: video.title,
      url: `https://www.bilibili.com/video/${video.bvid}`,
      cover: video.pic,
      date: video.created ? new Date(video.created * 1000).toISOString().slice(0, 10) : '',
    }))
  } catch {
    latest = []
  }
  return {
    name: card?.card?.name || biliName,
    mid,
    profileUrl: `https://space.bilibili.com/${mid}`,
    fans: card?.card?.fans ?? null,
    likes: upstat?.likes ?? card?.like_num ?? null,
    latest,
    updatedAt: new Date().toISOString(),
  }
}

function handleBilibiliApi(request, response, next) {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (pathname !== '/api/bilibili/summary') return next()
  bilibiliSummary().then(data => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'public, max-age=300')
    response.end(JSON.stringify(data))
  }).catch(error => {
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify({ name: biliName, fans: null, likes: null, latest: [], error: error.message }))
  })
}

function localNotesPlugin() {
  return {
    name: 'local-notes-preview',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        handleBilibiliApi(request, response, () => {
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
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        handleBilibiliApi(request, response, next)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localNotesPlugin()],
  build: { target: 'es2020', sourcemap: true },
})
