// Hiber: el botón de descarga baja el zip del navegador que detecta (último release de GitHub).
// Sin JS o si falla la API de GitHub, los enlaces quedan apuntando a la página del release.
(function () {
  var REPO = '011Xuca/hiber';
  var NOMBRES = { chrome: 'Chrome / Brave / Vivaldi', edge: 'Edge', opera: 'Opera / Opera GX', firefox: 'Firefox' };

  // Edge, Opera y Firefox se reconocen por el user agent; Chrome, Brave, Vivaldi y demás Chromium usan el zip de Chrome.
  function detectar() {
    var u = navigator.userAgent;
    if (/Edg\//.test(u)) return 'edge';
    if (/OPR\/|Opera/.test(u)) return 'opera';
    if (/Firefox\//.test(u)) return 'firefox';
    if (/Chrome\/|Chromium\//.test(u)) return 'chrome';
    return null; // Safari u otro: no hay zip para ese navegador
  }

  function listo() {
    var det = detectar();
    var nombre = document.getElementById('nav-detectado');
    if (nombre) nombre.textContent = det ? NOMBRES[det] : '—';

    fetch('https://api.github.com/repos/' + REPO + '/releases/latest')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (rel) {
        var zips = {};
        (rel.assets || []).forEach(function (a) {
          var m = /^hiber-(chrome|edge|opera|firefox)-[\d.]+\.zip$/.exec(a.name);
          if (m) zips[m[1]] = a.browser_download_url;
        });
        document.querySelectorAll('[data-nav]').forEach(function (a) {
          if (zips[a.dataset.nav]) a.href = zips[a.dataset.nav];
        });
        var principal = document.getElementById('dl-hiber');
        if (principal && det && zips[det]) principal.href = zips[det];
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listo);
  else listo();
})();
