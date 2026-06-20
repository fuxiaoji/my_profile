import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { awards, capabilities, facts, photographs, projects } from './data'
import { useLanguage } from './i18n'
import { usePortfolioMotion } from './usePortfolioMotion'

function Arrow() { return <span aria-hidden="true">↗</span> }
const githubFile = (path, repo = 'my_profile') => `https://github.com/fuxiaoji/${repo}/blob/main/${path.split('/').map(encodeURIComponent).join('/')}`
const githubRaw = path => `https://raw.githubusercontent.com/fuxiaoji/my_profile/main/${path.split('/').map(encodeURIComponent).join('/')}`
const articleMarkdown = import.meta.glob('/文章/**/*.md', { query: '?raw', import: 'default' })
const articleFallbacks = ['/photo/19fe9711f293690d0f284f205ef2e987.jpg', '/photo/8562470192cf76943e9acf21df4fd607.jpg', '/photo/d8548023ca6e0f529fa56d584ad7b6dd.jpg', '/photo/8d1acd0f8314c9a56308436e2af3702d.jpg']

function Shell({ children }) {
  const { t, toggle } = useLanguage()
  const navItems = [['/projects', t.navWork], ['/writing', t.navArticles], ['/study', t.navNotes], ['/about', t.navProfile]]
  return <div className="site-shell">
    <header className="nav-shell">
      <Link className="wordmark" to="/" aria-label={t.home}>FWJ<span>®</span></Link>
      <nav aria-label="主导航">
        {navItems.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : undefined}>{label}</NavLink>)}
      </nav>
      <div className="nav-actions"><a className="header-email" href="mailto:fuwenji61616@gmail.com">EMAIL</a><a className="header-resume" href="/about#resume">简历 ↓</a><span className="availability"><i /> {t.available}</span><button type="button" onClick={toggle} aria-label="切换语言">{t.language}</button></div>
    </header>{children}<nav className="mobile-dock" aria-label="移动端导航"><Link to="/">首页</Link>{navItems.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
  </div>
}

function SectionTitle({ index, title, subtitle, light = false }) {
  return <div className={`section-heading ${light ? 'light' : ''}`}><span>({index})</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>
}

function ProjectCard({ project, detailed = false }) {
  const { language } = useLanguage(); const english = language === 'en'
  const detailLines = english ? project.enDetails : project.details
  return <article className={`project-card ${detailed ? 'project-card-detailed' : ''}`}>
    <a className={`project-visual ${project.tone}`} href={project.link} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}><span className="project-no">{project.no}</span><div className="orb" /><div className="metric"><strong>{project.metric}</strong><small>{english ? project.enMetricLabel : project.metricLabel}</small></div></a>
    <div className="project-body"><div><p>{project.period} / {english ? project.enSubtitle : project.subtitle}</p><h3>{project.title}</h3></div><p className="project-copy">{english ? project.enCopy : project.copy}</p>{detailed && <ol className="project-details">{detailLines.map((line, index) => <li key={line}><span>0{index + 1}</span>{line}</li>)}</ol>}<ul className="project-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a className="github-link" href={project.link} target="_blank" rel="noreferrer"><span>GITHUB</span><span>{project.link.replace('https://github.com/', '')}</span><Arrow /></a></div>
  </article>
}

function Subscribe() {
  const { t } = useLanguage(); const [email, setEmail] = useState('')
  const submit = event => { event.preventDefault(); if (!email) return; window.location.href = `mailto:fuwenji61616@gmail.com?subject=${encodeURIComponent('订阅网站更新 / Subscribe')}&body=${encodeURIComponent(`订阅邮箱 / Subscriber: ${email}`)}` }
  return <form className="subscribe-form" onSubmit={submit}><div><p className="eyebrow">NEWSLETTER / 通讯</p><h3>{t.subscribeTitle}</h3><p>{t.subscribeDesc}</p></div><div className="subscribe-control"><label><span className="sr-only">Email</span><input type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder={t.emailPlaceholder} /></label><button type="submit">{t.subscribe} <Arrow /></button><small>{t.subscribeHint}</small></div></form>
}

