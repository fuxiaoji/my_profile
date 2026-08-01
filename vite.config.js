import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const localNotesRoot = 'F:/desktop/note'
const localArticlesRoot = path.resolve('文章')
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
    const fallbackFile = path.resolve('public/bilibili-summary.json')
    if (fs.existsSync(fallbackFile)) {
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.setHeader('Cache-Control', 'public, max-age=60')
      response.end(JSON.stringify({ ...JSON.parse(fs.readFileSync(fallbackFile, 'utf8')), liveError: error.message }))
      return
    }
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify({ name: biliName, fans: null, likes: null, latest: [], error: error.message }))
  })
}

function findArchivedTiebaMarkdown(threadId) {
  if (!threadId || !fs.existsSync(localArticlesRoot)) return null
  const stack = [localArticlesRoot]
  while (stack.length) {
    const current = stack.pop()
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }
      if (!entry.name.toLowerCase().endsWith('.md')) continue
      if (full.includes(threadId) || fs.readFileSync(full, 'utf8').includes(`/p/${threadId}`)) {
        return full
      }
    }
  }
  return null
}

async function readJsonBody(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  const text = Buffer.concat(chunks).toString('utf8')
  return text ? JSON.parse(text) : {}
}

function handleTiebaSpiderApi(request, response, next) {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (pathname !== '/spider-api/run') return next()
  if (request.method !== 'POST') {
    response.statusCode = 405
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify({ code: 405, msg: 'Method not allowed' }))
    return
  }
  readJsonBody(request).then(body => {
    const url = String(body.url || '')
    const threadId = url.match(/tieba\.baidu\.com\/p\/(\d+)/)?.[1] || url.match(/\/p\/(\d+)/)?.[1]
    const archived = findArchivedTiebaMarkdown(threadId)
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (!archived) {
      response.end(JSON.stringify({
        code: 200,
        msg: `本地预览接口已连通，但没有找到帖子 ${threadId || url} 的本地归档。线上完整抓取请部署 API_DOC.md 中的爬虫后端。`,
        markdown_content: `# Tieba Reaper\n\n> 本地接口已连通。\n\n- 输入链接：${url || '未提供'}\n- 本地归档：未找到\n\n如果这是新帖子，需要服务器端爬虫服务实际访问贴吧并返回 Markdown。`,
      }))
      return
    }
    response.end(JSON.stringify({
      code: 200,
      msg: '已从本地文章归档读取 Markdown。',
      markdown_content: fs.readFileSync(archived, 'utf8'),
      folder_name: path.basename(path.dirname(archived)),
    }))
  }).catch(error => {
    response.statusCode = 400
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify({ code: 400, msg: error.message }))
  })
}

function serveFileWithRange(request, response, file, mime) {
  const size = fs.statSync(file).size
  const range = request.headers.range
  response.setHeader('Accept-Ranges', 'bytes')
  response.setHeader('Content-Type', mime)
  if (range) {
    const [startText, endText] = range.replace('bytes=', '').split('-')
    const start = Number(startText)
    const end = endText ? Number(endText) : size - 1
    response.statusCode = 206
    response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
    response.setHeader('Content-Length', end - start + 1)
    fs.createReadStream(file, { start, end }).pipe(response)
    return
  }
  response.setHeader('Content-Length', size)
  fs.createReadStream(file).pipe(response)
}

function localMime(file) {
  return {
    '.pdf': 'application/pdf',
    '.md': 'text/markdown; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }[path.extname(file).toLowerCase()] || 'application/octet-stream'
}

function handleLocalContent(request, response, next) {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (pathname === '/__local_notes_index') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(noteTree()))
    return
  }
  if (pathname.startsWith('/local-note/')) {
    const relative = decodeURIComponent(pathname.slice('/local-note/'.length))
    const file = path.resolve(localNotesRoot, relative)
    const root = path.resolve(localNotesRoot)
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.statusCode = 403
      response.end('Forbidden')
      return
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.statusCode = 404
      response.end('Not found')
      return
    }
    serveFileWithRange(request, response, file, localMime(file))
    return
  }
  if (pathname.startsWith('/article-asset/')) {
    const relative = decodeURIComponent(pathname.slice('/article-asset/'.length))
    const file = path.resolve(localArticlesRoot, relative)
    const root = path.resolve(localArticlesRoot)
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      response.statusCode = 403
      response.end('Forbidden')
      return
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.statusCode = 404
      response.end('Not found')
      return
    }
    serveFileWithRange(request, response, file, localMime(file))
    return
  }
  next()
}

function localNotesPlugin() {
  return {
    name: 'local-notes-preview',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        handleBilibiliApi(request, response, () => {
        handleTiebaSpiderApi(request, response, () => {
        handleLocalContent(request, response, next)
        })
        })
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        handleBilibiliApi(request, response, () => handleTiebaSpiderApi(request, response, () => handleLocalContent(request, response, next)))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localNotesPlugin()],
  build: { target: 'es2020', sourcemap: true },
})
