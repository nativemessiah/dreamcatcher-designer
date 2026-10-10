const STYLE_PRESETS = {
  classic: {
    ring: '#8b5e3c',
    web: '#d4a373',
    accent: '#f4d35e',
    feather: '#d8d0bf',
    glow: true,
    background: '#f7f1e6',
  },
  boho: {
    ring: '#7d5a50',
    web: '#c38b73',
    accent: '#f3b7a0',
    feather: '#d7c2a8',
    glow: true,
    background: '#f7ebdf',
  },
  celestial: {
    ring: '#3c4d78',
    web: '#8aa4d9',
    accent: '#f5d76d',
    feather: '#dfe5ff',
    glow: true,
    background: '#edf3ff',
  },
  forest: {
    ring: '#2f5d50',
    web: '#9dbd8a',
    accent: '#d7c76a',
    feather: '#c3d7a0',
    glow: false,
    background: '#edf5ee',
  },
  sunrise: {
    ring: '#a45f2a',
    web: '#f2b56b',
    accent: '#ffd364',
    feather: '#f9e2b1',
    glow: true,
    background: '#fff7ee',
  },
};

const defaultState = {
  style: 'classic',
  shape: 'circle',
  size: 320,
  webDensity: 18,
  featherCount: 6,
  ringColor: '#8b5e3c',
  webColor: '#d4a373',
  accentColor: '#f4d35e',
  featherColor: '#d8d0bf',
  glow: true,
};

