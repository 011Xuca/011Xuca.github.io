// Reproductor: suena al entrar, la tarjeta de la canción sube al empezar, baja al terminar y vuelve a empezar.
// Los navegadores bloquean el sonido automático: si pasa, se muestra una pantalla "Tocá para entrar" y el toque lo desbloquea.
(function () {
  var C = window.LINKTREE || {}, M = C.music;
  if (!M || !M.src) return;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function svg(d) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = d; return s;
  }
  var PLAY = '<path d="M7 4.500v15l13-7.500z" fill="currentColor" stroke="none"/>';
  var PAUSE = '<path d="M7 4h3.500v16H7zM13.500 4H17v16h-3.500z" fill="currentColor" stroke="none"/>';
  var NOTA = '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>';

  var au = new Audio(M.src);
  au.preload = 'auto';
  var MAX = Math.min(0.5, M.volume != null ? M.volume : 0.5), // tope fijo: nunca más de 0.5
      desde = 0, FADE = M.fade != null ? M.fade : 3;
  au.volume = 0;
  // Volumen según el segundo de la canción: sube de 0 a MAX en los primeros FADE segundos y baja a 0 en los últimos
  var raf = 0;
  function volumen() {
    var t = au.currentTime, d = au.duration || Infinity;
    var r = Math.min(1, (performance.now() - desde) / (FADE * 1000)); // subida de cada vez que arranca o se reanuda
    au.volume = Math.max(0, Math.min(1, MAX * Math.min(t / FADE, (d - t) / FADE, r, 1)));
    raf = au.paused ? 0 : requestAnimationFrame(volumen);
  }
  au.addEventListener('play', function () { desde = performance.now(); cancelAnimationFrame(raf); volumen(); });

  // Tarjeta "reproduciendo"
  var np = el('div', 'np'); np.dataset.style = M.style || 'glass';
  var cover = el('div', 'np-cover');
  if (M.cover) { var im = el('img'); im.src = M.cover; im.alt = ''; cover.appendChild(im); } else cover.appendChild(svg(NOTA));
  var eq = el('span', 'eq'); eq.innerHTML = '<i></i><i></i><i></i>';
  cover.appendChild(eq);
  var info = el('div', 'np-info');
  info.appendChild(el('b', null, M.title || 'Música'));
  if (M.artist) info.appendChild(el('small', null, M.artist));
  var bar = el('div', 'np-bar'); bar.appendChild(el('i'));
  info.appendChild(bar);
  var btn = el('button', 'np-btn'); btn.type = 'button';
  np.appendChild(cover); np.appendChild(info); np.appendChild(btn);
  document.body.appendChild(np);
  document.body.classList.add('con-musica');

  function icono() { btn.innerHTML = ''; btn.appendChild(svg(au.paused ? PLAY : PAUSE)); btn.setAttribute('aria-label', au.paused ? 'Reproducir' : 'Pausar'); np.classList.toggle('playing', !au.paused); }
  icono();
  btn.addEventListener('click', function () { if (au.paused) au.play().catch(function () {}); else au.pause(); });
  ['play', 'pause'].forEach(function (ev) { au.addEventListener(ev, icono); });
  au.addEventListener('play', function () { np.classList.add('on'); });
  au.addEventListener('timeupdate', function () { bar.firstChild.style.width = (au.duration ? au.currentTime / au.duration * 100 : 0) + '%'; });
  // Al terminar: la tarjeta baja, espera un momento y vuelve a empezar
  var rep = 0;
  au.addEventListener('ended', function () {
    np.classList.remove('on');
    // La copia de audio que escucha el analizador muere al terminar la canción: se recrea en la próxima reproducción
    if (ac) { ac.close(); ac = an = null; intentos = 0; }
    clearTimeout(rep);
    rep = setTimeout(function () {
      if (!au.paused) return; // ya le diste play vos durante la espera
      au.currentTime = 0;
      if (document.hidden) reanudar = true; else au.play().catch(function () {});
    }, M.repeatDelay != null ? M.repeatDelay : 3500);
  });

  // Si cambiás de pestaña o minimizás, se pausa; al volver sigue (solo si sonaba, no si la pausaste vos)
  var reanudar = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!au.paused) { reanudar = true; au.pause(); } }
    else if (reanudar) { reanudar = false; au.play().catch(function () {}); }
  });

  // Análisis de audio para que el fondo reaccione: graves, barras de espectro y golpes de beat (window.LTAudio).
  // El análisis se crea recién después de un toque de la persona; si el navegador no lo permite, la música suena igual, sin efectos.
  var A = window.LTAudio = { on: false, bass: 0, beatId: 0, bars: new Float32Array(48) };
  var ac = null, an = null, fd = null, pico = 0.05, pico2 = 0.05, prom = 0, previo = 0, ultimo = 0, rafA = 0;
  var intentos = 0, ticks = 0, suma = 0, mudo = 0, reintentos = 0;
  A.estado = function () { return { ctx: ac ? ac.state : null, an: !!an, intentos: intentos, ticks: ticks, suma: suma }; }; // diagnóstico (consola: LTAudio.estado())
  function grafo() {
    if (an) return;
    // Se "escucha" una copia del audio (captureStream) y NO se conecta a la salida: el sonido sigue su camino normal,
    // así que si el análisis falla o el navegador no lo soporta (Safari), la música igual suena.
    var cap = au.captureStream || au.mozCaptureStream;
    if (!cap) return;
    try {
      var st = cap.call(au);
      if (!st.getAudioTracks().length) return; // todavía sin pista de audio: se reintenta
      ac = new (window.AudioContext || window.webkitAudioContext)();
      an = ac.createAnalyser(); an.fftSize = 512; an.smoothingTimeConstant = 0.55;
      ac.createMediaStreamSource(st).connect(an);
      fd = new Uint8Array(an.frequencyBinCount);
      ac.resume();
    } catch (e) { if (ac) ac.close(); ac = an = null; }
  }
  function analizar() {
    A.on = !au.paused;
    if (!A.on) { A.bass = 0; A.bars.fill(0); return; }
    if (!an && intentos < 300 && intentos++ % 15 === 0) grafo();
    if (an && ac.state === 'suspended') ac.resume();
    if (an && ac.state === 'running') {
      an.getByteFrequencyData(fd); ticks++; suma = fd[1] + fd[2] + fd[3] + fd[4];
      // Autocorrección: si el analizador lee silencio con la música sonando (pasa al repetir la canción), se recrea
      if (suma === 0 && au.volume > 0.15 * MAX) {
        if (++mudo > 45 && reintentos < 8) { reintentos++; ac.close(); ac = an = null; mudo = 0; intentos = 0; rafA = requestAnimationFrame(analizar); return; }
      } else if (suma > 0) { mudo = 0; reintentos = 0; }
      var b = (fd[1] + fd[2] + fd[3] + fd[4]) / 1020, ahora = performance.now();
      var gan = Math.min(1, au.volume / MAX); // durante la subida y bajada de volumen los efectos son más chicos
      pico = Math.max(b, pico * 0.997);
      A.bass = b / Math.max(0.05, pico) * gan;
      // beat = los graves saltan por encima de su promedio reciente y de su nivel anterior
      if (A.bass > 0.45 && b > 0.01 && b > prom * 1.08 && b > previo + 0.004 && ahora - ultimo > 230) { ultimo = ahora; A.beatId++; }
      previo = b; prom = prom * 0.96 + b * 0.04;
      var n = A.bars.length, m = 0, i;
      for (i = 0; i < n; i++) { var v = fd[2 + Math.floor(Math.pow(i / n, 1.6) * 150)] / 255; A.bars[i] = v; if (v > m) m = v; }
      pico2 = Math.max(m, pico2 * 0.997);
      for (i = 0; i < n; i++) A.bars[i] = A.bars[i] / Math.max(0.05, pico2) * gan;
    }
    rafA = requestAnimationFrame(analizar);
  }
  au.addEventListener('play', function () { grafo(); cancelAnimationFrame(rafA); analizar(); });
  au.addEventListener('pause', function () { A.on = false; A.bass = 0; A.bars.fill(0); });
  // Si el navegador dejó sonar sin toque previo, el análisis se activa con el primer toque
  ['pointerdown', 'keydown'].forEach(function (ev) { addEventListener(ev, function () { if (!ac && !au.paused) { grafo(); cancelAnimationFrame(rafA); analizar(); } }, { passive: true }); });

  // Entrada: probar sonido automático; si el navegador lo bloquea, pantalla de entrada
  function puerta() {
    var g = el('button', 'gate'); g.type = 'button';
    var p = C.profile || {};
    g.appendChild(el('span', 'gate-name', p.name || ''));
    g.appendChild(el('span', 'gate-tap', M.gateText || 'Tocá para entrar'));
    g.addEventListener('click', function () {
      au.play().catch(function () {});
      g.classList.add('out');
      setTimeout(function () { g.remove(); }, 700);
    });
    document.body.appendChild(g);
    g.focus();
  }
  var intento = au.play();
  if (intento && intento.catch) intento.catch(puerta);
})();
