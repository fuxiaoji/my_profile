import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { awards, capabilities, facts, photographs, projects } from './data'
import { useLanguage } from './i18n'
import { usePortfolioMotion } from './usePortfolioMotion'

function Arrow() { return <span aria-hidden="true">↗</span> }
const githubFile = (path, repo = 'my_profile') => `https://github.com/fuxiaoji/${repo}/blob/main/${path.split('/').map(encodeURIComponent).join('/')}`

function Shell({ children }) {
  const { t, toggle } = useLanguage()
  const navItems = [['/projects', t.navWork], ['/writing', t.navArticles], ['/study', t.navNotes], ['/about', t.navProfile]]
  return <div className="site-shell">
    <header className="nav-shell">
      <Link className="wordmark" to="/" aria-label={t.home}>FWJ<span>®</span></Link>
      <nav aria-label="主导航">
        {navItems.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : undefined}>{label}</NavLink>)}
      </nav>
      <div className="nav-actions"><span className="availability"><i /> {t.available}</span><button type="button" onClick={toggle} aria-label="切换语言">{t.language}</button></div>
    </header>{children}
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

function Home() {
  const { t, language } = useLanguage()
  return <main>
    <div className="opening" aria-hidden="true"><div className="opening-panel" /><div className="opening-panel" /><div className="opening-panel" /><p className="opening-label"><span>FU WENJI / PORTFOLIO</span></p><strong className="opening-count">000</strong></div>
    <section id="top" className="hero" aria-labelledby="hero-title"><div className="hero-top"><p className="eyebrow">{t.heroRole}</p><p>CHENGDU / CN<br />30.67° N, 104.06° E</p></div><h1 id="hero-title"><span>FU</span><span>WENJI</span></h1><div className="hero-bottom"><p className="hero-intro">{t.heroLine}</p><p className="scroll-note">{t.explore} <b>↓</b></p></div></section>

    <section className="manifesto"><p className="eyebrow">{t.introKicker}</p><p className="manifesto-copy">{t.intro}</p><p className="manifesto-cn">{t.introDetail}</p></section>

    <section id="work" className="work-section"><SectionTitle index="01" title={t.selected} subtitle={t.selectedSub} /><div className="project-list">{projects.slice(0, 3).map(project => <ProjectCard project={project} key={project.title} />)}</div><Link className="section-cta" to="/projects">{t.allProjects} <Arrow /></Link></section>

    <section className="capabilities-section"><SectionTitle index="02" title={t.method} subtitle={t.methodSub} light /><div className="capability-list">{capabilities.map(([title, tools, zhTitle], i) => <article key={title}><span>0{i + 1}</span><h3>{language === 'zh' ? zhTitle : title}</h3><p>{tools}</p></article>)}</div></section>

    <section id="profile" className="profile-section"><SectionTitle index="03" title={t.profile} subtitle={t.profileSub} light /><div className="profile-grid"><div className="portrait"><img src="/photo/IMG_5292.jpeg" alt="傅文基与朋友" /></div><div className="profile-copy"><p>{t.hello}</p><p>{t.bio1}</p><p>{t.bio2}</p></div><dl className="facts">{facts.map(([value, zhLabel, enLabel]) => <div key={value}><dt>{value}</dt><dd>{language === 'zh' ? zhLabel : enLabel}</dd></div>)}</dl></div><div className="awards-strip">{awards.map(([value, zhLabel, enLabel]) => <article key={value}><strong>{value}</strong><p>{language === 'zh' ? zhLabel : enLabel}</p></article>)}</div></section>

    <section className="photo-section" aria-label={t.field}><div className="photo-sticky"><div className="photo-heading"><p className="eyebrow">{t.fieldSub}</p><h2>{t.field}</h2><p>{t.scrollGallery}</p></div><div className="photo-track">{photographs.map(([file, label], index) => <figure className={`photo-frame photo-frame-${index % 4}`} key={file}><div><img src={`/photo/${file}`} alt={t.field} loading="lazy" decoding="async" /></div><figcaption><span>{label}</span><span>FU WENJI ARCHIVE</span></figcaption></figure>)}<div className="photo-end"><span>12 MOMENTS</span><strong>KEEP<br />LOOKING.</strong></div></div></div></section>

    <section className="library-section"><SectionTitle index="04" title={t.library} subtitle={t.librarySub} /><div className="library-grid"><Link to="/writing"><span>01 / WRITING</span><h3>{language === 'zh' ? '文章库' : 'Writing'}</h3><p>{t.articlesDesc}</p><b>{t.openArticles} <Arrow /></b></Link><Link to="/study"><span>02 / NOTES</span><h3>{language === 'zh' ? '笔记库' : 'Notes'}</h3><p>{t.notesDesc}</p><b>{t.openNotes} <Arrow /></b></Link></div></section>

    <section id="contact" className="contact-section"><p className="eyebrow">{t.contactKicker}</p><h2>{t.contact}</h2><Subscribe /><div className="contact-links"><a href="mailto:fuwenji61616@gmail.com">EMAIL <Arrow /></a><a href="https://github.com/fuxiaoji" target="_blank" rel="noreferrer">GITHUB <Arrow /></a><a href="/files/resume-internet.pdf" target="_blank">{t.resume} <Arrow /></a></div><footer><span>© 2026 FU WENJI</span><span>CHENGDU / CN</span><a href="#top">BACK TO TOP ↑</a></footer></section>
  </main>
}

