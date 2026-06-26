import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { awards, capabilities, facts, photographs, projects } from './data'
import { useLanguage } from './i18n'
import { usePortfolioMotion } from './usePortfolioMotion'

function Arrow() { return <span aria-hidden="true">↗</span> }
const githubFile = (path, repo = 'my_profile') => `https://github.com/fuxiaoji/${repo}/blob/main/${path.split('/').map(encodeURIComponent).join('/')}`
const githubRaw = path => `https://raw.githubusercontent.com/fuxiaoji/my_profile/main/${path.split('/').map(encodeURIComponent).join('/')}`
const noteCdn = path => `https://cdn.jsdelivr.net/gh/fuxiaoji/note@main/${path.split('/').map(encodeURIComponent).join('/')}`
const articleMarkdown = import.meta.glob('/文章/**/*.md', { query: '?raw', import: 'default' })
const articleFallbackCover = article => {
  const topic = `${article.title} ${(article.tags || []).join(' ')}`.toLowerCase()
  if (/稳定币|web3|货币|currency|crypto/.test(topic)) return '/article-covers/digital-finance.jpg'
  if (/人工智能|银行|\bai\b|建模|数据/.test(topic)) return '/article-covers/banking-ai.jpg'
  if (/宏观|经济|关税|制造业|市场/.test(topic)) return '/article-covers/market-research.jpg'
  return '/article-covers/strategy-map.jpg'
}
const MarkdownContent = lazy(() => import('./MarkdownContent'))

function Shell({ children }) {
  const { t, toggle } = useLanguage()
  const navItems = [['/projects', t.navWork], ['/game', t.navGame], ['/writing', t.navArticles], ['/study', t.navNotes], ['/about', t.navProfile]]
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
  const { t, language } = useLanguage(); const [email, setEmail] = useState(''); const [status, setStatus] = useState('idle')
  const submit = async event => {
    event.preventDefault(); if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const response = await fetch('https://formspree.io/f/xbdwnzwj', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: email.trim(), _subject: 'New subscriber from fuwenji.asia' }) })
      if (!response.ok) throw new Error('Subscription failed')
      setEmail(''); setStatus('success')
    } catch { setStatus('error') }
  }
  const message = status === 'success' ? (language === 'zh' ? '订阅成功，感谢关注。' : 'Subscribed. Thank you.') : status === 'error' ? (language === 'zh' ? '订阅失败，请稍后再试。' : 'Subscription failed. Please try again.') : t.subscribeHint
  return <form className={`subscribe-form subscribe-${status}`} onSubmit={submit}><div><p className="eyebrow">NEWSLETTER / 通讯</p><h3>{t.subscribeTitle}</h3><p>{t.subscribeDesc}</p></div><div className="subscribe-control"><label><span className="sr-only">Email</span><input type="email" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); if (status !== 'idle') setStatus('idle') }} placeholder={t.emailPlaceholder} /></label><button type="submit" disabled={status === 'loading'}>{status === 'loading' ? '…' : t.subscribe} <Arrow /></button><small role="status">{message}</small></div></form>
}

function ArticleCommunity() {
  const { language } = useLanguage(); const commentsRef = useRef(null)
  useEffect(() => {
    const container = commentsRef.current
    if (!container) return undefined
    container.innerHTML = ''
    const script = document.createElement('script')
    Object.entries({ src: 'https://giscus.app/client.js', 'data-repo': 'fuxiaoji/my_profile', 'data-repo-id': 'R_kgDOSE-1gg', 'data-category': 'Announcements', 'data-category-id': 'DIC_kwDOSE-1gs4C9JnF', 'data-mapping': 'pathname', 'data-strict': '0', 'data-reactions-enabled': '1', 'data-emit-metadata': '0', 'data-input-position': 'bottom', 'data-theme': 'light', 'data-lang': language === 'zh' ? 'zh-CN' : 'en', 'data-loading': 'lazy', crossorigin: 'anonymous', async: 'true' }).forEach(([key, value]) => script.setAttribute(key, value))
    container.appendChild(script)
    return () => { container.innerHTML = '' }
  }, [language])
  return <section className="article-community"><div className="article-comments"><header><p className="eyebrow">COMMENTS / 评论</p><span>{language === 'zh' ? '使用 GitHub 登录参与讨论' : 'Join with your GitHub account'}</span></header><div ref={commentsRef} /></div><Subscribe /></section>
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
  return <div className="home-project-mosaic">{projects.slice(0, 5).map((project, index) => <a className={`home-project-tile tile-${index + 1} ${project.tone}`} href={project.link} target="_blank" rel="noreferrer" key={project.title}><span>{project.no}</span><div className="tile-shape" /><div><p>{project.period} / {english ? project.enSubtitle : project.subtitle}</p><h3>{project.title}</h3></div><strong>{project.metric}</strong><Arrow /></a>)}<Link className="home-project-tool" to="/tools/tieba-spider"><div className="home-project-tool-cover"><img src="/project-covers/tieba-spider-shot.jpg" alt={language === 'zh' ? '贴吧爬虫页面截图' : 'Tieba crawler screenshot'} loading="lazy" /></div><div className="home-project-tool-meta"><span>TOOL / CRAWLER</span><strong>{language === 'zh' ? '贴吧爬虫页面' : 'Tieba Spider Page'}</strong><em>{language === 'zh' ? '抓取、预览、导出 Markdown' : 'Crawl, preview and export Markdown'}</em></div><i>OPEN ↗</i></Link></div>
}

