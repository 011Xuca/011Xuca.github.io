// Fondo animado: motas que suben despacio con distinta profundidad y se mueven apenas con el mouse o el celu.
// Con música (window.LTAudio): visualizador de barras abajo con su luz, las motas saltan y se desenfocan solo en cada beat,
// el contenido tiembla (camshake) y publica --pulso en :root para que botones, avatar y cursor escalen con la música.
// Solo corre con bgAnimation: 'particulas'. Se frena si la pestaña está oculta o si pedís "reducir movimiento".
(function () {
  if (document.body.dataset.bgAnim !== 'particulas') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.LTSinGPU) return; // sin aceleracion: sin canvas ni visualizador
  var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  cv.className = 'fondo-canvas';
  document.body.insertBefore(cv, document.body.firstChild);
  var root = document.documentElement;
  var color = getComputedStyle(root).getPropertyValue('--accent').trim() || '#9AD7FF';
  var transp = color.length === 7 ? color + '00' : 'rgba(255,255,255,0)';
  var W, H, dpr, motas = [], px = 0, py = 0, tx = 0, ty = 0, raf = 0;
  var bajos = 0, impulso = 0, temblor = 0, ultimoBeat = 0, nivel = 0, barras = new Float32Array(48);
  var fuerte = Math.min(innerWidth, innerHeight) > 600; // en celu el temblor y las barras son más suaves
  var pulsoPrev = '';
  var lite = matchMedia('(hover: none)').matches || !!window.LTSinGPU, lento = 0, ult = 0; // lite = celu o equipo lento: menos efectos
  function crear(abajo) {
    var z = Math.random(); // 0 = lejos, 1 = cerca
    return { x: Math.random() * W, y: abajo ? H + 10 : Math.random() * H, z: z, r: 0.6 + z * 2.4, v: 6 + z * 26, a: 0.15 + z * 0.55, f: Math.random() * 6.28, s: 0.4 + Math.random() * 0.8, k: 0 };
  }
  function medir() {
    dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    W = root.clientWidth; H = root.clientHeight; // sin la barra de scroll
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(lite ? 24 : fuerte ? 90 : 35, W * H / 14000)); // menos motas en pantallas chicas
    while (motas.length < n) motas.push(crear(false));
    motas.length = n;
  }
  var t0 = 0, tr = 0;
  function frame(t) {
    // fps reales del navegador (antes del limite de 30 fps del celu): si el promedio pasa de 22 ms por cuadro (<45 fps), se apaga todo
    var raw = t - tr; tr = t;
    if (raw > 0 && raw < 500) { lento += (raw - lento) * 0.05; if (++ult > 60 && lento > 22) { window.LTSinGPU = true; root.classList.add('sin-gpu'); cv.style.transition = 'opacity .8s'; cv.style.opacity = 0; ac.abort(); setTimeout(function () { cv.remove(); }, 900); return; } }
    if (lite && t - t0 < 30) { raf = requestAnimationFrame(frame); return; } // celu: 30 fps
    var crudo = t - t0;
    var dt = Math.min(0.05, crudo / 1000 || 0); t0 = t;
    px += (tx - px) * 0.04; py += (ty - py) * 0.04;
    ctx.clearRect(0, 0, W, H);

    // Música: graves y beats; todo se suaviza hacia 0 cuando la canción está en pausa
    var A = window.LTAudio, on = !!(A && A.on);
    bajos += ((on ? A.bass : 0) - bajos) * 0.15;
    nivel += ((on ? 1 : 0) - nivel) * 0.06;
    var golpe = on && A.beatId !== ultimoBeat;
    if (golpe) { ultimoBeat = A.beatId; impulso = 1; temblor = lite ? 0 : fuerte ? 9 : 4; }
    impulso *= 0.88;
    // Barras: suben rápido y bajan despacio (menos rebote)
    for (var b = 0; b < barras.length; b++) {
      var obj = on ? Math.pow(A.bars[b], 1.4) : 0;
      barras[b] += (obj - barras[b]) * (obj > barras[b] ? 0.3 : 0.07);
    }
    var pv = (nivel * (0.35 * bajos + 0.65 * impulso)).toFixed(3);
    if (!lite && pv !== pulsoPrev) { pulsoPrev = pv; root.style.setProperty('--pulso', pv); } // lo leen botones, avatar y cursor; solo si cambió (evita recalcular estilos 60 veces/s en silencio)

    // Luz del visualizador: una franja que sube desde abajo y una línea fina en la base, para unir las barras con el fondo
    if (nivel > 0.02) {
      var alto = H * (fuerte ? 0.45 : 0.3);
      var luz = ctx.createLinearGradient(0, H, 0, H - alto * 1.5);
      luz.addColorStop(0, color); luz.addColorStop(1, transp);
      ctx.globalAlpha = nivel * (0.1 + 0.14 * bajos + 0.12 * impulso); ctx.fillStyle = luz;
      ctx.fillRect(0, H - alto * 1.5, W, alto * 1.5);
      var linea = ctx.createLinearGradient(0, 0, W, 0);
      linea.addColorStop(0, transp); linea.addColorStop(0.5, color); linea.addColorStop(1, transp);
      ctx.globalAlpha = nivel * (0.45 + 0.4 * impulso); ctx.fillStyle = linea;
      ctx.fillRect(0, H - 2, W, 2);
    }
    // Barras gruesas que se desvanecen desde su propia punta
    if (nivel > 0.02) {
      var n = barras.length, paso = W / n, alt = H * (fuerte ? 0.45 : 0.3);
      for (var k = 0; k < n; k += lite ? 2 : 1) {
        var hb = barras[k] * alt + 3;
        if (lite) { ctx.globalAlpha = 0.4 * nivel; ctx.fillStyle = color; }
        else { var g = ctx.createLinearGradient(0, H, 0, H - hb); g.addColorStop(0, color); g.addColorStop(1, transp); ctx.globalAlpha = 0.6 * nivel; ctx.fillStyle = g; }
        ctx.fillRect(k * paso + paso * 0.15, H - hb, Math.max(5, paso * (lite ? 1.6 : 0.7)), hb);
      }
    }
    ctx.fillStyle = color;

    // Motas: nítidas mientras suena; solo se desenfocan y saltan de golpe en cada beat
    for (var i = 0; i < motas.length; i++) {
      var m = motas[i];
      if (golpe) m.k = 140 + 320 * m.z; // empujón hacia arriba
      m.k *= 0.88;
      m.y -= (m.v * (1 + bajos * nivel * 1.2) + m.k) * dt; m.f += m.s * dt * (1 + bajos * nivel);
      var x = m.x + Math.sin(m.f) * 14 * m.z + px * m.z * 40, y = m.y + py * m.z * 40;
      if (m.y < -10) { motas[i] = crear(true); continue; }
      ctx.globalAlpha = Math.min(1, m.a * (0.65 + 0.35 * Math.sin(m.f * 2.3)) * (1 + impulso * 0.8));
      ctx.shadowColor = color; ctx.shadowBlur = lite ? 0 : impulso * 14 * (0.4 + m.z); // el desenfoque aparece solo con el golpe
      ctx.beginPath(); ctx.arc(x, y, m.r * (1 + impulso * 0.7 * m.z), 0, 6.2832); ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Camshake: el contenido tiembla en cada beat y se va apagando
    if (temblor > 0.1) {
      root.style.setProperty('--sx', ((Math.random() - 0.5) * 2 * temblor).toFixed(2) + 'px');
      root.style.setProperty('--sy', ((Math.random() - 0.5) * 2 * temblor).toFixed(2) + 'px');
      temblor *= 0.82;
    } else if (temblor) { temblor = 0; root.style.setProperty('--sx', '0px'); root.style.setProperty('--sy', '0px'); }
    raf = requestAnimationFrame(frame);
  }
  var ac = new AbortController(), S = ac.signal; // al apagar se quitan todos los listeners
  addEventListener('resize', medir, { signal: S });
  addEventListener('pointermove', function (e) { tx = e.clientX / W - 0.5; ty = e.clientY / H - 0.5; }, { passive: true, signal: S });
  addEventListener('deviceorientation', function (e) { if (e.gamma != null) { tx = Math.max(-0.5, Math.min(0.5, e.gamma / 60)); ty = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 90)); } }, { passive: true, signal: S });
  document.addEventListener('visibilitychange', function () { cancelAnimationFrame(raf); if (!document.hidden) { t0 = performance.now(); raf = requestAnimationFrame(frame); } }, { signal: S });
  medir(); raf = requestAnimationFrame(frame);
})();
