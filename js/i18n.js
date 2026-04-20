/**
 * i18n — 轻量级中英文切换模块
 * 用法：在 HTML 元素上添加 data-i18n="key" 属性
 *       调用 switchLang('en') 或 switchLang('zh') 切换
 */
const I18N_DICT = {
  // ===== 全局导航 =====
  'nav.focus':       { zh: '关注领域',   en: 'Focus' },
  'nav.projects':    { zh: '项目',       en: 'Projects' },
  'nav.resume':      { zh: '简历摘要',   en: 'Resume' },
  'nav.tree':        { zh: '学习树',     en: 'Learning Tree' },
  'nav.articles':    { zh: '文章列表',   en: 'Articles' },
  'nav.notes':       { zh: '笔记',       en: 'Notes' },
  'nav.contact':     { zh: '联系',       en: 'Contact' },
  'nav.home':        { zh: '首页',       en: 'Home' },

  // ===== 首页 Hero =====
  'hero.title':      { zh: '在金融市场与代码之间，\n找可验证的问题与叙事。', en: 'Between finance and code,\nfinding verifiable questions and narratives.' },
  'hero.desc':       { zh: '西南财经大学 · 金融（经管实验班）在读', en: 'SWUFE · Finance (Honors Program)' },
  'hero.github':     { zh: '查看 GitHub', en: 'View GitHub' },

  // ===== 兴趣版图 =====
  'focus.title':     { zh: '兴趣版图',   en: 'Focus Areas' },
  'focus.desc':      { zh: '金融逻辑、技术实现与制度叙事可以放在同一张表里讨论——关键是假设是否清楚、证据是否站得住。', en: 'Finance, tech, and institutional narratives belong in the same spreadsheet — what matters is whether assumptions are clear and evidence holds up.' },
  'focus.scroll':    { zh: '向下滚动浏览（中心卡片会放大）', en: 'Scroll down to browse (center card zooms in)' },
  'focus.card1.title': { zh: '证券投资与建模', en: 'Securities & Modeling' },
  'focus.card1.desc':  { zh: '模拟与实盘经验、ETF 与行业轮动；金融科技建模与量化学习项目并行。', en: 'Simulated & live trading, ETF rotation; fintech modeling and quant learning in parallel.' },
  'focus.card2.title': { zh: 'Web3 与链上应用', en: 'Web3 & On-chain Apps' },
  'focus.card2.desc':  { zh: '关注协议与产品逻辑，把「谁能做什么、风险在哪」说清楚。', en: 'Focused on protocol and product logic — clarifying "who can do what" and "where the risks lie".' },
  'focus.card3.title': { zh: '数据与 LLM 工具链', en: 'Data & LLM Toolchain' },
  'focus.card3.desc':  { zh: '抓取清洗、建模与可视化；用 Cursor / Claude 等工具压缩重复劳动。', en: 'Scraping, modeling & visualization; leveraging Cursor / Claude to eliminate repetitive work.' },
  'focus.card4.title': { zh: '政经与产业观察', en: 'Political Economy & Industry' },
  'focus.card4.desc':  { zh: '长文梳理制度与市场互动；关税、出海、宏观政策等课题与实习行研有交集。', en: 'Long-form analysis of institutions and markets; tariffs, overseas expansion, and macro policy intersect with internship research.' },

  // ===== 影像记录 =====
  'photo.title':     { zh: '影像记录',   en: 'Photo Gallery' },
  'photo.desc':      { zh: '生活与旅途中的一些瞬间。', en: 'Moments from life and travel.' },

  // ===== 项目 =====
  'projects.title':  { zh: 'GitHub 项目', en: 'GitHub Projects' },
  'projects.desc':   { zh: '选自 github.com/fuxiaoji 的公开仓库；点击卡片跳转源码。', en: 'Selected public repos from github.com/fuxiaoji; click cards for source code.' },
  'projects.view':   { zh: '查看仓库 →', en: 'View Repo →' },
  'projects.viewhome': { zh: '查看主页仓库 →', en: 'View Profile Repo →' },

  // ===== 在线实验 =====
  'live.title':      { zh: '在线实验',   en: 'Live Experiments' },
  'live.tieba.title': { zh: '贴吧爬虫核心引擎', en: 'Tieba Crawler Engine' },
  'live.tieba.desc':  { zh: '在网页端直接调用的无头爬虫接口。分析贴主内容并榨取帖子数据。', en: 'Headless crawler API callable directly from the browser. Analyzes thread content and extracts post data.' },
  'live.tieba.btn':   { zh: '立即体验 →', en: 'Try Now →' },

  // ===== 文章入口 =====
  'articles.section.title': { zh: '文章列表入口', en: 'Articles' },
  'articles.section.desc':  { zh: '已将 文章/ 中的文稿统一补充为 Markdown 版本，并单独提供文章页与阅读页。', en: 'All manuscripts in the articles/ folder have been converted to Markdown, with dedicated listing and reading pages.' },
  'articles.open':          { zh: '打开文章页面', en: 'Open Articles' },

  // ===== 笔记入口 =====
  'notes.section.title': { zh: '笔记文件夹', en: 'Notes' },
  'notes.section.desc':  { zh: '收录 note/ 目录下的日常笔记、课程总结与思维碎片，以文件树格式浏览。', en: 'Daily notes, course summaries, and thought fragments from the note/ directory, browsable as a file tree.' },
  'notes.section.extra':  { zh: '这里是近期整理的个人笔记，涵盖了财务管理、中级微观经济学、中级宏观经济学、计量经济学、概率论等多门学科。点击"打开笔记页面"进入文件浏览器，可直接阅览 .md 文稿或预览 .pdf 课件。', en: 'These are recently organized personal notes covering Financial Management, Intermediate Microeconomics, Intermediate Macroeconomics, Econometrics, Probability Theory, and more. Click "Open Notes" to browse .md files or preview .pdf courseware.' },
  'notes.open':           { zh: '打开笔记页面', en: 'Open Notes' },

  // ===== 简历摘要 =====
  'resume.title':    { zh: '简历摘要',   en: 'Resume Summary' },
  'resume.desc':     { zh: '与 PDF 简历一致的核心条目；更新以简历文件为准。', en: 'Core entries consistent with the PDF resume; updates follow the resume file.' },
  'resume.comp.title': { zh: '比赛与职务', en: 'Competitions & Roles' },
  'resume.intern.title': { zh: '实习与证书', en: 'Internships & Certificates' },

  // ===== 联系 =====
  'contact.title':   { zh: '联系与合作', en: 'Contact & Collaboration' },
  'contact.desc':    { zh: '实习、项目或写作交流，欢迎发邮件；技术内容也可在 GitHub 上私信或提 Issue。', en: 'For internships, projects, or writing — email is welcome; for technical topics, feel free to DM or open an Issue on GitHub.' },
  'contact.subscribe.title': { zh: '订阅更新', en: 'Subscribe' },
  'contact.subscribe.desc':  { zh: '输入邮箱，获取最新文章与行研推送。', en: 'Enter your email to receive the latest articles and research updates.' },
  'contact.subscribe.email': { zh: '你的邮箱', en: 'Your email' },
  'contact.subscribe.btn':   { zh: '订阅', en: 'Subscribe' },
  'contact.subscribe.success': { zh: '订阅成功！感谢关注。', en: 'Subscribed! Thanks for following.' },
  'contact.subscribe.error':   { zh: '订阅失败，请稍后再试。', en: 'Subscription failed. Please try again later.' },

  // ===== Footer =====
  'footer.copy':     { zh: '傅文基 · 西南财经大学 · 纸感浅色布局', en: 'Wenji Fu · SWUFE · Paper-textured light layout' },
  'footer.top':      { zh: '回到顶部', en: 'Back to top' },

  // ===== 文章列表页 =====
  'articles.page.title':  { zh: '文章列表', en: 'Articles' },
  'articles.page.desc':   { zh: '这页是文章仓库。点开就能读。', en: 'Article archive. Click to read.' },
  'articles.page.all':    { zh: '全部文章', en: 'All Articles' },
  'articles.page.tag.all': { zh: '全部', en: 'All' },
  'articles.page.read':   { zh: '现在去读', en: 'Read Now' },
  'articles.page.docx':   { zh: '下载 DOCX', en: 'Download DOCX' },
  'articles.page.nodocx': { zh: '无 DOCX', en: 'No DOCX' },
  'articles.page.back':   { zh: '← 返回首页', en: '← Back to Home' },
  'articles.page.viewdir': { zh: '查看原始目录', en: 'View Raw Directory' },
  'articles.page.empty':  { zh: '该标签下暂时没有文章。', en: 'No articles under this tag yet.' },

  // ===== 文章阅读页 =====
  'reader.toc':      { zh: '大纲导航',   en: 'Table of Contents' },
  'reader.similar':  { zh: '顺手读点',   en: 'Related Reads' },
  'reader.similar.desc': { zh: '同主题推荐', en: 'Same-topic recommendations' },
  'reader.similar.hint': { zh: '看 3 篇就够。', en: '3 articles should suffice.' },
  'reader.continue': { zh: '继续读', en: 'Continue' },
  'reader.loading':  { zh: '稍等，马上加载。', en: 'Loading...' },
  'reader.notoc':    { zh: '这篇没有小标题', en: 'No headings in this article' },
  'reader.error':    { zh: '没加载出来。', en: 'Failed to load.' },
  'reader.nosimilar': { zh: '暂无推荐', en: 'No recommendations' },

  // ===== 笔记页 =====
  'notes.page.title': { zh: '笔记目录', en: 'Notes Directory' },
  'notes.page.desc':  { zh: '课件、手记都在这。点文件夹就展开。', en: 'Courseware and notes are here. Click folders to expand.' },
  'notes.page.loading': { zh: '正在加载笔记目录...', en: 'Loading notes directory...' },
  'notes.page.empty': { zh: '空文件夹', en: 'Empty folder' },
  'notes.page.error': { zh: '加载失败', en: 'Load failed' },
  'notes.page.footer': { zh: '© 2026 傅文基', en: '© 2026 Wenji Fu' },

  // ===== 搜索 =====
  'search.placeholder': { zh: '搜索文章...', en: 'Search articles...' },
  'search.noresult':    { zh: '没有找到相关文章', en: 'No articles found' },
  'search.close':       { zh: '关闭', en: 'Close' },

  // ===== 暗色模式 =====
  'theme.light':     { zh: '浅色', en: 'Light' },
  'theme.dark':      { zh: '深色', en: 'Dark' },
};

let currentLang = localStorage.getItem('site-lang') || 'zh';

function t(key) {
  const entry = I18N_DICT[key];
  if (!entry) return key;
  return entry[currentLang] || entry['zh'] || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  // 更新 lang 属性
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('site-lang', lang);
  applyI18n();
  // 触发自定义事件，供其他模块监听
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function getLang() {
  return currentLang;
}

// 页面加载时自动应用
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
});