function GamePreviewSection() {
  const { language } = useLanguage(); const zh = language === 'zh'
  return <section className="game-preview-section">
    <video className="game-preview-video" autoPlay muted loop playsInline preload="metadata" poster="/game/mmd-dance-02-poster.jpg" aria-hidden="true"><source src="/game/mmd-dance-02.mp4" type="video/mp4" /></video>
    <div className="game-preview-overlay" />
    <div className="game-preview-meta"><span>(GAME / MOTION)</span><span>MMD · BLENDER · REALTIME</span></div>
    <h2><span>MOTION.</span><span>WORLD.</span><span>STAGE.</span></h2>
    <div className="home-mmd-peek" aria-hidden="true"><video autoPlay muted loop playsInline preload="metadata" poster="/game/mmd-dance-01-poster.jpg"><source src="/game/mmd-dance-01.mp4" type="video/mp4" /></video><span>MMD DANCE / NEW WORK</span></div>
    <div className="game-preview-bottom"><div><p>{zh ? 'MMD 舞蹈、实时渲染与镜头调度' : 'MMD dance, realtime rendering and camera rhythm'}</p><strong>{zh ? '把角色动作、舞台光线和镜头节奏组织成可以循环观看的动态作品。' : 'Character motion, stage lighting and camera rhythm become loopable motion pieces.'}</strong></div><dl><div><dt>2</dt><dd>{zh ? '最新舞蹈视频' : 'new dance reels'}</dd></div><div><dt>4K</dt><dd>{zh ? '原始渲染素材' : 'source renders'}</dd></div></dl><Link to="/game">{zh ? '查看游戏与动态作品' : 'Enter game portfolio'} <Arrow /></Link></div>
  </section>
}

