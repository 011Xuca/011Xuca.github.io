// Temas listos. Cada variable puede pisarse desde config.js > theme.overrides.
window.LT_PRESETS = {
  base: {
    layout: 'column',            // column (estilo Linktree: panel central) | card (estilo guns.lol: tarjeta chica sobre fondo)
    bg: '#14161B', panel: 'transparent', text: '#F2F3F5', muted: '#9AA0A6', accent: '#22D3EE', accentText: '#04222A',
    btnBg: '#1E2025', btnText: '#F2F3F5', btnBorder: '#2B2E35',
    btnStyle: 'fill', btnRadius: '14px', btnPadding: '16px', width: '480px',
    iconStyle: 'plain',          // plain | circle (ícono dentro de un círculo)
    iconBg: '#111', iconFg: '#fff',
    rows: 'left',                // left | center (título centrado)
    heroImage: '',               // foto grande de fondo que se desvanece (estilo "Héroe")
    bgImage: '', bgBlur: '0px', bgDim: '0', bgGray: '0',
    nameEffect: 'none',          // none | glitch
    bioEffect: 'none',           // none | typing
    font: '', fontUrl: '', bgAnimation: 'none', entrance: 'slide', hover: 'lift',
  },
  midnight: { bg: '#0B0D12', btnBg: '#161A22', btnBorder: '#252B38', accent: '#8B9CFF', accentText: '#0B0D12' },
  xuca: { bg: 'linear-gradient(180deg, #0F2A36, #0D1520 70%)', btnBg: '#162739', btnBorder: '#24384D', bgAnimation: 'grid', btnStyle: 'soft' },
  paper: { bg: '#F4F1EA', text: '#1D1B16', muted: '#6B665A', accent: '#C2410C', accentText: '#fff', btnBg: '#FFFFFF', btnText: '#1D1B16', btnBorder: '#DDD6C5', btnStyle: 'hard', btnRadius: '6px' },
  sunset: { bg: 'linear-gradient(160deg,#ff9a76,#e8537a 55%,#5b2a86)', text: '#fff', muted: '#ffe3ea', accent: '#fff', accentText: '#5b2a86', btnBg: 'rgba(255,255,255,.18)', btnBorder: 'rgba(255,255,255,.35)', btnStyle: 'glass', bgAnimation: 'gradient', btnRadius: '999px' },
  neon: { bg: '#07060D', accent: '#39FF14', accentText: '#07060D', btnBg: 'transparent', btnBorder: '#39FF14', btnText: '#39FF14', btnStyle: 'outline', hover: 'glow', btnRadius: '4px', font: 'JetBrains Mono', fontUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap' },
  glass: { bg: 'linear-gradient(135deg,#1e3c72,#2a5298,#7b4397)', text: '#fff', muted: '#d6dcff', accent: '#fff', accentText: '#1e3c72', btnBg: 'rgba(255,255,255,.12)', btnBorder: 'rgba(255,255,255,.28)', btnStyle: 'glass', bgAnimation: 'gradient' },
  // Premium: tarjeta de vidrio con partículas flotando y grano de fondo, filas con ícono en círculo y brillo que sigue al mouse
  cristal: { layout: 'card', bg: 'linear-gradient(180deg, #0B0D16, #0A0B12 60%, #10121C)', bgAnimation: 'particulas', panel: 'rgba(20,22,32,.5)', text: '#FFFFFF', muted: '#B5BCCD', accent: '#9AD7FF', accentText: '#07080F',
    btnBg: 'rgba(255,255,255,.07)', btnBorder: 'rgba(255,255,255,.16)', btnStyle: 'glass', btnRadius: '16px', btnPadding: '12px', width: '440px',
    iconStyle: 'circle', iconBg: 'rgba(255,255,255,.14)', iconFg: '#FFFFFF', rows: 'center', entrance: 'pop', hover: 'grow' },
  // Como el Linktree de la captura: fondo gris, panel claro, filas blancas con ícono redondo
  linktree: { bg: '#A7A8AA', panel: '#EDEEF3', text: '#111111', muted: '#555B66', accent: '#111111', accentText: '#FFFFFF', btnBg: '#FFFFFF', btnText: '#111111', btnBorder: 'transparent',
    btnStyle: 'soft', btnRadius: '10px', btnPadding: '10px', width: '440px', iconStyle: 'circle', rows: 'center', entrance: 'fade', hover: 'grow' },
  // Como el guns.lol de la captura: foto de fondo en gris, tarjeta de vidrio, nombre con glitch
  forest: { layout: 'card', bg: '#111', bgGray: '1', bgDim: '.25', panel: 'rgba(40,40,40,.55)', text: '#fff', muted: '#d0d0d0', accent: '#fff', accentText: '#111',
    btnBg: 'rgba(255,255,255,.1)', btnBorder: 'rgba(255,255,255,.22)', btnStyle: 'glass', width: '420px', nameEffect: 'glitch', entrance: 'pop' },
};
