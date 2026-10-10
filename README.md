const BASE_TEMPLATE_DEFS = {
  classic: {
    label: 'Classic',
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
    background: '#f7f1e6',
  },
  boho: {
    label: 'Boho',
    style: 'boho',
    shape: 'oval',
    size: 340,
    webDensity: 16,
    featherCount: 7,
    ringColor: '#7d5a50',
    webColor: '#c38b73',
    accentColor: '#f3b7a0',
    featherColor: '#d7c2a8',
    glow: true,
    background: '#f7ebdf',
  },
  celestial: {
    label: 'Celestial',
    style: 'celestial',
    shape: 'circle',
    size: 310,
    webDensity: 20,
    featherCount: 8,
    ringColor: '#3c4d78',
    webColor: '#8aa4d9',
    accentColor: '#f5d76d',
    featherColor: '#dfe5ff',
    glow: true,
    background: '#edf3ff',
  },
  forest: {
    label: 'Forest',
    style: 'forest',
    shape: 'diamond',
    size: 300,
    webDensity: 15,
    featherCount: 5,
    ringColor: '#2f5d50',
    webColor: '#9dbd8a',
    accentColor: '#d7c76a',
    featherColor: '#c3d7a0',
    glow: false,
    background: '#edf5ee',
  },
  sunrise: {
    label: 'Sunrise',
    style: 'sunrise',
    shape: 'crescent',
    size: 360,
    webDensity: 14,
    featherCount: 9,
    ringColor: '#a45f2a',
    webColor: '#f2b56b',
    accentColor: '#ffd364',
    featherColor: '#f9e2b1',
    glow: true,
    background: '#fff7ee',
  },
  festival: {
    label: 'Festival',
    style: 'festival',
    shape: 'circle',
    size: 330,
    webDensity: 22,
    featherCount: 10,
    ringColor: '#5f2a55',
    webColor: '#d96d9d',
    accentColor: '#ffd166',
    featherColor: '#ffe2a8',
    glow: true,
    background: '#fff3f6',
  },
  earthy: {
    label: 'Earthy',
    style: 'earthy',
    shape: 'diamond',
    size: 350,
    webDensity: 17,
    featherCount: 6,
    ringColor: '#5d4035',
    webColor: '#c9886a',
    accentColor: '#d1a76d',
    featherColor: '#e4d3b0',
    glow: false,
    background: '#f4ece0',
  },
};

const PALETTE_LIBRARY = {
  earthy: { label: 'Earthy', colors: ['#5d4035', '#c9886a', '#d1a76d', '#e4d3b0'] },
  celestial: { label: 'Celestial', colors: ['#3c4d78', '#8aa4d9', '#f5d76d', '#dfe5ff'] },
  festival: { label: 'Festival', colors: ['#5f2a55', '#d96d9d', '#ffd166', '#ffe2a8'] },
  moonlit: { label: 'Moonlit', colors: ['#1b1f2f', '#7c89a9', '#c8d5ff', '#e9eeff'] },
  desert: { label: 'Desert Bloom', colors: ['#8a4f36', '#d7975d', '#f1d7a5', '#f6f1e8'] },
};

const STORAGE_KEYS = {
  customPalettes: 'dreamcatcher-custom-palettes',
  savedLooks: 'dreamcatcher-saved-looks',
};

const defaultState = {
  template: 'classic',
  style: 'classic',
  shape: 'circle',
  size: 320,
  webDensity: 18,
  featherCount: 6,
  ringColor: '#8b5e3c',
  webColor: '#d4a373',
  accentColor: '#f6d365',
  featherColor: '#d5d5d5',
  glow: true,
  background: '#f7f1e6',
  beadPositions: [],
  paletteKey: 'earthy',
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
  templateButtons: document.getElementById('templateButtons'),
  paletteButtons: document.getElementById('paletteButtons'),
  savePaletteBtn: document.getElementById('savePaletteBtn'),
  savedPresetList: document.getElementById('savedPresetList'),
};

let state = { ...defaultState };
let dragState = null;

function cloneState() {
  return JSON.parse(JSON.stringify(state));
}

function getStorageItem(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    return [];
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // ignore storage limitations
  }
}

function generateBeadPositions(count) {
  const results = [];
  const radius = 150;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const x = 250 + Math.cos(angle) * radius;
    const y = 250 + Math.sin(angle) * radius;
    results.push({ x, y });
  }
  return results;
}

