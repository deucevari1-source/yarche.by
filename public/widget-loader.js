(function () {
  var loaded = false;

  function loadWidget() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.src = '/widget.js';
    s.defer = true;
    s.dataset.api = 'https://bot.yarche.by';
    s.dataset.lead = 'https://bot.yarche.by:5050/api/lead';
    s.dataset.name = 'ai-Влад';
    s.dataset.color = '#FF6B00';
    s.dataset.greeting = 'Здравуствуйте, чем могу помочь? Что подсказать?';
    document.body.appendChild(s);
  }

  // Load on first real user interaction
  var events = ['scroll', 'touchstart', 'mousemove', 'keydown'];
  events.forEach(function (ev) {
    window.addEventListener(ev, loadWidget, { once: true, passive: true });
  });

  // Fallback: load after idle period if no interaction (real users almost always interact)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadWidget, { timeout: 7000 });
  } else {
    setTimeout(loadWidget, 5000);
  }
})();
