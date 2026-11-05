// Interfaz: tema (sistema / claro / oscuro), idioma (es / en), botón copiar y link de Discord.
// Expone window.XUCA.idioma() y dispara el evento "idioma" para que otros scripts repinten sus textos.
(function () {
  var root = document.documentElement;
  var DISCORD = 'https://discord.gg/FwYuKkTuXZ'; // se actualiza en todos los botones
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

  // ---- Idioma: cada texto traducible tiene data-en con el inglés; el español es el texto original ----
  var idioma = leer('idioma') || ((navigator.language || 'es').toLowerCase().indexOf('es') === 0 ? 'es' : 'en');
  window.XUCA = { idioma: function () { return idioma; } };
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
    document.dispatchEvent(new CustomEvent('idioma'));
  }

  document.addEventListener('DOMContentLoaded', function () {
    iconoTema();
    ponerIdioma(idioma);
    document.querySelectorAll('.link-discord').forEach(function (a) { a.href = DISCORD; });
    var bt = document.getElementById('btn-tema');
    if (bt) bt.addEventListener('click', function () {
      var nuevo = esOscuro() ? 'light' : 'dark';
      root.setAttribute('data-theme', nuevo);
      guardar('tema', nuevo === 'light' ? 'claro' : 'oscuro');
      iconoTema();
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', iconoTema);
    var bi = document.getElementById('btn-idioma');
    if (bi) bi.addEventListener('click', function () {
      var l = idioma === 'en' ? 'es' : 'en';
      guardar('idioma', l);
      ponerIdioma(l);
    });
    document.querySelectorAll('.copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = document.getElementById(btn.dataset.copy);
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
        if (navigator.clipboard) navigator.clipboard.writeText(code.textContent).then(listo, seleccionar);
        else seleccionar();
      });
    });
  });
})();
