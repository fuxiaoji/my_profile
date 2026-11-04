import { Link } from 'react-router-dom'
import { useState } from 'react'
import { research, researchFilters } from './research.js'
import { useLanguage } from './i18n'

function PaperMeta({ item, zh }) {
  return <div className="paper-meta-line"><span className="author-mark">{zh ? '一作' : 'First author'}</span>{item.rank && <span className="rank-mark">{item.rank}</span>}<span>{!zh && item.enVenue ? item.enVenue : item.venue}</span><span className="paper-status">{zh ? item.status : item.enStatus}</span></div>
}

function PaperLinks({ item, zh }) {
  return <div className="paper-links">{item.paper && <a href={item.paper} target="_blank" rel="noreferrer">{zh ? '阅读预印本' : 'Read preprint'}</a>}{item.code && <a href={item.code} target="_blank" rel="noreferrer">{zh ? '查看代码' : 'View code'}</a>}</div>
}

export function ResearchPreview() {
  const { language } = useLanguage(); const zh = language === 'zh'
  const featured = research.slice(0, 3)
  return <section className="research-preview" aria-labelledby="research-preview-title"><div className="research-heading"><div><h2 id="research-preview-title">{zh ? '正在研究' : 'Research in progress'}</h2><p>{zh ? '从一个问题，走到可检验的方法。' : 'From a question to a testable method.'}</p></div><Link to="/research">{zh ? '查看全部研究' : 'All research'}</Link></div><div className="research-feature-grid">{featured.map((item, index) => <article className={index === 0 ? 'research-feature research-feature-main' : 'research-feature'} key={item.id}><PaperMeta item={item} zh={zh} /><p className="research-question">{zh ? item.question : item.enQuestion}</p><h3><Link to={`/research#${item.id}`}>{zh ? item.title : item.enTitle}</Link></h3><p>{zh ? item.summary : item.enSummary}</p><PaperLinks item={item} zh={zh} /></article>)}</div></section>
}

export function ResearchPage() {
  const { language } = useLanguage(); const zh = language === 'zh'
  const [filter, setFilter] = useState('all')
  const visible = research.filter(item => filter === 'all' || item.area === filter || (filter === 'ai' && item.id === 'dllm'))
  return <main className="index-page research-page"><header className="index-hero research-page-hero"><p>{zh ? '人工智能 / 运筹优化 / 金融科技' : 'AI / Optimization / Financial technology'}</p><h1>{zh ? '研究' : 'Research'}</h1><p>{zh ? '关心问题，也关心方法。' : 'Questions matter. So do methods.'}</p></header><div className="research-controls" aria-label={zh ? '研究方向筛选' : 'Research filters'}>{researchFilters.map(([value, label, enLabel]) => <button type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} key={value}>{zh ? label : enLabel}</button>)}</div><div className="research-index" aria-live="polite">{visible.map(item => <article id={item.id} className="research-entry" key={item.id}><div className="research-entry-side"><span>{item.year}</span><p>{zh ? item.question : item.enQuestion}</p></div><div><PaperMeta item={item} zh={zh} /><h2>{zh ? item.title : item.enTitle}</h2>{zh && <p className="paper-original-title">{item.enTitle}</p>}<p className="research-summary">{zh ? item.summary : item.enSummary}</p><ul className="research-methods">{(zh ? item.methods : item.enMethods).map(method => <li key={method}>{method}</li>)}</ul><PaperLinks item={item} zh={zh} /></div></article>)}</div><p className="research-edition">{zh ? '状态截至 2026.11.04。评级采用 CCF 2026、JCR 2024（2025 发布）；JOCO 按应用数学，MSS / JFS 按经济学。' : 'Status as of 4 November 2026. Rankings use CCF 2026 and JCR 2024 (released 2025): applied mathematics for JOCO, economics for MSS/JFS.'}</p><Link className="back-home" to="/">{zh ? '返回首页' : 'Back home'}</Link></main>
}

export function Background() {
  const { language } = useLanguage(); const zh = language === 'zh'
  const entries = [
    ['教育', 'Education', '西南财经大学 · 金融学', 'SWUFE · Finance', '经管国际化创新实验班，全英语教学。', 'International Innovation Program, taught in English.'],
    ['科研训练', 'Research training', '芝加哥大学线上暑期科研', 'Online summer research', 'Haifeng Xu 教授指导，开展大模型推理与图谱研究。', 'Supervised by Prof. Haifeng Xu, studying language-model reasoning and knowledge graphs.'],
    ['线上课程', 'Online coursework', '麻省理工大学机器学习线上学分课程', 'MIT machine-learning online credit course', '完成机器学习课程学习。', 'Completed online coursework in machine learning.'],
    ['国际交流', 'Exchange', 'HSE · 俄罗斯高等经济大学', 'HSE University', '代表学校学院参加深度合作交流项目，优秀结业。', 'Represented the school in a cooperation exchange, completed with distinction.'],
    ['实习', 'Internship', '中泰证券 · 深圳分部', 'Zhongtai Securities · Shenzhen', '行研与基金服务。参与尽调、备案及海外关税专题研究。', 'Research and fund services: due diligence, fund filing and thematic tariff research.'],
    ['内容与社区', 'Community', '兵棋开发、对战与内容创作', 'Wargames, playtests and educational content', '把开发过程变成对局、教学与战报。', 'Turning development work into playtests, teaching and after-action reports.'],
  ]
  return <section className="background-section"><h2>{zh ? '学习与实践' : 'Learning & practice'}</h2><div>{entries.map(([label, enLabel, title, enTitle, text, enText]) => <article key={label}><span>{zh ? label : enLabel}</span><div><h3>{zh ? title : enTitle}</h3><p>{zh ? text : enText}</p></div></article>)}</div></section>
}