function ResumePanel() {
  const { language } = useLanguage(); const zh = language === 'zh'
  const resumes = [
    ['/files/resume-internet.pdf', zh ? '互联网 / AI 开发' : 'Internet / AI Development', '01'],
    ['/files/resume-game.pdf', zh ? '游戏开发 / AI' : 'Game Development / AI', '02'],
    ['/files/resume-finance.pdf', zh ? '金融研究' : 'Finance & Research', '03'],
  ]
  return <section id="resume" className="resume-panel"><div><p className="eyebrow">CONTACT & RÉSUMÉ / 联系与简历</p><h3>{zh ? '选择适合你的版本。' : 'Choose the relevant version.'}</h3><a className="primary-email" href="mailto:fuwenji61616@gmail.com"><span>EMAIL</span><strong>fuwenji61616@gmail.com</strong><Arrow /></a></div><div className="resume-downloads">{resumes.map(([href, label, no]) => <a href={href} download key={href}><span>{no}</span><strong>{label}</strong><em>下载 PDF ↓</em></a>)}</div></section>
}

function HomeProjectMosaic() {
  const { language } = useLanguage(); const english = language === 'en'
  return <div className="home-project-mosaic">{projects.slice(0, 5).map((project, index) => <a className={`home-project-tile tile-${index + 1} ${project.tone}`} href={project.link} target="_blank" rel="noreferrer" key={project.title}><span>{project.no}</span><div className="tile-shape" /><div><p>{project.period} / {english ? project.enSubtitle : project.subtitle}</p><h3>{project.title}</h3></div><strong>{project.metric}</strong><Arrow /></a>)}</div>
}

