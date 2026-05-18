(function () {
  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Disable on mobile — heavy animation kills TBT on weak CPUs
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return;

  var IS_FAME = document.documentElement.dataset.page === 'cases';

  function init() {
    // Inject styles. Canvas starts at opacity:0 and fades in via CSS transition
    // — set programmatically below after first paint to trigger the transition.
    var style = document.createElement('style');
    style.textContent =
      'html:not([data-theme="light"]) body { background: transparent !important; }' +
      '#space-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; display: block; opacity: 0; transition: opacity 1.5s ease-out; }' +
      (IS_FAME
        ? 'html[data-page="cases"] body { background: transparent !important; }'
        : 'html[data-theme="light"] #space-bg { display: none; }');
    document.head.appendChild(style);

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'space-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H, DPR;
    var stars = [];
    var shootingStars = [];
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    var paused = false;
    var sprites = []; // pre-rendered glow sprites (fame mode only)

    var CONFIG = IS_FAME ? {
      // Hall-of-fame: slower, sparser, bigger golden dust motes drifting upward
      starDensity: 0.00022,
      layers: [
        { speed: 0.015, minR: 0.6, maxR: 1.4, alpha: 0.35 },
        { speed: 0.035, minR: 1.0, maxR: 2.2, alpha: 0.6 },
        { speed: 0.065, minR: 1.6, maxR: 3.2, alpha: 0.85 }
      ],
      shootingInterval: [3500, 8000],
      parallaxStrength: 20,
      palette: [
        [255, 220, 140],
        [255, 200,  90],
        [255, 240, 200],
        [255, 180,  70]
      ],
      driftAngle: -Math.PI / 2, // upward
      driftSpread: 0.35,
      glow: 8
    } : {
      starDensity: 0.00035,
      layers: [
        { speed: 0.02, minR: 0.3, maxR: 0.8, alpha: 0.4 },
        { speed: 0.05, minR: 0.5, maxR: 1.2, alpha: 0.7 },
        { speed: 0.10, minR: 0.8, maxR: 1.8, alpha: 1.0 }
      ],
      shootingInterval: [2500, 6000],
      parallaxStrength: 15,
      palette: null,
      glow: 0
    };

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initStars();
    }

    function buildSprites() {
      // One soft-glow sprite per palette color. Each is a small offscreen canvas
      // with a radial gradient. drawImage with these is ~10× cheaper than shadowBlur.
      sprites = [];
      if (!CONFIG.palette) return;
      var SIZE = 32;
      for (var i = 0; i < CONFIG.palette.length; i++) {
        var c = CONFIG.palette[i];
        var off = document.createElement('canvas');
        off.width = off.height = SIZE;
        var octx = off.getContext('2d');
        var g = octx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
        g.addColorStop(0.0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',1)');
        g.addColorStop(0.35, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.5)');
        g.addColorStop(1.0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
        octx.fillStyle = g;
        octx.fillRect(0, 0, SIZE, SIZE);
        sprites.push(off);
      }
    }

    function initStars() {
      stars = [];
      var total = Math.floor(W * H * CONFIG.starDensity);
      for (var i = 0; i < total; i++) {
        var layer = CONFIG.layers[i % CONFIG.layers.length];
        var color = null;
        var spriteIdx = -1;
        if (CONFIG.palette) {
          spriteIdx = Math.floor(Math.random() * CONFIG.palette.length);
          color = CONFIG.palette[spriteIdx];
        }
        // Per-particle drift vector (used in fame mode)
        var angle = CONFIG.driftAngle != null
          ? CONFIG.driftAngle + (Math.random() - 0.5) * (CONFIG.driftSpread || 0)
          : 0;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: layer.minR + Math.random() * (layer.maxR - layer.minR),
          baseAlpha: layer.alpha * (0.5 + Math.random() * 0.5),
          twinkleSpeed: 0.003 + Math.random() * 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          speed: layer.speed,
          layerIndex: i % CONFIG.layers.length,
          color: color,
          spriteIdx: spriteIdx,
          vx: Math.cos(angle),
          vy: Math.sin(angle)
        });
      }
    }

    function spawnShootingStar() {
      var min = CONFIG.shootingInterval[0];
      var max = CONFIG.shootingInterval[1];
      // skip spawning while tab hidden or paused — only schedule next
      if (!paused && !document.hidden) {
        var startX = Math.random() * W;
        var startY = Math.random() * H * 0.3;
        var angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
        var speed = 8 + Math.random() * 6;
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1, trail: []
        });
      }
      setTimeout(spawnShootingStar, min + Math.random() * (max - min));
    }

    function draw() {
      if (paused) {
        requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      if (IS_FAME) ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        var alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));
        if (IS_FAME) {
          s.x += s.vx * s.speed * 3;
          s.y += s.vy * s.speed * 3;
        } else {
          s.x += s.speed * 0.3;
          s.y += s.speed * 0.1;
        }
        if (s.x > W + 10) s.x = -10;
        if (s.x < -10) s.x = W + 10;
        if (s.y > H + 10) s.y = -10;
        if (s.y < -10) s.y = H + 10;
        var px = mouse.x * (s.layerIndex + 1) / CONFIG.layers.length;
        var py = mouse.y * (s.layerIndex + 1) / CONFIG.layers.length;
        if (s.spriteIdx >= 0 && sprites[s.spriteIdx]) {
          var sprite = sprites[s.spriteIdx];
          var size = s.r * 8; // sprite already has soft falloff
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, s.x + px - size / 2, s.y + py - size / 2, size, size);
        } else {
          ctx.beginPath();
          ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      for (var j = shootingStars.length - 1; j >= 0; j--) {
        var m = shootingStars[j];
        m.trail.push({ x: m.x, y: m.y });
        if (m.trail.length > 20) m.trail.shift();
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.008;
        for (var k = 0; k < m.trail.length; k++) {
          var t = m.trail[k];
          var tAlpha = (k / m.trail.length) * m.life;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.2 * (k / m.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + tAlpha + ')';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + m.life + ')';
        ctx.fill();
        if (m.life <= 0 || m.x > W + 50 || m.y > H + 50) {
          shootingStars.splice(j, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    function updateState() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      var wasPaused = paused;
      // Hall-of-fame page stays dark on both themes, so don't pause on light
      paused = (isLight && !IS_FAME) || document.hidden;
      // returning to tab — drop any in-flight meteors so they don't bunch up
      if (wasPaused && !paused) {
        shootingStars.length = 0;
      }
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) {
      mouse.tx = ((e.clientX / W) - 0.5) * CONFIG.parallaxStrength;
      mouse.ty = ((e.clientY / H) - 0.5) * CONFIG.parallaxStrength;
    });
    document.addEventListener('visibilitychange', updateState);

    var observer = new MutationObserver(updateState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    updateState();
    buildSprites();
    resize();
    if (!IS_FAME) setTimeout(spawnShootingStar, 1500);
    draw();

    // Trigger fade-in. Two rAFs so the browser has applied opacity:0 first.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        canvas.style.opacity = '1';
      });
    });
  }

  // Defer init until the browser is idle (or 1.5s timeout — whichever first).
  // This keeps space-bg's startup work off the critical rendering path so
  // it doesn't compete with hero text / fonts / hydration for the main thread.
  function scheduleInit() {
    var ric = window.requestIdleCallback;
    if (typeof ric === 'function') {
      ric(init, { timeout: 1500 });
    } else {
      setTimeout(init, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInit);
  } else {
    scheduleInit();
  }
})();