function ensureBeadPositions(count) {
  if (!state.beadPositions || state.beadPositions.length !== count) {
    state.beadPositions = generateBeadPositions(count);
  }
  return state.beadPositions;
}

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

function applyTemplatePreset(templateKey) {
  const preset = BASE_TEMPLATE_DEFS[templateKey] ?? BASE_TEMPLATE_DEFS.classic;
  state = {
    ...state,
    template: templateKey,
    style: preset.style,
    shape: preset.shape,
    size: preset.size,
    webDensity: preset.webDensity,
    featherCount: preset.featherCount,
    ringColor: preset.ringColor,
    webColor: preset.webColor,
    accentColor: preset.accentColor,
    featherColor: preset.featherColor,
    glow: preset.glow,
    background: preset.background,
    paletteKey: templateKey,
  };
  ensureBeadPositions(state.webDensity + 4);
  setControlValues();
  renderTemplateButtons();
  renderSavedLooks();
  renderDreamCatcher();
}

function renderTemplateButtons() {
  controls.templateButtons.innerHTML = Object.entries(BASE_TEMPLATE_DEFS)
    .map(([key, template]) => {
      const activeClass = state.template === key ? 'active' : '';
      return `<button class="pill-button ${activeClass}" data-template="${key}" type="button">${template.label}</button>`;
    })
    .join('');
}

function renderPaletteButtons() {
  const allPalettes = { ...PALETTE_LIBRARY, ...objectifyCustomPalettes() };
  controls.paletteButtons.innerHTML = Object.entries(allPalettes)
    .map(([key, palette]) => {
      const activeClass = state.paletteKey === key ? 'active' : '';
      const swatches = (palette.colors || []).map((color) => `<span class="swatch" style="background:${color}"></span>`).join('');
      return `<button class="palette-button ${activeClass}" data-palette="${key}" type="button"><span class="swatches">${swatches}</span><span>${palette.label}</span></button>`;
    })
    .join('');
}

function objectifyCustomPalettes() {
  const custom = getStorageItem(STORAGE_KEYS.customPalettes);
  return custom.reduce((acc, palette) => {
    acc[palette.id] = {
      label: palette.name,
      colors: palette.colors,
    };
    return acc;
  }, {});
}

function renderSavedLooks() {
  const savedLooks = getStorageItem(STORAGE_KEYS.savedLooks);
  if (!savedLooks.length) {
    controls.savedPresetList.innerHTML = '<button class="preset-button" type="button" disabled>No saved looks yet</button>';
    return;
  }

  controls.savedPresetList.innerHTML = savedLooks
    .map((preset) => `
      <button class="preset-button" data-preset-name="${preset.name}" type="button">
        <span>${preset.name}</span>
        <span>${preset.shape}</span>
      </button>
    `)
    .join('');
}

function saveCurrentPalette() {
  const customPalettes = getStorageItem(STORAGE_KEYS.customPalettes);
  const nextName = `Custom ${customPalettes.length + 1}`;
  const nextPalette = {
    id: `custom-${Date.now()}`,
    name: nextName,
    colors: [state.ringColor, state.webColor, state.accentColor, state.featherColor],
  };

  customPalettes.push(nextPalette);
  setStorageItem(STORAGE_KEYS.customPalettes, customPalettes);
  renderPaletteButtons();
}

function saveCurrentLook() {
  const savedLooks = getStorageItem(STORAGE_KEYS.savedLooks);
  const name = `${state.style.charAt(0).toUpperCase() + state.style.slice(1)} ${savedLooks.length + 1}`;
  const look = {
    name,
    style: state.style,
    shape: state.shape,
    size: state.size,
    webDensity: state.webDensity,
    featherCount: state.featherCount,
    ringColor: state.ringColor,
    webColor: state.webColor,
    accentColor: state.accentColor,
    featherColor: state.featherColor,
    glow: state.glow,
    background: state.background,
  };

  savedLooks.push(look);
  setStorageItem(STORAGE_KEYS.savedLooks, savedLooks);
  renderSavedLooks();
}

