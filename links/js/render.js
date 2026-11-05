// Lee config.js y arma la página. Todo el texto entra con textContent y solo se aceptan links http, https y mailto.
(function () {
  var C = window.LINKTREE, root = document.documentElement;
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function seguro(u) { return /^(https?:|mailto:|\.{0,2}\/|[\w-]+\/)/i.test(u || '') ? u : '#'; }
  function icono(n) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = window.LT_ICONS[n] || window.LT_ICONS.link; // contenido fijo de icons.js, no viene de la config
    Array.prototype.forEach.call(s.querySelectorAll('path,circle,rect'), function (f) { f.setAttribute('pathLength', '1'); }); // para que el ícono se "dibuje"
    return s;
  }

  // Tema: base + preset + overrides -> variables CSS y atributos
  var P = window.LT_PRESETS, t = Object.assign({}, P.base, P[C.theme.preset] || {}, C.theme.overrides || {});
  var vars = { bg: 'bg', text: 'text', muted: 'muted', accent: 'accent', accentText: 'accent-text', btnBg: 'btn-bg', btnText: 'btn-text',
    btnBorder: 'btn-border', btnRadius: 'btn-radius', btnPadding: 'btn-padding', width: 'width', panel: 'panel', iconBg: 'icon-bg', iconFg: 'icon-fg' };
  Object.keys(vars).forEach(function (k) { root.style.setProperty('--' + vars[k], t[k]); });
  if (t.font) {
    root.style.setProperty('--font', '"' + t.font + '", system-ui, sans-serif');
    if (t.fontUrl && /^https:\/\/fonts\.googleapis\.com\//.test(t.fontUrl)) {
      var l = el('link'); l.rel = 'stylesheet'; l.href = t.fontUrl; document.head.appendChild(l);
    }
  }
  var b = document.body;
  b.dataset.btn = t.btnStyle; b.dataset.bgAnim = t.bgAnimation; b.dataset.entrance = t.entrance; b.dataset.hover = t.hover;
  b.dataset.layout = t.layout; b.dataset.icon = t.iconStyle; b.dataset.rows = t.rows;

  // Foto de fondo (con desenfoque, oscurecido y blanco y negro opcionales)
  if (t.bgImage && seguro(t.bgImage) !== '#') {
    var fondo = el('div', 'fondo-img');
    fondo.style.backgroundImage = 'url("' + seguro(t.bgImage).replace(/"/g, '%22') + '")';
    fondo.style.filter = 'blur(' + t.bgBlur + ') grayscale(' + t.bgGray + ') brightness(' + (1 - parseFloat(t.bgDim || 0)) + ')';
    b.insertBefore(fondo, b.firstChild);
  }

  // Foto grande de fondo (estilo "Héroe"): se desvanece hacia los bordes para integrarse con la composición
  if (t.heroImage && seguro(t.heroImage) !== '#') {
    var foto = el('div', 'fondo-foto');
    foto.style.backgroundImage = 'url("' + seguro(t.heroImage).replace(/"/g, '%22') + '")';
    b.insertBefore(foto, b.firstChild);
  }

  // Perfil
  var p = C.profile, page = document.getElementById('page');
  if (p.avatar) { // sin avatar en config.js, no se muestra ninguna foto
    var av = el('img', 'avatar ' + (p.avatarShape || 'circle'));
    av.src = p.avatar; av.alt = p.name; av.width = av.height = 96;
    if (p.avatarPosition) av.style.objectPosition = p.avatarPosition; // qué parte de una imagen no cuadrada se ve, ej '35% 50%'
    if (p.avatarSize) av.style.width = av.style.height = p.avatarSize + 'px';
    if (p.avatarInvert) { av.classList.add('invertido'); av.style.boxShadow = 'none'; } // dibujo negro sobre blanco -> líneas claras sobre oscuro (el aro se desactiva: el filtro lo tiñe)
    page.appendChild(av);
  }
  var h1 = el('h1', 'name' + (t.nameEffect === 'glitch' ? ' glitch' : ''), p.name);
  h1.dataset.text = p.name;
  page.appendChild(h1);
  if (p.handle) page.appendChild(el('p', 'handle', p.handle));
  if (p.bio) {
    var bio = el('p', 'bio', t.bioEffect === 'typing' ? '' : p.bio);
    page.appendChild(bio);
    if (t.bioEffect === 'typing') {
      var k = 0;
      bio.classList.add('typing');
      (function paso() { bio.textContent = p.bio.slice(0, ++k); if (k < p.bio.length) setTimeout(paso, 45); })();
    }
  }
  document.title = p.name + ' · Links';

  // Redes
  if (C.socials && C.socials.length) {
    var so = el('div', 'socials');
    C.socials.forEach(function (s) {
      if (!s.url) return; // red sin url todavía: no se muestra
      var a = el('a', 'social');
      a.href = seguro(s.url); a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', s.type);
      a.appendChild(icono(s.type));
      so.appendChild(a);
    });
    page.appendChild(so);
  }

  // Links
  var list = el('div', 'links'), nb = 0;
  C.links.forEach(function (it) {
    if (it.type === 'header') return list.appendChild(el('h2', 'grupo', it.title));
    if (it.type === 'divider') return list.appendChild(el('hr', 'sep'));
    if (!it.url) return; // link sin url todavía: no se muestra
    var a = el('a', 'btn' + (it.featured ? ' featured' : '') + (it.image ? ' con-imagen' : ''));
    a.style.setProperty('--k', nb++); // posición del botón: escalona su entrada y su brillo
    a.href = seguro(it.url);
    // Datos para la vista previa al pasar el mouse (js/preview.js)
    try { a.dataset.host = new URL(it.url, location.href).hostname.replace(/^www\./, '') || 'este sitio'; } catch (e) { a.dataset.host = ''; }
    a.dataset.titulo = it.title; if (it.desc) a.dataset.desc = it.desc; if (it.preview) a.dataset.img = seguro(it.preview);
    a.dataset.icono = it.icon || 'link'; if (it.tags) a.dataset.tags = it.tags.join('|'); if (it.cta) a.dataset.cta = it.cta;
    if (/^https?:/i.test(it.url)) { a.target = '_blank'; a.rel = 'noopener'; }
    if (it.image) { // tarjeta grande con imagen, como el Discord del Linktree
      var im = el('img', 'thumb'); im.src = seguro(it.image); im.alt = ''; im.loading = 'lazy';
      a.appendChild(im);
    } else a.appendChild(icono(it.icon || 'link'));
    var tx = el('span', 'tx');
    tx.appendChild(el('b', null, it.title));
    if (it.subtitle) tx.appendChild(el('small', null, it.subtitle));
    a.appendChild(tx);
    if (it.badge) a.appendChild(el('em', 'badge', it.badge));
    a.appendChild(icono('arrow')).classList.add('go');
    list.appendChild(a);
  });
  page.appendChild(list);
  if (C.footer && C.footer.text) page.appendChild(el('p', 'pie', C.footer.text));

  // Contador de visitas (opcional): abacus.jasoncameron.dev, sin datos personales
  if (C.views && C.views.enabled) {
    var vw = el('p', 'visitas'); vw.appendChild(icono('eye'));
    var n = el('span', null, '…'); vw.appendChild(n); page.appendChild(vw);
    fetch('https://abacus.jasoncameron.dev/hit/' + encodeURIComponent(C.views.namespace || '011xuca') + '/' + encodeURIComponent(C.views.key || 'links'))
      .then(function (r) { return r.json(); }).then(function (d) { n.textContent = d.value; })
      .catch(function () { vw.remove(); });
  }

  // Brillo que sigue al mouse dentro de cada botón (solo con mouse)
  list.addEventListener('pointermove', function (e) {
    var bt = e.target.closest && e.target.closest('.btn');
    if (!bt) return;
    var r = bt.getBoundingClientRect();
    bt.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    bt.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // Entrada escalonada
  Array.prototype.forEach.call(page.children, function (c, i) { c.style.setProperty('--i', i); });
  if (C.customCss) { var st = el('style'); st.textContent = C.customCss; document.head.appendChild(st); }
})();
