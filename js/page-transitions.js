/**
 * Lightweight static-page transitions and staggered content reveals.
 */
(function () {
  function reveal() {
    document.documentElement.classList.add('content-ready');
    document.querySelectorAll('[data-stagger]').forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
    });
  }

  function isInternalPageLink(link) {
    if (!link || !link.href || link.target || link.hasAttribute('download')) return false;
    if (link.origin !== window.location.origin) return false;
    if (link.pathname === window.location.pathname && link.hash) return false;
    return /\.(html)?$/.test(link.pathname) || link.pathname.endsWith('/');
  }

  function bindPageLinks() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!isInternalPageLink(link)) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;

      event.preventDefault();
      document.body.classList.add('page-fade-out');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 170);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      reveal();
      bindPageLinks();
    }, { once: true });
  } else {
    reveal();
    bindPageLinks();
  }
})();
