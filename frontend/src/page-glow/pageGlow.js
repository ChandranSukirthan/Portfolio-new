import './pageGlow.css';

(function initPageGlow() {
  if (typeof window === 'undefined') return;

  const MARKER = 'data-page-glow';
  const SECTION_SELECTOR = 'section[id]';
  const PAGE_SELECTOR = '#root > div';

  function ensurePositioning(el) {
    const pos = window.getComputedStyle(el).position;
    if (pos === 'static') {
      el.style.position = 'relative';
    }
  }

  function createGlowLayer() {
    const layer = document.createElement('div');
    layer.className = 'page-glow-layer';
    layer.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 3; i += 1) {
      const orb = document.createElement('div');
      orb.className = `page-glow-orb page-glow-orb--${i}`;
      layer.appendChild(orb);
    }

    return layer;
  }

  function injectGlow(el) {
    if (!el || el.hasAttribute(MARKER)) return;
    if (el.querySelector('.page-glow-layer')) return;

    const rect = el.getBoundingClientRect();
    if (rect.height < 120) return;

    el.setAttribute(MARKER, 'true');
    ensurePositioning(el);
    el.insertBefore(createGlowLayer(), el.firstChild);
  }

  function scan() {
    document.querySelectorAll(SECTION_SELECTOR).forEach(injectGlow);

    const root = document.getElementById('root');
    if (!root) return;

    const pageWrappers = [...root.querySelectorAll(PAGE_SELECTOR)].filter((el) => {
      if (el.hasAttribute(MARKER)) return false;
      if (el.querySelector(SECTION_SELECTOR)) return false;
      const h = el.getBoundingClientRect().height;
      return h >= window.innerHeight * 0.5;
    });

    pageWrappers.forEach(injectGlow);
  }

  let scanTimer = null;

  function scheduleScan() {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(() => requestAnimationFrame(scan), 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleScan, { once: true });
  } else {
    scheduleScan();
  }

  const observer = new MutationObserver(scheduleScan);

  const root = document.getElementById('root');
  if (root) {
    observer.observe(root, { childList: true, subtree: true });
  }

  window.addEventListener('popstate', scheduleScan);
  window.addEventListener('resize', scheduleScan);
})();
