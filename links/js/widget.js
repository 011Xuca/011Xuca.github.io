// Clic en un link con "widget" (el Discord): abre el widget del servidor en un cuadro, con botón para unirse. Funciona en celu y en PC.
// Ctrl/Cmd/Shift + clic o clic del medio siguen abriendo el link normal.
(function () {
  var dlg = null, frame = null, join = null;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function crear() {
    dlg = el('dialog', 'wg'); dlg.setAttribute('aria-label', 'Servidor de Discord');
    frame = el('iframe'); frame.title = 'Widget del servidor de Discord';
    frame.sandbox = 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts';
    var bar = el('div', 'wg-bar');
    join = el('a', 'wg-join', 'Unirme al servidor'); join.target = '_blank'; join.rel = 'noopener';
    var x = el('button', 'wg-x', 'Cerrar'); x.type = 'button'; x.addEventListener('click', function () { dlg.close(); });
    bar.appendChild(join); bar.appendChild(x);
    dlg.appendChild(frame); dlg.appendChild(bar);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // clic en el fondo oscuro
    document.body.appendChild(dlg);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-widget]');
    if (!a || e.button || e.ctrlKey || e.metaKey || e.shiftKey || typeof HTMLDialogElement === 'undefined') return;
    e.preventDefault();
    if (!dlg) crear();
    var u = 'https://discord.com/widget?id=' + encodeURIComponent(a.dataset.widget) + '&theme=dark';
    if (frame.getAttribute('src') !== u) frame.src = u;
    join.href = a.href;
    dlg.showModal();
  });
})();