function Home({ openingVariant = 'v2' }) {
  const { t, language } = useLanguage(); const [featuredArticles, setFeaturedArticles] = useState([])
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(data => setFeaturedArticles(data.slice(0, 8))).catch(() => setFeaturedArticles([])) }, [])
  return <main>
    <div className={`opening opening--${openingVariant}`} aria-hidden="true"><div className="opening-panel" /><div className="opening-panel" /><div className="opening-panel" /><div className="opening-kicker"><span>INDEPENDENT DEVELOPER</span><span>PORTFOLIO / 2026</span></div><div className="opening-cn"><span>傅文基</span></div><i className="opening-rule" /><p className="opening-label"><span>FU WENJI / PORTFOLIO</span></p><strong className="opening-count">000</strong></div>
    <section id="top" className="hero" aria-labelledby="hero-title"><div className="hero-watermark" aria-hidden="true">傅文基</div><div className="hero-top"><p className="eyebrow">{t.heroRole}</p><p>CHENGDU / CN<br />30.67° N, 104.06° E</p></div><h1 id="hero-title"><span>FU</span><span>WENJI</span></h1><div className="hero-bottom"><p className="hero-intro">{t.heroLine}</p><p className="scroll-note">{t.explore} <b>↓</b></p></div></section>

    <section className="manifesto"><p className="eyebrow">{t.introKicker}</p><p className="manifesto-copy">{t.intro}</p><p className="manifesto-cn">{t.introDetail}</p></section>

    <section id="work" className="work-section home-work"><SectionTitle index="01" title={t.selected} subtitle={t.selectedSub} /><HomeProjectMosaic /><Link className="section-cta" to="/projects">{t.allProjects} <Arrow /></Link></section>

    <GamePreviewSection />

    <section className="capabilities-section"><SectionTitle index="02" title={t.method} subtitle={t.methodSub} light /><div className="capability-list">{capabilities.map(([title, tools, zhTitle, zhDesc, enDesc, zhPoints, enPoints], i) => <article key={title}><span>0{i + 1}</span><h3>{language === 'zh' ? zhTitle : title}</h3><div className="capability-detail"><p className="capability-tools">{tools}</p><p className="capability-desc">{language === 'zh' ? zhDesc : enDesc}</p><ul>{(language === 'zh' ? zhPoints : enPoints).map((point, pointIndex) => <li key={point}><span>{String(pointIndex + 1).padStart(2, '0')}</span><p>{point}</p></li>)}</ul></div></article>)}</div></section>

    <section id="profile" className="profile-section"><SectionTitle index="03" title={t.profile} subtitle={t.profileSub} light /><div className="profile-grid"><div className="portrait"><img src="/photo/8562470192cf76943e9acf21df4fd607.jpg" alt="傅文基个人照" /></div><div className="profile-copy"><p>{t.hello}</p><p>{t.bio1}</p><p>{t.bio2}</p></div><dl className="facts">{facts.map(([value, zhLabel, enLabel]) => <div key={value}><dt>{value}</dt><dd>{language === 'zh' ? zhLabel : enLabel}</dd></div>)}</dl></div><div className="awards-strip">{awards.map(([value, zhLabel, enLabel]) => <article key={value}><strong>{value}</strong><p>{language === 'zh' ? zhLabel : enLabel}</p></article>)}</div></section>

    <section className="photo-section" aria-label={t.field}><div className="photo-sticky"><div className="photo-heading"><p className="eyebrow">{t.fieldSub}</p><h2>{t.field}</h2><p>{t.scrollGallery}</p></div><div className="photo-track">{photographs.map(([file, label], index) => <figure className={`photo-frame photo-frame-${index % 4}`} key={file}><div><img src={`/photo/${file}`} alt={t.field} loading="lazy" decoding="async" /></div><figcaption><span>{label}</span><span>FU WENJI ARCHIVE</span></figcaption></figure>)}<div className="photo-end"><span>12 MOMENTS</span><strong>KEEP<br />LOOKING.</strong></div></div></div></section>

    <section className="library-section"><SectionTitle index="04" title={t.library} subtitle={t.librarySub} /><div className="home-article-cards">{featuredArticles.map((article, index) => <Link className={`home-article-card article-card-${index + 1}`} to={`/writing/${index}`} key={article.title}><div className="article-card-cover"><img src={/^https?:/i.test(article.cover || '') ? articleFallbackCover(article) : githubRaw(article.cover)} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = articleFallbackCover(article) }} alt={`${article.title} 文章封面`} loading="lazy" /></div><span>{String(index + 1).padStart(2, '0')} / {article.date || 'FIELD NOTE'}</span><h3>{article.title}</h3><p>{article.summary}</p><small>{article.tags?.join(' / ')}</small><Arrow /></Link>)}</div><div className="library-actions"><Link className="all-writing-link" to="/writing">{language === 'zh' ? '查看全部文章' : 'View all writing'} <Arrow /></Link><Link className="notes-entry" to="/study"><span>NOTES / 笔记</span><strong>{language === 'zh' ? '进入文件浏览器' : 'Open file browser'}</strong><Arrow /></Link></div></section>

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

const gameLiteracy = [
  ['01', 'STRATEGY / WARGAME', '策略与兵棋', '《钢铁雄心 IV》《维多利亚》各 1000+ 小时；体验 20+ 款硬核兵棋，持续产出攻略与战报。', '1,000+ hours each in Hearts of Iron IV and Victoria, plus 20+ hardcore wargames and a growing archive of guides and AARs.', '1000+ HRS × 2'],
  ['02', 'FPS / BATTLEFIELD', '战场与载具', '战地系列 2300+ 小时；《战地 1》2000+ 小时，110 级，胜率 67%，熟悉步兵、载具和空战节奏。', '2,300+ hours across Battlefield; 2,000+ in Battlefield 1 with a 67% win rate and deep infantry, vehicle and air-combat literacy.', '67% WIN RATE'],
  ['03', 'GaaS / ANIME', '长线内容', '长期体验原神、崩坏：星穹铁道、鸣潮等产品，理解内容版本节奏、角色驱动与抽卡商业化。', 'Long-term experience with major anime GaaS titles, with attention to update cadence, character-driven content and gacha monetisation.', 'LIVE OPS'],
  ['04', 'ACTION / SIM', '动作与模拟', '战舰世界、骑马与砍杀、实况足球各 500+ 小时，并完整体验多款动作与开放世界作品。', '500+ hours each across World of Warships, Mount & Blade and PES, alongside completed action and open-world titles.', '500+ HRS'],
]

