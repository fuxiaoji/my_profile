(function () {
  function getLangSafe() {
    return typeof getLang === 'function' ? getLang() : 'zh';
  }

  function getArticleKey() {
    if (window.__articleId) return window.__articleId;
    const params = new URLSearchParams(window.location.search);
    const fileParam = params.get('file');
    return fileParam ? decodeURIComponent(fileParam) : window.location.pathname;
  }

  function loadRatings(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveRatings(storageKey, ratings) {
    localStorage.setItem(storageKey, JSON.stringify(ratings));
  }

  function formatStats(avg, count, max, lang) {
    if (lang === 'en') {
      return `Avg ${avg}/${max} · ${count} ratings`;
    }
    return `均分 ${avg}/${max} · ${count} 人`;
  }

  function initRating() {
    const ratingEl = document.querySelector('[data-rating]');
    if (!ratingEl) return;
    const statsEl = document.querySelector('[data-rating-stats]');
    const hintEl = document.querySelector('[data-rating-hint]');

    const articleKey = getArticleKey();
    const storageKey = `rating:${articleKey}`;
    const userKey = `${storageKey}:user`;

    function updateStats() {
      const lang = getLangSafe();
      const ratings = loadRatings(storageKey);
      if (!ratings.length) {
        if (statsEl) statsEl.textContent = lang === 'en' ? 'No ratings yet' : '还没人打分';
        return;
      }
      const total = ratings.reduce((sum, value) => sum + Number(value || 0), 0);
      const avg = (total / ratings.length).toFixed(1);
      if (statsEl) statsEl.textContent = formatStats(avg, ratings.length, ratingEl.max || 5, lang);
    }

    function updateHint(isLocked) {
      const lang = getLangSafe();
      if (!hintEl) return;
      if (isLocked) {
        hintEl.textContent = lang === 'en' ? 'Rated' : '已评分';
      } else {
        hintEl.textContent = lang === 'en' ? 'Tap a star' : '点星即可';
      }
    }

    const userRating = localStorage.getItem(userKey);
    if (userRating) {
      ratingEl.value = Number(userRating);
      ratingEl.setAttribute('readonly', '');
      updateHint(true);
    } else {
      updateHint(false);
    }

    updateStats();

    ratingEl.addEventListener('change', () => {
      if (ratingEl.hasAttribute('readonly')) return;
      const value = Number(ratingEl.value);
      if (!value || value < 1) return;
      const ratings = loadRatings(storageKey);
      ratings.push(value);
      saveRatings(storageKey, ratings);
      localStorage.setItem(userKey, String(value));
      ratingEl.setAttribute('readonly', '');
      updateStats();
      updateHint(true);
    });

    window.addEventListener('langchange', () => {
      updateStats();
      updateHint(ratingEl.hasAttribute('readonly'));
    });
  }

  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark_dimmed' : 'light';
  }

  function getCommunityConfig() {
    if (window.__communityConfig && typeof window.__communityConfig === 'object') {
      return window.__communityConfig;
    }
    return {};
  }

  function initGiscus() {
    const container = document.querySelector('[data-giscus-container]');
    if (!container) return;
    const hintEl = document.querySelector('[data-giscus-hint]');
    const config = getCommunityConfig().giscus || {};
    const repo = container.dataset.giscusRepo || config.repo || '';
    const repoId = container.dataset.giscusRepoId || config.repoId || '';
    const category = container.dataset.giscusCategory || config.category || '';
    const categoryId = container.dataset.giscusCategoryId || config.categoryId || '';
    const mapping = container.dataset.giscusMapping || config.mapping || 'specific';
    const inputPosition = container.dataset.giscusInputPosition || config.inputPosition || 'top';

    if (!repo || !repoId || !category || !categoryId) {
      if (hintEl) {
        hintEl.textContent = typeof t === 'function'
          ? t('community.comment.config')
          : (getLangSafe() === 'en' ? 'Configure comments to enable Giscus' : '请先配置 Giscus 才能留言');
      }
      return;
    }

    if (hintEl) hintEl.textContent = getLangSafe() === 'en' ? 'Loading comments...' : '留言加载中…';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    if (mapping === 'specific') {
      script.setAttribute('data-term', getArticleKey());
    }
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', getTheme());
    script.setAttribute('data-lang', getLangSafe() === 'en' ? 'en' : 'zh-CN');

    container.innerHTML = '';
    container.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: getTheme() } } },
        'https://giscus.app'
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('langchange', () => {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { lang: getLangSafe() === 'en' ? 'en' : 'zh-CN' } } },
        'https://giscus.app'
      );
      if (hintEl) hintEl.textContent = '';
    });
  }

  function initSubscribeForms() {
    const forms = document.querySelectorAll('[data-subscribe-form]');
    if (!forms.length) return;

    forms.forEach((form) => {
      const config = getCommunityConfig().subscribe || {};
      const emailInput = form.querySelector('[data-subscribe-email]');
      const msg = form.querySelector('[data-subscribe-msg]');
      const btn = form.querySelector('[data-subscribe-btn]');
      const endpoint = form.dataset.subscribeEndpoint || config.endpoint || '';
      const provider = form.dataset.subscribeProvider || config.provider || 'listmonk';
      const listId = form.dataset.subscribeList || config.listId || '';
      const subject = form.dataset.subscribeSubject || config.subject || 'New subscriber';

      if (!emailInput || !msg || !btn) return;
      if (!endpoint) {
        btn.disabled = true;
        msg.className = 'text-xs text-center mt-2 text-stone-500';
        msg.textContent = getLangSafe() === 'en' ? 'Subscription not configured yet.' : '订阅服务尚未配置。';
        msg.classList.remove('hidden');
        return;
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();
        if (!email) return;

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '...';

        try {
          let res;
          if (provider === 'formspree') {
            res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ email, _subject: subject })
            });
          } else {
            const formData = new FormData();
            formData.append('email', email);
            if (listId) formData.append('list', listId);
            res = await fetch(endpoint, { method: 'POST', body: formData });
          }

          if (!res.ok) throw new Error('subscribe failed');
          msg.className = 'text-xs text-center mt-2 text-green-600';
          msg.textContent = typeof t === 'function' ? t('contact.subscribe.success') : '订阅成功！感谢关注。';
          msg.classList.remove('hidden');
          emailInput.value = '';
        } catch (err) {
          msg.className = 'text-xs text-center mt-2 text-red-600';
          msg.textContent = typeof t === 'function' ? t('contact.subscribe.error') : '订阅失败，请稍后再试。';
          msg.classList.remove('hidden');
        } finally {
          btn.disabled = false;
          btn.textContent = originalText || (typeof t === 'function' ? t('contact.subscribe.btn') : '订阅');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initRating();
    initGiscus();
    initSubscribeForms();
  });
})();
