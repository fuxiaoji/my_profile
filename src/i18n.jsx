import { createContext, useContext, useMemo, useState } from 'react'

const copy = {
  zh: {
    navWork: '项目', navGame: '游戏', navArticles: '文章', navNotes: '笔记', navProfile: '关于', available: '正在寻找开发实习',
    heroRole: 'AI 开发者 × 金融思考者', heroLine: '用工程验证想法，用系统理解复杂世界。', explore: '向下探索',
    introKicker: '我在做什么 / 2026', intro: '我构建能在真实问题中工作的智能系统。', introDetail: '金融训练我判断，工程让我验证，游戏教我理解系统。三个方向，最后都落到一件事：把复杂问题做成能运行、能观察、能迭代的产品。',
    selected: '精选项目', selectedSub: '从想法到可运行系统', allProjects: '查看全部项目',
    method: '能力与方法', methodSub: '技术不是清单，是解决问题的路径',
    profile: '经历', profileSub: '背景、实践与可验证结果', hello: '我是傅文基。', bio1: '西南财经大学金融学本科生，也是独立开发者。我喜欢把看似不相干的领域接起来：用强化学习做兵棋 AI，用金融模型拆现实问题，再把过程公开成代码。', bio2: '我正在寻找一段能碰到真实产品、真实用户和硬问题的开发实习。',
    field: '影像记录', fieldSub: '生活、旅行，以及工作之外', scrollGallery: '继续滚动 / 影像向左移动',
    library: '阅读与记录', librarySub: '长文章、研究与课程笔记', articlesDesc: '兵棋推演、宏观研究、AI 与产品思考。写作是我整理复杂系统的另一种方式。', notesDesc: '金融、经济学与技术课程的学习资料。把知识整理成可回看的结构。', openArticles: '进入文章库', openNotes: '进入笔记库',
    proof: '结果，不是形容词', proofSub: '一些可以被核对的数字',
    contactKicker: '有一个值得解决的难题？', contact: '一起做点真的。',
    subscribeTitle: '订阅更新', subscribeDesc: '留下邮箱，接收最新文章、项目进展与研究记录。', emailPlaceholder: '你的邮箱', subscribe: '立即订阅', subscribeHint: '通过安全表单提交，不会公开你的邮箱。',
    projectsTitle: '项目库', projectsLead: '每个项目都从一个具体问题开始。这里保存完整的工程实验与开源作品。',
    articlesTitle: '文章库', articlesLead: '兵棋、金融、AI 与宏观研究。长文负责保存那些不能被一句话讲清的东西。',
    notesTitle: '笔记库', notesLead: '课程资料与学习索引。内容保存在独立笔记仓库中。',
    home: '返回首页', open: '查看原文', empty: '内容正在整理中', resume: '简历', language: 'EN',
  },
  en: {
    navWork: 'Work', navGame: 'Game', navArticles: 'Writing', navNotes: 'Notes', navProfile: 'About', available: 'Open to software development internships',
    heroRole: 'AI Developer × Financial Thinker', heroLine: 'I use engineering to test ideas, and systems thinking to understand complexity.', explore: 'Scroll to explore',
    introKicker: 'WHAT I DO / 2026', intro: 'I build intelligent systems for real-world problems.', introDetail: 'Finance trained my judgment. Engineering lets me test it. Games taught me how systems behave. All three lead to the same goal: products that run, reveal patterns and improve through iteration.',
    selected: 'Selected Work', selectedSub: 'From an idea to a working system', allProjects: 'View all projects',
    method: 'Practice & Method', methodSub: 'Technology is a route to solving problems, not a checklist',
    profile: 'Experience', profileSub: 'Background, practice and verifiable results', hello: 'I’m Fu Wenji.', bio1: 'I am a finance undergraduate at SWUFE and an independent developer. I connect unlikely fields: reinforcement learning for wargame AI, financial models for real problems, and open code for the process.', bio2: 'I’m looking for a development internship close to real products, real users and hard problems.',
    field: 'Visual Archive', fieldSub: 'Life, travel and everything outside work', scrollGallery: 'Keep scrolling / images move left',
    library: 'Reading & Notes', librarySub: 'Essays, research and study archives', articlesDesc: 'Wargames, macro research, AI and product thinking. Writing is another way I map complex systems.', notesDesc: 'Finance, economics and technical course materials, organized into a structure worth returning to.', openArticles: 'Browse writing', openNotes: 'Browse notes',
    proof: 'Proof, not adjectives', proofSub: 'A few numbers you can verify',
    contactKicker: 'HAVE A HARD PROBLEM?', contact: 'Let’s build something real.',
    subscribeTitle: 'Subscribe', subscribeDesc: 'Get new essays, project progress and research notes.', emailPlaceholder: 'Your email', subscribe: 'Subscribe now', subscribeHint: 'Submitted securely. Your address will not be published.',
    projectsTitle: 'Project Index', projectsLead: 'Every project starts with a concrete problem. This is the full archive of engineering experiments and open-source work.',
    articlesTitle: 'Writing Index', articlesLead: 'Wargames, finance, AI and macro research. Long-form writing preserves what cannot be compressed into one line.',
    notesTitle: 'Notes Index', notesLead: 'Course materials and study references, stored in a dedicated notes repository.',
    home: 'Back home', open: 'Open source', empty: 'Still organizing this section', resume: 'Résumé', language: '中',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-language') || 'zh')
  const value = useMemo(() => ({ language, t: copy[language], toggle: () => setLanguage(current => {
    const next = current === 'zh' ? 'en' : 'zh'
    localStorage.setItem('portfolio-language', next)
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
    return next
  }) }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() { return useContext(LanguageContext) }