const gameVisuals = {
  '01': [{ name: 'HEARTS OF IRON IV', image: '/game/covers/hoi4.jpg' }, { name: 'VICTORIA 3', image: '/game/covers/victoria3.jpg' }, { name: 'HARDCORE WARGAMES', code: '20+' }],
  '02': [{ name: 'BATTLEFIELD 1', image: '/game/covers/battlefield1.jpg' }, { name: 'AIR / CAVALRY', code: '20★' }, { name: 'WIN RATE', code: '67%' }],
  '03': [{ name: '原神', image: '/game/logos/genshin.png' }, { name: '崩坏：星穹铁道', image: '/game/logos/star-rail.png' }, { name: '鸣潮', image: '/game/logos/wuthering-waves.png' }, { name: '洛克王国', image: '/game/logos/roco.png' }, { name: '异环', code: 'NTE' }],
  '04': [{ name: 'WORLD OF WARSHIPS', image: '/game/covers/world-of-warships.jpg' }, { name: 'MOUNT & BLADE II', image: '/game/covers/bannerlord.jpg' }, { name: 'BLACK MYTH: WUKONG', image: '/game/covers/black-myth.jpg' }, { name: 'EFOOTBALL', image: '/game/covers/efootball.jpg' }],
}

function GamePage() {
  const { language } = useLanguage(); const zh = language === 'zh'
  return <main className="game-page">
    <section className="game-hero">
      <video autoPlay muted loop playsInline preload="metadata" poster="/game/helicopter-poster.webp" aria-hidden="true"><source src="/game/helicopter-ue5.mp4" type="video/mp4" /></video><div className="game-hero-shade" />
      <div className="game-hero-meta"><span>05 / GAME & REALTIME</span><span>CHENGDU / 2026</span></div>
      <h1><span>GAME</span><span>SYSTEMS</span></h1>
      <div className="game-hero-intro"><p>{zh ? '游戏开发 / AI / 实时视觉' : 'Game development / AI / realtime visual'}</p><strong>{zh ? '理解规则，构建系统，再让世界动起来。' : 'Understand the rules. Build the system. Make the world move.'}</strong><a href="#game-work">{zh ? '向下探索' : 'Explore'} ↓</a></div>
    </section>

    <section className="game-statement" id="game-work"><p className="eyebrow">PROFILE / GAME</p><h2>{zh ? '从玩家经验，走向可运行的游戏系统。' : 'From player literacy to systems that run.'}</h2><div><p>{zh ? '我的游戏方向不是孤立的美术或代码练习：一端是对策略、战场、长线内容与动作循环的长期观察，另一端是 C++、PyTorch、UE5、Unity 与 Blender 的工程实践。' : 'My game practice connects years of player literacy with engineering across C++, PyTorch, UE5, Unity and Blender.'}</p><dl><div><dt>2300+</dt><dd>BATTLEFIELD HOURS</dd></div><div><dt>200+</dt><dd>EVOLVED AI MODELS</dd></div><div><dt>20+</dt><dd>HARDCORE WARGAMES</dd></div></dl></div></section>

    <section className="game-case">
      <div className="game-case-heading"><p className="eyebrow">01 / GAME AI</p><h2>BISMARCK<br />HUNT</h2><a href="https://github.com/fuxiaoji/wargame" target="_blank" rel="noreferrer">GITHUB / SOURCE <Arrow /></a></div>
      <div className="game-case-copy"><p>{zh ? '把经典隐藏移动兵棋《追击俾斯麦》完整电子化，并构建可以大规模训练与观测的 AI 演化环境。' : 'A complete digital adaptation of the hidden-movement wargame, rebuilt as a scalable AI training environment.'}</p><ol><li><span>01</span>{zh ? 'C++ 并发仿真与 TypeScript 实时可视化组成异构架构。' : 'Heterogeneous C++ simulation and TypeScript realtime visualisation.'}</li><li><span>02</span>{zh ? '结合 Transformer、LSTM 与强化学习表达不完全信息决策。' : 'Transformer, LSTM and reinforcement learning for imperfect-information decisions.'}</li><li><span>03</span>{zh ? '演化 200+ 模型，最佳策略相对基线胜率提升 40%。' : 'Evolved 200+ models; the best strategy beat the baseline by 40%.'}</li></ol><div className="game-stack"><span>C++</span><span>PYTORCH</span><span>TRANSFORMER</span><span>LSTM</span><span>TYPESCRIPT</span></div></div>
    </section>

    <section className="game-wallpaper"><img src="/game/enchanted-forest.webp" alt={zh ? '魔法森林实时渲染作品' : 'Enchanted forest realtime render'} /><div><span>02 / ENVIRONMENT ART</span><h2>ENCHANTED<br />FOREST</h2><p>{zh ? '角色、植被、水面、体积光与景深共同组织的幻想场景练习。' : 'A fantasy environment study in character staging, foliage, water, volumetric light and depth of field.'}</p></div></section>

    <section className="game-reels"><header><p className="eyebrow">03 / MOTION STUDIES</p><h2>{zh ? '实时世界，也需要镜头与节奏。' : 'Realtime worlds need camera and rhythm.'}</h2></header><div className="game-reel-grid game-reel-grid-featured"><figure className="mmd-feature-reel"><video controls muted loop playsInline preload="metadata" poster="/game/mmd-dance-02-poster.jpg"><source src="/game/mmd-dance-02.mp4" type="video/mp4" /></video><figcaption><span>MMD / DANCE FILM</span><p>{zh ? '最新 MMD 舞蹈作品：用舞台光、角色动作和镜头切换制造节奏，而不是只展示模型。' : 'A new MMD dance piece focused on stage light, character motion and camera rhythm.'}</p></figcaption></figure><figure><video controls muted loop playsInline preload="metadata" poster="/game/mmd-dance-01-poster.jpg"><source src="/game/mmd-dance-01.mp4" type="video/mp4" /></video><figcaption><span>MMD / CAMERA TEST</span><p>{zh ? '第二支舞蹈片段作为横向补充，展示动作连续性和构图变化。' : 'A companion dance reel showing continuity and composition shifts.'}</p></figcaption></figure><figure><video controls muted loop playsInline preload="metadata" poster="/game/helicopter-poster.webp"><source src="/game/helicopter-ue5.mp4" type="video/mp4" /></video><figcaption><span>UE5 / CINEMATIC</span><p>{zh ? '直升机、角色与环境共同构成的实时过场实验。' : 'A realtime cinematic study with vehicle, character and environment.'}</p></figcaption></figure><figure><video controls muted loop playsInline preload="metadata" poster="/game/forest-poster.webp"><source src="/game/forest-render.mp4" type="video/mp4" /></video><figcaption><span>BLENDER / SCENE ANIMATION</span><p>{zh ? '材质、灯光、构图与镜头运动练习。' : 'Material, lighting, composition and camera study.'}</p></figcaption></figure></div></section>

    <section className="game-toolkit"><p className="eyebrow">04 / REALTIME CRAFT</p><div className="game-toolkit-grid"><article><span>01</span><h3>UE5</h3><p>Blueprint / C++ / Sequencer / Lighting</p></article><article><span>02</span><h3>UNITY</h3><p>Gameplay prototype / Interaction / Scene</p></article><article><span>03</span><h3>BLENDER</h3><p>Modeling / Texturing / Shader / Animation</p></article><article><span>04</span><h3>GAME AI</h3><p>PyTorch / RL / Evolution / Multi-agent</p></article></div></section>

    <section id="player-literacy" className="game-literacy"><header><p className="eyebrow">05 / PLAYER LITERACY</p><h2>{zh ? '大量游玩不是数字，是对系统手感的长期采样。' : 'Playtime is long-term sampling of how systems feel.'}</h2></header><div>{gameLiteracy.map(([no, en, title, copy, enCopy, metric]) => <article key={no}><div className={`game-literacy-visual game-visual-${no}`}>{gameVisuals[no].map(item => <figure className={item.image ? 'has-image' : 'is-stat'} key={item.name}>{item.image ? <img src={item.image} alt={`${item.name} 游戏视觉`} /> : <b>{item.code}</b>}<figcaption>{item.name}</figcaption></figure>)}</div><span>{no} / {en}</span><h3>{zh ? title : en}</h3><p>{zh ? copy : enCopy}</p><strong>{metric}</strong></article>)}</div></section>

    <section className="game-contact"><p>GAME DEVELOPMENT / AI / REALTIME</p><h2>{zh ? '想一起做一个会动、会思考的世界？' : 'Build a world that moves and thinks?'}</h2><div><a href="mailto:fuwenji61616@gmail.com">EMAIL <Arrow /></a><a href="/files/resume-game.pdf" download>{zh ? '下载游戏方向简历' : 'Download game résumé'} <Arrow /></a><Link to="/">{zh ? '返回首页' : 'Back home'} <Arrow /></Link></div></section>
  </main>
}

