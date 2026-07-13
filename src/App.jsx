import { useEffect, useMemo, useState } from 'react'

const BACKGROUND_OPTIONS = [
  { id: 'clean', label: 'Clean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'forest', label: 'Forest' },
  { id: 'grid', label: 'Grid' },
]

const DEFAULT_COMPONENT_STYLE = {
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  borderColor: '#cbd5e1',
  hoverColor: '#2563eb',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  padding: 0,
  radius: 12,
  opacity: 100,
  hoverScale: 1.03,
  hoverShadow: true,
  animation: 'none',
  fontFamily: 'inherit',
}

const COMPONENT_STYLE_PRESETS = {
  modern: {
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    hoverColor: '#2563eb',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.55,
    letterSpacing: 0,
    padding: 10,
    radius: 12,
    opacity: 100,
    hoverScale: 1.03,
    hoverShadow: true,
    animation: 'none',
    fontFamily: "'Segoe UI', sans-serif",
  },
  bold: {
    textColor: '#0b1020',
    backgroundColor: '#f8fafc',
    borderColor: '#1d4ed8',
    hoverColor: '#ef4444',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.35,
    letterSpacing: 0.5,
    padding: 14,
    radius: 14,
    opacity: 100,
    hoverScale: 1.06,
    hoverShadow: true,
    animation: 'pulse',
    fontFamily: "'Trebuchet MS', sans-serif",
  },
  minimal: {
    textColor: '#334155',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    hoverColor: '#0f172a',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    padding: 6,
    radius: 6,
    opacity: 96,
    hoverScale: 1.01,
    hoverShadow: false,
    animation: 'fade',
    fontFamily: 'inherit',
  },
}

const PREVIEW_STORAGE_KEY = 'studio-live-preview-v1'

function readSavedPreviewSnapshot() {
  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function savePreviewSnapshot(snapshot) {
  try {
    window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function getPreviewStyle(appearance, customBackground) {
  return {
    '--preview-text': appearance.textColor,
    '--preview-heading': appearance.headingColor,
    '--preview-accent': appearance.accentColor,
    '--preview-card-bg': appearance.cardBg,
    '--preview-border': appearance.borderColor,
    '--preview-radius': `${appearance.radius}px`,
    '--preview-gap': `${appearance.gap}px`,
    '--preview-button-radius': `${appearance.buttonRadius}px`,
    '--preview-canvas-width': `${appearance.canvasWidth}px`,
    '--preview-custom-bg': customBackground,
  }
}

function getComponentCssVariables(styleConfig) {
  const style = withDefaultComponentStyle(styleConfig)

  return {
    '--component-text-color': style.textColor,
    '--component-bg-color': style.backgroundColor,
    '--component-border-color': style.borderColor,
    '--component-hover-color': style.hoverColor,
    '--component-font-size': `${style.fontSize}px`,
    '--component-font-weight': style.fontWeight,
    '--component-line-height': style.lineHeight,
    '--component-letter-spacing': `${style.letterSpacing}px`,
    '--component-padding': `${style.padding}px`,
    '--component-radius': `${style.radius}px`,
    '--component-opacity': style.opacity / 100,
    '--component-hover-scale': style.hoverScale,
    '--component-font-family': style.fontFamily,
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderStaticBlockSource(block) {
  const { type, props } = block

  if (type === 'heading') return `<h1>${escapeHtml(props.text)}</h1>`
  if (type === 'subheading') return `<h2>${escapeHtml(props.text)}</h2>`
  if (type === 'text') return `<p>${escapeHtml(props.text)}</p>`

  if (type === 'header') {
    const links = toList(props.links)
      .map((link) => `<a href="#">${escapeHtml(link)}</a>`)
      .join('')
    return `<header class="preview-header"><strong>${escapeHtml(props.brand)}</strong><nav>${links}</nav><button type="button">${escapeHtml(props.cta)}</button></header>`
  }

  if (type === 'image') {
    return `<img class="preview-image" src="${escapeHtml(props.src)}" alt="${escapeHtml(props.alt)}" loading="lazy" />`
  }

  if (type === 'video') {
    return `<div class="preview-video-wrap"><iframe src="${escapeHtml(props.url)}" title="${escapeHtml(props.title)}" class="preview-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
  }

  if (type === 'button') {
    return `<a class="preview-button" href="${escapeHtml(props.href)}">${escapeHtml(props.text)}</a>`
  }

  if (type === 'button-group') {
    const items = toList(props.items)
      .map((item) => `<button type="button">${escapeHtml(item)}</button>`)
      .join('')
    return `<div class="preview-button-group">${items}</div>`
  }

  if (type === 'accordion' || type === 'collapsible') {
    const open = props.open ? ' open' : ''
    return `<details class="preview-accordion"${open}><summary>${escapeHtml(props.title)}</summary><p>${escapeHtml(props.content)}</p></details>`
  }

  if (type === 'alert') return `<div class="preview-alert" role="alert">${escapeHtml(props.text)}</div>`

  if (type === 'card') {
    return `<article class="preview-card"><h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.content)}</p></article>`
  }

  if (type === 'badge') return `<span class="preview-badge">${escapeHtml(props.text)}</span>`

  if (type === 'avatar') {
    return `<div class="preview-avatar"><img src="${escapeHtml(props.src)}" alt="${escapeHtml(props.name)}" /><span>${escapeHtml(props.name)}</span></div>`
  }

  if (type === 'checkbox') {
    const checked = props.checked ? ' checked' : ''
    return `<label class="preview-check"><input type="checkbox"${checked} /><span>${escapeHtml(props.label)}</span></label>`
  }

  if (type === 'input') {
    return `<label class="preview-field"><span>${escapeHtml(props.label)}</span><input type="text" placeholder="${escapeHtml(props.placeholder)}" /></label>`
  }

  if (type === 'textarea') {
    return `<label class="preview-field"><span>${escapeHtml(props.label)}</span><textarea rows="4" placeholder="${escapeHtml(props.placeholder)}"></textarea></label>`
  }

  if (type === 'select') {
    const options = toList(props.options)
      .map((option) => `<option>${escapeHtml(option)}</option>`)
      .join('')
    return `<label class="preview-field"><span>${escapeHtml(props.label)}</span><select>${options}</select></label>`
  }

  if (type === 'radio-group') {
    const options = toList(props.options)
      .map(
        (option) =>
          `<label><input type="radio" name="radio-${escapeHtml(block.id)}"${props.selected === option ? ' checked' : ''} /><span>${escapeHtml(option)}</span></label>`,
      )
      .join('')
    return `<fieldset class="preview-radio-group"><legend>${escapeHtml(props.label)}</legend>${options}</fieldset>`
  }

  if (type === 'carousel') {
    const slides = toList(props.images)
      .map((image, index) => `<img src="${escapeHtml(image)}" alt="slide-${index + 1}" />`)
      .join('')
    return `<div class="preview-carousel">${slides}</div>`
  }

  if (type === 'chart') {
    const bars = toList(props.values)
      .map((value) => clampNumber(value, 0, 100, 0))
      .map((value) => `<div style="height: ${value}%" title="${value}%"></div>`)
      .join('')
    return `<div class="preview-chart">${bars}</div>`
  }

  if (type === 'progress') {
    const value = clampNumber(props.value, 0, 100, 0)
    return `<div class="preview-progress-wrap"><span>${escapeHtml(props.label)}</span><progress max="100" value="${value}"></progress></div>`
  }

  if (type === 'separator') {
    return `<div class="preview-separator"><hr /><span>${escapeHtml(props.text)}</span></div>`
  }

  if (type === 'aspect-ratio') {
    const squareClass = String(props.ratio).trim() === '1/1' ? ' is-square' : ''
    return `<div class="preview-aspect${squareClass}"><img src="${escapeHtml(props.src)}" alt="aspect content" /></div>`
  }

  if (type === 'quote') {
    return `<figure class="preview-quote"><blockquote>&quot;${escapeHtml(props.text)}&quot;</blockquote><figcaption>${escapeHtml(props.author)}</figcaption></figure>`
  }

  if (type === 'logo-row') {
    const items = toList(props.items)
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join('')
    return `<div class="preview-logo-row">${items}</div>`
  }

  if (type === 'kpi') {
    return `<article class="preview-kpi"><strong>${escapeHtml(props.value)}</strong><p>${escapeHtml(props.label)}</p><small>${escapeHtml(props.note)}</small></article>`
  }

  if (type === 'pricing-card') {
    const features = toList(props.features)
      .map((feature) => `<li>${escapeHtml(feature)}</li>`)
      .join('')
    return `<article class="preview-pricing-card"><h3>${escapeHtml(props.plan)}</h3><p class="preview-pricing-line"><strong>${escapeHtml(props.price)}</strong><span>${escapeHtml(props.period)}</span></p><ul>${features}</ul><button type="button">${escapeHtml(props.cta)}</button></article>`
  }

  if (type === 'feature-list') {
    const items = toList(props.items)
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('')
    return `<ul class="preview-feature-list">${items}</ul>`
  }

  if (type === 'countdown') {
    const days = clampNumber(props.days, 0, 365, 0)
    const hours = clampNumber(props.hours, 0, 23, 0)
    const minutes = clampNumber(props.minutes, 0, 59, 0)
    return `<div class="preview-countdown"><p>${escapeHtml(props.label)}</p><div><span><strong>${days}</strong><small>dnu</small></span><span><strong>${hours}</strong><small>hod</small></span><span><strong>${minutes}</strong><small>min</small></span></div></div>`
  }

  if (type === 'limited-offer') {
    return `<article class="preview-offer"><div><h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.subtitle)}</p></div><code>${escapeHtml(props.code)}</code><button type="button">${escapeHtml(props.cta)}</button></article>`
  }

  if (type === 'cookie-popup') {
    return `<aside class="preview-cookie-popup" role="dialog" aria-label="Cookie consent"><h4>${escapeHtml(props.title)}</h4><p>${escapeHtml(props.text)}</p><div><button type="button" data-cookie-close="1">${escapeHtml(props.reject)}</button><button type="button" class="is-primary" data-cookie-close="1">${escapeHtml(props.accept)}</button></div></aside>`
  }

  if (type === 'footer') {
    const links = toList(props.links)
      .map((link) => `<a href="#">${escapeHtml(link)}</a>`)
      .join('')
    return `<footer class="preview-footer"><strong>${escapeHtml(props.brand)}</strong><p>${escapeHtml(props.note)}</p><div>${links}</div></footer>`
  }

  return ''
}

function buildStaticExportHtml(snapshot) {
  const appearance = snapshot.appearance ?? {
    textColor: '#1f2937',
    headingColor: '#0f172a',
    accentColor: '#2563eb',
    cardBg: '#ffffff',
    borderColor: '#cbd5e1',
    radius: 12,
    gap: 14,
    buttonRadius: 10,
    canvasWidth: 920,
  }
  const backgroundId = snapshot.backgroundId ?? 'clean'
  const customBackground = snapshot.customBackground ?? '#ffffff'
  const blocks = Array.isArray(snapshot.blocks) ? snapshot.blocks : []

  const cards = blocks
    .map((block) => {
      const styleVars = getComponentCssVariables((snapshot.componentStyles ?? {})[block.id])
      const cssVars = Object.entries(styleVars)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
      return `<section class="preview-component has-hover-shadow" style="${cssVars}"><div class="preview-component-body">${renderStaticBlockSource(block)}</div></section>`
    })
    .join('\n')

  const customBackgroundStyle =
    backgroundId === 'custom' ? ` style="--preview-custom-bg: ${escapeHtml(customBackground)}"` : ''

  return `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>247solutions Export</title>
    <style>
      :root {
        --preview-text: ${appearance.textColor};
        --preview-heading: ${appearance.headingColor};
        --preview-accent: ${appearance.accentColor};
        --preview-card-bg: ${appearance.cardBg};
        --preview-border: ${appearance.borderColor};
        --preview-radius: ${appearance.radius}px;
        --preview-gap: ${appearance.gap}px;
        --preview-button-radius: ${appearance.buttonRadius}px;
        --preview-canvas-width: ${appearance.canvasWidth}px;
      }
      body { margin: 0; padding: 24px; font-family: 'Segoe UI', sans-serif; color: var(--preview-text); background: #f3f6fb; }
      .preview-canvas { max-width: min(100%, var(--preview-canvas-width)); margin: 0 auto; display: grid; gap: var(--preview-gap); }
      .preview-bg-clean { background: #ffffff; }
      .preview-bg-sunset { background: linear-gradient(160deg, #fff4e6 0%, #ffe3e3 100%); }
      .preview-bg-ocean { background: linear-gradient(160deg, #e0f2fe 0%, #ecfeff 100%); }
      .preview-bg-forest { background: linear-gradient(160deg, #e6f4ea 0%, #f0fdf4 100%); }
      .preview-bg-grid { background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px); background-size: 24px 24px; background-color: #fff; }
      .preview-bg-custom { background: var(--preview-custom-bg, #ffffff); }
      .preview-component { border: 1px solid var(--component-border-color, var(--preview-border)); border-radius: var(--component-radius, var(--preview-radius)); background: var(--component-bg-color, var(--preview-card-bg)); }
      .preview-component-body { padding: calc(16px + var(--component-padding, 0px)); color: var(--component-text-color, var(--preview-text)); font-size: var(--component-font-size, 16px); font-weight: var(--component-font-weight, 400); line-height: var(--component-line-height, 1.5); letter-spacing: var(--component-letter-spacing, 0px); opacity: var(--component-opacity, 1); font-family: var(--component-font-family, inherit); }
      .preview-component:hover { box-shadow: none; transform: none; transition: none; }
      .preview-component h1,.preview-component h2,.preview-component h3,.preview-component h4 { color: var(--preview-heading); margin: 0 0 10px; }
      .preview-component p { margin: 0; }
      .preview-button, .preview-button-group button, .preview-header button, .preview-pricing-card button, .preview-offer button, .preview-cookie-popup button { border: none; border-radius: var(--preview-button-radius); background: var(--preview-accent); color: #fff; padding: 10px 14px; cursor: pointer; text-decoration: none; display: inline-block; }
      .preview-button-group { display: flex; flex-wrap: wrap; gap: 10px; }
      .preview-header, .preview-footer { display: flex; gap: 14px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
      .preview-header nav, .preview-footer div { display: flex; gap: 12px; flex-wrap: wrap; }
      .preview-image, .preview-aspect img, .preview-carousel img { width: 100%; border-radius: calc(var(--preview-radius) - 2px); }
      .preview-video-wrap { position: relative; padding-top: 56.25%; }
      .preview-video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: calc(var(--preview-radius) - 2px); }
      .preview-aspect.is-square { padding-top: 100%; position: relative; }
      .preview-aspect.is-square img { position: absolute; inset: 0; height: 100%; object-fit: cover; }
      .preview-chart { display: flex; gap: 8px; align-items: end; min-height: 160px; }
      .preview-chart div { flex: 1; background: color-mix(in srgb, var(--preview-accent) 80%, white); border-radius: 8px 8px 0 0; }
      .preview-feature-list, .preview-pricing-card ul { margin: 0; padding-left: 18px; }
      .preview-cookie-popup { position: fixed; right: 16px; bottom: 16px; width: min(360px, calc(100vw - 32px)); z-index: 20; }
      .preview-cookie-popup div { display: flex; gap: 10px; margin-top: 12px; }
      @media (max-width: 900px) { body { padding: 12px; } }
    </style>
  </head>
  <body>
    <main class="preview-canvas preview-bg-${backgroundId}"${customBackgroundStyle}>
      ${cards || '<p>Export je prazdny. Pridat bloky ve Studiu.</p>'}
    </main>
    <script>
      document.querySelectorAll('[data-cookie-close="1"]').forEach((button) => {
        button.addEventListener('click', () => {
          const popup = button.closest('.preview-cookie-popup');
          if (popup) popup.remove();
        });
      });
    </script>
  </body>
</html>`
}

function buildReactExportCss() {
  return `:root {
  color-scheme: light;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #e8ecef;
  color: #111827;
}

#root {
  width: 100%;
  min-height: 100vh;
}

.preview-canvas {
  width: min(var(--preview-canvas-width, 920px), 100%);
  margin: 1rem auto;
  border: 1px solid var(--preview-border, #d1d5db);
  border-radius: var(--preview-radius, 18px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: clamp(1rem, 3vw, 2.25rem);
  display: flex;
  flex-direction: column;
  gap: var(--preview-gap, 0.9rem);
}

.preview-component {
  border: 1px solid transparent;
  border-radius: var(--component-radius, 12px);
  background: var(--component-bg-color, #ffffff);
  color: var(--component-text-color, inherit);
  font-size: var(--component-font-size, inherit);
  font-weight: var(--component-font-weight, inherit);
  line-height: var(--component-line-height, inherit);
  letter-spacing: var(--component-letter-spacing, 0px);
  opacity: var(--component-opacity, 1);
  font-family: var(--component-font-family, inherit);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.preview-component-body {
  padding: calc(16px + var(--component-padding, 0px));
  border: 1px solid var(--component-border-color, #cbd5e1);
  border-radius: var(--component-radius, 12px);
}

.preview-component.has-hover-shadow:hover {
  box-shadow: none;
}

.preview-component:hover {
  transform: none;
}

.preview-canvas h1,
.preview-canvas h2,
.preview-canvas p {
  margin: 0;
}

.preview-canvas h1 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.1;
  color: var(--preview-heading, #0f172a);
}

.preview-canvas h2 {
  font-size: clamp(1.2rem, 2.6vw, 2rem);
  color: var(--preview-heading, #374151);
}

.preview-canvas p {
  font-size: 1rem;
  line-height: 1.55;
  color: var(--preview-text, #1f2937);
}

.preview-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  padding: 0.7rem 0.85rem;
}

.preview-header nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.preview-header a,
.preview-footer a {
  color: #334155;
  text-decoration: none;
}

.preview-header button,
.preview-button,
.preview-pricing-card button,
.preview-offer button,
.preview-cookie-popup button.is-primary {
  border: 0;
  border-radius: var(--preview-button-radius, 10px);
  background: var(--preview-accent, #2563eb);
  color: #fff;
  padding: 0.45rem 0.8rem;
  font-weight: 600;
}

.preview-image {
  width: 100%;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  object-fit: cover;
}

.preview-video-wrap {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  background: #0f172a;
}

.preview-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  display: block;
}

.preview-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.preview-button-group button {
  border: 1px solid var(--preview-accent, #93c5fd);
  background: color-mix(in srgb, var(--preview-accent, #2563eb) 22%, white);
  color: #1e40af;
  border-radius: var(--preview-button-radius, 10px);
  padding: 0.4rem 0.7rem;
}

.preview-button-group button.is-active {
  background: var(--preview-accent, #2563eb);
  border-color: var(--preview-accent, #2563eb);
  color: #fff;
}

.preview-card,
.preview-accordion,
.preview-radio-group,
.preview-kpi,
.preview-pricing-card,
.preview-offer,
.preview-cookie-popup,
.preview-footer,
.preview-countdown,
.preview-quote {
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
  background: #ffffff;
}

.preview-alert {
  border: 1px solid #fdba74;
  background: #fff7ed;
  color: #9a3412;
  border-radius: 10px;
  padding: 0.75rem 0.85rem;
}

.preview-badge {
  display: inline-block;
  width: fit-content;
  border-radius: 999px;
  background: color-mix(in srgb, var(--preview-accent, #2563eb) 20%, white);
  color: var(--preview-accent, #1d4ed8);
  padding: 0.28rem 0.62rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.preview-avatar {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.preview-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
}

.preview-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.preview-field input,
.preview-field textarea,
.preview-field select {
  border: 1px solid #d1d5db;
  border-radius: 9px;
  padding: 0.5rem 0.62rem;
  font: inherit;
  background: #ffffff;
}

.preview-radio-group label,
.preview-check {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.preview-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.45rem;
}

.preview-carousel img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.preview-chart {
  height: 150px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: linear-gradient(180deg, #f8fafc, #fff);
  padding: 0.5rem;
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
}

.preview-chart div {
  flex: 1;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(180deg, #60a5fa, #2563eb);
}

.preview-separator {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.preview-separator hr {
  border: 0;
  border-top: 1px solid #cbd5e1;
  flex: 1;
}

.preview-aspect {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #d1d5db;
}

.preview-aspect.is-square {
  aspect-ratio: 1 / 1;
  max-width: 420px;
}

.preview-aspect img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-logo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.preview-logo-row span {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 0.3rem 0.65rem;
  background: #f8fafc;
  color: #334155;
  font-weight: 600;
  font-size: 0.85rem;
}

.preview-feature-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.preview-feature-list li {
  position: relative;
  padding-left: 1.35rem;
}

.preview-feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #16a34a;
  font-weight: 700;
}

.preview-cookie-popup {
  position: sticky;
  bottom: 0.5rem;
  margin-left: auto;
}

.preview-cookie-popup div {
  display: flex;
  justify-content: flex-end;
  gap: 0.45rem;
}

.preview-cookie-popup button {
  border: 1px solid #475569;
  background: transparent;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
}

.preview-footer {
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.preview-bg-clean {
  background: #ffffff;
}

.preview-bg-custom {
  background: var(--preview-custom-bg, #ffffff);
}

.preview-bg-sunset {
  background:
    radial-gradient(circle at 15% 15%, rgba(251, 146, 60, 0.3), transparent 30%),
    radial-gradient(circle at 85% 80%, rgba(244, 63, 94, 0.22), transparent 34%),
    linear-gradient(145deg, #fff7ed, #ffedd5);
}

.preview-bg-ocean {
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.28), transparent 32%),
    radial-gradient(circle at 80% 75%, rgba(6, 182, 212, 0.22), transparent 36%),
    linear-gradient(135deg, #ecfeff, #cffafe);
}

.preview-bg-forest {
  background:
    radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.24), transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(22, 163, 74, 0.2), transparent 35%),
    linear-gradient(145deg, #f0fdf4, #dcfce7);
}

.preview-bg-grid {
  background-color: #ffffff;
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px);
  background-size: 24px 24px;
}

@media (max-width: 900px) {
  .preview-canvas {
    margin: 0;
    border-radius: 0;
  }
}`
}

function buildReactExportAppSource(snapshot) {
  const blocks = JSON.stringify(snapshot.blocks ?? [], null, 2)
  const componentStyles = JSON.stringify(snapshot.componentStyles ?? {}, null, 2)
  const appearance = JSON.stringify(snapshot.appearance ?? {}, null, 2)
  const backgroundId = JSON.stringify(snapshot.backgroundId ?? 'clean')
  const customBackground = JSON.stringify(snapshot.customBackground ?? '#ffffff')

  return `import { useState } from 'react'

const BLOCKS = ${blocks}
const COMPONENT_STYLES = ${componentStyles}
const APPEARANCE = ${appearance}
const BACKGROUND_ID = ${backgroundId}
const CUSTOM_BACKGROUND = ${customBackground}

const DEFAULT_COMPONENT_STYLE = {
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  borderColor: '#cbd5e1',
  hoverColor: '#2563eb',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  padding: 0,
  radius: 12,
  opacity: 100,
  hoverScale: 1.03,
  hoverShadow: true,
  animation: 'none',
  fontFamily: 'inherit',
}

function withDefaultComponentStyle(style) {
  return {
    ...DEFAULT_COMPONENT_STYLE,
    ...(style ?? {}),
  }
}

function toList(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return Math.max(min, Math.min(max, number))
}

function getComponentStyle(styleConfig) {
  const style = withDefaultComponentStyle(styleConfig)
  return {
    '--component-text-color': style.textColor,
    '--component-bg-color': style.backgroundColor,
    '--component-border-color': style.borderColor,
    '--component-hover-color': style.hoverColor,
    '--component-font-size': style.fontSize + 'px',
    '--component-font-weight': style.fontWeight,
    '--component-line-height': style.lineHeight,
    '--component-letter-spacing': style.letterSpacing + 'px',
    '--component-padding': style.padding + 'px',
    '--component-radius': style.radius + 'px',
    '--component-opacity': style.opacity / 100,
    '--component-hover-scale': style.hoverScale,
    '--component-font-family': style.fontFamily,
  }
}

function renderBlock(block, state, onStateChange) {
  const { type, props } = block

  function getStateValue(key, fallback) {
    if (state && key in state) return state[key]
    return fallback
  }

  if (type === 'heading') return <h1 key={block.id}>{props.text}</h1>
  if (type === 'subheading') return <h2 key={block.id}>{props.text}</h2>
  if (type === 'text') return <p key={block.id}>{props.text}</p>

  if (type === 'header') {
    return (
      <header key={block.id} className="preview-header">
        <strong>{props.brand}</strong>
        <nav>
          {toList(props.links).map((link, index) => (
            <a href="#" key={link + '-' + index}>
              {link}
            </a>
          ))}
        </nav>
        <button type="button">{props.cta}</button>
      </header>
    )
  }

  if (type === 'image') return <img key={block.id} className="preview-image" src={props.src} alt={props.alt} loading="lazy" />

  if (type === 'video') {
    return (
      <div key={block.id} className="preview-video-wrap">
        <iframe
          src={props.url}
          title={props.title}
          className="preview-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (type === 'button') return <a key={block.id} className="preview-button" href={props.href}>{props.text}</a>

  if (type === 'button-group') {
    const activeIndex = getStateValue('activeIndex', -1)
    return (
      <div key={block.id} className="preview-button-group">
        {toList(props.items).map((item, index) => (
          <button type="button" key={item + '-' + index} className={index === activeIndex ? 'is-active' : ''} onClick={() => onStateChange({ activeIndex: index })}>
            {item}
          </button>
        ))}
      </div>
    )
  }

  if (type === 'accordion' || type === 'collapsible') {
    const isOpen = Boolean(getStateValue('open', props.open))
    return (
      <details key={block.id} className="preview-accordion" open={isOpen} onToggle={(event) => onStateChange({ open: event.currentTarget.open })}>
        <summary>{props.title}</summary>
        <p>{props.content}</p>
      </details>
    )
  }

  if (type === 'alert') return <div key={block.id} className="preview-alert" role="alert">{props.text}</div>

  if (type === 'card') {
    return (
      <article key={block.id} className="preview-card">
        <h3>{props.title}</h3>
        <p>{props.content}</p>
      </article>
    )
  }

  if (type === 'badge') return <span key={block.id} className="preview-badge">{props.text}</span>

  if (type === 'avatar') {
    return (
      <div key={block.id} className="preview-avatar">
        <img src={props.src} alt={props.name} />
        <span>{props.name}</span>
      </div>
    )
  }

  if (type === 'checkbox') {
    const checked = Boolean(getStateValue('checked', props.checked))
    return (
      <label key={block.id} className="preview-check">
        <input type="checkbox" checked={checked} onChange={(event) => onStateChange({ checked: event.target.checked })} />
        <span>{props.label}</span>
      </label>
    )
  }

  if (type === 'input') {
    const value = String(getStateValue('value', ''))
    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <input type="text" placeholder={props.placeholder} value={value} onChange={(event) => onStateChange({ value: event.target.value })} />
      </label>
    )
  }

  if (type === 'textarea') {
    const value = String(getStateValue('value', ''))
    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <textarea placeholder={props.placeholder} rows={4} value={value} onChange={(event) => onStateChange({ value: event.target.value })} />
      </label>
    )
  }

  if (type === 'select') {
    const options = toList(props.options)
    const fallbackValue = options[0] ?? ''
    const value = String(getStateValue('value', fallbackValue))
    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <select value={value} onChange={(event) => onStateChange({ value: event.target.value })}>
          {options.map((option, index) => (
            <option key={option + '-' + index}>{option}</option>
          ))}
        </select>
      </label>
    )
  }

  if (type === 'radio-group') {
    const options = toList(props.options)
    const selectedValue = String(getStateValue('selected', props.selected))
    return (
      <fieldset key={block.id} className="preview-radio-group">
        <legend>{props.label}</legend>
        {options.map((option, index) => (
          <label key={option + '-' + index}>
            <input type="radio" name={'radio-' + block.id} checked={selectedValue === option} onChange={() => onStateChange({ selected: option })} />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
    )
  }

  if (type === 'carousel') {
    return (
      <div key={block.id} className="preview-carousel">
        {toList(props.images).map((image, index) => (
          <img key={image + '-' + index} src={image} alt={'slide-' + (index + 1)} />
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    const values = toList(props.values).map((value) => clampNumber(value, 0, 100, 0))
    return (
      <div key={block.id} className="preview-chart">
        {values.map((value, index) => (
          <div key={value + '-' + index} style={{ height: value + '%' }} title={value + '%'} />
        ))}
      </div>
    )
  }

  if (type === 'progress') {
    const value = clampNumber(props.value, 0, 100, 0)
    return (
      <div key={block.id} className="preview-progress-wrap">
        <span>{props.label}</span>
        <progress max="100" value={value} />
      </div>
    )
  }

  if (type === 'separator') {
    return (
      <div key={block.id} className="preview-separator">
        <hr />
        <span>{props.text}</span>
      </div>
    )
  }

  if (type === 'aspect-ratio') {
    const isSquare = String(props.ratio).trim() === '1/1'
    return (
      <div key={block.id} className={'preview-aspect' + (isSquare ? ' is-square' : '')}>
        <img src={props.src} alt="aspect content" />
      </div>
    )
  }

  if (type === 'quote') {
    return (
      <figure key={block.id} className="preview-quote">
        <blockquote>"{props.text}"</blockquote>
        <figcaption>{props.author}</figcaption>
      </figure>
    )
  }

  if (type === 'logo-row') {
    return (
      <div key={block.id} className="preview-logo-row">
        {toList(props.items).map((item, index) => (
          <span key={item + '-' + index}>{item}</span>
        ))}
      </div>
    )
  }

  if (type === 'kpi') {
    return (
      <article key={block.id} className="preview-kpi">
        <strong>{props.value}</strong>
        <p>{props.label}</p>
        <small>{props.note}</small>
      </article>
    )
  }

  if (type === 'pricing-card') {
    return (
      <article key={block.id} className="preview-pricing-card">
        <h3>{props.plan}</h3>
        <p className="preview-pricing-line">
          <strong>{props.price}</strong>
          <span>{props.period}</span>
        </p>
        <ul>
          {toList(props.features).map((feature, index) => (
            <li key={feature + '-' + index}>{feature}</li>
          ))}
        </ul>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'feature-list') {
    return (
      <ul key={block.id} className="preview-feature-list">
        {toList(props.items).map((item, index) => (
          <li key={item + '-' + index}>{item}</li>
        ))}
      </ul>
    )
  }

  if (type === 'countdown') {
    const days = clampNumber(props.days, 0, 365, 0)
    const hours = clampNumber(props.hours, 0, 23, 0)
    const minutes = clampNumber(props.minutes, 0, 59, 0)
    return (
      <div key={block.id} className="preview-countdown">
        <p>{props.label}</p>
        <div>
          <span><strong>{days}</strong><small>dnu</small></span>
          <span><strong>{hours}</strong><small>hod</small></span>
          <span><strong>{minutes}</strong><small>min</small></span>
        </div>
      </div>
    )
  }

  if (type === 'limited-offer') {
    return (
      <article key={block.id} className="preview-offer">
        <div>
          <h3>{props.title}</h3>
          <p>{props.subtitle}</p>
        </div>
        <code>{props.code}</code>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'cookie-popup') {
    const closed = Boolean(getStateValue('closed', false))
    if (closed) return null
    return (
      <aside key={block.id} className="preview-cookie-popup" role="dialog" aria-label="Cookie consent">
        <h4>{props.title}</h4>
        <p>{props.text}</p>
        <div>
          <button type="button" onClick={() => onStateChange({ closed: true })}>{props.reject}</button>
          <button type="button" className="is-primary" onClick={() => onStateChange({ closed: true, accepted: true })}>{props.accept}</button>
        </div>
      </aside>
    )
  }

  if (type === 'footer') {
    return (
      <footer key={block.id} className="preview-footer">
        <strong>{props.brand}</strong>
        <p>{props.note}</p>
        <div>
          {toList(props.links).map((link, index) => (
            <a href="#" key={link + '-' + index}>{link}</a>
          ))}
        </div>
      </footer>
    )
  }

  return null
}

export default function App() {
  const [previewState, setPreviewState] = useState({})
  const previewStyle = {
    '--preview-text': APPEARANCE.textColor,
    '--preview-heading': APPEARANCE.headingColor,
    '--preview-accent': APPEARANCE.accentColor,
    '--preview-card-bg': APPEARANCE.cardBg,
    '--preview-border': APPEARANCE.borderColor,
    '--preview-radius': APPEARANCE.radius + 'px',
    '--preview-gap': APPEARANCE.gap + 'px',
    '--preview-button-radius': APPEARANCE.buttonRadius + 'px',
    '--preview-canvas-width': APPEARANCE.canvasWidth + 'px',
    '--preview-custom-bg': CUSTOM_BACKGROUND,
  }

  return (
    <main className={'preview-canvas preview-bg-' + BACKGROUND_ID} style={previewStyle}>
      {BLOCKS.length > 0 ? (
        BLOCKS.map((block) => {
          const style = withDefaultComponentStyle(COMPONENT_STYLES[block.id])
          const classes = ['preview-component']
          if (style.hoverShadow) classes.push('has-hover-shadow')
          return (
            <section key={block.id} className={classes.join(' ')} style={getComponentStyle(style)}>
              <div className="preview-component-body">
                {renderBlock(block, previewState[block.id], (patch) =>
                  setPreviewState((prev) => ({
                    ...prev,
                    [block.id]: {
                      ...(prev[block.id] ?? {}),
                      ...patch,
                    },
                  }))
                )}
              </div>
            </section>
          )
        })
      ) : (
        <p>Preview je prazdny.</p>
      )}
    </main>
  )
}
`
}

function buildReactProjectFiles(snapshot) {
  return {
    'package.json': JSON.stringify(
      {
        name: 'landing-page-export',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^19.2.7',
          'react-dom': '^19.2.7',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^6.0.3',
          vite: '^8.1.1',
        },
      },
      null,
      2,
    ) + '\n',
    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Landing Page Export</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
    'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`,
    'src/main.jsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
    'src/App.jsx': buildReactExportAppSource(snapshot),
    'src/index.css': buildReactExportCss(),
    'README.md': `# Landing Page Export\n\nExport generated from 247solutions Studio.\n\n## Run\n\n- npm install\n- npm run dev\n\n## Build\n\n- npm run build\n`,
  }
}

async function exportReactProjectZip(snapshot) {
  const jszipModule = await import('jszip')
  const JSZip = jszipModule.default
  const zip = new JSZip()
  const files = buildReactProjectFiles(snapshot)

  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'landing-page-react-project.zip'
  anchor.click()
  URL.revokeObjectURL(url)
}

function withDefaultComponentStyle(style) {
  return {
    ...DEFAULT_COMPONENT_STYLE,
    ...(style ?? {}),
  }
}

const COMPONENT_LIBRARY = [
  {
    type: 'header',
    label: 'Header',
    category: 'Layout',
    defaults: {
      brand: 'ORCAVE',
      links: 'Produkt, Cenik, FAQ, Kontakt',
      cta: 'Zacit zdarma',
    },
  },
  { type: 'heading', label: 'Heading', category: 'Text', defaults: { text: 'Hlavni nadpis sekce' } },
  { type: 'subheading', label: 'Subheading', category: 'Text', defaults: { text: 'Podnadpis sekce' } },
  { type: 'text', label: 'Text', category: 'Text', defaults: { text: 'Delsi odstavcovy text obsahu.' } },
  {
    type: 'image',
    label: 'Image',
    category: 'Media',
    defaults: { src: 'https://picsum.photos/seed/orcave/1200/700', alt: 'Ukazkovy obrazek' },
  },
  {
    type: 'video',
    label: 'Video',
    category: 'Media',
    defaults: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Video blok' },
  },
  { type: 'button', label: 'Button', category: 'CTA', defaults: { text: 'Klikni sem', href: '#' } },
  {
    type: 'button-group',
    label: 'Button Group',
    category: 'CTA',
    defaults: { items: 'Primarni, Sekundarni' },
  },
  {
    type: 'accordion',
    label: 'Accordion',
    category: 'Content',
    defaults: { title: 'Casto kladena otazka', content: 'Sem pride odpoved v accordionu.', open: false },
  },
  {
    type: 'collapsible',
    label: 'Collapsible',
    category: 'Content',
    defaults: { title: 'Dalsi detail', content: 'Skryty obsah collapsible komponenty.', open: false },
  },
  { type: 'alert', label: 'Alert', category: 'Feedback', defaults: { text: 'Dulezite upozorneni nebo casove omezena akce.' } },
  { type: 'card', label: 'Card', category: 'Content', defaults: { title: 'Benefit title', content: 'Jedna karta s benefitem nebo hodnotou.' } },
  { type: 'badge', label: 'Badge', category: 'Feedback', defaults: { text: 'New' } },
  {
    type: 'avatar',
    label: 'Avatar',
    category: 'Social Proof',
    defaults: { name: 'Tereza Novak', src: 'https://i.pravatar.cc/120?img=32' },
  },
  { type: 'checkbox', label: 'Checkbox', category: 'Form', defaults: { label: 'Souhlasim s podminkami', checked: false } },
  { type: 'input', label: 'Input', category: 'Form', defaults: { label: 'Jmeno', placeholder: 'Zadej hodnotu' } },
  { type: 'textarea', label: 'Textarea', category: 'Form', defaults: { label: 'Zprava', placeholder: 'Napis text...' } },
  {
    type: 'select',
    label: 'Select',
    category: 'Form',
    defaults: { label: 'Vyber moznost', options: 'Varianta A, Varianta B, Varianta C' },
  },
  {
    type: 'radio-group',
    label: 'Radio Group',
    category: 'Form',
    defaults: { label: 'Typ planu', options: 'Free, Pro, Enterprise', selected: 'Pro' },
  },
  {
    type: 'carousel',
    label: 'Carousel',
    category: 'Social Proof',
    defaults: {
      images:
        'https://picsum.photos/seed/car-1/600/360, https://picsum.photos/seed/car-2/600/360, https://picsum.photos/seed/car-3/600/360',
    },
  },
  { type: 'chart', label: 'Chart', category: 'Social Proof', defaults: { values: '24, 56, 36, 78, 42' } },
  { type: 'progress', label: 'Progress', category: 'Utility', defaults: { value: 62, label: 'Kapacita 62%' } },
  { type: 'separator', label: 'Separator', category: 'Layout', defaults: { text: 'Sekce' } },
  {
    type: 'aspect-ratio',
    label: 'Aspect Ratio',
    category: 'Layout',
    defaults: { ratio: '16/9', src: 'https://picsum.photos/seed/aspect/1000/560' },
  },
  {
    type: 'quote',
    label: 'Quote',
    category: 'Social Proof',
    defaults: {
      text: 'Spoluprace byla rychla, jasna a mela realny dopad na vysledky.',
      author: 'Martina K., CMO',
    },
  },
  {
    type: 'logo-row',
    label: 'Logo Row',
    category: 'Social Proof',
    defaults: { items: 'Acme, Vertex, Novus, Orbit, Prime' },
  },
  {
    type: 'kpi',
    label: 'KPI',
    category: 'Social Proof',
    defaults: { value: '34%', label: 'Rust poptavek', note: 'za 30 dni' },
  },
  {
    type: 'pricing-card',
    label: 'Pricing Card',
    category: 'CTA',
    defaults: {
      plan: 'Pro Plan',
      price: '1490 Kc',
      period: '/ mesic',
      features: 'Neomezene projekty, Prioritni podpora, Integrace',
      cta: 'Zacit zdarma',
    },
  },
  {
    type: 'feature-list',
    label: 'Feature List',
    category: 'Content',
    defaults: { items: 'Rychle nasazeni, Jasna analytika, Vyssi konverze' },
  },
  {
    type: 'countdown',
    label: 'Countdown',
    category: 'CTA',
    defaults: { days: 7, hours: 12, minutes: 45, label: 'Akce konci za' },
  },
  {
    type: 'limited-offer',
    label: 'Limited Offer',
    category: 'CTA',
    defaults: {
      title: 'Limitovana nabidka',
      subtitle: 'Jen pro prvnich 50 klientu.',
      code: 'START2026',
      cta: 'Aktivovat nabidku',
    },
  },
  {
    type: 'cookie-popup',
    label: 'Cookie Popup',
    category: 'Utility',
    defaults: {
      title: 'Pouzivame cookies',
      text: 'Pomahaji nam zlepsit web a merit vykon kampani.',
      accept: 'Prijmout',
      reject: 'Odmittnout',
    },
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'Layout',
    defaults: {
      brand: 'ORCAVE',
      note: 'Copyright 2026 ORCAVE. Vsechna prava vyhrazena.',
      links: 'Podminky, Ochrana udaju, Kontakt',
    },
  },
]

const PREMADE_SECTIONS = [
  {
    id: 'form',
    label: 'Formular',
    description: 'Lead form se zakladnimi poli a CTA.',
    blocks: [
      { type: 'separator', props: { text: 'Kontaktni formular' } },
      { type: 'heading', props: { text: 'Posli nam poptavku' } },
      { type: 'text', props: { text: 'Odpovime ti do 24 hodin.' } },
      { type: 'input', props: { label: 'Jmeno a prijmeni', placeholder: 'Jan Novak' } },
      { type: 'input', props: { label: 'Email', placeholder: 'jan@firma.cz' } },
      { type: 'textarea', props: { label: 'Pozadavek', placeholder: 'Co potrebujes vyresit?' } },
      { type: 'checkbox', props: { label: 'Souhlasim se zpracovanim osobnich udaju', checked: false } },
      { type: 'button', props: { text: 'Odeslat poptavku', href: '#' } },
    ],
  },
  {
    id: 'contact',
    label: 'Kontakt',
    description: 'Blok s kontaktnimi udaji a rychlymi akcemi.',
    blocks: [
      { type: 'separator', props: { text: 'Kontakt' } },
      { type: 'heading', props: { text: 'Spoj se s nami' } },
      { type: 'text', props: { text: 'Po-Pa 8:00-18:00 | Odpovime jeste dnes.' } },
      { type: 'card', props: { title: 'Email', content: 'hello@orcave.cz' } },
      { type: 'card', props: { title: 'Telefon', content: '+420 777 123 456' } },
      { type: 'button-group', props: { items: 'Zavolat, Napsat email, Domluvit call' } },
    ],
  },
  {
    id: 'stats',
    label: 'Statistiky',
    description: 'Dukaz vykonu pomoci metrik a cisel.',
    blocks: [
      { type: 'separator', props: { text: 'Vysledky klientu' } },
      { type: 'heading', props: { text: 'Metriky, ktere mluvi jasne' } },
      { type: 'chart', props: { values: '22, 48, 37, 64, 89' } },
      { type: 'progress', props: { label: 'Rust konverze', value: 74 } },
      { type: 'card', props: { title: '+34%', content: 'Vice poptavek za prvnich 30 dni.' } },
      { type: 'card', props: { title: '-18%', content: 'Nizsi cena za lead po optimalizaci.' } },
    ],
  },
  {
    id: 'links',
    label: 'Odkazy',
    description: 'Rychle odkazy na dalsi obsah nebo sekce.',
    blocks: [
      { type: 'separator', props: { text: 'Rychle odkazy' } },
      { type: 'subheading', props: { text: 'Vyber dalsi krok' } },
      { type: 'button-group', props: { items: 'Cenik, Pripadove studie, FAQ, Kontakt' } },
      { type: 'alert', props: { text: 'Tip: zacni pripadovymi studiemi a over vysledky.' } },
    ],
  },
  {
    id: 'references',
    label: 'Reference',
    description: 'Social proof od klientu a ukazky.',
    blocks: [
      { type: 'separator', props: { text: 'Reference klientu' } },
      { type: 'heading', props: { text: 'Duvira vice nez 120 firm' } },
      { type: 'avatar', props: { name: 'Martina K., CMO', src: 'https://i.pravatar.cc/120?img=47' } },
      {
        type: 'card',
        props: {
          title: '"Skvela spoluprace"',
          content: 'Behem 2 tydnu jsme zvedli pocet leadu o tretinu a konecne mame jasnou komunikaci hodnoty.',
        },
      },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/ref-1/600/360, https://picsum.photos/seed/ref-2/600/360, https://picsum.photos/seed/ref-3/600/360' } },
      { type: 'badge', props: { text: '4.9/5 hodnoceni' } },
    ],
  },
  {
    id: 'hero-launch',
    label: 'Hero Launch',
    description: 'Nadpis, podnadpis, CTA, media a social proof.',
    blocks: [
      { type: 'badge', props: { text: 'Nova verze 2026' } },
      { type: 'heading', props: { text: 'Postav landing page za 15 minut' } },
      { type: 'subheading', props: { text: 'Editor pro rychly navrh sdeleni, CTA a formulare bez kodu.' } },
      { type: 'button-group', props: { items: 'Vyzkouset zdarma, Rezervovat demo' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/hero-launch/1200/675' } },
      { type: 'logo-row', props: { items: 'Acme, Brisk, Northlabs, Pixelio, Vanta' } },
    ],
  },
  {
    id: 'benefits',
    label: 'Benefity',
    description: 'Sekce s vyhodami a strukturou argumentu.',
    blocks: [
      { type: 'separator', props: { text: 'Proc ORCAVE' } },
      { type: 'heading', props: { text: 'Co ziskas hned po nasazeni' } },
      { type: 'feature-list', props: { items: 'Jasny message-market fit, Vyssi konverzni pomer, Rychle A/B iterace' } },
      { type: 'card', props: { title: 'Jednoducha sprava', content: 'Obsah i strukturu menis v jednom panelu.' } },
      { type: 'card', props: { title: 'Skalovatelnost', content: 'Stejny framework pouzijes pro dalsi kampane.' } },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Cenovy blok a porovnani hlavniho planu.',
    blocks: [
      { type: 'separator', props: { text: 'Cenik' } },
      { type: 'heading', props: { text: 'Jednoduche ceny bez skrytych poplatku' } },
      {
        type: 'pricing-card',
        props: {
          plan: 'Growth',
          price: '1490 Kc',
          period: '/ mesic',
          features: 'Neomezene landing pages, Heatmapy, Integrace CRM, Priority support',
          cta: 'Zacit Growth',
        },
      },
      { type: 'countdown', props: { label: 'Launch sleva konci za', days: 3, hours: 8, minutes: 14 } },
    ],
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Predpripravene casto kladene dotazy.',
    blocks: [
      { type: 'separator', props: { text: 'FAQ' } },
      { type: 'heading', props: { text: 'Na co se ptate nejcasteji' } },
      { type: 'accordion', props: { title: 'Jak rychle spustim prvni stranku?', content: 'Zakladni variantu zvladnes behem jednoho odpoledne.', open: true } },
      { type: 'accordion', props: { title: 'Muzu exportovat kod?', content: 'Ano, projekt zustava plne pod tvoji kontrolou.', open: false } },
      { type: 'accordion', props: { title: 'Jde to propojit s CRM?', content: 'Ano, pres webhooky a integrace formularu.', open: false } },
    ],
  },
  {
    id: 'final-cta',
    label: 'Finalni CTA',
    description: 'Zaverecna vyzva k akci s dukazy duvery.',
    blocks: [
      { type: 'separator', props: { text: 'Posledni krok' } },
      { type: 'heading', props: { text: 'Pripraveni zvednout konverze?' } },
      { type: 'quote', props: { text: 'Po nasazeni jsme meli o 34 % vice relevantnich leadu.', author: 'Pavel R., CEO' } },
      { type: 'kpi', props: { value: '+34%', label: 'Vice leadu', note: 'behem 30 dni' } },
      { type: 'button', props: { text: 'Chci zacit dnes', href: '#' } },
    ],
  },
  {
    id: 'top-header',
    label: 'Top Header',
    description: 'Elegantni horni navigace pro landing page.',
    blocks: [
      {
        type: 'header',
        props: {
          brand: 'ORCAVE Studio',
          links: 'Funkce, Reference, Cenik, FAQ',
          cta: 'Book demo',
        },
      },
    ],
  },
  {
    id: 'footer-contact',
    label: 'Footer Kontakt',
    description: 'Paticka s kontakty a legal odkazy.',
    blocks: [
      {
        type: 'footer',
        props: {
          brand: 'ORCAVE',
          note: 'Kontakt: hello@orcave.cz | +420 777 123 456',
          links: 'Obchodni podminky, GDPR, Podpora',
        },
      },
    ],
  },
  {
    id: 'limited-offer-premade',
    label: 'Limited Nabidka',
    description: 'Samostatny promo blok s casove omezenou akci.',
    blocks: [
      {
        type: 'limited-offer',
        props: {
          title: 'Flash sleva 25 %',
          subtitle: 'Plati jen dnes do pulnoci.',
          code: 'FLASH25',
          cta: 'Uplatnit kod',
        },
      },
    ],
  },
  {
    id: 'cookie-popup-premade',
    label: 'Cookie Popup',
    description: 'Samostatny blok pro souhlas s cookies.',
    blocks: [
      {
        type: 'cookie-popup',
        props: {
          title: 'Nastaveni cookies',
          text: 'Pouzivame analyticke i marketingove cookies pro lepsi vysledky kampani.',
          accept: 'Prijmout vse',
          reject: 'Jen nezbytne',
        },
      },
    ],
  },
  {
    id: 'boilerplate-saas',
    label: 'Boilerplate SaaS',
    description: 'Zakladni SaaS landing: hero, benefity, social proof, CTA.',
    blocks: [
      { type: 'header', props: { brand: 'Nimbus AI', links: 'Produkt, Integrace, Cenik, Kontakt', cta: 'Start free' } },
      { type: 'badge', props: { text: 'B2B SaaS' } },
      { type: 'heading', props: { text: 'Automatizuj reporty behem 5 minut' } },
      { type: 'subheading', props: { text: 'Jedna platforma pro data, dashboardy a tydenni reporting bez manualni prace.' } },
      { type: 'button-group', props: { items: 'Vyzkouset zdarma, Rezervovat demo' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/saas-boiler/1200/680' } },
      { type: 'feature-list', props: { items: 'Napojeni na CRM, Live dashboard, AI shrnuti pro management' } },
      { type: 'logo-row', props: { items: 'Inovo, DeltaTech, Brightly, OpenGrid, Axis' } },
      { type: 'footer', props: { brand: 'Nimbus AI', note: 'Trusted by 200+ teams', links: 'Terms, Privacy, Contact' } },
    ],
  },
  {
    id: 'boilerplate-agency',
    label: 'Boilerplate Agentura',
    description: 'Stranka pro marketingovou/webovou agenturu.',
    blocks: [
      { type: 'header', props: { brand: 'Studio North', links: 'Sluzby, Projekty, O nas, Kontakt', cta: 'Nezavazna konzultace' } },
      { type: 'heading', props: { text: 'Weby a kampane, ktere realne prodavaji' } },
      { type: 'text', props: { text: 'Kombinujeme strategii, obsah a performance marketing do jednoho procesu.' } },
      { type: 'card', props: { title: 'Strategie', content: 'Analyza trhu a jasny plan rustu.' } },
      { type: 'card', props: { title: 'Design + UX', content: 'Zamereno na konverzi a srozumitelnost.' } },
      { type: 'card', props: { title: 'Performance', content: 'PPC + SEO + analytika pod jednou strechou.' } },
      { type: 'quote', props: { text: 'Nejlepsi investice za posledni rok. Leady sly okamzite nahoru.', author: 'Lucie V., COO' } },
      { type: 'button', props: { text: 'Domluvit call', href: '#' } },
    ],
  },
  {
    id: 'boilerplate-webinar',
    label: 'Boilerplate Webinar',
    description: 'Rychla sablona pro registraci na webinar/event.',
    blocks: [
      { type: 'badge', props: { text: 'Live Webinar' } },
      { type: 'heading', props: { text: 'Jak zvednout konverze landing page o 30 %' } },
      { type: 'text', props: { text: 'Streda 24. 7. v 18:00 | 45 minut + Q&A.' } },
      { type: 'countdown', props: { label: 'Startujeme za', days: 5, hours: 3, minutes: 22 } },
      { type: 'input', props: { label: 'Jmeno', placeholder: 'Tvoje jmeno' } },
      { type: 'input', props: { label: 'Email', placeholder: 'email@firma.cz' } },
      { type: 'checkbox', props: { label: 'Souhlasim se zaslanim zaznamu po akci', checked: true } },
      { type: 'button', props: { text: 'Registrovat se', href: '#' } },
      { type: 'cookie-popup', props: { title: 'Cookies pro event', text: 'Pouzivame cookies pro mereni navstevnosti registrace.', accept: 'OK', reject: 'Ne ted' } },
    ],
  },
  {
    id: 'boilerplate-eshop',
    label: 'Boilerplate E-shop Promo',
    description: 'Promo stranka pro produkt nebo sezonni akci.',
    blocks: [
      { type: 'header', props: { brand: 'UrbanWear', links: 'New In, Kolekce, Doprava, FAQ', cta: 'Nakupovat' } },
      { type: 'limited-offer', props: { title: 'Summer Drop -20 %', subtitle: 'Pouze tento vikend na vybrane produkty.', code: 'SUMMER20', cta: 'Nakoupit ted' } },
      { type: 'image', props: { src: 'https://picsum.photos/seed/shop-promo/1200/800', alt: 'Promo kolekce' } },
      { type: 'pricing-card', props: { plan: 'Starter Pack', price: '990 Kc', period: '', features: 'Tri bestsellery, Doprava zdarma, Vymena do 30 dni', cta: 'Pridat do kosiku' } },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/shop-1/600/360, https://picsum.photos/seed/shop-2/600/360, https://picsum.photos/seed/shop-3/600/360' } },
      { type: 'footer', props: { brand: 'UrbanWear', note: 'Fast shipping across CZ/SK', links: 'Vráceni, Podpora, Kontakt' } },
    ],
  },
  {
    id: 'boilerplate-consultant',
    label: 'Boilerplate Konzultant',
    description: 'Osobni landing pro freelancera nebo konzultanta.',
    blocks: [
      { type: 'heading', props: { text: 'Pomaham firmam rust systematicky' } },
      { type: 'subheading', props: { text: 'Strategie, funnel a exekuce pro mensi a stredni firmy.' } },
      { type: 'avatar', props: { name: 'Jan Novak, Growth Consultant', src: 'https://i.pravatar.cc/120?img=18' } },
      { type: 'kpi', props: { value: '80+', label: 'Dokoncenych projektu', note: 'v poslednich 3 letech' } },
      { type: 'quote', props: { text: 'Pragmaticky pristup, jasne priority a meritelne vysledky.', author: 'Eva N., Founder' } },
      { type: 'input', props: { label: 'Email', placeholder: 'kam mam poslat navrh?' } },
      { type: 'textarea', props: { label: 'Co chcete zlepsit?', placeholder: 'Napis kratce kontext a cil...' } },
      { type: 'button', props: { text: 'Poslat poptavku', href: '#' } },
    ],
  },
]

function toList(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return Math.max(min, Math.min(max, number))
}

function createBlock(type, index) {
  const definition = COMPONENT_LIBRARY.find((component) => component.type === type)
  if (!definition) {
    return {
      id: `unknown-${Date.now()}-${index}`,
      type: 'text',
      props: { text: 'Neznamy blok' },
    }
  }

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    props: { ...definition.defaults },
  }
}

function createBlockFromTemplate(template, index) {
  const baseBlock = createBlock(template.type, index)

  return {
    ...baseBlock,
    props: {
      ...baseBlock.props,
      ...(template.props ?? {}),
    },
  }
}

function renderPreviewBlock(block, state, onStateChange) {
  const { type, props } = block

  function getStateValue(key, fallback) {
    if (state && key in state) {
      return state[key]
    }

    return fallback
  }

  if (type === 'heading') return <h1 key={block.id}>{props.text}</h1>
  if (type === 'subheading') return <h2 key={block.id}>{props.text}</h2>
  if (type === 'text') return <p key={block.id}>{props.text}</p>

  if (type === 'header') {
    return (
      <header key={block.id} className="preview-header">
        <strong>{props.brand}</strong>
        <nav>
          {toList(props.links).map((link, index) => (
            <a href="#" key={`${link}-${index}`}>
              {link}
            </a>
          ))}
        </nav>
        <button type="button">{props.cta}</button>
      </header>
    )
  }

  if (type === 'image') {
    return <img key={block.id} className="preview-image" src={props.src} alt={props.alt} loading="lazy" />
  }

  if (type === 'video') {
    return (
      <div key={block.id} className="preview-video-wrap">
        <iframe
          src={props.url}
          title={props.title}
          className="preview-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (type === 'button') {
    return (
      <a key={block.id} className="preview-button" href={props.href}>
        {props.text}
      </a>
    )
  }

  if (type === 'button-group') {
    const activeIndex = getStateValue('activeIndex', -1)

    return (
      <div key={block.id} className="preview-button-group">
        {toList(props.items).map((item, index) => (
          <button
            type="button"
            key={`${item}-${index}`}
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => onStateChange({ activeIndex: index })}
          >
            {item}
          </button>
        ))}
      </div>
    )
  }

  if (type === 'accordion' || type === 'collapsible') {
    const isOpen = Boolean(getStateValue('open', props.open))

    return (
      <details
        key={block.id}
        className="preview-accordion"
        open={isOpen}
        onToggle={(event) => onStateChange({ open: event.currentTarget.open })}
      >
        <summary>{props.title}</summary>
        <p>{props.content}</p>
      </details>
    )
  }

  if (type === 'alert') {
    return (
      <div key={block.id} className="preview-alert" role="alert">
        {props.text}
      </div>
    )
  }

  if (type === 'card') {
    return (
      <article key={block.id} className="preview-card">
        <h3>{props.title}</h3>
        <p>{props.content}</p>
      </article>
    )
  }

  if (type === 'badge') {
    return (
      <span key={block.id} className="preview-badge">
        {props.text}
      </span>
    )
  }

  if (type === 'avatar') {
    return (
      <div key={block.id} className="preview-avatar">
        <img src={props.src} alt={props.name} />
        <span>{props.name}</span>
      </div>
    )
  }

  if (type === 'checkbox') {
    const checked = Boolean(getStateValue('checked', props.checked))

    return (
      <label key={block.id} className="preview-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onStateChange({ checked: event.target.checked })}
        />
        <span>{props.label}</span>
      </label>
    )
  }

  if (type === 'input') {
    const value = String(getStateValue('value', ''))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <input
          type="text"
          placeholder={props.placeholder}
          value={value}
          onChange={(event) => onStateChange({ value: event.target.value })}
        />
      </label>
    )
  }

  if (type === 'textarea') {
    const value = String(getStateValue('value', ''))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <textarea
          placeholder={props.placeholder}
          rows={4}
          value={value}
          onChange={(event) => onStateChange({ value: event.target.value })}
        />
      </label>
    )
  }

  if (type === 'select') {
    const options = toList(props.options)
    const fallbackValue = options[0] ?? ''
    const value = String(getStateValue('value', fallbackValue))

    return (
      <label key={block.id} className="preview-field">
        <span>{props.label}</span>
        <select value={value} onChange={(event) => onStateChange({ value: event.target.value })}>
          {options.map((option, index) => (
            <option key={`${option}-${index}`}>{option}</option>
          ))}
        </select>
      </label>
    )
  }

  if (type === 'radio-group') {
    const options = toList(props.options)
    const selectedValue = String(getStateValue('selected', props.selected))

    return (
      <fieldset key={block.id} className="preview-radio-group">
        <legend>{props.label}</legend>
        {options.map((option, index) => (
          <label key={`${option}-${index}`}>
            <input
              type="radio"
              name={`radio-${block.id}`}
              checked={selectedValue === option}
              onChange={() => onStateChange({ selected: option })}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
    )
  }

  if (type === 'carousel') {
    return (
      <div key={block.id} className="preview-carousel">
        {toList(props.images).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={`slide-${index + 1}`} />
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    const values = toList(props.values).map((value) => clampNumber(value, 0, 100, 0))
    return (
      <div key={block.id} className="preview-chart">
        {values.map((value, index) => (
          <div key={`${value}-${index}`} style={{ height: `${value}%` }} title={`${value}%`} />
        ))}
      </div>
    )
  }

  if (type === 'progress') {
    const value = clampNumber(props.value, 0, 100, 0)
    return (
      <div key={block.id} className="preview-progress-wrap">
        <span>{props.label}</span>
        <progress max="100" value={value} />
      </div>
    )
  }

  if (type === 'separator') {
    return (
      <div key={block.id} className="preview-separator">
        <hr />
        <span>{props.text}</span>
      </div>
    )
  }

  if (type === 'aspect-ratio') {
    const isSquare = String(props.ratio).trim() === '1/1'
    return (
      <div key={block.id} className={`preview-aspect ${isSquare ? 'is-square' : ''}`}>
        <img src={props.src} alt="aspect content" />
      </div>
    )
  }

  if (type === 'quote') {
    return (
      <figure key={block.id} className="preview-quote">
        <blockquote>"{props.text}"</blockquote>
        <figcaption>{props.author}</figcaption>
      </figure>
    )
  }

  if (type === 'logo-row') {
    return (
      <div key={block.id} className="preview-logo-row">
        {toList(props.items).map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    )
  }

  if (type === 'kpi') {
    return (
      <article key={block.id} className="preview-kpi">
        <strong>{props.value}</strong>
        <p>{props.label}</p>
        <small>{props.note}</small>
      </article>
    )
  }

  if (type === 'pricing-card') {
    return (
      <article key={block.id} className="preview-pricing-card">
        <h3>{props.plan}</h3>
        <p className="preview-pricing-line">
          <strong>{props.price}</strong>
          <span>{props.period}</span>
        </p>
        <ul>
          {toList(props.features).map((feature, index) => (
            <li key={`${feature}-${index}`}>{feature}</li>
          ))}
        </ul>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'feature-list') {
    return (
      <ul key={block.id} className="preview-feature-list">
        {toList(props.items).map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
  }

  if (type === 'countdown') {
    const days = clampNumber(props.days, 0, 365, 0)
    const hours = clampNumber(props.hours, 0, 23, 0)
    const minutes = clampNumber(props.minutes, 0, 59, 0)

    return (
      <div key={block.id} className="preview-countdown">
        <p>{props.label}</p>
        <div>
          <span>
            <strong>{days}</strong>
            <small>dnu</small>
          </span>
          <span>
            <strong>{hours}</strong>
            <small>hod</small>
          </span>
          <span>
            <strong>{minutes}</strong>
            <small>min</small>
          </span>
        </div>
      </div>
    )
  }

  if (type === 'limited-offer') {
    return (
      <article key={block.id} className="preview-offer">
        <div>
          <h3>{props.title}</h3>
          <p>{props.subtitle}</p>
        </div>
        <code>{props.code}</code>
        <button type="button">{props.cta}</button>
      </article>
    )
  }

  if (type === 'cookie-popup') {
    const closed = Boolean(getStateValue('closed', false))
    if (closed) return null

    return (
      <aside key={block.id} className="preview-cookie-popup" role="dialog" aria-label="Cookie consent">
        <h4>{props.title}</h4>
        <p>{props.text}</p>
        <div>
          <button type="button" onClick={() => onStateChange({ closed: true })}>
            {props.reject}
          </button>
          <button type="button" className="is-primary" onClick={() => onStateChange({ closed: true, accepted: true })}>
            {props.accept}
          </button>
        </div>
      </aside>
    )
  }

  if (type === 'footer') {
    return (
      <footer key={block.id} className="preview-footer">
        <strong>{props.brand}</strong>
        <p>{props.note}</p>
        <div>
          {toList(props.links).map((link, index) => (
            <a href="#" key={`${link}-${index}`}>
              {link}
            </a>
          ))}
        </div>
      </footer>
    )
  }

  return null
}

function renderEditorFields(block, onChange) {
  const { type, props } = block

  if (type === 'header') {
    return (
      <>
        <input type="text" value={props.brand} onChange={(event) => onChange('brand', event.target.value)} placeholder="Brand" />
        <input type="text" value={props.links} onChange={(event) => onChange('links', event.target.value)} placeholder="Link1, Link2" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA" />
      </>
    )
  }

  if (type === 'heading' || type === 'subheading' || type === 'text' || type === 'alert') {
    return <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={type === 'text' ? 4 : 2} />
  }

  if (type === 'image') {
    return (
      <>
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Image URL" />
        <input type="text" value={props.alt} onChange={(event) => onChange('alt', event.target.value)} placeholder="Alt text" />
      </>
    )
  }

  if (type === 'video') {
    return (
      <>
        <input type="text" value={props.url} onChange={(event) => onChange('url', event.target.value)} placeholder="Embed URL" />
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Video title" />
      </>
    )
  }

  if (type === 'button') {
    return (
      <>
        <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Button label" />
        <input type="text" value={props.href} onChange={(event) => onChange('href', event.target.value)} placeholder="Button href" />
      </>
    )
  }

  if (type === 'button-group' || type === 'carousel' || type === 'chart') {
    const propName = type === 'carousel' ? 'images' : type === 'chart' ? 'values' : 'items'
    return <input type="text" value={props[propName]} onChange={(event) => onChange(propName, event.target.value)} placeholder="Polozka1, Polozka2" />
  }

  if (type === 'accordion' || type === 'collapsible') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Title" />
        <textarea value={props.content} onChange={(event) => onChange('content', event.target.value)} rows={3} />
        <label className="tiny-check">
          <input type="checkbox" checked={props.open} onChange={(event) => onChange('open', event.target.checked)} />
          <span>Open by default</span>
        </label>
      </>
    )
  }

  if (type === 'card') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Title" />
        <textarea value={props.content} onChange={(event) => onChange('content', event.target.value)} rows={3} />
      </>
    )
  }

  if (type === 'badge') {
    return <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Badge text" />
  }

  if (type === 'avatar') {
    return (
      <>
        <input type="text" value={props.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Name" />
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Avatar URL" />
      </>
    )
  }

  if (type === 'checkbox') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <label className="tiny-check">
          <input type="checkbox" checked={props.checked} onChange={(event) => onChange('checked', event.target.checked)} />
          <span>Checked</span>
        </label>
      </>
    )
  }

  if (type === 'input' || type === 'textarea') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Field label" />
        <input type="text" value={props.placeholder} onChange={(event) => onChange('placeholder', event.target.value)} placeholder="Placeholder" />
      </>
    )
  }

  if (type === 'select') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Field label" />
        <input type="text" value={props.options} onChange={(event) => onChange('options', event.target.value)} placeholder="A, B, C" />
      </>
    )
  }

  if (type === 'radio-group') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <input type="text" value={props.options} onChange={(event) => onChange('options', event.target.value)} placeholder="A, B, C" />
        <input type="text" value={props.selected} onChange={(event) => onChange('selected', event.target.value)} placeholder="Selected" />
      </>
    )
  }

  if (type === 'progress') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Progress label" />
        <input type="number" min="0" max="100" value={props.value} onChange={(event) => onChange('value', event.target.value)} />
      </>
    )
  }

  if (type === 'separator') {
    return <input type="text" value={props.text} onChange={(event) => onChange('text', event.target.value)} placeholder="Separator label" />
  }

  if (type === 'aspect-ratio') {
    return (
      <>
        <input type="text" value={props.ratio} onChange={(event) => onChange('ratio', event.target.value)} placeholder="16/9 or 1/1" />
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Image URL" />
      </>
    )
  }

  if (type === 'quote') {
    return (
      <>
        <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} />
        <input type="text" value={props.author} onChange={(event) => onChange('author', event.target.value)} placeholder="Autor" />
      </>
    )
  }

  if (type === 'logo-row' || type === 'feature-list') {
    return <input type="text" value={props.items} onChange={(event) => onChange('items', event.target.value)} placeholder="Polozka1, Polozka2" />
  }

  if (type === 'kpi') {
    return (
      <>
        <input type="text" value={props.value} onChange={(event) => onChange('value', event.target.value)} placeholder="Hodnota" />
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Popis" />
        <input type="text" value={props.note} onChange={(event) => onChange('note', event.target.value)} placeholder="Doplnek" />
      </>
    )
  }

  if (type === 'pricing-card') {
    return (
      <>
        <input type="text" value={props.plan} onChange={(event) => onChange('plan', event.target.value)} placeholder="Nazev planu" />
        <input type="text" value={props.price} onChange={(event) => onChange('price', event.target.value)} placeholder="Cena" />
        <input type="text" value={props.period} onChange={(event) => onChange('period', event.target.value)} placeholder="Perioda" />
        <input type="text" value={props.features} onChange={(event) => onChange('features', event.target.value)} placeholder="Feature1, Feature2" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA label" />
      </>
    )
  }

  if (type === 'countdown') {
    return (
      <>
        <input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Label" />
        <input type="number" min="0" max="365" value={props.days} onChange={(event) => onChange('days', event.target.value)} />
        <input type="number" min="0" max="23" value={props.hours} onChange={(event) => onChange('hours', event.target.value)} />
        <input type="number" min="0" max="59" value={props.minutes} onChange={(event) => onChange('minutes', event.target.value)} />
      </>
    )
  }

  if (type === 'limited-offer') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis nabidky" />
        <input type="text" value={props.subtitle} onChange={(event) => onChange('subtitle', event.target.value)} placeholder="Podtext" />
        <input type="text" value={props.code} onChange={(event) => onChange('code', event.target.value)} placeholder="Slevovy kod" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA" />
      </>
    )
  }

  if (type === 'cookie-popup') {
    return (
      <>
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" />
        <textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} />
        <input type="text" value={props.accept} onChange={(event) => onChange('accept', event.target.value)} placeholder="Accept label" />
        <input type="text" value={props.reject} onChange={(event) => onChange('reject', event.target.value)} placeholder="Reject label" />
      </>
    )
  }

  if (type === 'footer') {
    return (
      <>
        <input type="text" value={props.brand} onChange={(event) => onChange('brand', event.target.value)} placeholder="Brand" />
        <textarea value={props.note} onChange={(event) => onChange('note', event.target.value)} rows={2} />
        <input type="text" value={props.links} onChange={(event) => onChange('links', event.target.value)} placeholder="Link1, Link2" />
      </>
    )
  }

  return null
}

function StudioApp() {
  const [blocks, setBlocks] = useState([createBlock('heading', 0), createBlock('text', 1), createBlock('button', 2)])
  const [backgroundId, setBackgroundId] = useState('clean')
  const [componentQuery, setComponentQuery] = useState('')
  const [previewState, setPreviewState] = useState({})
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [componentStyles, setComponentStyles] = useState({})
  const [copiedComponentStyle, setCopiedComponentStyle] = useState(null)
  const [customBackground, setCustomBackground] = useState('#ffffff')
  const [appearance, setAppearance] = useState({
    textColor: '#1f2937',
    headingColor: '#0f172a',
    accentColor: '#2563eb',
    cardBg: '#ffffff',
    borderColor: '#cbd5e1',
    radius: 12,
    gap: 14,
    buttonRadius: 10,
    canvasWidth: 920,
  })

  const hasBlocks = blocks.length > 0
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null
  const selectedComponent = selectedBlock
    ? COMPONENT_LIBRARY.find((item) => item.type === selectedBlock.type)
    : null
  const selectedStyle = withDefaultComponentStyle(
    selectedBlock ? componentStyles[selectedBlock.id] : null,
  )

  const blockCountLabel = useMemo(() => {
    const count = blocks.length
    if (count === 1) return '1 blok'
    if (count > 1 && count < 5) return `${count} bloky`
    return `${count} bloku`
  }, [blocks])

  const filteredComponents = useMemo(() => {
    const query = componentQuery.trim().toLowerCase()
    if (!query) return COMPONENT_LIBRARY

    return COMPONENT_LIBRARY.filter((component) => {
      const target = `${component.label} ${component.category}`.toLowerCase()
      return target.includes(query)
    })
  }, [componentQuery])

  function addBlock(type) {
    let createdBlock = null
    setBlocks((prev) => {
      createdBlock = createBlock(type, prev.length)
      return [...prev, createdBlock]
    })

    if (createdBlock) {
      setSelectedBlockId(createdBlock.id)
    }
  }

  function addPremadeSection(sectionId) {
    const section = PREMADE_SECTIONS.find((item) => item.id === sectionId)
    if (!section) return

    let firstCreatedId = null

    setBlocks((prev) => {
      const offset = prev.length
      const nextBlocks = section.blocks.map((template, index) =>
        createBlockFromTemplate(template, offset + index),
      )

      firstCreatedId = nextBlocks[0]?.id ?? null

      return [...prev, ...nextBlocks]
    })

    if (firstCreatedId) {
      setSelectedBlockId(firstCreatedId)
    }
  }

  function updateBlockProp(id, propName, value) {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? { ...block, props: { ...block.props, [propName]: value } }
          : block,
      ),
    )
  }

  function removeBlock(id) {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
    setPreviewState((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    setComponentStyles((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    setSelectedBlockId((prevSelected) => (prevSelected === id ? null : prevSelected))
  }

  function updatePreviewState(id, patch) {
    setPreviewState((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        ...patch,
      },
    }))
  }

  function updateAppearance(name, value) {
    setAppearance((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function updateSelectedComponentStyle(name, value) {
    if (!selectedBlockId) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        [name]: value,
      },
    }))
  }

  function resetSelectedComponentStyle() {
    if (!selectedBlockId) return

    setComponentStyles((prev) => {
      const next = { ...prev }
      delete next[selectedBlockId]
      return next
    })
  }

  function copySelectedComponentStyle() {
    if (!selectedBlockId) return
    setCopiedComponentStyle(withDefaultComponentStyle(componentStyles[selectedBlockId]))
  }

  function pasteToSelectedComponentStyle() {
    if (!selectedBlockId || !copiedComponentStyle) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        ...copiedComponentStyle,
      },
    }))
  }

  function applyStylePresetToSelected(presetKey) {
    if (!selectedBlockId) return
    const preset = COMPONENT_STYLE_PRESETS[presetKey]
    if (!preset) return

    setComponentStyles((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...withDefaultComponentStyle(prev[selectedBlockId]),
        ...preset,
      },
    }))
  }

  function exportCurrentProjectSource() {
    const snapshot = {
      blocks,
      backgroundId,
      customBackground,
      appearance,
      componentStyles,
    }
    const html = buildStaticExportHtml(snapshot)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'landing-page-export.html'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function exportCurrentReactProject() {
    const snapshot = {
      blocks,
      backgroundId,
      customBackground,
      appearance,
      componentStyles,
    }

    await exportReactProjectZip(snapshot)
  }

  function getComponentStyle(id) {
    return getComponentCssVariables(componentStyles[id])
  }

  function getComponentWrapperClass(id) {
    const style = withDefaultComponentStyle(componentStyles[id])
    const classes = ['preview-component']

    if (id === selectedBlockId) {
      classes.push('is-selected')
    }

    if (style.hoverShadow) {
      classes.push('has-hover-shadow')
    }

    if (style.animation !== 'none') {
      classes.push(`anim-${style.animation}`)
    }

    return classes.join(' ')
  }

  const previewStyle = getPreviewStyle(appearance, customBackground)

  useEffect(() => {
    savePreviewSnapshot({
      blocks,
      backgroundId,
      customBackground,
      appearance,
      componentStyles,
      updatedAt: Date.now(),
    })
  }, [blocks, backgroundId, customBackground, appearance, componentStyles])

  return (
    <div className="editor-layout">
      <aside className="editor-panel">
        <h1>Live Editor</h1>
        <p className="panel-muted">Toolbox je pro landing page (bez menu/tabs/breadcrumbs).</p>

        <div className="editor-meta">{blockCountLabel}</div>

        <div className="studio-actions">
          <button type="button" onClick={exportCurrentProjectSource}>
            Export HTML zdrojak
          </button>
          <button type="button" onClick={exportCurrentReactProject}>
            Export full React projekt (.zip)
          </button>
          <button
            type="button"
            onClick={() => window.open('/preview', '_blank', 'noopener,noreferrer')}
          >
            Otevrit live podstranku
          </button>
          <p className="panel-muted">
            Live nahled je dostupny na <code>/preview</code> a aktualizuje se automaticky.
          </p>
        </div>

        <div>
          <p className="panel-muted">Pozadi preview</p>
          <div className="tool-row">
            {BACKGROUND_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={option.id === backgroundId ? 'is-selected-bg' : undefined}
                onClick={() => setBackgroundId(option.id)}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              className={backgroundId === 'custom' ? 'is-selected-bg' : undefined}
              onClick={() => setBackgroundId('custom')}
            >
              Custom
            </button>
          </div>
          {backgroundId === 'custom' && (
            <div className="custom-inline-control">
              <label htmlFor="custom-bg-input">Custom pozadi</label>
              <input
                id="custom-bg-input"
                type="color"
                value={customBackground}
                onChange={(event) => setCustomBackground(event.target.value)}
              />
            </div>
          )}
        </div>

        <div className="custom-style-panel">
          <p className="panel-muted">Custom upravy (barvicky + komponenty)</p>

          <div className="custom-grid">
            <label>
              Text
              <input
                type="color"
                value={appearance.textColor}
                onChange={(event) => updateAppearance('textColor', event.target.value)}
              />
            </label>
            <label>
              Heading
              <input
                type="color"
                value={appearance.headingColor}
                onChange={(event) => updateAppearance('headingColor', event.target.value)}
              />
            </label>
            <label>
              Accent
              <input
                type="color"
                value={appearance.accentColor}
                onChange={(event) => updateAppearance('accentColor', event.target.value)}
              />
            </label>
            <label>
              Card BG
              <input
                type="color"
                value={appearance.cardBg}
                onChange={(event) => updateAppearance('cardBg', event.target.value)}
              />
            </label>
            <label>
              Border
              <input
                type="color"
                value={appearance.borderColor}
                onChange={(event) => updateAppearance('borderColor', event.target.value)}
              />
            </label>
          </div>

          <div className="custom-range-list">
            <label>
              Radius: {appearance.radius}px
              <input
                type="range"
                min="4"
                max="30"
                value={appearance.radius}
                onChange={(event) => updateAppearance('radius', Number(event.target.value))}
              />
            </label>
            <label>
              Mezery: {appearance.gap}px
              <input
                type="range"
                min="8"
                max="28"
                value={appearance.gap}
                onChange={(event) => updateAppearance('gap', Number(event.target.value))}
              />
            </label>
            <label>
              Radius tlacitek: {appearance.buttonRadius}px
              <input
                type="range"
                min="4"
                max="24"
                value={appearance.buttonRadius}
                onChange={(event) => updateAppearance('buttonRadius', Number(event.target.value))}
              />
            </label>
            <label>
              Sirka canvasu: {appearance.canvasWidth}px
              <input
                type="range"
                min="680"
                max="1200"
                step="10"
                value={appearance.canvasWidth}
                onChange={(event) => updateAppearance('canvasWidth', Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="component-picker">
          <p className="panel-muted">Pridat komponentu</p>
          <input
            type="text"
            value={componentQuery}
            onChange={(event) => setComponentQuery(event.target.value)}
            placeholder="Hledej: card, image, input..."
          />
          <div className="component-list">
            {filteredComponents.map((component) => (
              <button
                key={component.type}
                type="button"
                className="component-item"
                onClick={() => addBlock(component.type)}
              >
                <span>{component.label}</span>
                <small>{component.category}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="premade-picker">
          <p className="panel-muted">Premade bloky</p>
          <div className="premade-list">
            {PREMADE_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className="premade-item"
                onClick={() => addPremadeSection(section.id)}
              >
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="block-list">
          {hasBlocks ? (
            blocks.map((block, index) => {
              const component = COMPONENT_LIBRARY.find((item) => item.type === block.type)

              return (
                <section
                  className={`block-editor ${block.id === selectedBlockId ? 'is-selected' : ''}`}
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="block-editor-head">
                    <strong>
                      {index + 1}. {component?.label ?? block.type}
                    </strong>
                    <button type="button" className="ghost-danger" onClick={() => removeBlock(block.id)}>
                      Smazat
                    </button>
                  </div>
                  <div className="block-fields">
                    {renderEditorFields(block, (propName, value) => updateBlockProp(block.id, propName, value))}
                  </div>
                </section>
              )
            })
          ) : (
            <p className="panel-muted">Zatim tu nic neni. Pridat prvni blok.</p>
          )}
        </div>
      </aside>

      <section className="preview-shell">
        <div className={`preview-canvas preview-bg-${backgroundId}`} style={previewStyle}>
          {hasBlocks ? (
            blocks.map((block) => {
              const component = COMPONENT_LIBRARY.find((item) => item.type === block.type)

              return (
                <div
                  key={block.id}
                  className={getComponentWrapperClass(block.id)}
                  style={getComponentStyle(block.id)}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="preview-component-label">{component?.label ?? block.type}</div>
                  <div className="preview-component-body">
                    {renderPreviewBlock(block, previewState[block.id], (patch) =>
                      updatePreviewState(block.id, patch),
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="preview-empty">Preview je prazdny.</p>
          )}
        </div>

        <aside className="inspector-panel">
          <h2>Inspector</h2>
          {selectedBlock ? (
            <>
              <p className="panel-muted">
                Upravy pro: <strong>{selectedComponent?.label ?? selectedBlock.type}</strong>
              </p>

              <div className="inspector-actions">
                <button type="button" onClick={resetSelectedComponentStyle}>
                  Reset stylu
                </button>
                <button type="button" onClick={copySelectedComponentStyle}>
                  Copy styl
                </button>
                <button
                  type="button"
                  disabled={!copiedComponentStyle}
                  onClick={pasteToSelectedComponentStyle}
                >
                  Paste styl
                </button>
              </div>

              <div className="inspector-presets">
                <button type="button" onClick={() => applyStylePresetToSelected('modern')}>
                  Modern
                </button>
                <button type="button" onClick={() => applyStylePresetToSelected('bold')}>
                  Bold
                </button>
                <button type="button" onClick={() => applyStylePresetToSelected('minimal')}>
                  Minimal
                </button>
              </div>

              <div className="inspector-group">
                <label>
                  Font family
                  <select
                    value={selectedStyle.fontFamily}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontFamily', event.target.value)
                    }
                  >
                    <option value="inherit">Default</option>
                    <option value="Georgia, serif">Serif</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                    <option value="'Courier New', monospace">Monospace</option>
                    <option value="'Segoe UI', sans-serif">Segoe UI</option>
                  </select>
                </label>

                <label>
                  Velikost pismene: {selectedStyle.fontSize}px
                  <input
                    type="range"
                    min="12"
                    max="52"
                    value={selectedStyle.fontSize}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontSize', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Font weight: {selectedStyle.fontWeight}
                  <input
                    type="range"
                    min="300"
                    max="800"
                    step="100"
                    value={selectedStyle.fontWeight}
                    onChange={(event) =>
                      updateSelectedComponentStyle('fontWeight', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Line height: {selectedStyle.lineHeight}
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.05"
                    value={selectedStyle.lineHeight}
                    onChange={(event) =>
                      updateSelectedComponentStyle('lineHeight', Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Letter spacing: {selectedStyle.letterSpacing}px
                  <input
                    type="range"
                    min="-1"
                    max="8"
                    step="0.5"
                    value={selectedStyle.letterSpacing}
                    onChange={(event) =>
                      updateSelectedComponentStyle('letterSpacing', Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="inspector-group inspector-colors">
                <label>
                  Text
                  <input
                    type="color"
                    value={selectedStyle.textColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('textColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Background
                  <input
                    type="color"
                    value={selectedStyle.backgroundColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('backgroundColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Border
                  <input
                    type="color"
                    value={selectedStyle.borderColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('borderColor', event.target.value)
                    }
                  />
                </label>
                <label>
                  Hover
                  <input
                    type="color"
                    value={selectedStyle.hoverColor}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverColor', event.target.value)
                    }
                  />
                </label>
              </div>

              <div className="inspector-group">
                <label>
                  Padding: {selectedStyle.padding}px
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={selectedStyle.padding}
                    onChange={(event) =>
                      updateSelectedComponentStyle('padding', Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Radius: {selectedStyle.radius}px
                  <input
                    type="range"
                    min="0"
                    max="28"
                    value={selectedStyle.radius}
                    onChange={(event) =>
                      updateSelectedComponentStyle('radius', Number(event.target.value))
                    }
                  />
                </label>
                <label>
                  Opacity: {selectedStyle.opacity}%
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={selectedStyle.opacity}
                    onChange={(event) =>
                      updateSelectedComponentStyle('opacity', Number(event.target.value))
                    }
                  />
                </label>
              </div>

              <div className="inspector-group">
                <label>
                  Hover scale: {selectedStyle.hoverScale.toFixed(2)}
                  <input
                    type="range"
                    min="1"
                    max="1.15"
                    step="0.01"
                    value={selectedStyle.hoverScale}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverScale', Number(event.target.value))
                    }
                  />
                </label>

                <label className="tiny-check">
                  <input
                    type="checkbox"
                    checked={selectedStyle.hoverShadow}
                    onChange={(event) =>
                      updateSelectedComponentStyle('hoverShadow', event.target.checked)
                    }
                  />
                  <span>Hover shadow</span>
                </label>

                <label>
                  Animace
                  <select
                    value={selectedStyle.animation}
                    onChange={(event) =>
                      updateSelectedComponentStyle('animation', event.target.value)
                    }
                  >
                    <option value="none">None</option>
                    <option value="float">Float</option>
                    <option value="pulse">Pulse</option>
                    <option value="fade">Fade In</option>
                  </select>
                </label>
              </div>
            </>
          ) : (
            <p className="panel-muted">Vyber komponentu v seznamu nebo klikni na blok v preview.</p>
          )}
        </aside>
      </section>
    </div>
  )
}

function LivePreviewSubpage() {
  const [snapshot, setSnapshot] = useState(() => {
    if (typeof window === 'undefined') return null
    return readSavedPreviewSnapshot()
  })
  const [previewState, setPreviewState] = useState({})

  useEffect(() => {
    function refreshSnapshot() {
      setSnapshot(readSavedPreviewSnapshot())
    }

    refreshSnapshot()
    const intervalId = window.setInterval(refreshSnapshot, 900)
    return () => window.clearInterval(intervalId)
  }, [])

  if (!snapshot) {
    return (
      <div className="live-preview-page">
        <div className="live-preview-empty">
          <h1>Live Preview</h1>
          <p>Preview zatim nema data. Otevri Studio a uprav bloky.</p>
        </div>
      </div>
    )
  }

  const blocks = Array.isArray(snapshot.blocks) ? snapshot.blocks : []
  const backgroundId = snapshot.backgroundId ?? 'clean'
  const appearance = snapshot.appearance ?? {
    textColor: '#1f2937',
    headingColor: '#0f172a',
    accentColor: '#2563eb',
    cardBg: '#ffffff',
    borderColor: '#cbd5e1',
    radius: 12,
    gap: 14,
    buttonRadius: 10,
    canvasWidth: 920,
  }
  const customBackground = snapshot.customBackground ?? '#ffffff'
  const componentStyles = snapshot.componentStyles ?? {}

  return (
    <div className="live-preview-page">
      <header className="live-preview-header">
        <strong>247solutions Live Preview</strong>
        <a href="/">Zpet do Studia</a>
      </header>

      <main
        className={`preview-canvas preview-bg-${backgroundId} preview-standalone`}
        style={getPreviewStyle(appearance, customBackground)}
      >
        {blocks.length > 0 ? (
          blocks.map((block) => {
            const style = withDefaultComponentStyle(componentStyles[block.id])
            const classes = ['preview-component', 'preview-standalone-component']
            if (style.hoverShadow) classes.push('has-hover-shadow')
            if (style.animation !== 'none') classes.push(`anim-${style.animation}`)

            return (
              <div key={block.id} className={classes.join(' ')} style={getComponentCssVariables(style)}>
                <div className="preview-component-body">
                  {renderPreviewBlock(block, previewState[block.id], (patch) =>
                    setPreviewState((prev) => ({
                      ...prev,
                      [block.id]: {
                        ...(prev[block.id] ?? {}),
                        ...patch,
                      },
                    }))
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="preview-empty">Preview je prazdny.</p>
        )}
      </main>
    </div>
  )
}

function isPreviewRoute() {
  if (typeof window === 'undefined') return false
  const normalized = window.location.pathname.replace(/\/+$/, '')
  return normalized === '/preview'
}

export default function App() {
  if (isPreviewRoute()) {
    return <LivePreviewSubpage />
  }

  return <StudioApp />
}
