// Tema (sistema / claro / oscuro), idioma (es / en), botón copiar y lista de configs.
(function () {
  var root = document.documentElement;
  // Animaciones siempre: muchos usuarios (y el optimizador) apagan las animaciones de Windows
  var quieto = false;
  if (!quieto) {
    root.classList.add('js-anim');
  }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // ---- Tema ----
  var tema = leer('tema');
  if (tema === 'claro') root.setAttribute('data-theme', 'light');
  if (tema === 'oscuro') root.setAttribute('data-theme', 'dark');
  function esOscuro() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  }
  function iconoTema() {
    var b = document.getElementById('btn-tema');
    if (!b) return;
    b.innerHTML = esOscuro()
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  }

  // ---- Idioma ----
  // Cada texto traducible tiene data-en con el inglés; el español es el texto original de la página.
  var idioma = leer('idioma') || ((navigator.language || 'es').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  function ponerIdioma(l) {
    idioma = l;
    root.lang = l;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll('[data-en-title]').forEach(function (el) {
      if (el.dataset.esTitle === undefined) el.dataset.esTitle = el.getAttribute('title') || '';
      el.setAttribute('title', l === 'en' ? el.dataset.enTitle : el.dataset.esTitle);
      el.setAttribute('aria-label', el.getAttribute('title'));
    });
    var b = document.getElementById('btn-idioma');
    if (b) b.textContent = l === 'en' ? 'ES' : 'EN';
    if (document.body.dataset.titleEn) {
      if (!document.body.dataset.titleEs) document.body.dataset.titleEs = document.title;
      document.title = l === 'en' ? document.body.dataset.titleEn : document.body.dataset.titleEs;
    }
    pintarConfigs();
    partirTodo();
  }

  // ---- Configs (repos de GitHub que se llaman Algo-Config, igual que en la app) ----
  var configs = null;
  function nombreLindo(n) {
    return n.replace(/-Config$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ' Config';
  }
  function pintarConfigs() {
    var box = document.getElementById('lista-configs');
    if (!box || configs === null) return;
    box.innerHTML = '';
    if (configs === 'error' || configs.length === 0) {
      var p = document.createElement('p');
      p.className = 'cfg-empty';
      p.textContent = configs === 'error'
        ? (idioma === 'en' ? "Couldn't load the list. You can see them on GitHub." : 'No se pudo cargar la lista. Las podés ver en GitHub.')
        : (idioma === 'en' ? 'Empty for now...' : 'Vacío por ahora...');
      box.appendChild(p);
      return;
    }
    configs.forEach(function (r, n) {
      var a = document.createElement('a');
      a.className = 'cfg nueva';
      a.style.setProperty('--n', n);
      a.style.setProperty('--c', 'var(--orange)');
      a.addEventListener('animationend', function () { a.classList.remove('nueva'); }, { once: true });
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      var b = document.createElement('b');
      b.textContent = nombreLindo(r.name);
      var p = document.createElement('p');
      p.textContent = r.description || (idioma === 'en' ? 'Settings and instructions.' : 'Configuración e instrucciones.');
      a.appendChild(b);
      a.appendChild(p);
      box.appendChild(a);
    });
  }
  // Link de invitación al Discord (cambialo acá y se actualiza en todos los botones)
  var DISCORD = 'https://discord.gg/FwYuKkTuXZ';

  function corto(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.0', '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
    return String(n);
  }
  // Una sola consulta a GitHub para las configs y las estrellas
  function cargarRepos() {
    var hayCfg = document.getElementById('lista-configs');
    var est = document.querySelectorAll('.n-estrellas');
    if (!hayCfg && !est.length) return;
    fetch('https://api.github.com/users/011Xuca/repos?per_page=100')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var propios = d.filter(function (r) { return !r.fork; });
        configs = propios.filter(function (r) { return /-Config$/i.test(r.name); })
                         .sort(function (a, b) { return a.name.localeCompare(b.name); });
        pintarConfigs();
        est.forEach(function (el) {
          var rep = el.dataset.repo, n = 0;
          propios.forEach(function (r) { if (rep === '*' || r.name.toLowerCase() === rep.toLowerCase()) n += r.stargazers_count; });
          el.textContent = corto(n);
        });
      })
      .catch(function () { configs = 'error'; pintarConfigs(); est.forEach(function (el) { el.textContent = '★'; }); });
    // Descargas (se ve siempre, aunque sea 0): contador que suma install.ps1 cada vez que alguien instala (abacus, sin datos personales)
    var cd = document.querySelector('.con-descargas');
    if (cd && cd.dataset.releases) {
      // Apps que se bajan como .exe: se suman las descargas de todos sus Releases de GitHub
      fetch('https://api.github.com/repos/011Xuca/' + cd.dataset.releases + '/releases?per_page=100')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) {
          var n = 0;
          d.forEach(function (rel) { (rel.assets || []).forEach(function (a) { n += a.download_count || 0; }); });
          cd.querySelector('.n-descargas').textContent = corto(n);
        })
        .catch(function () {});
    } else if (cd) {
      fetch('https://abacus.jasoncameron.dev/get/011xuca/xuca-optimizer-instalaciones')
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) {
          cd.querySelector('.n-descargas').textContent = corto((d && d.value) || 0);
        })
        .catch(function () {});
    }
  }

  // Parte el texto de los títulos en palabras para que caigan de a una
  function partir(el) {
    var i = 0;
    (function recorrer(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
            var sp = document.createElement('span');
            sp.className = 'pal';
            sp.style.setProperty('--i', i++);
            sp.textContent = w;
            f.appendChild(sp);
          });
          n.replaceChild(f, c);
        } else if (c.nodeType === 1 && !c.classList.contains('pal')) recorrer(c);
      });
    })(el);
  }
  function partirTodo() {
    if (quieto) return;
    document.querySelectorAll('.hero h1, .head h2').forEach(function (h) {
      if (h.querySelector('.pal')) return;
      partir(h);
      var caja = h.classList.contains('rev') ? h : h.closest('.rev');
      if (caja && caja.classList.contains('ver')) {
        caja.classList.remove('ver');
        void caja.offsetWidth;
        caja.style.setProperty('--d', '0s');
        requestAnimationFrame(function () { caja.classList.add('ver'); });
      }
    });
  }
  function escribir(code) {
    if (code.dataset.full) return;
    var t = code.textContent, k = 0;
    code.dataset.full = t;
    code.textContent = '';
    code.classList.add('escribiendo');
    (function paso() {
      k += 2;
      code.textContent = t.slice(0, k);
      if (k < t.length) setTimeout(paso, 16);
      else setTimeout(function () { code.classList.remove('escribiendo'); }, 900);
    })();
  }
  function efectosMouse() {
    var fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    document.querySelectorAll('.pills span, .feat').forEach(function (el, n) { el.style.setProperty('--n', n % 7); });
    var barra = document.createElement('div');
    barra.className = 'progreso';
    document.body.appendChild(barra);
    function prog() {
      var h = document.documentElement.scrollHeight - innerHeight;
      barra.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    }
    addEventListener('scroll', prog, { passive: true });
    prog();
    if (!fino) return;
    // Luz que sigue al mouse
    document.addEventListener('pointermove', function (e) {
      var f = document.querySelector('.fondo');
      if (f) {
        f.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
        f.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
      }
    }, { passive: true });
    // Inclinación 3D de las tarjetas
    function inclinar(sel, grados, escala) {
      document.addEventListener('pointerover', function (e) {
        var c = e.target.closest && e.target.closest(sel);
        if (!c || c.dataset.incl) return;
        c.dataset.incl = '1';
        c.classList.add('incl');
        var primero = true;
        function mover(ev) {
          var r = c.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
          c.style.transition = primero ? 'transform .45s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .35s' : 'transform .15s ease-out, border-color .25s, box-shadow .35s';
          if (primero) setTimeout(function () { primero = false; }, 350);
          c.style.transform = 'perspective(900px) rotateX(' + (-y * grados) + 'deg) rotateY(' + (x * grados) + 'deg) scale(' + escala + ')';
        }
        function salir() {
          c.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .35s';
          c.style.transform = '';
          c.removeEventListener('pointermove', mover);
          c.removeEventListener('pointerleave', salir);
          delete c.dataset.incl;
        }
        c.addEventListener('pointermove', mover);
        c.addEventListener('pointerleave', salir);
      });
    }
    inclinar('.feat, .proj, .cfg, .leg, .step', 6, 1.04);
  }


  // Baja la página deslizándose hasta el destino (hecho a mano: algunos navegadores saltan de golpe)
  var deslizando = 0;
  function deslizar(dest) {
    var arriba = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
    var desde = scrollY;
    var hasta = Math.max(0, Math.min(dest.getBoundingClientRect().top + scrollY - arriba, document.documentElement.scrollHeight - innerHeight));
    var dist = hasta - desde;
    if (Math.abs(dist) < 2) return;
    var dur = Math.min(1100, 450 + Math.abs(dist) * 0.35);
    var inicio = null, id = ++deslizando;
    document.documentElement.style.scrollBehavior = 'auto';
    function suave(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function paso(ts) {
      if (id !== deslizando) return;
      if (inicio === null) inicio = ts;
      var t = Math.min(1, (ts - inicio) / dur);
      scrollTo(0, desde + dist * suave(t));
      if (t < 1) requestAnimationFrame(paso);
      else document.documentElement.style.scrollBehavior = '';
    }
    requestAnimationFrame(paso);
  }
  // Si la persona usa la rueda mientras baja, se corta la animación
  addEventListener('wheel', function () { deslizando++; document.documentElement.style.scrollBehavior = ''; }, { passive: true });
  addEventListener('touchstart', function () { deslizando++; document.documentElement.style.scrollBehavior = ''; }, { passive: true });

  // ---- Animaciones (como en la app) ----
  function desplegar(espera) {
    root.style.setProperty('--intro', espera + 's');
    var grupos = [
      ['.hero .insignia, .hero h1, .hero .lead, .hero .ctas', 0.12], ['.pie-col, .copy-linea', 0.08],
      ['.pills span', 0.05],
      ['.head', 0], ['.grid > *', 0.07], ['.steps > *', 0.1], ['.legend > *', 0.1],
      ['.cmd, .how, .install .ctas', 0.08], ['.support', 0], ['.projects > *', 0.1]
    ];
    var todos = [];
    grupos.forEach(function (g) {
      document.querySelectorAll(g[0]).forEach(function (el, i) {
        el.classList.add('rev');
        el.style.setProperty('--d', (Math.min(i, 8) * g[1]).toFixed(2) + 's');
        todos.push(el);
      });
    });
    // Lo que se ve al abrir entra en orden, de arriba hacia abajo, como una lista
    var alto = innerHeight;
    var visibles = todos.filter(function (el) { return el.getBoundingClientRect().top < alto; })
      .sort(function (a, b) { var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
    visibles.forEach(function (el, i) { el.style.setProperty('--d', (0.15 + i * 0.07).toFixed(2) + 's'); });
    if (!('IntersectionObserver' in window)) { todos.forEach(function (el) { el.classList.add('ver'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('ver');
        io.unobserve(el);
        var dd = parseFloat(el.style.getPropertyValue('--d')) || 0;
        setTimeout(function () {
          el.classList.remove('rev', 'ver');
          el.style.removeProperty('--d');
        }, (dd + 1.3) * 1000);
        var cd = e.target.matches('.cmd') && e.target.querySelector('code');
        if (cd) setTimeout(function () { escribir(cd); }, 350);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    requestAnimationFrame(function () { todos.forEach(function (el) { io.observe(el); }); });
  }
  function onda(e) {
    var el = e.currentTarget, r = el.getBoundingClientRect();
    var d = Math.max(r.width, r.height) * 2.2;
    var o = document.createElement('span');
    o.className = 'onda';
    o.style.width = o.style.height = d + 'px';
    o.style.left = (e.clientX - r.left - d / 2) + 'px';
    o.style.top = (e.clientY - r.top - d / 2) + 'px';
    el.appendChild(o);
    setTimeout(function () { o.remove(); }, 650);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!quieto) {
      partirTodo();
      desplegar(0);
      efectosMouse();
      document.querySelectorAll('.btn, .copy, .icon-btn').forEach(function (b) { b.addEventListener('pointerdown', onda); });
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var dest = document.querySelector(a.getAttribute('href'));
        if (!dest) return;
        ev.preventDefault();
        deslizar(dest);
        if (dest.dataset.resalta) return;
        dest.dataset.resalta = '1';
        setTimeout(function () { dest.classList.add('resalta'); }, 300);
        setTimeout(function () { dest.classList.remove('resalta'); delete dest.dataset.resalta; }, 1500);
      });
    });
    var top = document.querySelector('.top');
    function sombra() { top.classList.toggle('bajo', window.scrollY > 8); }
    window.addEventListener('scroll', sombra, { passive: true });
    sombra();
    iconoTema();
    ponerIdioma(idioma);
    cargarRepos();
    document.querySelectorAll('.link-discord').forEach(function (a) { a.href = DISCORD; });

    var bt = document.getElementById('btn-tema');
    if (bt) bt.addEventListener('click', function () {
      var nuevo = esOscuro() ? 'light' : 'dark';
      function cambiar() {
        root.setAttribute('data-theme', nuevo);
        guardar('tema', nuevo === 'light' ? 'claro' : 'oscuro');
        iconoTema();
      }
      if (quieto || !document.startViewTransition) { cambiar(); return; }
      var r = bt.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(cambiar).ready.then(function () {
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radio + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' });
      });
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', iconoTema);

    var bi = document.getElementById('btn-idioma');
    if (bi) bi.addEventListener('click', function () {
      var l = idioma === 'en' ? 'es' : 'en';
      guardar('idioma', l);
      ponerIdioma(l);
      document.body.classList.remove('cambia');
      void document.body.offsetWidth;
      document.body.classList.add('cambia');
      setTimeout(function () { document.body.classList.remove('cambia'); }, 400);
    });

    document.querySelectorAll('.copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = document.getElementById(btn.dataset.copy);
        var texto = code.dataset.full || code.textContent;
        function listo() {
          btn.classList.add('ok');
          var span = btn.querySelector('span');
          var antes = span.innerHTML;
          span.textContent = idioma === 'en' ? 'Copied' : 'Copiado';
          setTimeout(function () { btn.classList.remove('ok'); span.innerHTML = antes; }, 1800);
        }
        function seleccionar() {
          var r = document.createRange();
          r.selectNodeContents(code);
          var s = window.getSelection();
          s.removeAllRanges();
          s.addRange(r);
        }
        if (navigator.clipboard) navigator.clipboard.writeText(texto).then(listo, seleccionar);
        else seleccionar();
      });
    });
  });
})();