function TiebaSpiderPage() {
  const { language } = useLanguage(); const zh = language === 'zh'
  return <IndexShell><PageHero kicker="06 / WEB TOOL" title={zh ? '贴吧爬虫页面' : 'Tieba Spider Tool'} lead={zh ? '旧版爬虫工具已接入新版站点。保留原有操作体验，并加上统一入口。' : 'The legacy Tieba crawler tool is now integrated into the redesigned site with a unified entry.'} /><section className="tieba-tool-page"><article className="tieba-tool-intro"><p className="eyebrow">SCRAPE / PREVIEW / EXPORT</p><h2>{zh ? '抓取贴吧内容，整理为可读的 Markdown 档案。' : 'Capture Tieba threads and archive them as readable Markdown.'}</h2><p>{zh ? '支持帖子链接输入、楼中楼与图片选项、源码预览、渲染预览、复制与下载。页面保留你之前的完整工具能力。' : 'Supports thread URL input, nested replies and image options, source/preview panes, clipboard copy and Markdown download.'}</p><div><a href="/tieba-spider.html" target="_blank" rel="noreferrer">{zh ? '打开爬虫页面' : 'Open crawler page'} <Arrow /></a><a href="/projects">{zh ? '返回项目列表' : 'Back to projects'} <Arrow /></a></div></article><figure className="tieba-tool-shot"><img src="/project-covers/tieba-spider-shot.jpg" alt={zh ? '贴吧爬虫工具截图' : 'Tieba spider tool screenshot'} loading="lazy" /><figcaption>{zh ? '实时页面截图：保留旧版功能，统一新版入口。' : 'Live screenshot: legacy functionality with modern portfolio entry.'}</figcaption></figure></section></IndexShell>
}

