// Movimiento: aparecer al bajar, barra de progreso, sombra de la barra y onda en los botones.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  root.classList.add('js-anim');
  document.addEventListener('DOMContentLoaded', function () {
    // Aparecer al bajar: los hermanos entran escalonados
    var items = document.querySelectorAll('main > section:not(.hero) :is(.head, .feat, .step, .leg, .proj, .cmd, .how, .ctas)');
    items.forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 8) * 0.06 + 's');
      el.classList.add('rev');
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ver'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else items.forEach(function (el) { el.classList.add('ver'); });

    // Progreso de lectura y sombra de la barra
    var barra = document.createElement('div');
    barra.className = 'progreso';
    document.body.appendChild(barra);
    var top = document.querySelector('.top');
    function scroll() {
      var h = root.scrollHeight - innerHeight;
      barra.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      if (top) top.classList.toggle('bajo', scrollY > 8);
    }
    addEventListener('scroll', scroll, { passive: true });
    scroll();

    // Onda al tocar un botón
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.btn, .icon-btn, .copy');
      if (!b) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
      var o = document.createElement('span');
      o.className = 'onda';
      o.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(o);
      setTimeout(function () { o.remove(); }, 650);
    });
  });
})();
