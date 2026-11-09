// Cursor propio: rombo giratorio, punto exacto, estela fluida y chispas que suben como las motas del fondo.
// Reacciona a la música: la estela se ensancha y el rombo escala con --pulso (lo publica fondo.js).
// Solo con mouse (no en celu) y sin "reducir movimiento".
(function () {
  if (window.LTSinGPU || !matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement, body = document.body;
  var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  var ring = document.createElement('div'), dot = document.createElement('div');
  cv.className = 'cursor-trail'; ring.className = 'cursor-ring'; dot.className = 'cursor-dot';
  body.appendChild(cv); body.appendChild(ring); body.appendChild(dot);
  root.classList.add('cursor-custom');
  var color = getComputedStyle(root).getPropertyValue('--accent').trim() || '#9AD7FF';
  var W, H, dpr, mx = -100, my = -100, rx = -100, ry = -100, pts = [], chispas = [], VIDA = 420, raf = 0, ult = 0;
  function medir() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = root.clientWidth; H = root.clientHeight; // sin la barra de scroll
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  var ac = new AbortController(), S = ac.signal; // al apagar se quitan todos los listeners
  addEventListener('resize', medir, { signal: S }); medir();
  addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (rx < 0) { rx = mx; ry = my; }
    root.classList.add('cursor-on');
    ring.classList.toggle('grande', !!(e.target.closest && e.target.closest('a, button, [role="button"], .np')));
  }, { passive: true, signal: S });
  document.addEventListener('mouseleave', function () { root.classList.remove('cursor-on'); }, { signal: S });
  addEventListener('pointerdown', function () { ring.classList.add('click'); }, { signal: S });
  addEventListener('pointerup', function () { ring.classList.remove('click'); }, { signal: S });
  function frame(t) {
    // fondo.js agrega .sin-gpu si el equipo va lento sin aceleracion: se vuelve al cursor normal
    if (root.classList.contains('sin-gpu')) { ac.abort(); root.classList.remove('cursor-custom'); // vuelve el cursor normal y el custom se desvanece
      [cv, ring, dot].forEach(function (el) { el.style.transition = 'opacity .6s'; el.style.setProperty('opacity', '0', 'important'); });
      setTimeout(function () { cv.remove(); ring.remove(); dot.remove(); root.classList.remove('cursor-on'); }, 700); return; }
    var dt = Math.min(0.05, (t - ult) / 1000 || 0); ult = t;
    var pulso = parseFloat(root.style.getPropertyValue('--pulso')) || 0;
    rx += (mx - rx) * 0.4; ry += (my - ry) * 0.4; // el rombo sigue con poca inercia
    // Con la propiedad "translate" (no "transform"): "scale" se aplica después y no multiplica la posición
    ring.style.translate = rx + 'px ' + ry + 'px';
    dot.style.translate = mx + 'px ' + my + 'px';
    var u = pts[pts.length - 1], mov = u ? Math.abs(u.x - mx) + Math.abs(u.y - my) : 0;
    if (!u || mov > 0.4) { pts.push({ x: mx, y: my, t: t }); if (pts.length > 140) pts.shift(); }
    if (mov > 3 && chispas.length < 60) chispas.push({ x: mx, y: my, vx: (Math.random() - 0.5) * 30, vy: -(15 + Math.random() * 45), r: 0.8 + Math.random() * 1.6, t: t });
    while (pts.length && t - pts[0].t > VIDA) pts.shift();
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color; ctx.fillStyle = color;
    for (var i = 1; i < pts.length; i++) {
      var a = 1 - (t - pts[i].t) / VIDA;
      ctx.globalAlpha = Math.max(0, a * 0.65); ctx.lineWidth = (1 + 6 * a) * (1 + pulso * 1.6);
      ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
    }
    for (var j = chispas.length - 1; j >= 0; j--) {
      var c = chispas[j], v = 1 - (t - c.t) / 800;
      if (v <= 0) { chispas.splice(j, 1); continue; }
      c.x += c.vx * dt; c.y += c.vy * dt;
      ctx.globalAlpha = v * 0.8; ctx.beginPath(); ctx.arc(c.x, c.y, c.r * (1 + pulso), 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); }, { signal: S });
  raf = requestAnimationFrame(frame);
})();