function PageHero({ kicker, title, lead }) { return <header className="index-hero"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{lead}</p></header> }
function IndexShell({ children }) { const { t } = useLanguage(); return <main className="index-page">{children}<Link className="back-home" to="/">← {t.home}</Link></main> }

function ProjectsPage() { const { t } = useLanguage(); return <IndexShell><PageHero kicker="01 / WORK" title={t.projectsTitle} lead={t.projectsLead} /><div className="project-list index-projects">{projects.map(project => <ProjectCard project={project} detailed key={project.title} />)}</div></IndexShell> }

function AboutPage() {
  const { t, language } = useLanguage()
  return <IndexShell><PageHero kicker="04 / PROFILE" title={t.profile} lead={t.bio1} /><section className="about-index"><div className="about-portrait"><img src="/photo/IMG_5292.jpeg" alt="傅文基与朋友" /></div><div><p className="about-lead">{t.bio2}</p><dl className="facts">{facts.map(([value, zhLabel, enLabel]) => <div key={value}><dt>{value}</dt><dd>{language === 'zh' ? zhLabel : enLabel}</dd></div>)}</dl></div></section><Subscribe /></IndexShell>
}

function ArticlesPage() {
  const { t } = useLanguage(); const [articles, setArticles] = useState([])
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  return <IndexShell><PageHero kicker="02 / WRITING" title={t.articlesTitle} lead={t.articlesLead} /><div className="content-index">{articles.map((article, index) => <a href={article.md ? githubFile(article.md) : '#'} target="_blank" rel="noreferrer" key={article.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{article.title}</h2><p>{article.summary}</p></div><small>{article.date || 'FIELD NOTE'}</small><Arrow /></a>)}</div></IndexShell>
}

const flattenNotes = (nodes, result = []) => { (nodes || []).forEach(node => node.type === 'file' ? result.push(node) : flattenNotes(node.children, result)); return result }
function NotesPage() {
  const { t } = useLanguage(); const [notes, setNotes] = useState([])
  useEffect(() => { fetch('/notes.json').then(r => r.json()).then(data => setNotes(flattenNotes([data]))).catch(() => setNotes([])) }, [])
  return <IndexShell><PageHero kicker="03 / NOTES" title={t.notesTitle} lead={t.notesLead} /><div className="notes-grid">{notes.slice(0, 80).map((note, index) => <a href={githubFile(note.path.replace(/^note\//, ''), 'note')} target="_blank" rel="noreferrer" key={`${note.path}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><h2>{note.name}</h2><p>{note.path.split('/').slice(1, -1).join(' / ')}</p><Arrow /></a>)}{!notes.length && <p>{t.empty}</p>}</div></IndexShell>
}

export default function App() {
  const location = useLocation(); const scope = useRef(null); usePortfolioMotion(scope, location.pathname)
  return <div ref={scope}><div className="route-curtain" aria-hidden="true" /><Shell><Routes location={location}><Route path="/" element={<Home />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/articles" element={<ArticlesPage />} /><Route path="/writing" element={<ArticlesPage />} /><Route path="/notes" element={<NotesPage />} /><Route path="/study" element={<NotesPage />} /><Route path="/about" element={<AboutPage />} /></Routes></Shell></div>
}
