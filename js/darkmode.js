/**
 * Dark Mode — 暗色模式切换模块
 * 通过 <html> 上的 class="dark" 控制
 * 在 Tailwind CDN 配置中需启用 darkMode: 'class'
 */
(function () {
  const STORAGE_KEY = 'site-theme';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    // 更新按钮图标
    document.querySelectorAll('.theme-toggle-icon').forEach(el => {
      el.setAttribute('icon', theme === 'dark' ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // 立即应用（在 head 中引入时可防止闪烁）
  applyTheme(getPreferred());

  // 暴露全局方法
  window.toggleTheme = toggleTheme;
  window.applyTheme = applyTheme;

  // DOMContentLoaded 后绑定按钮
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    // 再次确保状态正确
    applyTheme(getPreferred());
  });
})();