function Home() {
  const { t, language } = useLanguage(); const [featuredArticles, setFeaturedArticles] = useState([])
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(data => setFeaturedArticles(data.slice(0, 8))).catch(() => setFeaturedArticles([])) }, [])
  return <main>
    <div className="opening" aria-hidden="true"><div className="opening-panel" /><div className="opening-panel" /><div className="opening-panel" /><p className="opening-label"><span>FU WENJI / PORTFOLIO</span></p><strong className="opening-count">000</strong></div>
    <section id="top" className="hero" aria-labelledby="hero-title"><div className="hero-watermark" aria-hidden="true">傅文基</div><div className="hero-top"><p className="eyebrow">{t.heroRole}</p><p>CHENGDU / CN<br />30.67° N, 104.06° E</p></div><h1 id="hero-title"><span>FU</span><span>WENJI</span></h1><div className="hero-bottom"><p className="hero-intro">{t.heroLine}</p><p className="scroll-note">{t.explore} <b>↓</b></p></div></section>

    <section className="manifesto"><p className="eyebrow">{t.introKicker}</p><p className="manifesto-copy">{t.intro}</p><p className="manifesto-cn">{t.introDetail}</p></section>

    <section id="work" className="work-section home-work"><SectionTitle index="01" title={t.selected} subtitle={t.selectedSub} /><HomeProjectMosaic /><Link className="section-cta" to="/projects">{t.allProjects} <Arrow /></Link></section>

    <section className="capabilities-section"><SectionTitle index="02" title={t.method} subtitle={t.methodSub} light /><div className="capability-list">{capabilities.map(([title, tools, zhTitle, zhDesc, enDesc, zhPoints, enPoints], i) => <article key={title}><span>0{i + 1}</span><h3>{language === 'zh' ? zhTitle : title}</h3><div className="capability-detail"><p className="capability-tools">{tools}</p><p className="capability-desc">{language === 'zh' ? zhDesc : enDesc}</p><ul>{(language === 'zh' ? zhPoints : enPoints).map((point, pointIndex) => <li key={point}><span>{String(pointIndex + 1).padStart(2, '0')}</span><p>{point}</p></li>)}</ul></div></article>)}</div></section>

    <section id="profile" className="profile-section"><SectionTitle index="03" title={t.profile} subtitle={t.profileSub} light /><div className="profile-grid"><div className="portrait"><img src="/photo/8562470192cf76943e9acf21df4fd607.jpg" alt="傅文基个人照" /></div><div className="profile-copy"><p>{t.hello}</p><p>{t.bio1}</p><p>{t.bio2}</p></div><dl className="facts">{facts.map(([value, zhLabel, enLabel]) => <div key={value}><dt>{value}</dt><dd>{language === 'zh' ? zhLabel : enLabel}</dd></div>)}</dl></div><div className="awards-strip">{awards.map(([value, zhLabel, enLabel]) => <article key={value}><strong>{value}</strong><p>{language === 'zh' ? zhLabel : enLabel}</p></article>)}</div></section>

    <section className="photo-section" aria-label={t.field}><div className="photo-sticky"><div className="photo-heading"><p className="eyebrow">{t.fieldSub}</p><h2>{t.field}</h2><p>{t.scrollGallery}</p></div><div className="photo-track">{photographs.map(([file, label], index) => <figure className={`photo-frame photo-frame-${index % 4}`} key={file}><div><img src={`/photo/${file}`} alt={t.field} loading="lazy" decoding="async" /></div><figcaption><span>{label}</span><span>FU WENJI ARCHIVE</span></figcaption></figure>)}<div className="photo-end"><span>12 MOMENTS</span><strong>KEEP<br />LOOKING.</strong></div></div></div></section>

    <section className="library-section"><SectionTitle index="04" title={t.library} subtitle={t.librarySub} /><div className="home-article-cards">{featuredArticles.map((article, index) => <Link className={`home-article-card article-card-${index + 1}`} to={`/writing/${index}`} key={article.title}><div className="article-card-cover"><img src={githubRaw(article.cover)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = articleFallbacks[index % articleFallbacks.length] }} alt="" loading="lazy" /></div><span>{String(index + 1).padStart(2, '0')} / {article.date || 'FIELD NOTE'}</span><h3>{article.title}</h3><p>{article.summary}</p><small>{article.tags?.join(' / ')}</small><Arrow /></Link>)}</div><div className="library-actions"><Link className="all-writing-link" to="/writing">{language === 'zh' ? '查看全部文章' : 'View all writing'} <Arrow /></Link><Link className="notes-entry" to="/study"><span>NOTES / 笔记</span><strong>{language === 'zh' ? '进入文件浏览器' : 'Open file browser'}</strong><Arrow /></Link></div></section>

    <section id="contact" className="contact-section"><p className="eyebrow">{t.contactKicker}</p><h2>{t.contact}</h2><ResumePanel /><Subscribe /><div className="contact-links"><a href="mailto:fuwenji61616@gmail.com">EMAIL <Arrow /></a><a href="https://github.com/fuxiaoji" target="_blank" rel="noreferrer">GITHUB <Arrow /></a><a href="#top">BACK TO TOP ↑</a></div><footer><span>© 2026 FU WENJI</span><span>CHENGDU / CN</span><a href="#top">BACK TO TOP ↑</a></footer></section>
  </main>
}

function PageHero({ kicker, title, lead }) { return <header className="index-hero"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{lead}</p></header> }
function IndexShell({ children }) { const { t } = useLanguage(); return <main className="index-page">{children}<Link className="back-home" to="/">← {t.home}</Link></main> }

function ProjectsPage() { const { t } = useLanguage(); return <IndexShell><PageHero kicker="01 / WORK" title={t.projectsTitle} lead={t.projectsLead} /><div className="project-list index-projects">{projects.map(project => <ProjectCard project={project} detailed key={project.title} />)}</div></IndexShell> }

