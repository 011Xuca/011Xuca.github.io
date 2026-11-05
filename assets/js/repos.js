// Datos de GitHub: estrellas, descargas y lista de configs (repos que se llaman Algo-Config).
(function () {
  var configs = null;
  function idioma() { return window.XUCA ? window.XUCA.idioma() : 'es'; }
  function nombreLindo(n) {
    return n.replace(/-Config$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ' Config';
  }
  function corto(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1).replace('.0', '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
    return String(n);
  }
  function pintarConfigs() {
    var box = document.getElementById('lista-configs');
    if (!box || configs === null) return;
    var en = idioma() === 'en';
    box.innerHTML = '';
    if (configs === 'error' || configs.length === 0) {
      var p = document.createElement('p');
      p.className = 'cfg-empty';
      p.textContent = configs === 'error'
        ? (en ? "Couldn't load the list. You can see them on GitHub." : 'No se pudo cargar la lista. Las podés ver en GitHub.')
        : (en ? 'Empty for now...' : 'Vacío por ahora...');
      box.appendChild(p);
      return;
    }
    configs.forEach(function (r) {
      var a = document.createElement('a');
      a.className = 'cfg';
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      var b = document.createElement('b');
      b.textContent = nombreLindo(r.name);
      var p = document.createElement('p');
      p.textContent = r.description || (en ? 'Settings and instructions.' : 'Configuración e instrucciones.');
      a.appendChild(b);
      a.appendChild(p);
      box.appendChild(a);
    });
  }
  function descargas() {
    var cd = document.querySelector('.con-descargas');
    if (!cd) return;
    // .exe = suma de los Releases de GitHub; instalador por PowerShell = contador abacus (sin datos personales)
    var fuente = cd.dataset.releases
      ? 'https://api.github.com/repos/011Xuca/' + cd.dataset.releases + '/releases?per_page=100'
      : 'https://abacus.jasoncameron.dev/get/011xuca/xuca-optimizer-instalaciones';
    fetch(fuente)
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var n = 0;
        if (cd.dataset.releases) d.forEach(function (rel) { (rel.assets || []).forEach(function (a) { n += a.download_count || 0; }); });
        else n = (d && d.value) || 0;
        cd.querySelector('.n-descargas').textContent = corto(n);
      })
      .catch(function () {});
  }
  document.addEventListener('DOMContentLoaded', function () {
    var est = document.querySelectorAll('.n-estrellas');
    if (document.getElementById('lista-configs') || est.length) {
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
    }
    descargas();
  });
  document.addEventListener('idioma', pintarConfigs);
})();
