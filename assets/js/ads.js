// Anuncios (Google AdSense). Completá `client` (ca-pub-XXXX) y el id de cada bloque cuando AdSense apruebe el sitio.
// Vacío = los espacios quedan ocultos y no se carga nada de terceros.
// shortcut: el id de AdSense es público por diseño (viaja en el HTML de todos los sitios con anuncios) y no se puede esconder
// en una web estática; la protección real es "Sitios autorizados" en el panel de AdSense, que rechaza otros dominios.
(function () {
  var ADS = { client: 'ca-pub-1804493682737411', slots: { izq: '', der: '', abajo: '' } };
  if (!ADS.client) return;
  document.addEventListener('DOMContentLoaded', function () {
    // El <script> de AdSense ya está fijo en el <head> de cada página (AdSense lo busca ahí para verificar el sitio)
    document.querySelectorAll('[data-ad]').forEach(function (c) {
      var id = ADS.slots[c.dataset.ad];
      if (!id) return;
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.dataset.adClient = ADS.client;
      ins.dataset.adSlot = id;
      ins.dataset.adFormat = c.dataset.ad === 'abajo' ? 'horizontal' : 'vertical';
      ins.dataset.fullWidthResponsive = 'true';
      c.querySelector('.ad').appendChild(ins);
      c.hidden = false;
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  });
})();