function AboutPage() {
  const { t, language } = useLanguage()
  return <IndexShell><PageHero kicker="04 / PROFILE" title={t.profile} lead={t.bio1} /><section className="about-index"><div className="about-portrait"><img src="/photo/8562470192cf76943e9acf21df4fd607.jpg" alt="傅文基个人照" /></div><div><p className="about-lead">{t.bio2}</p><dl className="facts">{facts.map(([value, zhLabel, enLabel]) => <div key={value}><dt>{value}</dt><dd>{language === 'zh' ? zhLabel : enLabel}</dd></div>)}</dl></div></section><ResumePanel /><Subscribe /></IndexShell>
}

function ArticlesPage() {
  const { t, language } = useLanguage(); const [articles, setArticles] = useState([]); const [query, setQuery] = useState('')
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  const filtered = articles.map((article, index) => ({ ...article, index })).filter(article => `${article.title} ${article.summary} ${(article.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <IndexShell><PageHero kicker="02 / WRITING" title={t.articlesTitle} lead={t.articlesLead} /><section className="writing-browser"><div className="writing-toolbar"><label><span>{language === 'zh' ? '搜索文章' : 'Search writing'}</span><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder={language === 'zh' ? '输入标题、主题或关键词…' : 'Title, topic or keyword…'} /></label><p><strong>{String(filtered.length).padStart(2, '0')}</strong> {language === 'zh' ? '篇内容' : 'ENTRIES'}</p></div><div className="writing-card-grid">{filtered.map(article => <Link to={`/writing/${article.index}`} className="writing-card" key={article.title}><span>{String(article.index + 1).padStart(2, '0')} / {article.date || 'FIELD NOTE'}</span><h2>{article.title}</h2><p>{article.summary}</p><small>{article.tags?.join(' / ')}</small><Arrow /></Link>)}</div>{filtered.length === 0 && <p className="writing-empty">{language === 'zh' ? '没有匹配的文章。' : 'No matching writing.'}</p>}</section></IndexShell>
}

const headingId = (text, index) => `section-${index}-${text.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`
function MarkdownContent({ source }) {
  let headingIndex = -1
  return <div className="article-prose">{source.split(/\r?\n/).map((line, index) => {
    const heading = line.match(/^(#{1,4})\s+(.+)/)
    if (heading) { headingIndex += 1; const Tag = `h${Math.min(heading[1].length + 1, 4)}`; return <Tag id={headingId(heading[2], headingIndex)} key={index}>{heading[2]}</Tag> }
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (image) return null
    if (/^[-*]\s+/.test(line)) return <p className="article-list-line" key={index}><span>—</span>{line.replace(/^[-*]\s+/, '')}</p>
    if (/^>\s*/.test(line)) return <blockquote key={index}>{line.replace(/^>\s*/, '')}</blockquote>
    if (!line.trim()) return null
    return <p key={index}>{line.replace(/\*\*|__/g, '')}</p>
  })}</div>
}

function ArticleDetailPage() {
  const { articleId } = useParams(); const { language } = useLanguage(); const [articles, setArticles] = useState([]); const [source, setSource] = useState('')
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  const index = Number(articleId); const article = articles[index]
  useEffect(() => {
    if (!article) return undefined
    let current = true
    const loader = articleMarkdown[`/${article.md}`] || Object.entries(articleMarkdown).find(([path]) => path.endsWith(article.md.split('/').pop()))?.[1]
    if (loader) loader().then(markdown => { if (current) setSource(markdown) }).catch(() => { if (current) setSource('') })
    return () => { current = false }
  }, [article])
  if (!article) return <main className="article-detail"><p className="eyebrow">LOADING / WRITING</p></main>
  const headings = []; source.split(/\r?\n/).forEach(line => { const match = line.match(/^(#{1,4})\s+(.+)/); if (match) headings.push(match[2]) })
  const recommendations = articles.map((item, itemIndex) => ({ ...item, itemIndex })).filter(item => item.itemIndex !== index).sort((a, b) => (b.tags || []).filter(tag => article.tags?.includes(tag)).length - (a.tags || []).filter(tag => article.tags?.includes(tag)).length).slice(0, 3)
  return <main className="article-detail"><header className="article-detail-hero"><Link to="/writing">← {language === 'zh' ? '返回文章库' : 'Writing index'}</Link><p className="eyebrow">{article.tags?.join(' / ')} · {article.date}</p><h1>{article.title}</h1><p>{article.summary}</p></header><div className="article-layout"><aside><p className="eyebrow">CONTENTS / 目录</p>{headings.length ? headings.map((heading, headingIndex) => <a href={`#${headingId(heading, headingIndex)}`} key={`${heading}-${headingIndex}`}><span>{String(headingIndex + 1).padStart(2, '0')}</span>{heading}</a>) : <p>{language === 'zh' ? '正文阅读' : 'Article'}</p>}</aside>{source ? <MarkdownContent source={source} /> : <div className="article-prose"><p>{article.summary}</p><p>{language === 'zh' ? '原文内容正在迁移到新版阅读器，可暂时前往源文件查看。' : 'The full text is being migrated into the new reader.'}</p><a className="source-article-link" href={githubFile(article.md)} target="_blank" rel="noreferrer">{language === 'zh' ? '查看原始文章' : 'Open source article'} <Arrow /></a></div>}</div><section className="related-writing"><p className="eyebrow">RELATED / 相似推荐</p><div>{recommendations.map(item => <Link to={`/writing/${item.itemIndex}`} key={item.title}><span>{item.date}</span><h2>{item.title}</h2><p>{item.summary}</p><Arrow /></Link>)}</div></section></main>
}

const flattenNotes = (nodes, result = []) => { (nodes || []).forEach(node => node.type === 'file' ? result.push(node) : flattenNotes(node.children, result)); return result }
function NotesPage() {
  const { t } = useLanguage(); const [root, setRoot] = useState(null); const [selected, setSelected] = useState(0)
  useEffect(() => { fetch('/notes.json').then(r => r.json()).then(setRoot).catch(() => setRoot(null)) }, [])
  const folders = root?.children?.filter(node => node.type === 'directory') || []; const active = folders[selected]; const files = active ? flattenNotes(active.children, []) : []
  return <IndexShell><PageHero kicker="03 / NOTES" title={t.notesTitle} lead={t.notesLead} /><div className="file-browser"><aside><div className="browser-label"><i /> NOTE REPOSITORY</div>{folders.map((folder, index) => <button className={selected === index ? 'active' : ''} type="button" onClick={() => setSelected(index)} key={folder.name}><span>▸</span><strong>{folder.name}</strong><small>{flattenNotes(folder.children, []).length}</small></button>)}</aside><section><header><span>note</span><b>/</b><strong>{active?.name || '—'}</strong><small>{files.length} FILES</small></header><div className="file-rows">{files.map((note, index) => <a href={githubFile(note.path.replace(/^note\//, ''), 'note')} target="_blank" rel="noreferrer" key={`${note.path}-${index}`}><span className="file-icon">{note.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}</span><div><strong>{note.name}</strong><small>{note.path.split('/').slice(2, -1).join(' / ') || active?.name}</small></div><em>OPEN ↗</em></a>)}</div></section></div></IndexShell>
}

export default function App() {
  const location = useLocation(); const scope = useRef(null); usePortfolioMotion(scope, location.pathname)
  return <div ref={scope}><div className="route-curtain" aria-hidden="true"><span>FWJ / INDEX</span></div><Shell><Routes location={location}><Route path="/" element={<Home />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/articles" element={<ArticlesPage />} /><Route path="/writing" element={<ArticlesPage />} /><Route path="/writing/:articleId" element={<ArticleDetailPage />} /><Route path="/notes" element={<NotesPage />} /><Route path="/study" element={<NotesPage />} /><Route path="/about" element={<AboutPage />} /></Routes></Shell></div>
}