function ArticlesPage() {
  const { t, language } = useLanguage(); const [articles, setArticles] = useState([]); const [query, setQuery] = useState('')
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  const filtered = articles.map((article, index) => ({ ...article, index })).filter(article => `${article.title} ${article.summary} ${(article.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <IndexShell><PageHero kicker="02 / WRITING" title={t.articlesTitle} lead={t.articlesLead} /><section className="writing-browser"><div className="writing-toolbar"><label><span>{language === 'zh' ? '搜索文章' : 'Search writing'}</span><input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder={language === 'zh' ? '输入标题、主题或关键词…' : 'Title, topic or keyword…'} /></label><p><strong>{String(filtered.length).padStart(2, '0')}</strong> {language === 'zh' ? '篇内容' : 'ENTRIES'}</p></div><div className="writing-card-grid">{filtered.map(article => <Link to={`/writing/${article.index}`} className="writing-card" key={article.title}><span>{String(article.index + 1).padStart(2, '0')} / {article.date || 'FIELD NOTE'}</span><h2>{article.title}</h2><p>{article.summary}</p><small>{article.tags?.join(' / ')}</small><Arrow /></Link>)}</div>{filtered.length === 0 && <p className="writing-empty">{language === 'zh' ? '没有匹配的文章。' : 'No matching writing.'}</p>}</section></IndexShell>
}

const headingId = (text, index) => `section-${index}-${text.replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`

function ArticleDetailPage() {
  const { articleId } = useParams(); const { language } = useLanguage(); const [articles, setArticles] = useState([]); const [source, setSource] = useState(''); const [tocOpen, setTocOpen] = useState(true); const [activeHeading, setActiveHeading] = useState(0)
  useEffect(() => { fetch('/articles.json').then(r => r.json()).then(setArticles).catch(() => setArticles([])) }, [])
  const index = Number(articleId); const article = articles[index]
  useEffect(() => {
    if (!article) return undefined
    let current = true
    const loader = articleMarkdown[`/${article.md}`] || Object.entries(articleMarkdown).find(([path]) => path.endsWith(article.md.split('/').pop()))?.[1]
    if (loader) loader().then(markdown => { if (current) setSource(markdown) }).catch(() => { if (current) setSource('') })
    return () => { current = false }
  }, [article])
  useEffect(() => {
    if (!source) return undefined
    let frame = 0; let disposed = false
    const syncActiveHeading = () => {
      frame = 0
      if (disposed) return
      const nodes = [...document.querySelectorAll('.article-prose h2, .article-prose h3, .article-prose h4')]
      if (!nodes.length) return
      const current = nodes.reduce((active, node, headingIndex) => node.getBoundingClientRect().top <= 150 ? headingIndex : active, 0)
      setActiveHeading(current)
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(syncActiveHeading) }
    const start = window.requestAnimationFrame(() => { syncActiveHeading(); window.addEventListener('scroll', onScroll, { passive: true }) })
    return () => { disposed = true; window.cancelAnimationFrame(start); if (frame) window.cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [source])
  if (!article) return <main className="article-detail"><p className="eyebrow">LOADING / WRITING</p></main>
  const headings = []; source.split(/\r?\n/).forEach(line => { const match = line.match(/^(#{1,4})\s+(.+)/); if (match) headings.push(match[2]) })
  const recommendations = articles.map((item, itemIndex) => ({ ...item, itemIndex })).filter(item => item.itemIndex !== index).sort((a, b) => (b.tags || []).filter(tag => article.tags?.includes(tag)).length - (a.tags || []).filter(tag => article.tags?.includes(tag)).length).slice(0, 3)
  const articleDir = article.md.slice(0, article.md.lastIndexOf('/') + 1)
  return <main className="article-detail"><header className="article-detail-hero"><Link to="/writing">← {language === 'zh' ? '返回文章库' : 'Writing index'}</Link><p className="eyebrow">{article.tags?.join(' / ')} · {article.date}</p><h1>{article.title}</h1><p>{article.summary}</p></header><div className={`article-layout ${tocOpen ? 'toc-open' : 'toc-collapsed'}`}><aside className={`article-toc ${tocOpen ? 'is-open' : 'is-collapsed'}`}><button className="article-toc-toggle" type="button" aria-expanded={tocOpen} aria-label={tocOpen ? (language === 'zh' ? '收起目录' : 'Collapse contents') : (language === 'zh' ? '展开目录' : 'Expand contents')} onClick={() => setTocOpen(open => !open)}><span><i>{tocOpen ? 'READING MAP' : (language === 'zh' ? '目录' : 'INDEX')}</i>{tocOpen && <small>{String(headings.length).padStart(2, '0')} SECTIONS</small>}</span><b>{tocOpen ? '−' : '+'}</b></button><div className="article-toc-list" aria-hidden={!tocOpen}>{headings.length ? headings.map((heading, headingIndex) => <a tabIndex={tocOpen ? undefined : -1} className={activeHeading === headingIndex ? 'active' : undefined} aria-current={activeHeading === headingIndex ? 'location' : undefined} href={`#${headingId(heading, headingIndex)}`} key={`${heading}-${headingIndex}`}><span>{String(headingIndex + 1).padStart(2, '0')}</span><em>{heading}</em><i aria-hidden="true">↗</i></a>) : <p>{language === 'zh' ? '正文阅读' : 'Article'}</p>}</div><div className="article-toc-progress" aria-hidden="true"><i style={{ transform: `scaleY(${headings.length ? (activeHeading + 1) / headings.length : 0})` }} /></div></aside>{source ? <Suspense fallback={<div className="article-prose"><p>LOADING MARKDOWN…</p></div>}><MarkdownContent source={source} assetBase={githubRaw(articleDir)} /></Suspense> : <div className="article-prose"><p>{article.summary}</p><p>{language === 'zh' ? '原文内容正在迁移到新版阅读器，可暂时前往源文件查看。' : 'The full text is being migrated into the new reader.'}</p><a className="source-article-link" href={githubFile(article.md)} target="_blank" rel="noreferrer">{language === 'zh' ? '查看原始文章' : 'Open source article'} <Arrow /></a></div>}</div><ArticleCommunity /><section className="related-writing"><p className="eyebrow">RELATED / 相似推荐</p><div>{recommendations.map(item => <Link to={`/writing/${item.itemIndex}`} key={item.title}><span>{item.date}</span><h2>{item.title}</h2><p>{item.summary}</p><Arrow /></Link>)}</div></section></main>
}

const flattenNotes = (nodes, result = []) => { (nodes || []).forEach(node => node.type === 'file' ? result.push(node) : flattenNotes(node.children, result)); return result }
function NotesPage() {
  const { t } = useLanguage(); const [root, setRoot] = useState(null); const [selected, setSelected] = useState(0); const [localMode, setLocalMode] = useState(false)
  useEffect(() => { fetch('/__local_notes_index').then(r => { if (!r.ok) throw new Error('Local notes unavailable'); return r.json() }).then(data => { setRoot(data); setLocalMode(true) }).catch(() => fetch('/notes.json').then(r => r.json()).then(data => { setRoot(data); setLocalMode(false) }).catch(() => setRoot(null))) }, [])
  const folders = root?.children?.filter(node => node.type === 'directory') || []; const active = folders[selected]; const files = active ? flattenNotes(active.children, []) : []
  return <IndexShell><PageHero kicker="03 / NOTES" title={t.notesTitle} lead={t.notesLead} /><div className="file-browser"><aside><div className="browser-label"><i /> {localMode ? 'LOCAL NOTE VAULT' : 'NOTE REPOSITORY'}</div>{folders.map((folder, index) => <button className={selected === index ? 'active' : ''} type="button" onClick={() => setSelected(index)} key={folder.name}><span>▸</span><strong>{folder.name}</strong><small>{flattenNotes(folder.children, []).length}</small></button>)}</aside><section><header><span>note</span><b>/</b><strong>{active?.name || '—'}</strong><small>{files.length} FILES</small></header><div className="file-rows">{files.map((note, index) => { const extension = note.name.split('.').pop()?.toUpperCase() || 'FILE'; return <Link to={`/study/view?path=${encodeURIComponent(note.path.replace(/^note\//, ''))}${localMode ? '&local=1' : ''}`} key={`${note.path}-${index}`}><span className="file-icon">{extension.slice(0, 4)}</span><div><strong>{note.name}</strong><small>{note.path.split('/').slice(2, -1).join(' / ') || active?.name}</small></div><em>READ ↗</em></Link> })}</div></section></div></IndexShell>
}

function NoteViewerPage() {
  const [params] = useSearchParams(); const { language } = useLanguage(); const path = params.get('path') || ''; const localMode = params.get('local') === '1'; const name = path.split('/').pop() || 'Note'; const isPdf = /\.pdf$/i.test(path); const isMarkdown = /\.md$/i.test(path); const [source, setSource] = useState(''); const [error, setError] = useState('')
  useEffect(() => {
    setSource(''); setError('')
    if (!isMarkdown) return undefined
    let current = true
    const localUrl = `${localMode ? '/local-note' : '/note'}/${path.split('/').map(encodeURIComponent).join('/')}`
    const readMarkdown = async () => {
      for (const url of localMode ? [localUrl] : [localUrl, noteCdn(path)]) {
        try {
          const response = await fetch(url)
          const type = response.headers.get('content-type') || ''
          if (!response.ok || type.includes('text/html')) continue
          const text = await response.text()
          if (current) setSource(text)
          return
        } catch { /* try the next source */ }
      }
      if (current) setError(language === 'zh' ? '笔记源文件当前不可用，请检查 note 子仓库。' : 'The note source is unavailable; check the note submodule.')
    }
    readMarkdown()
    return () => { current = false }
  }, [path, isMarkdown, language, localMode])
  const headings = []; source.split(/\r?\n/).forEach(line => { const match = line.match(/^(#{1,4})\s+(.+)/); if (match) headings.push(match[2]) })
  const directory = path.slice(0, path.lastIndexOf('/') + 1); const encodedPath = path.split('/').map(encodeURIComponent).join('/'); const fileUrl = localMode ? `/local-note/${encodedPath}` : `/note/${encodedPath}`; const assetBase = localMode ? `/local-note/${directory.split('/').map(encodeURIComponent).join('/')}` : `/note/${directory.split('/').map(encodeURIComponent).join('/')}`
  return <main className="note-viewer"><header className="note-viewer-header"><Link to="/study">← {language === 'zh' ? '返回笔记库' : 'Notes index'}</Link><p className="eyebrow">{isPdf ? 'PDF DOCUMENT' : isMarkdown ? 'MARKDOWN NOTE' : 'LOCAL FILE'} / {path.split('/').slice(0, -1).join(' / ')}</p><h1>{name.replace(/\.[^.]+$/i, '')}</h1><div><a href={fileUrl} target="_blank" rel="noreferrer">{language === 'zh' ? '打开原文件' : 'Open original'} ↗</a><a href={fileUrl} download>{language === 'zh' ? '下载文件' : 'Download'} ↓</a></div></header>{isPdf ? <section className="pdf-reader"><div className="pdf-reader-bar"><span>PDF / {name}</span><span>{language === 'zh' ? '可缩放、翻页与打印' : 'Zoom, navigate and print'}</span></div><iframe title={name} src={fileUrl} /></section> : isMarkdown ? <div className="article-layout note-markdown-layout"><aside><p className="eyebrow">CONTENTS / 目录</p>{headings.length ? headings.map((heading, index) => <a href={`#${headingId(heading, index)}`} key={`${heading}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{heading}</a>) : <p>{language === 'zh' ? '正文阅读' : 'Note content'}</p>}</aside>{source ? <Suspense fallback={<div className="article-prose"><p>LOADING MARKDOWN…</p></div>}><MarkdownContent source={source} assetBase={assetBase} /></Suspense> : <div className="article-prose"><p>{error || (language === 'zh' ? '正在载入笔记…' : 'Loading note…')}</p></div>}</div> : <section className="local-file-fallback"><p className="eyebrow">{name.split('.').pop()?.toUpperCase()} / LOCAL DOCUMENT</p><h2>{language === 'zh' ? '此格式请使用本机应用打开' : 'Open this format with a desktop application'}</h2><a href={fileUrl} target="_blank" rel="noreferrer">{language === 'zh' ? '打开本地文件' : 'Open local file'} ↗</a></section>}</main>
}

export default function App() {
  const location = useLocation(); const scope = useRef(null); const openingVariant = 'v2'; usePortfolioMotion(scope, location.pathname, openingVariant, location.search)
  return <div ref={scope}><div className="route-curtain" aria-hidden="true"><span>FWJ / INDEX</span></div><Shell><Routes location={location}><Route path="/" element={<Home openingVariant={openingVariant} />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/game" element={<GamePage />} /><Route path="/tools/tieba-spider" element={<TiebaSpiderPage />} /><Route path="/articles" element={<ArticlesPage />} /><Route path="/writing" element={<ArticlesPage />} /><Route path="/writing/:articleId" element={<ArticleDetailPage />} /><Route path="/notes" element={<NotesPage />} /><Route path="/study" element={<NotesPage />} /><Route path="/study/view" element={<NoteViewerPage />} /><Route path="/about" element={<AboutPage />} /></Routes></Shell></div>
}
