// Widget del servidor de Discord en TODOS los botones de Discord del sitio (clase .link-discord, la que ya usa ui.js).
// Al pasar el mouse (solo PC) se ve en una tarjeta; al hacer clic (PC y celu) se abre en un cuadro con botón para unirse.
// Ctrl/Cmd/Shift + clic o clic del medio abren la invitación normal. Lo carga ui.js; no hace falta tocar las páginas.
(function () {
  var SRC = 'https://discord.com/widget?id=1093766638421155873&theme=dark';
  var SANDBOX = 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';
  var CSS = '.dw-card{position:fixed;z-index:9998;width:300px;height:360px;border-radius:14px;overflow:hidden;background:#1e1f22;box-shadow:0 12px 40px rgba(0,0,0,.45);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s,visibility .15s}' +
    '.dw-card.on{opacity:1;visibility:visible;pointer-events:auto}' +
    '.dw-card iframe,.dw-dlg iframe{display:block;width:100%;height:100%;border:0}' +
    '.dw-dlg{width:min(350px,calc(100vw - 32px));padding:0;border:0;border-radius:18px;overflow:hidden;color:#fff;background:#1e1f22}' +
    '.dw-dlg::backdrop{background:rgba(0,0,0,.65)}' +
    '.dw-dlg iframe{height:min(500px,65vh)}' +
    '.dw-bar{display:flex;gap:8px;padding:10px}' +
    '.dw-bar a,.dw-bar button{flex:1;padding:10px 14px;border:0;border-radius:12px;font:inherit;font-size:.9rem;font-weight:700;text-align:center;text-decoration:none;cursor:pointer}' +
    '.dw-join{color:#fff;background:#5865F2}.dw-x{flex:none!important;color:#fff;background:rgba(255,255,255,.12)}' +
    '@media (prefers-reduced-motion:reduce){.dw-card{transition:none}}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function frame() { var f = el('iframe'); f.title = 'Widget del servidor de Discord'; f.sandbox = SANDBOX; f.src = SRC; return f; }
  function boton(e) { return e.target.closest && e.target.closest('a.link-discord'); }

  // Tarjeta al pasar el mouse. El iframe se crea una vez y no se mueve (si no, se recarga).
  var card = null, actual = null, conMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function mostrar(a) {
    if (!card) { card = el('div', 'dw-card'); var f = frame(); f.tabIndex = -1; card.appendChild(f); document.body.appendChild(card); }
    card.classList.add('on');
    var r = a.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight, m = 10;
    card.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
    card.style.top = (r.bottom + m + h < innerHeight - 8 ? r.bottom + m : Math.max(8, r.top - h - m)) + 'px';
  }
  // Se cierra con una pausa: da tiempo a pasar el mouse del botón a la tarjeta (y se queda abierta mientras estés encima).
  var t = null;
  function cancelar() { clearTimeout(t); t = null; }
  function ocultar() { cancelar(); actual = null; if (card) card.classList.remove('on'); }
  function cerrarLuego() { cancelar(); t = setTimeout(ocultar, 450); }
  if (conMouse) {
    document.addEventListener('pointerover', function (e) {
      var a = boton(e) || null;
      if (a) { cancelar(); if (a !== actual) { actual = a; mostrar(a); } return; }
      if (!actual) return;
      if (card && card.contains(e.target)) cancelar(); else cerrarLuego();
    });
    document.addEventListener('scroll', ocultar, { passive: true });
  }

  // Cuadro al hacer clic
  var dlg = null, join = null;
  function crear() {
    dlg = el('dialog', 'dw-dlg'); dlg.setAttribute('aria-label', 'Servidor de Discord');
    var bar = el('div', 'dw-bar');
    join = el('a', 'dw-join', 'Unirme al servidor'); join.target = '_blank'; join.rel = 'noopener';
    var x = el('button', 'dw-x', 'Cerrar'); x.type = 'button'; x.addEventListener('click', function () { dlg.close(); });
    bar.appendChild(join); bar.appendChild(x);
    dlg.appendChild(frame()); dlg.appendChild(bar);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // clic en el fondo oscuro
    document.body.appendChild(dlg);
  }
  document.addEventListener('click', function (e) {
    var a = boton(e);
    if (!a || e.button || e.ctrlKey || e.metaKey || e.shiftKey || typeof HTMLDialogElement === 'undefined') return;
    e.preventDefault(); ocultar();
    if (!dlg) crear();
    join.href = a.href;
    dlg.showModal();
  });
})();
