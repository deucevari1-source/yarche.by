(function () {
  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Disable on mobile — heavy animation kills TBT on weak CPUs
  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) return;

  function init() {
    var style = document.createElement('style');
    style.textContent =
      // Body transparent in both themes so the canvas (child of body,
      // z-index: -1) shows on top of the <html> background paint.
      'body { background: transparent !important; }' +
      '#space-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; display: block; opacity: 0; transition: opacity 1.5s ease-out; }';
    document.head.appendChild(style);

    var canvas = document.createElement('canvas');
    canvas.id = 'space-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var W, H, DPR;
    var stars = [];
    // /cases extras: each cluster is one entity — colored nebula gradient
    // wrapped around a tight bundle of white stars, the whole thing drifts
    // across the canvas as a unit (gas cloud + young stars travelling
    // together, the way star-forming regions actually move).
    var clusters = [];
    var shootingStars = [];
    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    var paused = false;

    // /cases gets two extras layered on top: colored nebula gradients and a
    // second pool of stars (same white style) gathered into a few clumps.
    // galaxyAlpha tweens between 0 and 1 so navigating in/out fades smoothly.
    function isOnCases() {
      return document.documentElement.dataset.page === 'cases'
          || !!document.querySelector('main[data-page="cases"]');
    }
    function isLightTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light';
    }
    function shouldShowGalaxy() {
      // Light theme keeps the page clean — galaxy clusters only in dark.
      return isOnCases() && !isLightTheme();
    }
    var galaxyAlpha = 0;
    var galaxyTarget = shouldShowGalaxy() ? 1 : 0;

    // Star tint flips with theme: white on dark, cursor-blue on light. The
    // light value mirrors what the orange cursor (mix-blend-mode: difference)
    // visually becomes over the cream #F5F5F0 page background.
    var starRGB = '255, 255, 255';
    function updateStarColor() {
      starRGB = document.documentElement.getAttribute('data-theme') === 'light'
        ? '0, 138, 240' : '255, 255, 255';
    }

    var CONFIG = {
      starDensity: 0.00035,
      layers: [
        { speed: 0.02, minR: 0.3, maxR: 0.8, alpha: 0.4 },
        { speed: 0.05, minR: 0.5, maxR: 1.2, alpha: 0.7 },
        { speed: 0.10, minR: 0.8, maxR: 1.8, alpha: 1.0 }
      ],
      shootingInterval: [2500, 6000],
      parallaxStrength: 15
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
      initClusters();
    }

    function initStars() {
      stars = [];
      var total = Math.floor(W * H * CONFIG.starDensity);
      for (var i = 0; i < total; i++) {
        var layer = CONFIG.layers[i % CONFIG.layers.length];
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: layer.minR + Math.random() * (layer.maxR - layer.minR),
          baseAlpha: layer.alpha * (0.5 + Math.random() * 0.5),
          twinkleSpeed: 0.003 + Math.random() * 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          speed: layer.speed,
          layerIndex: i % CONFIG.layers.length
        });
      }
    }

    // 4-5 cluster objects. Each has a center, a velocity, a hue (with a
    // slow per-cluster drift) and a pool of member stars stored as relative
    // offsets from the center. Update the center each frame, then paint
    // nebula + members at the new position — the whole entity moves as one.
    function initClusters() {
      clusters = [];
      var COUNT = 2 + Math.floor(Math.random() * 2); // 2 or 3
      // Match the base star drift (vx = speed*0.3, vy = speed*0.1) so the
      // clusters move with the field, not across it.
      var sharedAngle = Math.atan2(0.1, 0.3);
      for (var i = 0; i < COUNT; i++) {
        var radius = 110 + Math.random() * 110; // visual extent of the gas cloud
        var angle = sharedAngle;
        var speed = 0.06 + Math.random() * 0.10; // very slow — speeds still vary for parallax feel
        var members = [];
        var memberCount = 28 + Math.floor(Math.random() * 22);
        for (var j = 0; j < memberCount; j++) {
          // Triangular distribution around center — denser core, sparser edges.
          var dx = (Math.random() + Math.random() - 1) * radius;
          var dy = (Math.random() + Math.random() - 1) * radius;
          var layer = CONFIG.layers[j % CONFIG.layers.length];
          members.push({
            dx: dx, dy: dy,
            r: layer.minR + Math.random() * (layer.maxR - layer.minR),
            baseAlpha: layer.alpha * (0.5 + Math.random() * 0.5),
            twinkleSpeed: 0.003 + Math.random() * 0.008,
            twinklePhase: Math.random() * Math.PI * 2
          });
        }
        // 3-5 offset "lobes" per nebula. Each is a smaller radial gradient
        // displaced from the cluster center with its own size + hue offset.
        // Their overlap reads as organic wispy cloud instead of a clean ball.
        var lobeCount = 3 + Math.floor(Math.random() * 3);
        var lobes = [];
        for (var l = 0; l < lobeCount; l++) {
          lobes.push({
            ox: (Math.random() + Math.random() - 1) * radius * 0.5,
            oy: (Math.random() + Math.random() - 1) * radius * 0.5,
            r: radius * (0.45 + Math.random() * 0.55),
            hueOffset: (Math.random() - 0.5) * 60, // ±30°, sibling-cloud tints
            alpha: 0.55 + Math.random() * 0.45
          });
        }
        clusters.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: radius,
          baseHue: Math.random() * 360,
          hueDrift: 0.004 + Math.random() * 0.006, // per-cluster hue shift
          members: members,
          lobes: lobes
        });
      }
    }

    function spawnShootingStar() {
      var min = CONFIG.shootingInterval[0];
      var max = CONFIG.shootingInterval[1];
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

    function drawClusters(t, alpha) {
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < clusters.length; i++) {
        var c = clusters[i];
        // Move center + wrap around edges so clusters re-enter from the
        // opposite side instead of disappearing forever.
        c.x += c.vx;
        c.y += c.vy;
        if (c.x < -c.radius) c.x = W + c.radius;
        if (c.x > W + c.radius) c.x = -c.radius;
        if (c.y < -c.radius) c.y = H + c.radius;
        if (c.y > H + c.radius) c.y = -c.radius;

        // Paint nebula as 3-5 overlapping lobes for an organic shape.
        var hue = (c.baseHue + t * c.hueDrift) % 360;
        for (var lobeIdx = 0; lobeIdx < c.lobes.length; lobeIdx++) {
          var lobe = c.lobes[lobeIdx];
          var lx = c.x + lobe.ox;
          var ly = c.y + lobe.oy;
          var lhue = (hue + lobe.hueOffset + 360) % 360;
          var lR = lobe.r * 1.8;
          var g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lR);
          var a0 = (0.22 * alpha * lobe.alpha).toFixed(3);
          var a1 = (0.10 * alpha * lobe.alpha).toFixed(3);
          g.addColorStop(0.0, 'hsla(' + lhue + ', 80%, 60%, ' + a0 + ')');
          g.addColorStop(0.45, 'hsla(' + ((lhue + 30) % 360) + ', 75%, 45%, ' + a1 + ')');
          g.addColorStop(1.0, 'hsla(' + lhue + ', 80%, 40%, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(lx - lR, ly - lR, lR * 2, lR * 2);
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      // Member stars rendered after the nebula so they sit on top of their
      // own gas cloud. Composite back to source-over for crisp white pixels.
      for (var j = 0; j < clusters.length; j++) {
        var cl = clusters[j];
        for (var k = 0; k < cl.members.length; k++) {
          var s = cl.members[k];
          s.twinklePhase += s.twinkleSpeed;
          var sa = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase)) * alpha;
          ctx.beginPath();
          ctx.arc(cl.x + s.dx, cl.y + s.dy, s.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + starRGB + ', ' + sa + ')';
          ctx.fill();
        }
      }
    }

    function draw() {
      if (paused) {
        requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Smooth tween toward target (~1s to full fade at 60fps).
      galaxyAlpha += (galaxyTarget - galaxyAlpha) * 0.02;
      var nowT = performance.now();
      if (galaxyAlpha > 0.001) {
        drawClusters(nowT, galaxyAlpha);
      }

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        var alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));
        s.x += s.speed * 0.3;
        s.y += s.speed * 0.1;
        if (s.x > W + 10) s.x = -10;
        if (s.x < -10) s.x = W + 10;
        if (s.y > H + 10) s.y = -10;
        if (s.y < -10) s.y = H + 10;
        var px = mouse.x * (s.layerIndex + 1) / CONFIG.layers.length;
        var py = mouse.y * (s.layerIndex + 1) / CONFIG.layers.length;
        ctx.beginPath();
        ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + starRGB + ', ' + alpha + ')';
        ctx.fill();
      }

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
          ctx.fillStyle = 'rgba(' + starRGB + ', ' + tAlpha + ')';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + starRGB + ', ' + m.life + ')';
        ctx.fill();
        if (m.life <= 0 || m.x > W + 50 || m.y > H + 50) {
          shootingStars.splice(j, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    function updateState() {
      var wasPaused = paused;
      paused = document.hidden;
      if (wasPaused && !paused) shootingStars.length = 0;
      updateStarColor();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) {
      mouse.tx = ((e.clientX / W) - 0.5) * CONFIG.parallaxStrength;
      mouse.ty = ((e.clientY / H) - 0.5) * CONFIG.parallaxStrength;
    });
    document.addEventListener('visibilitychange', updateState);

    var observer = new MutationObserver(function () {
      updateState();
      galaxyTarget = shouldShowGalaxy() ? 1 : 0;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-page']
    });

    updateState();
    resize();
    setTimeout(spawnShootingStar, 1500);
    draw();

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        canvas.style.opacity = '1';
      });
    });
  }

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
