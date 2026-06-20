import { Link, Route, Routes } from 'react-router-dom'

const nav = [
  ['Work', '/#work'],
  ['Profile', '/#profile'],
  ['Writing', '/writing'],
  ['Contact', '/#contact'],
]

function Shell({ children }) {
  return (
    <div className="site-shell">
      <header className="nav-shell">
        <Link className="wordmark" to="/" aria-label="返回首页">FWJ<span>®</span></Link>
        <nav aria-label="主导航">
          {nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </nav>
        <span className="availability">Available / 2026</span>
      </header>
      {children}
    </div>
  )
}

function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">AI BUILDER × FINANCE MIND</p>
        <h1>FU<br />WENJI</h1>
        <p className="hero-intro">把模型、代码和商业问题<br />做成真正能跑的东西。</p>
      </section>
      <section id="work" className="section"><h2>Selected Work</h2></section>
      <section id="profile" className="section"><h2>Profile</h2></section>
      <section id="contact" className="section"><h2>Let’s Talk</h2></section>
    </main>
  )
}

function Writing() {
  return <main className="page"><p className="eyebrow">INDEX / WRITING</p><h1>Ideas in<br />progress.</h1><Link to="/">← Back home</Link></main>
}

export default function App() {
  return <Shell><Routes><Route path="/" element={<Home />} /><Route path="/writing" element={<Writing />} /></Routes></Shell>
}
