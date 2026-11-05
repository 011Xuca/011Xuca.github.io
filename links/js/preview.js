// Vista previa al pasar el mouse por un link: ícono, título, descripción, etiquetas y botón de acción (todo viene de config.js).
// Solo con mouse; en el celu no hay "pasar el mouse".
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var pv = document.createElement('div');
  pv.className = 'pv'; pv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pv);
  var actual = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function icono(n) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = (window.LT_ICONS || {})[n] || (window.LT_ICONS || {}).link || ''; // contenido fijo de icons.js
    return s;
  }

  function mostrar(btn) {
    var d = btn.dataset;
    pv.textContent = '';
    if (d.img) { var im = el('img', 'pv-img'); im.src = d.img; im.alt = ''; pv.appendChild(im); }
    var cab = el('div', 'pv-cab');
    var ic = el('span', 'pv-ic'); ic.appendChild(icono(d.icono)); cab.appendChild(ic);
    var tt = el('div', 'pv-tt'); tt.appendChild(el('b', null, d.titulo)); tt.appendChild(el('small', null, d.host)); cab.appendChild(tt);
    pv.appendChild(cab);
    if (d.desc) pv.appendChild(el('p', 'pv-desc', d.desc));
    if (d.tags) { var ch = el('div', 'pv-tags'); d.tags.split('|').forEach(function (t) { ch.appendChild(el('span', null, t)); }); pv.appendChild(ch); }
    var cta = el('div', 'pv-cta'); cta.appendChild(el('span', null, d.cta || 'Abrir')); cta.appendChild(icono('arrow')); pv.appendChild(cta);
    pv.classList.add('on');
    var r = btn.getBoundingClientRect(), w = pv.offsetWidth, h = pv.offsetHeight, m = 14, L, T;
    if (r.right + m + w < innerWidth - 8) { L = r.right + m; T = r.top + r.height / 2 - h / 2; }       // a la derecha
    else if (r.left - m - w > 8) { L = r.left - m - w; T = r.top + r.height / 2 - h / 2; }             // a la izquierda
    else { L = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)); T = r.top - h - m < 8 ? r.bottom + m : r.top - h - m; } // arriba o abajo
    pv.style.left = L + 'px'; pv.style.top = Math.max(8, Math.min(innerHeight - h - 8, T)) + 'px';
  }
  document.addEventListener('pointerover', function (e) {
    var b = e.target.closest && e.target.closest('.btn[data-titulo]');
    if (b === actual) return;
    actual = b;
    if (b) mostrar(b); else pv.classList.remove('on');
  });
  document.addEventListener('scroll', function () { actual = null; pv.classList.remove('on'); }, { passive: true });
})();
