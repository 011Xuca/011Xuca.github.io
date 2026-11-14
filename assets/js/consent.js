// Consentimiento: Google (GTM), Clarity y Meta Pixel solo cargan si el visitante acepta.
(function () {
  var K = 'consent-analitica', d = document;
  function leer() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(K, v); } catch (e) {} }

  function cargar() {
    if (window.__trk) return; window.__trk = 1;
    var s = d.createElement('script'); s.async = 1; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-KW3R4QP10D'; d.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', 'G-KW3R4QP10D');
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, d, 'clarity', 'script', 'zdeji717t6');
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1042454828253324'); fbq('track', 'PageView');
  }

  function idioma() {
    var l; try { l = localStorage.getItem('idioma'); } catch (e) {}
    return (l || (navigator.language || 'es')).toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  function banner() {
    var es = idioma() === 'es', priv = (d.querySelector('link[rel=canonical]') ? 'https://011xuca.github.io/privacidad/' : 'privacidad/');
    var st = d.createElement('style');
    st.textContent = '#cb{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:560px;margin:0 auto;background:#1E2025;color:#F2F3F5;border:1px solid #2B2E35;border-radius:12px;padding:16px;font:14px/1.5 system-ui,sans-serif;box-shadow:0 8px 30px #0008}#cb p{margin:0 0 12px}#cb a{color:#22D3EE}#cb div{display:flex;gap:8px;flex-wrap:wrap}#cb button{font:600 14px system-ui,sans-serif;padding:10px 18px;min-height:44px;border-radius:8px;border:1px solid #22D3EE;cursor:pointer;background:transparent;color:#F2F3F5}#cb button.si{background:#22D3EE;color:#04222A}#cb button:focus-visible{outline:2px solid #fff;outline-offset:2px}';
    d.head.appendChild(st);
    var b = d.createElement('div'); b.id = 'cb'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', es ? 'Cookies' : 'Cookies');
    b.innerHTML = '<p>' + (es ? 'Uso Google Analytics, Microsoft Clarity y Meta Pixel para saber cómo se usa el sitio. Solo cargan si aceptás. ' : 'I use Google Analytics, Microsoft Clarity and Meta Pixel to understand how the site is used. They only load if you accept. ') + '<a href="' + priv + '">' + (es ? 'Más info' : 'More info') + '</a></p><div><button class="si" type="button">' + (es ? 'Aceptar' : 'Accept') + '</button><button class="no" type="button">' + (es ? 'Rechazar' : 'Reject') + '</button></div>';
    b.querySelector('.si').onclick = function () { guardar('si'); b.remove(); cargar(); };
    b.querySelector('.no').onclick = function () { guardar('no'); b.remove(); };
    d.body.appendChild(b);
  }

  var v = leer();
  if (v === 'si') cargar(); else if (v !== 'no') { if (d.body) banner(); else d.addEventListener('DOMContentLoaded', banner); }
})();
