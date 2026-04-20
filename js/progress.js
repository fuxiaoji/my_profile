/**
 * Reading Progress Bar — 阅读进度条模块
 * 在页面顶部显示一个固定的进度条
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // 创建进度条元素
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #b45309, #d97706, #f59e0b);
      z-index: 9999;
      transition: width 0.1s ease-out;
      pointer-events: none;
    `;
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        bar.style.width = '0%';
        return;
      }
      const progress = Math.min(100, (scrollTop / docHeight) * 100);
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  });
})();
