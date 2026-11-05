# Links

Todo se cambia en `config.js`. No hace falta tocar nada más.

- **Perfil**: nombre, usuario, bio, foto (`avatar`) y forma (`circle`, `rounded`, `square`).
- **Tema**: `preset` (`midnight`, `xuca`, `paper`, `sunset`, `neon`, `glass`) y `overrides` para cambiar cualquier detalle:
  `bg` (color, degradado o `url(foto.jpg)`), `text`, `muted`, `accent`, `btnStyle` (`fill soft outline shadow hard glass`),
  `btnRadius`, `font` + `fontUrl` (Google Fonts), `width`, `bgAnimation` (`none gradient grid`),
  `entrance` (`none fade slide pop`), `hover` (`none lift grow glow`).
- **Diseños**: `preset: 'linktree'` (panel claro sobre gris, como Linktree) o `'forest'` (tarjeta sobre foto de fondo, como guns.lol). Para tu foto: `bgImage`, `bgBlur`, `bgGray`, `bgDim`.
- **Efectos**: `nameEffect: 'glitch'`, `bioEffect: 'typing'`, `iconStyle: 'circle'`, `rows: 'center'`.
- **Opcionales**: `views` (contador de visitas), `music` (botón de sonido), `image` en un link (tarjeta grande con foto).
- **Redes**: íconos de arriba (`github discord youtube instagram tiktok twitch x kofi mail link`).
- **Links**: `title`, `url`, `subtitle`, `icon`, `badge`, `featured`. También `{ type: 'header', title }` y `{ type: 'divider' }`.
- **customCss**: tu propio CSS al final, para ir más allá de las opciones.
- **Nuevos presets**: agregá uno en `js/presets.js`. **Nuevos íconos**: en `js/icons.js`.

Se publica con GitHub Pages en `/links/`. Solo se aceptan links `http`, `https`, `mailto` y rutas del sitio.