const controls = {
  styleSelect: document.getElementById('styleSelect'),
  shapeSelect: document.getElementById('shapeSelect'),
  sizeRange: document.getElementById('sizeRange'),
  webRange: document.getElementById('webRange'),
  featherRange: document.getElementById('featherRange'),
  ringColor: document.getElementById('ringColor'),
  webColor: document.getElementById('webColor'),
  accentColor: document.getElementById('accentColor'),
  featherColor: document.getElementById('featherColor'),
  glowToggle: document.getElementById('glowToggle'),
  sizeValue: document.getElementById('sizeValue'),
  webValue: document.getElementById('webValue'),
  featherValue: document.getElementById('featherValue'),
  randomBtn: document.getElementById('randomBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  resetBtn: document.getElementById('resetBtn'),
  svg: document.getElementById('dreamcatcherSvg'),
};

let state = { ...defaultState };

function setControlValues() {
  controls.styleSelect.value = state.style;
  controls.shapeSelect.value = state.shape;
  controls.sizeRange.value = state.size;
  controls.webRange.value = state.webDensity;
  controls.featherRange.value = state.featherCount;
  controls.ringColor.value = state.ringColor;
  controls.webColor.value = state.webColor;
  controls.accentColor.value = state.accentColor;
  controls.featherColor.value = state.featherColor;
  controls.glowToggle.checked = state.glow;
  controls.sizeValue.textContent = state.size;
  controls.webValue.textContent = state.webDensity;
  controls.featherValue.textContent = state.featherCount;
}

function applyStylePreset(styleKey) {
  const preset = STYLE_PRESETS[styleKey] ?? STYLE_PRESETS.classic;
  state.style = styleKey;
  state.ringColor = preset.ring;
  state.webColor = preset.web;
  state.accentColor = preset.accent;
  state.featherColor = preset.feather;
  state.glow = preset.glow;
  setControlValues();
  renderDreamCatcher();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readStateFromControls() {
  state.style = controls.styleSelect.value;
  state.shape = controls.shapeSelect.value;
  state.size = Number(controls.sizeRange.value);
  state.webDensity = Number(controls.webRange.value);
  state.featherCount = Number(controls.featherRange.value);
  state.ringColor = controls.ringColor.value;
  state.webColor = controls.webColor.value;
  state.accentColor = controls.accentColor.value;
  state.featherColor = controls.featherColor.value;
  state.glow = controls.glowToggle.checked;

  controls.sizeValue.textContent = state.size;
  controls.webValue.textContent = state.webDensity;
  controls.featherValue.textContent = state.featherCount;
}

function ringPathFromShape(cx, cy, radiusX, radiusY, rotation = 0) {
  const rotationRad = (rotation * Math.PI) / 180;
  const shape = state.shape;

  if (shape === 'oval') {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${radiusX}" ry="${radiusY}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linecap="round" />`;
  }

  if (shape === 'diamond') {
    const points = [
      [cx, cy - radiusY],
      [cx + radiusX, cy],
      [cx, cy + radiusY],
      [cx - radiusX, cy],
    ].map((point) => point.join(',')).join(' ');
    return `<polygon points="${points}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linejoin="round" />`;
  }

  if (shape === 'crescent') {
    const outer = `M ${cx - radiusX} ${cy} A ${radiusX} ${radiusY} 0 1 1 ${cx + radiusX} ${cy} A ${radiusX * 0.78} ${radiusY * 0.78} 0 1 0 ${cx - radiusX} ${cy} Z`;
    return `<path d="${outer}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linecap="round" transform="rotate(${rotation} ${cx} ${cy})" />`;
  }

  return `<circle cx="${cx}" cy="${cy}" r="${radiusX}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linecap="round" transform="rotate(${rotation} ${cx} ${cy})" />`;
}

function buildWebLines(cx, cy, radius, density) {
  const lines = [];
  const ringCount = Math.max(4, density);

  for (let i = 0; i < density; i += 1) {
    const angle = (i / density) * Math.PI * 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    lines.push(`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${state.webColor}" stroke-width="1.4" opacity="0.9" />`);
  }

  for (let ring = 1; ring <= ringCount; ring += 1) {
    const ringRadius = (radius * ring) / (ringCount + 1);
    lines.push(`<circle cx="${cx}" cy="${cy}" r="${ringRadius}" fill="none" stroke="${state.webColor}" stroke-width="1.1" opacity="0.75" />`);
  }

  for (let i = 0; i < density; i += 1) {
    const angleA = (i / density) * Math.PI * 2;
    const angleB = ((i + 1) / density) * Math.PI * 2;
    const x1 = cx + Math.cos(angleA) * radius;
    const y1 = cy + Math.sin(angleA) * radius;
    const x2 = cx + Math.cos(angleB) * radius;
    const y2 = cy + Math.sin(angleB) * radius;
    lines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${state.webColor}" stroke-width="1.1" opacity="0.7" />`);
  }

  return lines.join('');
}

function buildBeads(cx, cy, radius, beadCount) {
  const beads = [];
  const offset = 0.18;
  const beadRadius = clamp(radius * 0.03, 3, 6);

  for (let i = 0; i < beadCount; i += 1) {
    const angle = (i / beadCount) * Math.PI * 2;
    const x = cx + Math.cos(angle) * (radius * (1 - offset));
    const y = cy + Math.sin(angle) * (radius * (1 - offset));
    beads.push(`<circle cx="${x}" cy="${y}" r="${beadRadius}" fill="${state.accentColor}" opacity="0.9" />`);
  }

  return beads.join('');
}

function makeFeather(x, y, scale, rotation, color) {
  const featherPath = `M 0 0 C 18 -28, 42 -58, 68 -82 C 52 -68, 36 -48, 20 -18 C 12 -8, 7 -5, 0 0 Z`;
  const stemPath = `M 0 0 L 8 70`;
  return `
    <g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})">
      <path d="${featherPath}" fill="${color}" opacity="0.9" />
      <path d="${stemPath}" stroke="${state.ringColor}" stroke-width="2" stroke-linecap="round" />
      <path d="M 0 0 C -12 -22, -32 -42, -52 -58" stroke="${state.accentColor}" stroke-width="1.4" fill="none" opacity="0.8" />
    </g>
  `;
}

function buildFeathers(cx, cy, radius, count) {
  const feathers = [];
  const startY = cy + radius * 0.9;
  const spread = clamp(radius * 0.8, 120, 220);
  const centerX = cx;

  for (let i = 0; i < count; i += 1) {
    const offset = ((i - (count - 1) / 2) / Math.max(1, count - 1)) * spread;
    const featherX = centerX + offset;
    const featherY = startY + (i % 2 === 0 ? 6 : -2);
    const scale = clamp(0.7 + (count - i) * 0.11, 0.7, 1.6);
    const rotation = (i % 2 === 0 ? 1 : -1) * (10 + i * 2);
    feathers.push(makeFeather(featherX, featherY, scale, rotation, state.featherColor));
  }

  return feathers.join('');
}

function buildGlowDefs() {
  if (!state.glow) return '';

  return `
    <defs>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${state.accentColor}" flood-opacity="0.8" />
      </filter>
    </defs>
  `;
}

function renderDreamCatcher() {
  const baseSize = clamp(state.size, 220, 430);
  const cx = 250;
  const cy = 250;
  const radius = baseSize / 2.2;
  const shapeMarkup = ringPathFromShape(cx, cy, radius, radius * 0.8, 0);
  const web = buildWebLines(cx, cy, radius * 0.96, state.webDensity);
  const beads = buildBeads(cx, cy, radius * 0.96, Math.max(10, state.webDensity + 4));
  const feathers = buildFeathers(cx, cy, radius, state.featherCount);
  const glowDefs = buildGlowDefs();

  const svgMarkup = `
    ${glowDefs}
    <rect x="0" y="0" width="500" height="500" fill="${STYLE_PRESETS[state.style]?.background || '#f7f1e6'}" />
    <g filter="${state.glow ? 'url(#softGlow)' : 'none'}">
      ${shapeMarkup}
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.18}" fill="${state.accentColor}" opacity="0.2" />
      ${web}
      ${beads}
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.17}" fill="none" stroke="${state.ringColor}" stroke-width="3" opacity="0.8" />
    </g>
    ${feathers}
  `;

  controls.svg.innerHTML = svgMarkup;
}

function randomizeDesign() {
  const styleKeys = Object.keys(STYLE_PRESETS);
  const randomStyle = styleKeys[Math.floor(Math.random() * styleKeys.length)];
  const shapeOptions = ['circle', 'oval', 'diamond', 'crescent'];
  const randomShape = shapeOptions[Math.floor(Math.random() * shapeOptions.length)];

  state.style = randomStyle;
  state.shape = randomShape;
  state.size = Math.floor(Math.random() * (430 - 220 + 1)) + 220;
  state.webDensity = Math.floor(Math.random() * (28 - 8 + 1)) + 8;
  state.featherCount = Math.floor(Math.random() * (12 - 3 + 1)) + 3;

  const preset = STYLE_PRESETS[randomStyle];
  state.ringColor = preset.ring;
  state.webColor = preset.web;
  state.accentColor = preset.accent;
  state.featherColor = preset.feather;
  state.glow = preset.glow;

  setControlValues();
  renderDreamCatcher();
}

function resetDesign() {
  state = { ...defaultState };
  setControlValues();
  renderDreamCatcher();
}

function downloadSvg() {
  const serialized = new XMLSerializer().serializeToString(controls.svg);
  const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'dream-catcher.svg';
  anchor.click();
  URL.revokeObjectURL(url);
}

controls.styleSelect.addEventListener('change', (event) => {
  applyStylePreset(event.target.value);
});

controls.shapeSelect.addEventListener('change', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.sizeRange.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.webRange.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.featherRange.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.ringColor.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.webColor.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.accentColor.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.featherColor.addEventListener('input', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.glowToggle.addEventListener('change', () => {
  readStateFromControls();
  renderDreamCatcher();
});

controls.randomBtn.addEventListener('click', randomizeDesign);
controls.resetBtn.addEventListener('click', resetDesign);
controls.downloadBtn.addEventListener('click', downloadSvg);

setControlValues();
renderDreamCatcher();