function applySavedLook(name) {
  const savedLooks = getStorageItem(STORAGE_KEYS.savedLooks);
  const preset = savedLooks.find((item) => item.name === name);
  if (!preset) return;

  state = {
    ...state,
    style: preset.style,
    shape: preset.shape,
    size: preset.size,
    webDensity: preset.webDensity,
    featherCount: preset.featherCount,
    ringColor: preset.ringColor,
    webColor: preset.webColor,
    accentColor: preset.accentColor,
    featherColor: preset.featherColor,
    glow: preset.glow,
    background: preset.background,
    template: preset.style,
  };
  setControlValues();
  renderTemplateButtons();
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
  state.template = state.style;

  controls.sizeValue.textContent = state.size;
  controls.webValue.textContent = state.webDensity;
  controls.featherValue.textContent = state.featherCount;
}

function ringPathFromShape(cx, cy, radiusX, radiusY) {
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
    return `<path d="${outer}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linecap="round" />`;
  }

  return `<circle cx="${cx}" cy="${cy}" r="${radiusX}" fill="none" stroke="${state.ringColor}" stroke-width="12" stroke-linecap="round" />`;
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

function buildBeadMarkup() {
  const beadCount = Math.max(10, state.webDensity + 4);
  const positions = ensureBeadPositions(beadCount);
  const beads = positions.map((point, index) => {
    const radius = clamp(state.size * 0.02, 3, 6);
    return `<circle class="bead-dot" data-bead-index="${index}" cx="${point.x}" cy="${point.y}" r="${radius}" fill="${state.accentColor}" opacity="0.9" />`;
  });
  return beads.join('');
}

