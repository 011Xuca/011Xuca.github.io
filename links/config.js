// ESTE ES EL ÚNICO ARCHIVO QUE TENÉS QUE EDITAR. Guardás, subís a GitHub y listo.
// Los links o redes con url vacía ('') no se muestran: completalos cuando los tengas. Guía de opciones: README.md.
window.LINKTREE = {
  profile: {
    name: 'Xuca',
    handle: '',
    bio: '¡Hola, soy Xuca! Pasá por donde quieras, acá está todo lo mío. Siempre sos bienvenido 💙',
    avatar: '',                     // ruta de tu foto (ej: 'assets/foto.png'); vacío = sin foto   // ruta o URL de tu foto (ej: 'avatar.jpg' si la subís a links/)
    avatarShape: 'rounded',
    avatarInvert: false,             // true = el dibujo negro sobre blanco se ve como líneas claras sobre fondo oscuro
    avatarSize: 150,                // tamaño en px (el dibujo es de líneas finas: chico se pierde)
    avatarPosition: '35% 50%',      // qué parte se ve si la imagen no es cuadrada (x% y%)         // circle | rounded | square
  },

  // Tema: preset = cristal | linktree | forest | xuca | midnight | paper | sunset | neon | glass
  //   cristal = vidrio premium con partículas flotando · linktree = panel claro sobre gris (como tu captura) · forest = tarjeta sobre foto de fondo (estilo guns.lol)
  theme: {
    preset: 'cristal',
    overrides: {
      heroImage: 'assets/fotoperfil.png',   // tu foto grande de fondo, desvanecida (vacío '' para sacarla)
      // --- Fondo ---
      // bg: 'linear-gradient(160deg,#0f2027,#2c5364)',   // color, degradado
      // bgImage: 'fondo.jpg',    // foto de fondo (subila a links/)
      // bgBlur: '4px', bgGray: '1', bgDim: '.3',          // desenfoque, blanco y negro (0-1), oscurecer (0-1)
      // bgAnimation: 'none',     // none | gradient | grid | particulas
      // --- Diseño ---
      // layout: 'card',          // column (panel) | card (tarjeta chica al centro)
      // width: '480px', panel: '#EDEEF3',
      // --- Colores y letra ---
      // text: '#111', muted: '#555', accent: '#22D3EE',
      // font: 'Figtree', fontUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap',
      // --- Botones ---
      // btnStyle: 'soft',        // fill | soft | outline | shadow | hard | glass
      // btnBg: '#fff', btnText: '#111', btnBorder: 'transparent', btnRadius: '10px', btnPadding: '10px',
      // iconStyle: 'circle',     // plain | circle
      // rows: 'center',          // left | center
      // --- Efectos ---
      // entrance: 'fade',        // none | fade | slide | pop
      // hover: 'grow',           // none | lift | grow | glow
      // nameEffect: 'glitch',    // none | glitch
      // bioEffect: 'typing',     // none | typing
    },
  },

  // Íconos de arriba: github discord youtube instagram tiktok twitch x kofi steam mail link
  socials: [
    { type: 'instagram', url: 'https://www.instagram.com/011xuca/' },
    { type: 'tiktok', url: 'https://www.tiktok.com/@011xuca' },
    { type: 'twitch', url: 'https://www.twitch.tv/011xuca' },
    { type: 'discord', url: 'https://discord.com/invite/FwYuKkTuXZ' },
    { type: 'steam', url: 'https://steamcommunity.com/id/CRITICAL_PROCESS_DlED/' },
  ],

  // Tipos: link (default) | header (título de grupo) | divider (línea)
  // Opciones de link: title, desc (texto de la vista previa al pasar el mouse), tags (etiquetas chicas), cta (texto del botón de la vista previa), preview (imagen), url, subtitle, icon, badge ("NUEVO"), featured (más grande), image (tarjeta grande con foto)
  links: [
    { title: 'Página Web', desc: 'Acá están Xuca OPtimizer y Xuca Monitor, mis apps gratuitas para Windows, con guías y descargas.', tags: ['Apps gratis', 'Windows 10/11'], cta: 'Entrar al sitio', url: 'https://011xuca.github.io/', icon: 'link' },
    { title: 'Donativo por Ko-fi 💙', desc: 'Si mis apps te sirvieron, podés invitarme un cafecito. Es voluntario y me ayuda a seguir creando cosas gratis.', tags: ['Voluntario', 'Gracias 💙'], cta: 'Invitar un cafecito', url: 'https://ko-fi.com/011xuca', icon: 'kofi' },
    { title: 'Nuestro servidor de Discord', desc: 'Charlá con la comunidad, enterate de las novedades de mis apps y pedí ayuda cuando la necesites.', tags: ['Comunidad', 'Gratis'], cta: 'Unirme al servidor', url: 'https://discord.com/invite/FwYuKkTuXZ', icon: 'discord' /* , image: 'assets/discord.png' */ },
    { title: 'Twitch', desc: 'Mis directos. Seguime para enterarte cuando salga en vivo.', cta: 'Ver el canal', url: 'https://www.twitch.tv/011xuca', icon: 'twitch' },
    { title: 'TikTok', desc: 'Videos cortos y clips. ¡Pasá a ver!', cta: 'Ver el perfil', url: 'https://www.tiktok.com/@011xuca', icon: 'tiktok' },
    { title: 'Instagram', desc: 'Fotos y novedades del día a día.', cta: 'Ver el perfil', url: 'https://www.instagram.com/011xuca/', icon: 'instagram' },
    { title: 'Perfil de Steam', desc: 'Mi perfil de Steam: mirá mis juegos y agregame de amigo.', cta: 'Ver el perfil', url: 'https://steamcommunity.com/id/CRITICAL_PROCESS_DlED/', icon: 'steam' },
  ],

  // Opcionales (apagados por defecto)
  views: { enabled: false },                              // contador de visitas: { enabled: true, key: 'links' }
  // Música: suena al entrar (si el navegador lo bloquea, aparece "Tocá para entrar"), la tarjeta sube al empezar,
  // baja al terminar y vuelve a empezar. style: 'glass' (estilo iPhone) | 'persona5' (rojo y negro)
  music: { src: 'no-way.mp3', title: 'No Way', artist: 'BirdsDieAlone', cover: 'assets/cover.png', volume: 0.5, /* máximo 0.5 */ fade: 3, style: 'glass', repeatDelay: 3500, gateText: 'Tocá para entrar' },
  // Título de la pestaña del navegador: se escribe y se borra letra por letra (X--- Xu-- Xuc- Xuca Xuc- ...)
  tabTitle: { text: '011Xuca', speed: 280, hold: 1600 },
  footer: { text: '' },

  // CSS propio para ir más allá. Ej: '.btn { text-transform: uppercase; }'
  customCss: '',
};
