// Anuncio antes de descargar o copiar un comando: modal tipo reproductor con cuenta regresiva.
// Brío y Hiber (ESTRICTO): no se puede saltar y, si hay un bloqueador de anuncios, pide quitarlo antes de seguir. En Pulso se puede saltar.
// Al terminar la cuenta hace la acción sola (baja el archivo o copia el comando). Esc o Cancelar cierran sin hacer nada.
// shortcut: la detección del bloqueador es por señuelo + pedido a AdSense, puede fallar en ambos sentidos; sirve de aviso, no de candado.
// Sin JS (o si este archivo no carga) los botones funcionan directo, así que nunca bloquea una descarga.
(function () {
  // Qué se muestra adentro. Con todo vacío sale un aviso propio del sitio (sin terceros).
  var ANUNCIO = {
    segundos: 5,
    video: '', // URL de un .mp4 o .webm propio (se reproduce mudo y sin controles)
    embed: '', // URL para un <iframe> (por ejemplo un embed de YouTube con autoplay=1&mute=1)
    slot: ''   // id de un bloque de AdSense. Ojo: revisá antes la política de AdSense sobre anuncios en ventanas emergentes
  };
  var CLIENT = 'ca-pub-1804493682737411'; // el mismo de ads.js
  // Botones que pasan por el anuncio: copiar comando, releases (.exe / .zip), ZIP del repo o lo que tenga data-anuncio
  var SEL = '.copy, a[href*="/releases/"], a[href*="/archive/"], [data-anuncio]';
  var LOGO = new URL('../logo.svg', document.currentScript.src).href;
  var ESTRICTO = /\/(brio|hiber)(\/|$)/.test(location.pathname);
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  var dlg, tit, num, barra, modo = 'anuncio', objetivo = null, pase = null, timer = 0, inicio = 0, video = null, slotPuesto = false;

  function en() { return !!(window.XUCA && window.XUCA.idioma() === 'en'); }
  function txt(es, ing) { return en() ? ing : es; }

  function crear() {
    if (dlg) return;
    dlg = document.createElement('dialog');
    dlg.className = 'anuncio';
    dlg.setAttribute('aria-labelledby', 'anuncio-tit');
    dlg.setAttribute('aria-describedby', 'anuncio-desc');
    dlg.innerHTML =
      '<div class="anuncio-pantalla">' +
        '<div class="anuncio-casa"><img src="' + LOGO + '" alt="" width="56" height="56"><b>011Xuca</b><p></p><a href="https://ko-fi.com/011xuca" target="_blank" rel="noopener">Ko-fi</a></div>' +
        '<span class="anuncio-chip"></span>' +
      '</div>' +
      '<div class="anuncio-barra" aria-hidden="true"><i></i></div>' +
      '<div class="anuncio-pie">' +
        '<div><h2 id="anuncio-tit"></h2><p id="anuncio-desc"></p></div>' +
        '<button type="button" class="btn" data-a="no"></button>' +
        '<button type="button" class="btn main" data-a="si" autofocus></button>' +
      '</div>';
    tit = dlg.querySelector('#anuncio-tit');
    barra = dlg.querySelector('.anuncio-barra i');
    var pantalla = dlg.querySelector('.anuncio-pantalla');
    // Video o embed solo si el visitante no pidió reducir movimiento; si fallan, queda el aviso propio de fondo
    if (ANUNCIO.video && !reducir.matches) {
      video = document.createElement('video');
      video.muted = true; video.playsInline = true; video.preload = 'none'; video.src = ANUNCIO.video;
      video.setAttribute('aria-hidden', 'true');
      video.addEventListener('error', function () { video.remove(); video = null; });
      pantalla.insertBefore(video, pantalla.lastChild);
    } else if (ANUNCIO.embed && !reducir.matches) {
      var fr = document.createElement('iframe');
      fr.src = ANUNCIO.embed; fr.title = 'Publicidad'; fr.allow = 'autoplay; encrypted-media';
      fr.referrerPolicy = 'strict-origin-when-cross-origin';
      fr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      pantalla.insertBefore(fr, pantalla.lastChild);
    }
    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-a]');
      if (!b) return;
      if (modo === 'muro' && b.dataset.a === 'si') return comprobar(); // "Ya lo desactivé"
      terminar(b.dataset.a === 'si');
    });
    dlg.addEventListener('close', limpiar); // también cubre Esc y el gesto de volver
    document.body.appendChild(dlg);
  }

  function textos() {
    var copiar = objetivo.matches('.copy');
    dlg.classList.toggle('muro', modo === 'muro');
    if (modo === 'muro') {
      tit.textContent = txt('Quitá tu bloqueador de anuncios para continuar', 'Turn off your ad blocker to continue');
      dlg.querySelector('#anuncio-desc').textContent = txt('Los anuncios mantienen estas apps gratis. Desactivá el bloqueador en esta página, recargala y volvé a tocar el botón.', 'Ads keep these apps free. Turn the blocker off on this page, reload it and tap the button again.');
      dlg.querySelector('.anuncio-chip').textContent = txt('Bloqueador detectado', 'Ad blocker detected');
      dlg.querySelector('[data-a="no"]').textContent = txt('Cancelar', 'Cancel');
      dlg.querySelector('[data-a="si"]').textContent = txt('Ya lo desactivé', 'I turned it off');
      dlg.querySelector('[data-a="si"]').style.display = '';
      return;
    }
    tit.innerHTML = (copiar ? txt('El comando se copia en ', 'The command is copied in ') : txt('Tu descarga empieza en ', 'Your download starts in ')) + '<b></b> s';
    num = tit.querySelector('b');
    dlg.querySelector('#anuncio-desc').textContent = ESTRICTO
      ? txt('Este anuncio mantiene el sitio gratis. Cuando termine, sigue solo.', 'This ad keeps the site free. When it ends, it continues on its own.')
      : txt('Este anuncio mantiene el sitio gratis. Podés saltarlo cuando quieras.', 'This ad keeps the site free. You can skip it any time.');
    dlg.querySelector('.anuncio-casa p').textContent = txt('Apps gratis, sin cuentas ni versión paga. Si te sirven, un Ko-fi me ayuda a seguir.', 'Free apps, no accounts and no paid version. If they help you, a Ko-fi keeps them going.');
    dlg.querySelector('.anuncio-chip').textContent = txt('Publicidad', 'Advertisement');
    dlg.querySelector('[data-a="no"]').textContent = txt('Cancelar', 'Cancel');
    dlg.querySelector('[data-a="si"]').textContent = txt('Saltar anuncio', 'Skip ad');
    dlg.querySelector('[data-a="si"]').style.display = ESTRICTO ? 'none' : '';
  }

  function tick() {
    var falta = Math.max(0, ANUNCIO.segundos - (performance.now() - inicio) / 1000);
    num.textContent = Math.ceil(falta);
    barra.style.transform = 'scaleX(' + (1 - falta / ANUNCIO.segundos) + ')';
    if (falta <= 0) { if (objetivo.matches('.copy')) listo(); else terminar(true); }
  }

  // Copiar al portapapeles sin un clic reciente hace que el navegador pida permiso (y parece sospechoso):
  // al terminar la cuenta se pide un clic, y esa copia sale de ese clic. Las descargas siguen solas.
  function listo() {
    clearInterval(timer); timer = 0;
    modo = 'listo';
    barra.style.transform = 'scaleX(1)';
    tit.textContent = txt('Listo: ya podés copiar el comando', 'Done: you can copy the command now');
    dlg.querySelector('#anuncio-desc').textContent = txt('Tocá el botón para copiarlo.', 'Tap the button to copy it.');
    var si = dlg.querySelector('[data-a="si"]');
    si.textContent = txt('Copiar comando', 'Copy command'); si.style.display = ''; si.focus();
  }

  // ¿Hay un bloqueador? Señuelo con clases típicas + pedido a AdSense. Sin conexión no se acusa a nadie.
  function bloqueado() {
    if (!navigator.onLine) return Promise.resolve(false);
    var b = document.createElement('div');
    b.className = 'adsbox ad-banner adsbygoogle-bait'; b.style.cssText = 'position:absolute;left:-9999px;height:10px;width:10px';
    document.body.appendChild(b);
    var oculto = !b.offsetHeight || getComputedStyle(b).display === 'none';
    b.remove();
    if (oculto) return Promise.resolve(true);
    return fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?bait=' + Date.now(), { mode: 'no-cors', cache: 'no-store' })
      .then(function () { return false; }, function () { return true; });
  }

  function comprobar() {
    bloqueado().then(function (si) {
      if (!dlg.open || !objetivo) return;
      if (!si) { modo = 'anuncio'; textos(); empezar(); }
    });
  }

  function abrir(el) {
    crear();
    if (dlg.open) return;
    objetivo = el; modo = 'anuncio';
    textos();
    barra.style.transform = 'scaleX(0)';
    dlg.showModal();
    if (!ESTRICTO) { empezar(); return; }
    bloqueado().then(function (si) {
      if (!dlg.open || objetivo !== el) return;
      if (si) { modo = 'muro'; textos(); } else empezar();
    });
  }

  function empezar() { // arranca la cuenta regresiva y lo que se ve en la pantalla
    inicio = performance.now();
    tick();
    timer = setInterval(tick, 200);
    if (video) { video.currentTime = 0; var p = video.play(); if (p) p.catch(function () {}); }
    if (ANUNCIO.slot && !slotPuesto) { // se pide con el modal abierto: AdSense necesita ancho para elegir el tamaño
      slotPuesto = true;
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle'; ins.style.display = 'block';
      ins.dataset.adClient = CLIENT; ins.dataset.adSlot = ANUNCIO.slot; ins.dataset.adFormat = 'rectangle';
      dlg.querySelector('.anuncio-pantalla').insertBefore(ins, dlg.querySelector('.anuncio-chip'));
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    }
  }

  function limpiar() {
    clearInterval(timer); timer = 0;
    if (video) video.pause();
  }

  function terminar(hacer) {
    var el = objetivo;
    limpiar();
    if (dlg.open) dlg.close(); // el navegador devuelve el foco al botón que abrió el anuncio
    objetivo = null;
    if (!hacer || !el) return;
    pase = el;   // la próxima vuelta del click la deja pasar: descarga o copia con el código de siempre
    el.click();
    pase = null;
  }

  // Captura en document: corre antes que el listener de copiar de ui.js y que la navegación del link
  document.addEventListener('click', function (e) {
    if (e.button !== 0 || (!ESTRICTO && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey))) return; // en Pulso, abrir en pestaña nueva y similares quedan nativos
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || el === pase || (dlg && dlg.contains(el))) return;
    e.preventDefault();
    e.stopPropagation();
    abrir(el);
  }, true);
  // Copiar el comando a mano (seleccionarlo y Ctrl+C o "Copiar" del menú del click derecho) también pasa por el anuncio.
  // shortcut: arrastrar el texto seleccionado a otra parte no dispara "copy" y no se cubre.
  document.addEventListener('copy', function (e) {
    if (dlg && dlg.open) return;
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var cmd = [].slice.call(document.querySelectorAll('code[id^="cmd-"]')).filter(function (c) { return sel.containsNode(c, true); })[0];
    var btn = cmd && document.querySelector('.copy[data-copy="' + cmd.id + '"]');
    if (!btn) return;
    e.preventDefault(); // no se copia nada ahora: el botón copia el comando completo al terminar el anuncio
    abrir(btn);
  });
})();
