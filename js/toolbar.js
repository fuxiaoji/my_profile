/**
 * Toolbar — 右下角浮动工具栏
 * 包含：暗色模式切换、语言切换、鼠标特效、搜索按钮
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.createElement('div');
    toolbar.id = 'floating-toolbar';
    toolbar.className = 'fixed bottom-6 right-6 z-[900] flex flex-col gap-2';
    toolbar.innerHTML = `
      <button
        data-toggle-theme
        title="Toggle Dark Mode"
        class="group flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none"
      >
        <iconify-icon icon="solar:moon-bold-duotone" class="theme-toggle-icon text-xl text-stone-600 dark:text-amber-400"></iconify-icon>
      </button>
      <button
        id="lang-toggle-btn"
        title="中/EN"
        class="group flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none"
      >
        <span class="text-sm font-bold text-stone-600 dark:text-stone-300" id="lang-toggle-label">EN</span>
      </button>
      <button
        data-mouse-effects-toggle
        title="关闭鼠标特效"
        aria-pressed="false"
        class="group flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none"
      >
        <iconify-icon icon="solar:stars-bold-duotone" class="text-xl text-stone-600 dark:text-stone-300"></iconify-icon>
      </button>
      <button
        onclick="openSearch()"
        title="Search (Ctrl+K)"
        class="group flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none"
      >
        <iconify-icon icon="solar:magnifer-bold-duotone" class="text-xl text-stone-600 dark:text-stone-300"></iconify-icon>
      </button>
    `;
    document.body.appendChild(toolbar);

    // 暗色模式按钮绑定
    toolbar.querySelector('[data-toggle-theme]').addEventListener('click', () => {
      if (typeof toggleTheme === 'function') toggleTheme();
    });

    // 语言切换按钮
    const langBtn = document.getElementById('lang-toggle-btn');
    const langLabel = document.getElementById('lang-toggle-label');

    function updateLangLabel() {
      const lang = (typeof getLang === 'function') ? getLang() : 'zh';
      langLabel.textContent = lang === 'zh' ? 'EN' : '中';
    }

    langBtn.addEventListener('click', () => {
      const lang = (typeof getLang === 'function') ? getLang() : 'zh';
      if (typeof switchLang === 'function') {
        switchLang(lang === 'zh' ? 'en' : 'zh');
      }
      updateLangLabel();
    });

    // 监听语言变化事件
    window.addEventListener('langchange', updateLangLabel);
    updateLangLabel();

    // 鼠标特效开关
    const mouseEffectsBtn = toolbar.querySelector('[data-mouse-effects-toggle]');

    function updateMouseEffectsButton(event) {
      const api = window.MouseEffects;
      const isAvailable = api && typeof api.isAvailable === 'function' ? api.isAvailable() : false;
      const isEnabled = event && event.detail ? event.detail.enabled : Boolean(api && api.isEnabled && api.isEnabled());
      mouseEffectsBtn.setAttribute('aria-pressed', String(isEnabled));
      mouseEffectsBtn.disabled = !isAvailable;
      mouseEffectsBtn.classList.toggle('opacity-45', !isAvailable);
      mouseEffectsBtn.classList.toggle('cursor-not-allowed', !isAvailable);
      mouseEffectsBtn.title = isAvailable
        ? (isEnabled ? '关闭鼠标特效' : '开启鼠标特效')
        : '当前设备已自动关闭鼠标特效';
    }

    mouseEffectsBtn.addEventListener('click', () => {
      if (window.MouseEffects && typeof window.MouseEffects.toggle === 'function') {
        window.MouseEffects.toggle();
      }
    });

    window.addEventListener('mouseeffectschange', updateMouseEffectsButton);
    updateMouseEffectsButton();
    window.setTimeout(updateMouseEffectsButton, 0);
  });
})();