function buildFeathers(cx, cy, radius, count) {
  const feathers = [];
  const startY = cy + radius * 0.95;
  const spread = clamp(radius * 0.8, 120, 220);

  for (let i = 0; i < count; i += 1) {
    const offset = ((i - (count - 1) / 2) / Math.max(1, count - 1)) * spread;
    const featherX = cx + offset;
    const featherY = startY + (i % 2 === 0 ? 6 : -2);
    const scale = clamp(0.7 + (count - i) * 0.11, 0.7, 1.6);
    const rotation = (i % 2 === 0 ? 1 : -1) * (10 + i * 2);
    const featherPath = `M 0 0 C 18 -28, 42 -58, 68 -82 C 52 -68, 36 -48, 20 -18 C 12 -8, 7 -5, 0 0 Z`;
    const stemPath = `M 0 0 L 8 70`;

    feathers.push(`
      <g transform="translate(${featherX} ${featherY}) rotate(${rotation}) scale(${scale})">
        <path d="${featherPath}" fill="${state.featherColor}" opacity="0.9" />
        <path d="${stemPath}" stroke="${state.ringColor}" stroke-width="2" stroke-linecap="round" />
        <path d="M 0 0 C -12 -22, -32 -42, -52 -58" stroke="${state.accentColor}" stroke-width="1.4" fill="none" opacity="0.8" />
      </g>
    `);
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
  const ring = ringPathFromShape(cx, cy, radius, radius * 0.8);
  const web = buildWebLines(cx, cy, radius * 0.96, state.webDensity);
  const beads = buildBeadMarkup();
  const feathers = buildFeathers(cx, cy, radius, state.featherCount);
  const glowDefs = buildGlowDefs();

  controls.svg.innerHTML = `
    ${glowDefs}
    <rect x="0" y="0" width="500" height="500" fill="${state.background || '#f7f1e6'}" />
    <g filter="${state.glow ? 'url(#softGlow)' : 'none'}">
      ${ring}
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.18}" fill="${state.accentColor}" opacity="0.2" />
      ${web}
      ${beads}
      <circle cx="${cx}" cy="${cy}" r="${radius * 0.17}" fill="none" stroke="${state.ringColor}" stroke-width="3" opacity="0.8" />
    </g>
    ${feathers}
  `;
}

function randomizeDesign() {
  const templateKeys = Object.keys(BASE_TEMPLATE_DEFS);
  const randomTemplate = templateKeys[Math.floor(Math.random() * templateKeys.length)];
  const shapeOptions = ['circle', 'oval', 'diamond', 'crescent'];

  const selected = BASE_TEMPLATE_DEFS[randomTemplate];
  state = {
    ...state,
    template: randomTemplate,
    style: randomTemplate,
    shape: shapeOptions[Math.floor(Math.random() * shapeOptions.length)],
    size: Math.floor(Math.random() * (430 - 220 + 1)) + 220,
    webDensity: Math.floor(Math.random() * (28 - 8 + 1)) + 8,
    featherCount: Math.floor(Math.random() * (12 - 3 + 1)) + 3,
    ringColor: selected.ringColor,
    webColor: selected.webColor,
    accentColor: selected.accentColor,
    featherColor: selected.featherColor,
    glow: selected.glow,
    background: selected.background,
  };

  setControlValues();
  renderTemplateButtons();
  renderDreamCatcher();
}

function resetDesign() {
  state = {
    ...defaultState,
    beadPositions: [],
  };
  ensureBeadPositions(defaultState.webDensity + 4);
  setControlValues();
  renderTemplateButtons();
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

function applyPalette(key) {
  const allPalettes = { ...PALETTE_LIBRARY, ...objectifyCustomPalettes() };
  const palette = allPalettes[key];
  if (!palette) return;

  const [ring, web, accent, feather] = palette.colors;
  state = {
    ...state,
    paletteKey: key,
    ringColor: ring,
    webColor: web,
    accentColor: accent,
    featherColor: feather,
  };
  setControlValues();
  renderPaletteButtons();
  renderDreamCatcher();
}

function applySavedLookFromButton(event) {
  const button = event.target.closest('[data-preset-name]');
  if (!button) return;
  applySavedLook(button.dataset.presetName);
}

function saveCurrentLookFromUI() {
  saveCurrentLook();
}

function getSvgCoordinates(event) {
  const rect = controls.svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 500;
  const y = ((event.clientY - rect.top) / rect.height) * 500;
  return { x, y };
}

function onPointerDown(event) {
  const target = event.target.closest('[data-bead-index]');
  if (!target) return;

  dragState = {
    beadIndex: Number(target.dataset.beadIndex),
    pointerId: event.pointerId,
  };
  controls.svg.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!dragState) return;
  const { x, y } = getSvgCoordinates(event);
  const positions = ensureBeadPositions(Math.max(10, state.webDensity + 4));
  const centerX = 250;
  const centerY = 250;
  const radius = clamp(Math.min(state.size, 220) / 1.8, 110, 200);
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const limitedDistance = Math.min(distance, radius);

  const angle = Math.atan2(dy, dx);
  const limitedX = centerX + Math.cos(angle) * limitedDistance;
  const limitedY = centerY + Math.sin(angle) * limitedDistance;

  positions[dragState.beadIndex] = { x: limitedX, y: limitedY };
  state.beadPositions = positions;
  renderDreamCatcher();
}

function onPointerUp(event) {
  if (!dragState) return;
  dragState = null;
  controls.svg.releasePointerCapture(event.pointerId);
}

controls.styleSelect.addEventListener('change', () => {
  const selected = controls.styleSelect.value;
  const template = BASE_TEMPLATE_DEFS[selected] ?? BASE_TEMPLATE_DEFS.classic;
  state = {
    ...state,
    style: selected,
    template: selected,
    shape: template.shape,
    size: template.size,
    webDensity: template.webDensity,
    featherCount: template.featherCount,
    ringColor: template.ringColor,
    webColor: template.webColor,
    accentColor: template.accentColor,
    featherColor: template.featherColor,
    glow: template.glow,
    background: template.background,
  };
  state.paletteKey = selected;
  setControlValues();
  renderTemplateButtons();
  renderDreamCatcher();
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
  ensureBeadPositions(state.webDensity + 4);
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
controls.savePaletteBtn.addEventListener('click', saveCurrentPalette);
controls.savedPresetList.addEventListener('click', applySavedLookFromButton);
controls.svg.addEventListener('pointerdown', onPointerDown);
controls.svg.addEventListener('pointermove', onPointerMove);
controls.svg.addEventListener('pointerup', onPointerUp);
controls.svg.addEventListener('pointerleave', onPointerUp);
controls.svg.addEventListener('pointercancel', onPointerUp);

controls.templateButtons.addEventListener('click', (event) => {
  const button = event.target.closest('[data-template]');
  if (!button) return;
  applyTemplatePreset(button.dataset.template);
});

controls.paletteButtons.addEventListener('click', (event) => {
  const button = event.target.closest('[data-palette]');
  if (!button) return;
  applyPalette(button.dataset.palette);
});

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 's' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    saveCurrentLookFromUI();
  }
});

renderTemplateButtons();
renderPaletteButtons();
renderSavedLooks();
setControlValues();
ensureBeadPositions(defaultState.webDensity + 4);
renderDreamCatcher();
