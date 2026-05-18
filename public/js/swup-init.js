/* SPA navigation for ЯРЧЕ — swup with custom hooks.
   <main> is the swap container. Everything outside <main> (nav, footer, canvas)
   survives navigation. Scripts inside <main> are re-executed by swup.

   Page-specific init: pages can register themselves on window.YarchePages.
   Each entry is { init: fn, destroy?: fn }. swup calls init() after content swap. */

(function () {
  if (typeof window.Swup !== 'function') {
    console.warn('[swup-init] Swup library not loaded');
    return;
  }

  window.YarchePages = window.YarchePages || {};

  var plugins = [];
  if (typeof window.SwupHeadPlugin === 'function') plugins.push(new window.SwupHeadPlugin());
  if (typeof window.SwupBodyClassPlugin === 'function') plugins.push(new window.SwupBodyClassPlugin());
  if (typeof window.SwupPreloadPlugin === 'function') plugins.push(new window.SwupPreloadPlugin());

  var swup = new window.Swup({
    containers: ['main'],
    cache: true,
    linkSelector: 'a[href]:not([target]):not([download]):not([data-no-swup]):not([href^="mailto:"]):not([href^="tel:"]):not([href*="://"])',
    plugins: plugins
  });
  window.swup = swup;

  function syncHtmlAttrs(html) {
    try {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var newHtml = doc.documentElement;
      ['data-page', 'lang'].forEach(function (attr) {
        var val = newHtml.getAttribute(attr);
        if (val) document.documentElement.setAttribute(attr, val);
        else document.documentElement.removeAttribute(attr);
      });
      // Title fallback if head plugin isn't loaded
      if (doc.title) document.title = doc.title;
    } catch (e) { /* ignore */ }
  }

  function updateActiveNav() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var normalized = href.replace(/\/$/, '') || '/';
      a.classList.toggle('active', normalized === path);
    });
  }

  function runPageInit() {
    var page = document.documentElement.dataset.page;
    if (page && window.YarchePages[page] && typeof window.YarchePages[page].init === 'function') {
      try { window.YarchePages[page].init(); } catch (e) { console.error(e); }
    }
  }

  function afterSwap() {
    updateActiveNav();
    runPageInit();
    // Reset scroll to top unless we're navigating to a hash
    if (!window.location.hash) window.scrollTo(0, 0);
    // Close mobile nav if open
    var mobile = document.getElementById('mobileNav');
    if (mobile) mobile.classList.remove('open');
  }

  // Hook into swup — API names differ between major versions, so register both.
  if (swup.hooks && typeof swup.hooks.on === 'function') {
    // swup v4
    swup.hooks.on('content:replace', function (visit) {
      if (visit && visit.to && visit.to.html) syncHtmlAttrs(visit.to.html);
    });
    swup.hooks.on('page:view', afterSwap);
  } else if (typeof swup.on === 'function') {
    // swup v3 fallback
    swup.on('contentReplaced', function () {
      // Best-effort attr sync from the freshly fetched page
      var entry = swup.cache && swup.cache.getCurrentPage && swup.cache.getCurrentPage();
      if (entry && entry.originalContent) syncHtmlAttrs(entry.originalContent);
      afterSwap();
    });
  }

  // Run init for the first page (no swap happened yet)
  document.addEventListener('DOMContentLoaded', runPageInit);
  if (document.readyState !== 'loading') runPageInit();
})();
