// Pone en la página la versión del último release del repo (brio / pulso / hiber): actualiza el JSON-LD y los [data-version].
// shortcut: los buscadores que no ejecutan JS ven el softwareVersion escrito en el HTML; cámbialo a mano al publicar si importa.
(function () {
  var repo = (location.pathname.match(/\/(brio|pulso|hiber)(\/|$)/) || [])[1];
  if (!repo) return;
  var clave = 'ver-' + repo;
  function poner(v) {
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) {
      try {
        var d = JSON.parse(s.textContent);
        if (d['@type'] !== 'SoftwareApplication') return;
        d.softwareVersion = v;
        s.textContent = JSON.stringify(d);
      } catch (e) {}
    });
    document.querySelectorAll('[data-version]').forEach(function (e) { e.textContent = v; });
  }
  var guardada = null;
  try { guardada = JSON.parse(sessionStorage.getItem(clave)); } catch (e) {}
  if (guardada && Date.now() - guardada.t < 36e5) return poner(guardada.v);
  fetch('https://api.github.com/repos/011Xuca/' + repo + '/releases/latest')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || !j.tag_name) return;
      var v = String(j.tag_name).replace(/^v/i, '');
      try { sessionStorage.setItem(clave, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
      poner(v);
    })
    .catch(function () {});
})();
