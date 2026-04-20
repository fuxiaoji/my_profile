/**
 * Search — 基于 Fuse.js 的文章搜索模块
 * 需要在页面中引入 Fuse.js CDN
 * 搜索弹窗通过 Ctrl+K / Cmd+K 打开
 */
(function () {
  let fuse = null;
  let articles = [];
  let searchModal = null;

  function loadArticles() {
    if (articles.length > 0) return Promise.resolve(articles);
    return fetch('articles.json')
      .then(res => res.json())
      .then(data => {
        articles = data;
        fuse = new Fuse(articles, {
          keys: ['title', 'summary', 'tags'],
          threshold: 0.35,
          includeScore: true,
        });
        return articles;
      });
  }

  function createSearchModal() {
    if (searchModal) return;

    const overlay = document.createElement('div');
    overlay.id = 'search-modal';
    overlay.className = 'fixed inset-0 z-[999] hidden items-start justify-center bg-black/40 backdrop-blur-sm pt-[12vh]';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="w-full max-w-xl mx-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden" id="search-box">
        <div class="flex items-center gap-3 border-b border-stone-100 dark:border-stone-700 px-5 py-4">
          <iconify-icon icon="solar:magnifer-bold-duotone" class="text-xl text-accent"></iconify-icon>
          <input
            id="search-input"
            type="text"
            class="flex-1 bg-transparent text-base text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none"
            data-i18n="search.placeholder"
            placeholder="搜索文章..."
            autocomplete="off"
          />
          <kbd class="hidden sm:inline-flex items-center gap-1 rounded-lg border border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 px-2 py-1 text-xs text-stone-500 dark:text-stone-400">ESC</kbd>
        </div>
        <div id="search-results" class="max-h-[50vh] overflow-y-auto px-2 py-2">
          <p class="px-3 py-6 text-center text-sm text-stone-400 dark:text-stone-500" data-i18n="search.placeholder">搜索文章...</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    searchModal = overlay;

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });

    // 输入搜索
    const input = document.getElementById('search-input');
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (!query) {
        renderResults([]);
        return;
      }
      if (fuse) {
        const results = fuse.search(query).slice(0, 8);
        renderResults(results.map(r => r.item));
      }
    });
  }

  function renderResults(items) {
    const container = document.getElementById('search-results');
    if (!items || items.length === 0) {
      const lang = (typeof getLang === 'function') ? getLang() : 'zh';
      const noResult = lang === 'en' ? 'No articles found' : '没有找到相关文章';
      const input = document.getElementById('search-input');
      if (!input.value.trim()) {
        const hint = lang === 'en' ? 'Search articles...' : '搜索文章...';
        container.innerHTML = `<p class="px-3 py-6 text-center text-sm text-stone-400 dark:text-stone-500">${hint}</p>`;
      } else {
        container.innerHTML = `<p class="px-3 py-6 text-center text-sm text-stone-400 dark:text-stone-500">${noResult}</p>`;
      }
      return;
    }

    container.innerHTML = items.map(a => {
      const tagsStr = (a.tags || []).join(' · ');
      const href = `article-viewer.html?file=${encodeURIComponent(a.md)}`;
      return `
        <a href="${href}" class="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800">
          <iconify-icon icon="solar:document-text-bold-duotone" class="mt-0.5 text-lg text-accent shrink-0"></iconify-icon>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">${a.title}</p>
            <p class="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate">${a.summary || ''}</p>
            <p class="mt-1 text-[11px] text-stone-400 dark:text-stone-500">${tagsStr}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  function openSearch() {
    createSearchModal();
    loadArticles().then(() => {
      searchModal.style.display = 'flex';
      setTimeout(() => {
        document.getElementById('search-input').focus();
      }, 100);
    });
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.style.display = 'none';
      const input = document.getElementById('search-input');
      if (input) input.value = '';
      renderResults([]);
    }
  }

  // 全局快捷键 Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal && searchModal.style.display === 'flex') {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // 暴露全局方法
  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
})();
