// Título de la pestaña animado: se escribe y se borra, manteniendo el ancho con guiones (X--- Xu-- Xuc- Xuca Xuc- Xu-- X--- ----).
(function () {
  var T = (window.LINKTREE || {}).tabTitle;
  if (!T || !T.text) return;
  var s = T.text, n = s.length, k = 0, dir = 1;
  function frame() {
    document.title = s.slice(0, k) + '-'.repeat(n - k);
    var espera = T.speed || 280;
    if (k === n) { dir = -1; espera = T.hold || 1600; }
    else if (k === 0 && dir === -1) { dir = 1; espera = (T.speed || 280) * 2; }
    k += dir;
    setTimeout(frame, espera);
  }
  frame();
})();
