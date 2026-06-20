import { useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { awards, capabilities, facts, projects } from './data'
import { usePortfolioMotion } from './usePortfolioMotion'

const nav = [['Work', '#work'], ['Profile', '#profile'], ['Writing', '/writing'], ['Contact', '#contact']]

function Arrow() { return <span aria-hidden="true">↗</span> }

function Shell({ children }) {
  return (
    <div className="site-shell">
      <header className="nav-shell">
        <Link className="wordmark" to="/" aria-label="返回首页">FWJ<span>®</span></Link>
        <nav aria-label="主导航">
          {nav.map(([label, href]) => href.startsWith('/')
            ? <Link key={label} to={href}>{label}</Link>
            : <a key={label} href={`/${href}`}>{label}</a>)}
        </nav>
        <span className="availability"><i /> Available for internship</span>
      </header>
      {children}
    </div>
  )
}

function SectionTitle({ index, children, light = false }) {
  return <div className={`section-heading ${light ? 'light' : ''}`}><span>({index})</span><h2>{children}</h2></div>
}

function Home() {
  return (
    <main>
      <div className="opening" aria-hidden="true">
        <div className="opening-panel" /><div className="opening-panel" /><div className="opening-panel" />
        <p className="opening-label"><span>FU WENJI / PORTFOLIO</span></p>
        <strong className="opening-count">000</strong>
      </div>
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-top"><p className="eyebrow">AI BUILDER × FINANCE MIND</p><p>CHENGDU / CN<br />30.67° N, 104.06° E</p></div>
        <h1 id="hero-title"><span>FU</span><span>WENJI</span></h1>
        <div className="hero-bottom">
          <p className="hero-intro">把模型、代码和商业问题<br />做成真正能跑的东西。</p>
          <p className="scroll-note">SCROLL TO EXPLORE <b>↓</b></p>
        </div>
      </section>

      <section className="manifesto">
        <p className="eyebrow">WHAT I DO / 2026</p>
        <p className="manifesto-copy">I build <em>intelligent systems</em><br />for complex, real-world play.</p>
        <p className="manifesto-cn">金融训练我判断。<br />工程让我验证。<br />游戏教我理解系统。</p>
      </section>

      <section id="work" className="work-section">
        <SectionTitle index="01">Selected<br />Work</SectionTitle>
        <div className="project-list">
          {projects.map((project) => (
            <a className="project-card" href={project.link} target="_blank" rel="noreferrer" key={project.title}>
              <div className={`project-visual ${project.tone}`}>
                <span className="project-no">{project.no}</span>
                <div className="orb" />
                <div className="metric"><strong>{project.metric}</strong><small>{project.metricLabel}</small></div>
              </div>
              <div className="project-body">
                <div><p>{project.period} / {project.subtitle}</p><h3>{project.title}</h3></div>
                <p className="project-copy">{project.copy}</p>
                <ul>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                <Arrow />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="profile" className="profile-section">
        <SectionTitle index="02" light>Profile &<br />Practice</SectionTitle>
        <div className="profile-grid">
          <div className="portrait"><img src="/photo/IMG_5292.jpeg" alt="傅文基的生活摄影" /></div>
          <div className="profile-copy"><p>我是傅文基。</p><p>金融学本科生，也是独立开发者。喜欢把看似不相干的领域接起来：用强化学习做兵棋 AI，用金融模型拆现实问题，再把过程公开成代码。</p><p>我在找一段能碰到真实产品、真实用户和硬问题的开发实习。</p></div>
          <dl className="facts">{facts.map(([value, label]) => <div key={value}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
        </div>
      </section>

      <section className="capabilities-section">
        <p className="eyebrow">CAPABILITY INDEX</p>
        <div>{capabilities.map(([title, tools], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{tools}</p></article>)}</div>
      </section>

      <section className="evidence-section">
        <SectionTitle index="03">Proof, not<br />adjectives.</SectionTitle>
        <div className="awards-grid">{awards.map(([value, label]) => <article key={value}><strong>{value}</strong><p>{label}</p></article>)}</div>
      </section>

      <section id="contact" className="contact-section">
        <p className="eyebrow">HAVE A HARD PROBLEM?</p>
        <h2>LET’S<br /><i>BUILD.</i></h2>
        <div className="contact-links">
          <a href="mailto:fuwenji61616@gmail.com">EMAIL <Arrow /></a>
          <a href="https://github.com/fuxiaoji" target="_blank" rel="noreferrer">GITHUB <Arrow /></a>
          <a href="/files/resume-internet.pdf" target="_blank">RÉSUMÉ <Arrow /></a>
        </div>
        <footer><span>© 2026 FU WENJI</span><span>DESIGNED IN CHENGDU</span><a href="#top">BACK TO TOP ↑</a></footer>
      </section>
    </main>
  )
}

function Writing() {
  const [articles, setArticles] = useState([])
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  return (
    <main className="writing-page">
      <div className="writing-hero"><p className="eyebrow">INDEX / WRITING</p><h1>Ideas in<br /><i>progress.</i></h1><p>金融、AI、兵棋和那些暂时没有分类的念头。</p></div>
      <div className="article-index">
        {articles.map((article, index) => {
          const source = article.url || (article.md ? `https://github.com/fuxiaoji/my_profile/blob/main/${article.md.split('/').map(encodeURIComponent).join('/')}` : '#')
          return <a href={source} target="_blank" rel="noreferrer" key={article.title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{article.title}</h2><p>{article.date || article.category || 'FIELD NOTE'}</p><Arrow /></a>
        })}
      </div>
      <Link className="back-home" to="/">← Back home</Link>
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const scope = useRef(null)
  usePortfolioMotion(scope, location.pathname)
  return <div ref={scope}><div className="route-curtain" aria-hidden="true" /><Shell><Routes location={location}><Route path="/" element={<Home />} /><Route path="/writing" element={<Writing />} /></Routes></Shell></div>
}
