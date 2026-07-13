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

  if (type === 'hero-banner') {
    return `<section class="preview-hero-banner" style="background-image: linear-gradient(120deg, rgba(15, 23, 42, .88), rgba(15, 23, 42, .35)), url('${escapeHtml(props.src)}')"><div><span>${escapeHtml(props.eyebrow)}</span><h2>${escapeHtml(props.title)}</h2><p>${escapeHtml(props.subtitle)}</p><a href="${escapeHtml(props.href)}">${escapeHtml(props.cta)}</a></div></section>`
  }

  if (type === 'tabs') {
    const tabs = toList(props.items).map((item) => item.split('|').map((part) => part.trim()))
    const buttons = tabs.map(([label], index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}">${escapeHtml(label)}</button>`).join('')
    return `<div class="preview-advanced-tabs"><div class="preview-advanced-tab-list">${buttons}</div><p>${escapeHtml(tabs[0]?.[1] ?? '')}</p></div>`
  }

  if (type === 'stats-grid') {
    const stats = toList(props.items).map((item) => {
      const [value = '', label = '', note = ''] = item.split('|').map((part) => part.trim())
      return `<article><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span><small>${escapeHtml(note)}</small></article>`
    }).join('')
    return `<div class="preview-stats-grid">${stats}</div>`
  }

  if (type === 'timeline') {
    const items = toList(props.items).map((item) => {
      const [date = '', title = '', content = ''] = item.split('|').map((part) => part.trim())
      return `<article><span>${escapeHtml(date)}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(content)}</p></div></article>`
    }).join('')
    return `<div class="preview-timeline">${items}</div>`
  }

  if (type === 'testimonials-grid') {
    const items = toList(props.items).map((item) => {
      const [text = '', author = '', role = ''] = item.split('|').map((part) => part.trim())
      return `<figure><div aria-label="5 hvezdice">★★★★★</div><blockquote>&quot;${escapeHtml(text)}&quot;</blockquote><figcaption><strong>${escapeHtml(author)}</strong><span>${escapeHtml(role)}</span></figcaption></figure>`
    }).join('')
    return `<div class="preview-testimonials-grid">${items}</div>`
  }

  if (type === 'comparison-table') {
    const headers = toList(props.headers).map((header) => `<th>${escapeHtml(header)}</th>`).join('')
    const rows = String(props.rows).split(';').map((row) => row.trim()).filter(Boolean).map((row) => `<tr>${row.split('|').map((cell) => `<td>${escapeHtml(cell.trim())}</td>`).join('')}</tr>`).join('')
    return `<div class="preview-comparison-wrap"><table class="preview-comparison-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`
  }

  if (type === 'faq-list') {
    const items = toList(props.items).map((item, index) => {
      const [question = '', answer = ''] = item.split('|').map((part) => part.trim())
      return `<details${index === 0 && props.firstOpen ? ' open' : ''}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`
    }).join('')
    return `<div class="preview-faq-list">${items}</div>`
  }

  if (type === 'team-grid') {
    const members = toList(props.items).map((item) => {
      const [name = '', role = '', src = ''] = item.split('|').map((part) => part.trim())
      return `<article><img src="${escapeHtml(src)}" alt="${escapeHtml(name)}" loading="lazy" /><h3>${escapeHtml(name)}</h3><p>${escapeHtml(role)}</p></article>`
    }).join('')
    return `<div class="preview-team-grid">${members}</div>`
  }

  if (type === 'gallery-grid') {
    const images = toList(props.images).map((src, index) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(props.alt)} ${index + 1}" loading="lazy" />`).join('')
    return `<div class="preview-gallery-grid">${images}</div>`
  }

  if (type === 'contact-panel') {
    return `<section class="preview-contact-panel"><div><span>Kontakt</span><h2>${escapeHtml(props.title)}</h2><p>${escapeHtml(props.text)}</p></div><address><a href="mailto:${escapeHtml(props.email)}">${escapeHtml(props.email)}</a><a href="tel:${escapeHtml(props.phone)}">${escapeHtml(props.phone)}</a><span>${escapeHtml(props.address)}</span><span>${escapeHtml(props.hours)}</span></address></section>`
  }

  if (type === 'newsletter') {
    return `<section class="preview-newsletter"><div><h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.text)}</p></div><form><label><span class="sr-only">E-mail</span><input type="email" placeholder="${escapeHtml(props.placeholder)}" /></label><button type="submit">${escapeHtml(props.cta)}</button></form><small>${escapeHtml(props.note)}</small></section>`
  }

  if (type === 'split-cta') {
    return `<section class="preview-split-cta"><div><span>${escapeHtml(props.badge)}</span><h2>${escapeHtml(props.title)}</h2></div><div><p>${escapeHtml(props.text)}</p><div><a href="#">${escapeHtml(props.primary)}</a><a href="#" class="is-secondary">${escapeHtml(props.secondary)}</a></div></div></section>`
  }

  if (type === 'marquee') {
    const logos = toList(props.items).map((item) => `<strong>${escapeHtml(item)}</strong>`).join('')
    return `<section class="preview-marquee"><p>${escapeHtml(props.label)}</p><div>${logos}</div></section>`
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
      .preview-hero-banner { min-height: 420px; padding: 48px; border-radius: var(--preview-radius); background-size: cover; background-position: center; display: grid; align-items: end; color: #fff; }
      .preview-hero-banner div { max-width: 680px; } .preview-hero-banner h2 { color: #fff; font-size: clamp(2rem, 6vw, 4.5rem); margin: 10px 0; } .preview-hero-banner p { color: #e2e8f0; } .preview-hero-banner a { display: inline-block; margin-top: 18px; padding: 12px 18px; border-radius: var(--preview-button-radius); background: var(--preview-accent); color: #fff; text-decoration: none; }
      .preview-advanced-tab-list { display: flex; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid var(--preview-border); } .preview-advanced-tab-list button { padding: 10px 14px; border: 0; background: transparent; } .preview-advanced-tab-list .is-active { color: var(--preview-accent); border-bottom: 3px solid var(--preview-accent); } .preview-advanced-tabs > p { padding: 18px 4px 4px; }
      .preview-stats-grid, .preview-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; } .preview-stats-grid article, .preview-testimonials-grid figure { margin: 0; padding: 18px; border: 1px solid var(--preview-border); border-radius: var(--preview-radius); background: var(--preview-card-bg); } .preview-stats-grid strong { display: block; font-size: 2rem; color: var(--preview-accent); } .preview-stats-grid span, .preview-stats-grid small, .preview-testimonials-grid figcaption span { display: block; }
      .preview-timeline { display: grid; } .preview-timeline article { position: relative; display: grid; grid-template-columns: 110px 1fr; gap: 20px; padding: 0 0 28px 22px; border-left: 2px solid var(--preview-border); } .preview-timeline article::before { content: ''; position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: var(--preview-accent); } .preview-timeline h3 { margin-top: 0; }
      .preview-testimonials-grid figure > div { color: #f59e0b; } .preview-testimonials-grid blockquote { margin: 12px 0; } .preview-testimonials-grid figcaption strong, .preview-testimonials-grid figcaption span { display: block; }
      .preview-comparison-wrap { overflow-x: auto; } .preview-comparison-table { width: 100%; border-collapse: collapse; } .preview-comparison-table th, .preview-comparison-table td { padding: 12px; border: 1px solid var(--preview-border); text-align: center; } .preview-comparison-table th { background: color-mix(in srgb, var(--preview-accent) 12%, white); } .preview-comparison-table :is(th, td):first-child { text-align: left; font-weight: 600; }
      .preview-faq-list { display: grid; gap: 10px; } .preview-faq-list details { padding: 14px 16px; border: 1px solid var(--preview-border); border-radius: var(--preview-radius); background: var(--preview-card-bg); } .preview-faq-list summary { cursor: pointer; font-weight: 700; } .preview-faq-list p { margin-top: 10px; }
      .preview-team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; } .preview-team-grid article { text-align: center; } .preview-team-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--preview-radius); } .preview-team-grid h3 { margin: 10px 0 2px; } .preview-team-grid p { color: #64748b; }
      .preview-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: 220px; gap: 10px; } .preview-gallery-grid img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--preview-radius); } .preview-gallery-grid img:first-child { grid-row: span 2; }
      .preview-contact-panel, .preview-split-cta { display: grid; grid-template-columns: 1.1fr .9fr; gap: 28px; padding: 32px; border-radius: var(--preview-radius); background: #0f172a; color: #fff; } .preview-contact-panel h2, .preview-split-cta h2 { color: #fff; } .preview-contact-panel p, .preview-split-cta p { color: #cbd5e1; } .preview-contact-panel address { display: grid; gap: 10px; font-style: normal; } .preview-contact-panel address :is(a, span) { padding: 10px 12px; border: 1px solid #334155; border-radius: 10px; color: #e2e8f0; text-decoration: none; }
      .preview-newsletter { display: grid; grid-template-columns: 1fr auto; gap: 14px 24px; align-items: center; padding: 28px; border-radius: var(--preview-radius); background: color-mix(in srgb, var(--preview-accent) 10%, white); } .preview-newsletter h3 { margin: 0; } .preview-newsletter form { display: flex; } .preview-newsletter input { min-width: 240px; padding: 11px; border: 1px solid var(--preview-border); border-radius: var(--preview-button-radius) 0 0 var(--preview-button-radius); } .preview-newsletter button { padding: 11px 16px; border: 0; border-radius: 0 var(--preview-button-radius) var(--preview-button-radius) 0; background: var(--preview-accent); color: #fff; } .preview-newsletter small { grid-column: 1 / -1; color: #64748b; }
      .preview-split-cta > div > span { color: #93c5fd; font-weight: 700; } .preview-split-cta a { display: inline-block; margin: 12px 8px 0 0; padding: 11px 14px; border-radius: var(--preview-button-radius); background: var(--preview-accent); color: #fff; text-decoration: none; } .preview-split-cta a.is-secondary { border: 1px solid #64748b; background: transparent; }
      .preview-marquee { overflow: hidden; text-align: center; } .preview-marquee > p { color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: .12em; } .preview-marquee > div { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; } .preview-marquee strong { padding: 12px 18px; border: 1px solid var(--preview-border); border-radius: 999px; background: var(--preview-card-bg); }
      .preview-cookie-popup { position: fixed; right: 16px; bottom: 16px; width: min(360px, calc(100vw - 32px)); z-index: 20; }
      .preview-cookie-popup div { display: flex; gap: 10px; margin-top: 12px; }
      .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }
      @media (max-width: 900px) { body { padding: 12px; } .preview-contact-panel, .preview-split-cta, .preview-newsletter { grid-template-columns: 1fr; } .preview-newsletter form { width: 100%; } .preview-newsletter label, .preview-newsletter input { width: 100%; min-width: 0; } }
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

.preview-hero-banner { min-height: 420px; padding: 48px; border-radius: var(--preview-radius); background-size: cover; background-position: center; display: grid; align-items: end; color: #fff; }
.preview-hero-banner div { max-width: 680px; }
.preview-hero-banner h2 { color: #fff; font-size: clamp(2rem, 6vw, 4.5rem); margin: 10px 0; }
.preview-hero-banner p { color: #e2e8f0; }
.preview-hero-banner a { display: inline-block; margin-top: 18px; padding: 12px 18px; border-radius: var(--preview-button-radius); background: var(--preview-accent); color: #fff; text-decoration: none; }
.preview-advanced-tab-list { display: flex; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid var(--preview-border); }
.preview-advanced-tab-list button { padding: 10px 14px; border: 0; background: transparent; cursor: pointer; }
.preview-advanced-tab-list .is-active { color: var(--preview-accent); border-bottom: 3px solid var(--preview-accent); }
.preview-advanced-tabs > p { padding: 18px 4px 4px; }
.preview-stats-grid, .preview-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.preview-stats-grid article, .preview-testimonials-grid figure { margin: 0; padding: 18px; border: 1px solid var(--preview-border); border-radius: var(--preview-radius); background: var(--preview-card-bg); }
.preview-stats-grid strong { display: block; font-size: 2rem; color: var(--preview-accent); }
.preview-stats-grid span, .preview-stats-grid small, .preview-testimonials-grid figcaption span { display: block; }
.preview-timeline { display: grid; }
.preview-timeline article { position: relative; display: grid; grid-template-columns: 110px 1fr; gap: 20px; padding: 0 0 28px 22px; border-left: 2px solid var(--preview-border); }
.preview-timeline article::before { content: ''; position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: var(--preview-accent); }
.preview-timeline h3 { margin-top: 0; }
.preview-testimonials-grid figure > div { color: #f59e0b; }
.preview-testimonials-grid blockquote { margin: 12px 0; }
.preview-testimonials-grid figcaption strong, .preview-testimonials-grid figcaption span { display: block; }
.preview-comparison-wrap { overflow-x: auto; }
.preview-comparison-table { width: 100%; border-collapse: collapse; }
.preview-comparison-table th, .preview-comparison-table td { padding: 12px; border: 1px solid var(--preview-border); text-align: center; }
.preview-comparison-table th { background: color-mix(in srgb, var(--preview-accent) 12%, white); }
.preview-comparison-table :is(th, td):first-child { text-align: left; font-weight: 600; }
.preview-faq-list { display: grid; gap: 10px; }
.preview-faq-list details { padding: 14px 16px; border: 1px solid var(--preview-border); border-radius: var(--preview-radius); background: var(--preview-card-bg); }
.preview-faq-list summary { cursor: pointer; font-weight: 700; }
.preview-faq-list p { margin-top: 10px; }
.preview-team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.preview-team-grid article { text-align: center; }
.preview-team-grid img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--preview-radius); }
.preview-team-grid h3 { margin: 10px 0 2px; }
.preview-team-grid p { color: #64748b; }
.preview-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: 220px; gap: 10px; }
.preview-gallery-grid img { width: 100%; height: 100%; object-fit: cover; border-radius: var(--preview-radius); }
.preview-gallery-grid img:first-child { grid-row: span 2; }
.preview-contact-panel, .preview-split-cta { display: grid; grid-template-columns: 1.1fr .9fr; gap: 28px; padding: 32px; border-radius: var(--preview-radius); background: #0f172a; color: #fff; }
.preview-contact-panel h2, .preview-split-cta h2 { color: #fff; }
.preview-contact-panel p, .preview-split-cta p { color: #cbd5e1; }
.preview-contact-panel address { display: grid; gap: 10px; font-style: normal; }
.preview-contact-panel address :is(a, span) { padding: 10px 12px; border: 1px solid #334155; border-radius: 10px; color: #e2e8f0; text-decoration: none; }
.preview-newsletter { display: grid; grid-template-columns: 1fr auto; gap: 14px 24px; align-items: center; padding: 28px; border-radius: var(--preview-radius); background: color-mix(in srgb, var(--preview-accent) 10%, white); }
.preview-newsletter h3 { margin: 0; }
.preview-newsletter form { display: flex; }
.preview-newsletter input { min-width: 240px; padding: 11px; border: 1px solid var(--preview-border); border-radius: var(--preview-button-radius) 0 0 var(--preview-button-radius); }
.preview-newsletter button { padding: 11px 16px; border: 0; border-radius: 0 var(--preview-button-radius) var(--preview-button-radius) 0; background: var(--preview-accent); color: #fff; }
.preview-newsletter small { grid-column: 1 / -1; color: #64748b; }
.preview-split-cta > div > span { color: #93c5fd; font-weight: 700; }
.preview-split-cta a { display: inline-block; margin: 12px 8px 0 0; padding: 11px 14px; border-radius: var(--preview-button-radius); background: var(--preview-accent); color: #fff; text-decoration: none; }
.preview-split-cta a.is-secondary { border: 1px solid #64748b; background: transparent; }
.preview-marquee { overflow: hidden; text-align: center; }
.preview-marquee > p { color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: .12em; }
.preview-marquee > div { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.preview-marquee strong { padding: 12px 18px; border: 1px solid var(--preview-border); border-radius: 999px; background: var(--preview-card-bg); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); }

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

  .preview-contact-panel,
  .preview-split-cta,
  .preview-newsletter {
    grid-template-columns: 1fr;
  }

  .preview-newsletter form,
  .preview-newsletter label,
  .preview-newsletter input {
    width: 100%;
    min-width: 0;
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

  if (type === 'hero-banner') {
    return (
      <section key={block.id} className="preview-hero-banner" style={{ backgroundImage: 'linear-gradient(120deg, rgba(15, 23, 42, .88), rgba(15, 23, 42, .35)), url("' + props.src + '")' }}>
        <div><span>{props.eyebrow}</span><h2>{props.title}</h2><p>{props.subtitle}</p><a href={props.href}>{props.cta}</a></div>
      </section>
    )
  }

  if (type === 'tabs') {
    const tabs = toList(props.items).map((item) => item.split('|').map((part) => part.trim()))
    const activeIndex = clampNumber(getStateValue('activeIndex', 0), 0, Math.max(0, tabs.length - 1), 0)
    return (
      <div key={block.id} className="preview-advanced-tabs">
        <div className="preview-advanced-tab-list" role="tablist">
          {tabs.map(([label], index) => <button type="button" role="tab" aria-selected={activeIndex === index} className={activeIndex === index ? 'is-active' : ''} onClick={() => onStateChange({ activeIndex: index })} key={label + index}>{label}</button>)}
        </div>
        <p>{tabs[activeIndex]?.[1] ?? ''}</p>
      </div>
    )
  }

  if (type === 'stats-grid') {
    return <div key={block.id} className="preview-stats-grid">{toList(props.items).map((item, index) => { const [value = '', label = '', note = ''] = item.split('|').map((part) => part.trim()); return <article key={index}><strong>{value}</strong><span>{label}</span><small>{note}</small></article> })}</div>
  }

  if (type === 'timeline') {
    return <div key={block.id} className="preview-timeline">{toList(props.items).map((item, index) => { const [date = '', title = '', content = ''] = item.split('|').map((part) => part.trim()); return <article key={index}><span>{date}</span><div><h3>{title}</h3><p>{content}</p></div></article> })}</div>
  }

  if (type === 'testimonials-grid') {
    return <div key={block.id} className="preview-testimonials-grid">{toList(props.items).map((item, index) => { const [text = '', author = '', role = ''] = item.split('|').map((part) => part.trim()); return <figure key={index}><div aria-label="5 hvezdice">★★★★★</div><blockquote>"{text}"</blockquote><figcaption><strong>{author}</strong><span>{role}</span></figcaption></figure> })}</div>
  }

  if (type === 'comparison-table') {
    const headers = toList(props.headers)
    const rows = String(props.rows).split(';').map((row) => row.trim()).filter(Boolean).map((row) => row.split('|').map((cell) => cell.trim()))
    return <div key={block.id} className="preview-comparison-wrap"><table className="preview-comparison-table"><thead><tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
  }

  if (type === 'faq-list') {
    return <div key={block.id} className="preview-faq-list">{toList(props.items).map((item, index) => { const [question = '', answer = ''] = item.split('|').map((part) => part.trim()); return <details key={index} defaultOpen={index === 0 && props.firstOpen}><summary>{question}</summary><p>{answer}</p></details> })}</div>
  }

  if (type === 'team-grid') {
    return <div key={block.id} className="preview-team-grid">{toList(props.items).map((item, index) => { const [name = '', role = '', src = ''] = item.split('|').map((part) => part.trim()); return <article key={index}><img src={src} alt={name} loading="lazy" /><h3>{name}</h3><p>{role}</p></article> })}</div>
  }

  if (type === 'gallery-grid') {
    return <div key={block.id} className="preview-gallery-grid">{toList(props.images).map((src, index) => <img src={src} alt={props.alt + ' ' + (index + 1)} loading="lazy" key={src + index} />)}</div>
  }

  if (type === 'contact-panel') {
    return <section key={block.id} className="preview-contact-panel"><div><span>Kontakt</span><h2>{props.title}</h2><p>{props.text}</p></div><address><a href={'mailto:' + props.email}>{props.email}</a><a href={'tel:' + props.phone}>{props.phone}</a><span>{props.address}</span><span>{props.hours}</span></address></section>
  }

  if (type === 'newsletter') {
    const email = String(getStateValue('email', ''))
    const submitted = Boolean(getStateValue('submitted', false))
    return <section key={block.id} className="preview-newsletter"><div><h3>{props.title}</h3><p>{props.text}</p></div>{submitted ? <strong>Dekujeme za prihlaseni.</strong> : <form onSubmit={(event) => { event.preventDefault(); onStateChange({ submitted: true }) }}><label><span className="sr-only">E-mail</span><input type="email" required placeholder={props.placeholder} value={email} onChange={(event) => onStateChange({ email: event.target.value })} /></label><button type="submit">{props.cta}</button></form>}<small>{props.note}</small></section>
  }

  if (type === 'split-cta') {
    return <section key={block.id} className="preview-split-cta"><div><span>{props.badge}</span><h2>{props.title}</h2></div><div><p>{props.text}</p><div><a href="#">{props.primary}</a><a href="#" className="is-secondary">{props.secondary}</a></div></div></section>
  }

  if (type === 'marquee') {
    return <section key={block.id} className="preview-marquee"><p>{props.label}</p><div>{toList(props.items).map((item, index) => <strong key={item + index}>{item}</strong>)}</div></section>
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
  {
    type: 'hero-banner',
    label: 'Hero Banner Pro',
    category: 'Advanced',
    defaults: { eyebrow: 'Nova generace sluzeb', title: 'Velky hero s obrazkem', subtitle: 'Silny uvodni blok s prekryvem, popisem a vyzvou k akci.', src: 'https://picsum.photos/seed/hero-pro/1400/800', cta: 'Zjistit vice', href: '#' },
  },
  {
    type: 'tabs',
    label: 'Interaktivni Tabs',
    category: 'Advanced',
    defaults: { items: 'Prehled|Vse dulezite na jednom miste., Funkce|Pokrocile funkce bez sloziteho nastavovani., Podpora|Nas tym je pripraven pomoci.' },
  },
  {
    type: 'stats-grid',
    label: 'Stats Grid',
    category: 'Advanced',
    defaults: { items: '98 %|Spokojenych klientu|za posledni rok, 12 let|Zkusenosti|v oboru, 24/7|Dostupnost|online podpora, 480+|Projektu|uspesne dokonceno' },
  },
  {
    type: 'timeline',
    label: 'Timeline',
    category: 'Advanced',
    defaults: { items: '01|Analyza|Pozname vase cile a zakazniky., 02|Navrh|Pripravime reseni a jasny plan., 03|Realizace|Postavime otestujeme a spustime., 04|Rust|Merime vysledky a dale optimalizujeme.' },
  },
  {
    type: 'testimonials-grid',
    label: 'Reference Grid',
    category: 'Advanced',
    defaults: { items: 'Spoluprace predcila nase ocekavani.|Jana Novakova|CEO Acme, Konecne mame web ktery skutecne prodava.|Petr Svoboda|Marketing Director, Rychly profesionalni a lidsky pristup.|Eva Mala|Founder Studio' },
  },
  {
    type: 'comparison-table',
    label: 'Srovnavaci tabulka',
    category: 'Advanced',
    defaults: { headers: 'Funkce, Start, Pro, Business', rows: 'Pocet projektu|3|Neomezene|Neomezene;Analytika|Zakladni|Pokrocila|Pokrocila;Podpora|E-mail|Prioritni|24/7;Cena|Zdarma|990 Kc|Na miru' },
  },
  {
    type: 'faq-list',
    label: 'FAQ Seznam',
    category: 'Advanced',
    defaults: { items: 'Jak rychle muzeme zacit?|Obvykle do peti pracovnich dnu od potvrzeni spoluprace., Je mozne sluzbu kdykoliv zrusit?|Ano bez dlouhodobeho zavazku a skrytych poplatku., Pomuzete nam s nastavenim?|Ano soucasti je onboarding i osobni podpora.', firstOpen: true },
  },
  {
    type: 'team-grid',
    label: 'Team Grid',
    category: 'Advanced',
    defaults: { items: 'Anna Novakova|CEO & Strategie|https://i.pravatar.cc/300?img=47, Martin Dvorak|Design Lead|https://i.pravatar.cc/300?img=12, Eva Kralova|Marketing|https://i.pravatar.cc/300?img=45' },
  },
  {
    type: 'gallery-grid',
    label: 'Gallery Mosaic',
    category: 'Advanced',
    defaults: { images: 'https://picsum.photos/seed/gallery-a/900/700, https://picsum.photos/seed/gallery-b/900/700, https://picsum.photos/seed/gallery-c/900/700, https://picsum.photos/seed/gallery-d/900/700', alt: 'Galerie projektu' },
  },
  {
    type: 'contact-panel',
    label: 'Kontaktni panel',
    category: 'Advanced',
    defaults: { title: 'Spojme se', text: 'Ozvete se nam. Odpovidame obvykle do jednoho pracovniho dne.', address: 'Dlouha 24, Praha 1', email: 'hello@firma.cz', phone: '+420 777 123 456', hours: 'Po-Pa 9:00-17:00' },
  },
  {
    type: 'newsletter',
    label: 'Newsletter Box',
    category: 'Advanced',
    defaults: { title: 'Jednou mesicne to nejlepsi', text: 'Prakticke tipy, nove pripadove studie a zadny spam.', placeholder: 'vas@email.cz', cta: 'Chci novinky', note: 'Odhlaseni je mozne jednim kliknutim.' },
  },
  {
    type: 'split-cta',
    label: 'Split CTA',
    category: 'Advanced',
    defaults: { badge: 'Pripraveni zacit?', title: 'Promenme vas napad v realny vysledek', text: 'Na uvodnim hovoru probereme cil, moznosti i realisticky dalsi krok.', primary: 'Domluvit konzultaci', secondary: 'Prohlednout ukazky' },
  },
  {
    type: 'marquee',
    label: 'Logo Marquee',
    category: 'Advanced',
    defaults: { label: 'Duveruji nam', items: 'ACME, Northstar, Vertex, Greenline, Bright Labs, Orbit, Nova, Peak' },
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
    id: 'advanced-social-proof',
    label: 'Advanced Social Proof',
    description: 'Loga, vysledky a vice referenci v jednom modernim bloku.',
    blocks: [
      { type: 'separator', props: { text: 'Vysledky a duvera' } },
      { type: 'marquee', props: { label: 'Vyuzivaji nas tymy z firem', items: 'Northstar, Vertex, Greenline, Bright Labs, Orbit, Nova, Peak, Acme' } },
      { type: 'stats-grid', props: { items: '98 %|Spokojenych klientu|overene hodnoceni, 480+|Projektu|uspesne dokonceno, 12 let|Zkusenosti|na ceskem trhu, 4.9/5|Prumerne hodnoceni|z 260 recenzi' } },
      { type: 'testimonials-grid', props: { items: 'Dostali jsme jasny plan a vysledky prisly rychleji nez jsme cekali.|Jana Novakova|CEO Northstar, Tym dokazal slozite tema vysvetlit a promenit v jednoduchy produkt.|Petr Svoboda|Product Lead Vertex, Spoluprace byla profesionalni rychla a po celou dobu naprosto transparentni.|Eva Kralova|Founder Greenline' } },
    ],
  },
  {
    id: 'advanced-about-team',
    label: 'Advanced O nas + Tym',
    description: 'Pribeh firmy, proces spoluprace a reprezentativni prehled tymu.',
    blocks: [
      { type: 'separator', props: { text: 'O nas' } },
      { type: 'heading', props: { text: 'Maly tym, velka odpovednost za vysledek' } },
      { type: 'text', props: { text: 'Spojujeme strategii, design a realizaci pod jednou strechou. Kazdy projekt ma konkretniho cloveka, ktery zna jeho kontext a provazi klienta od prvniho setkani az po vyhodnoceni vysledku.' } },
      { type: 'team-grid', props: { items: 'Anna Novakova|CEO & Strategie|https://i.pravatar.cc/300?img=47, Martin Dvorak|Design Lead|https://i.pravatar.cc/300?img=12, Eva Kralova|Marketing|https://i.pravatar.cc/300?img=45, Lukas Vesely|Development|https://i.pravatar.cc/300?img=13' } },
      { type: 'timeline', props: { items: '01|Pozname se|Probereme cil kontext a priority., 02|Navrhneme smer|Dostanete konkretni reseni harmonogram a cenu., 03|Tvorime|Prubezne ukazujeme vysledky a sbirame zpetnou vazbu., 04|Spoustime a merime|Nasazenim spoluprace nekonci sledujeme realny dopad.' } },
    ],
  },
  {
    id: 'advanced-portfolio-contact',
    label: 'Portfolio + Kontakt Pro',
    description: 'Obrazova galerie navazujici na vyrazny kontaktni panel.',
    blocks: [
      { type: 'separator', props: { text: 'Vybrane realizace' } },
      { type: 'heading', props: { text: 'Prace, za kterou je videt konkretni vysledek' } },
      { type: 'gallery-grid', props: { images: 'https://picsum.photos/seed/work-a/900/700, https://picsum.photos/seed/work-b/900/700, https://picsum.photos/seed/work-c/900/700, https://picsum.photos/seed/work-d/900/700', alt: 'Ukazka realizovaneho projektu' } },
      { type: 'contact-panel', props: { title: 'Mate podobny projekt?', text: 'Napiste nebo zavolejte. Do jednoho pracovniho dne se ozveme s navrhem dalsiho kroku.', address: 'Dlouha 24, Praha 1', email: 'hello@studio.cz', phone: '+420 777 123 456', hours: 'Po-Pa 9:00-17:00' } },
    ],
  },
  {
    id: 'advanced-conversion-cta',
    label: 'Conversion CTA Pro',
    description: 'Silna zaverecna vyzva doplnena newsletterovym formularem.',
    blocks: [
      { type: 'split-cta', props: { badge: 'Pripraveni zacit?', title: 'Promenme vas napad v realny vysledek', text: 'Na uvodnim hovoru probereme cil, moznosti a realisticky dalsi krok. Bez natlaku a zbytecnych prezentaci.', primary: 'Domluvit konzultaci', secondary: 'Prohlednout reference' } },
      { type: 'newsletter', props: { title: 'Zatim se jen rozhlizite?', text: 'Jednou mesicne posilame prakticke tipy a nove pripadove studie.', placeholder: 'vas@email.cz', cta: 'Chci novinky', note: 'Zadny spam. Odhlaseni jednim kliknutim.' } },
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
  {
    id: 'full-restaurant',
    label: 'Cely web Restaurace',
    description: 'Kompletni web restaurace: pribeh, menu, reference, rezervace a kontakt.',
    blocks: [
      { type: 'header', props: { brand: 'Bistro Misto', links: 'Menu, Nas pribeh, Galerie, Rezervace, Kontakt', cta: 'Rezervovat stul' } },
      { type: 'badge', props: { text: 'Sezonni kuchyne z lokalnich surovin' } },
      { type: 'heading', props: { text: 'Vecere, na kterou se nezapomina' } },
      { type: 'subheading', props: { text: 'Moderni ceska kuchyne, otevrena kuchyn a pohodova atmosfera v srdci mesta. Kazdy tyden varime nove sezonni menu.' } },
      { type: 'button-group', props: { items: 'Prohlednout menu, Rezervovat stul, Koupit voucher' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/bistro-hero/1200/675' } },
      { type: 'logo-row', props: { items: 'Local Food Guide, Gourmet CZ, City Life, Taste Map, Slow Food' } },
      { type: 'separator', props: { text: 'Proc prijit k nam' } },
      { type: 'card', props: { title: 'Kazdy den cerstve', content: 'Suroviny vybirame rano od overenych farmaru a dodavatelu. Menu proto prirozene sleduje sezonu a chut jednotlivych ingredienci.' } },
      { type: 'card', props: { title: 'Vlastni pecivo', content: 'Kvaskovy chleb, focacciu i sladke pecivo peceme primo u nas. K veceri je podavame s naslehanym maslem a bylinkami.' } },
      { type: 'card', props: { title: 'Vino bez predsudku', content: 'Na karte najdete moravska naturální vina i evropskou klasiku. Radi doporucime sklenku presne podle vaseho jidla.' } },
      { type: 'separator', props: { text: 'Dnesni menu' } },
      { type: 'feature-list', props: { items: 'Predkrm: zauzena repa, kozi syr a orechy, Hlavni chod: kure z farmy, bramborove pyre a tymian, Vegetariansky chod: peceny kvetak, miso a liskove orisky, Dezert: tvaroh, med a sezonni ovoce' } },
      { type: 'limited-offer', props: { title: 'Nedelni brunch', subtitle: 'Kazdou nedeli od 9:00 do 14:00. Domaci pecivo, vejce, sladke chody a neomezena filtrovana kava.', code: 'BRUNCH', cta: 'Rezervovat misto' } },
      { type: 'separator', props: { text: 'Atmosfera a lide' } },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/bistro-1/800/520, https://picsum.photos/seed/bistro-2/800/520, https://picsum.photos/seed/bistro-3/800/520' } },
      { type: 'avatar', props: { name: 'Anna a Marek, majitele bistra', src: 'https://i.pravatar.cc/120?img=47' } },
      { type: 'text', props: { text: 'Bistro vzniklo z touhy vytvorit misto, kam se hoste vraceji nejen kvuli jidlu. Verime v poctive remeslo, lidsky servis a vecery bez spechu. Nas tym tvori kuchari, pekari a cisnici, kteri maji radost z kazdeho detailu.' } },
      { type: 'quote', props: { text: 'Skvele jidlo bez zbytecneho pozlatka. Obsluha zna menu do detailu a pokazde se citime jako doma.', author: 'Klara S., pravidelna hostka' } },
      { type: 'kpi', props: { value: '4,9/5', label: 'Hodnoceni hostu', note: 'z vice nez 680 recenzi' } },
      { type: 'separator', props: { text: 'Rezervace' } },
      { type: 'input', props: { label: 'Jmeno a prijmeni', placeholder: 'Pro koho stul rezervujeme?' } },
      { type: 'input', props: { label: 'Telefon nebo e-mail', placeholder: 'Kam posleme potvrzeni?' } },
      { type: 'select', props: { label: 'Pocet hostu', options: '1 host, 2 hoste, 3 hoste, 4 hoste, 5 a vice hostu' } },
      { type: 'textarea', props: { label: 'Poznamka', placeholder: 'Datum, cas, alergie nebo specialni prani...' } },
      { type: 'checkbox', props: { label: 'Chci dostavat sezonni menu a pozvanky na specialni vecery', checked: false } },
      { type: 'button', props: { text: 'Odeslat rezervaci', href: '#' } },
      { type: 'footer', props: { brand: 'Bistro Misto', note: 'Po-Ne 11:00-23:00 | Dlouha 24, Praha | +420 777 456 123', links: 'Instagram, Darkove vouchery, Ochrana udaju, Kontakt' } },
    ],
  },
  {
    id: 'full-real-estate',
    label: 'Cely web Reality',
    description: 'Dlouha sablona pro maklere nebo realitni kancelar vcetne nabidek a lead formulare.',
    blocks: [
      { type: 'header', props: { brand: 'Domov & Co.', links: 'Nemovitosti, Prodej, Pronajem, O nas, Kontakt', cta: 'Odhad zdarma' } },
      { type: 'badge', props: { text: 'Reality lidsky a bez zbytecnych starosti' } },
      { type: 'heading', props: { text: 'Najdeme misto, kteremu budete rikat domov' } },
      { type: 'subheading', props: { text: 'Provazime kupujici i prodavajici celym procesem. Od prvni prohlidky a realistickeho odhadu az po smlouvy, financovani a predani klicu.' } },
      { type: 'button-group', props: { items: 'Prohlednout nabidky, Chci prodat nemovitost' } },
      { type: 'image', props: { src: 'https://picsum.photos/seed/reality-hero/1200/720', alt: 'Moderni dum v aktualni nabidce' } },
      { type: 'kpi', props: { value: '312', label: 'Prodaných nemovitosti', note: 'od roku 2018' } },
      { type: 'kpi', props: { value: '28 dni', label: 'Prumerna doba prodeje', note: 'pri spravne nastavene cene' } },
      { type: 'kpi', props: { value: '98 %', label: 'Klientu nas doporuci', note: 'podle dotazniku po predani' } },
      { type: 'separator', props: { text: 'Vybrane nemovitosti' } },
      { type: 'card', props: { title: 'Rodinny dum se zahradou | Brno', content: '5+kk, 168 m2, klidna ulice a zahrada orientovana na jih. Energeticky usporny dum pripraveny k nastehovani. Cena 13 490 000 Kc.' } },
      { type: 'card', props: { title: 'Svetly byt v centru | Praha', content: '3+1, 92 m2, puvodni prvky po citlive rekonstrukci, balkon do vnitrobloku a metro pet minut chuze. Cena 11 900 000 Kc.' } },
      { type: 'card', props: { title: 'Chata u lesa | Vysocina', content: 'Kompletne vybavena drevostavba pro celorocni uzivani, sauna, terasa a pozemek 1 140 m2. Cena 5 750 000 Kc.' } },
      { type: 'carousel', props: { images: 'https://picsum.photos/seed/home-1/800/520, https://picsum.photos/seed/home-2/800/520, https://picsum.photos/seed/home-3/800/520' } },
      { type: 'button', props: { text: 'Zobrazit vsechny nemovitosti', href: '#' } },
      { type: 'separator', props: { text: 'Jak probiha prodej' } },
      { type: 'feature-list', props: { items: 'Osobni konzultace a cenova analyza trhu, Profesionalni fotografie video a pudorys, Cilena propagace na realitnich serverech i socialnich sitich, Organizace prohlidek a provereni zajemcu, Pravni servis uschova kupni ceny a bezpecne predani' } },
      { type: 'progress', props: { value: 82, label: '82 % nabidek prodame do 45 dni' } },
      { type: 'separator', props: { text: 'Zkusenosti klientu' } },
      { type: 'quote', props: { text: 'Prodej domu jsme odkladali skoro rok. Tym vse vysvetlil, pripravil a behem mesice nasel vazneho kupce za cenu, kterou jsme chteli.', author: 'Petr a Jana M., Brno' } },
      { type: 'avatar', props: { name: 'Martin Dvorak, seniorni makler', src: 'https://i.pravatar.cc/120?img=12' } },
      { type: 'text', props: { text: 'Kazda nemovitost i zivotni situace je jina. Proto neslibujeme zazraky po telefonu. Nejdrive si nemovitost prohledneme, vyslechneme vase priority a pripravime konkretni plan vcetne cenove strategie a casoveho harmonogramu.' } },
      { type: 'separator', props: { text: 'Nezavazny odhad ceny' } },
      { type: 'input', props: { label: 'Jmeno', placeholder: 'Jak vas mame oslovovat?' } },
      { type: 'input', props: { label: 'E-mail nebo telefon', placeholder: 'Kontakt pro zpetnou vazbu' } },
      { type: 'select', props: { label: 'Typ nemovitosti', options: 'Byt, Rodinny dum, Pozemek, Komercni prostor, Jina nemovitost' } },
      { type: 'textarea', props: { label: 'Zakladni informace', placeholder: 'Lokalita, dispozice, plocha a stav nemovitosti...' } },
      { type: 'checkbox', props: { label: 'Souhlasim se zpracovanim udaju pro pripravu odhadu', checked: true } },
      { type: 'button', props: { text: 'Ziskat odhad zdarma', href: '#' } },
      { type: 'accordion', props: { title: 'Je odhad opravdu zdarma?', content: 'Ano. Uvodni trzni odhad a konzultace jsou bezplatne a bez zavazku. Predem dostanete i navrh dalsiho postupu.', open: false } },
      { type: 'accordion', props: { title: 'Kolik stoji realitni servis?', content: 'Odmena se odviji od typu nemovitosti a rozsahu sluzeb. Vzdy ji domluvime transparentne pred zacatkem spoluprace.', open: false } },
      { type: 'footer', props: { brand: 'Domov & Co.', note: 'Praha | Brno | Olomouc | info@domovco.cz | +420 800 123 456', links: 'Aktualni nabidky, Kariera, Podminky, GDPR' } },
    ],
  },
  {
    id: 'full-wellness',
    label: 'Cely web Wellness',
    description: 'Kompletni prezentace wellness, fitness nebo jogy s programem, cenami a registraci.',
    blocks: [
      { type: 'header', props: { brand: 'Nadech Studio', links: 'Lekce, Lektori, Clenstvi, Retreaty, Kontakt', cta: 'Prvni lekce zdarma' } },
      { type: 'badge', props: { text: 'Pohyb, dech a klid uprostred mesta' } },
      { type: 'heading', props: { text: 'Prostor, kde muzete na chvili zpomalit' } },
      { type: 'subheading', props: { text: 'Male skupiny, zkuseni lektori a lekce pro kazdou uroven. Prijdte si protahnout telo, zklidnit hlavu a vratit energii do bezneho dne.' } },
      { type: 'button-group', props: { items: 'Rezervovat lekci, Zobrazit rozvrh, Poznat studio' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/yoga-hero/1200/675' } },
      { type: 'separator', props: { text: 'Vyberte si svou cestu' } },
      { type: 'card', props: { title: 'Ranni flow', content: 'Dynamicka lekce pro prijemny start dne. Propojuje dech, silu a plynule prechody. Vhodna i pro mirne pokrocile zacatecniky.' } },
      { type: 'card', props: { title: 'Zdrava zada', content: 'Pomale cviceni zamerene na stred tela, mobilitu a uvolneni pretizenych zad. Idealni pro kazdeho, kdo travi hodne casu u pocitace.' } },
      { type: 'card', props: { title: 'Vecerni yin', content: 'Klidna meditativni praxe s delsi vydrzi v pozicich. Pomaha uvolnit napeti, zlepsit spanek a zakončit den bez spechu.' } },
      { type: 'feature-list', props: { items: 'Maximalne 12 lidi na lekci, Vsechny pomucky jsou v cene, Satny sprchy a cajovy bar, Online rezervace bez telefonovani, Lekce v cestine i anglictine' } },
      { type: 'separator', props: { text: 'Clenstvi bez slozitych podminek' } },
      { type: 'pricing-card', props: { plan: 'Jedna navsteva', price: '260 Kc', period: '/ lekce', features: 'Libovolna otevrena lekce, Zapujceni podlozky, Caj po lekci', cta: 'Vybrat lekci' } },
      { type: 'pricing-card', props: { plan: 'Nadech 8', price: '1 690 Kc', period: '/ mesic', features: 'Osm lekci kazdy mesic, Prioritni rezervace, Jedna lekce pro kamarada', cta: 'Zacit clenstvi' } },
      { type: 'pricing-card', props: { plan: 'Bez limitu', price: '2 390 Kc', period: '/ mesic', features: 'Neomezene lekce, Workshopy se slevou, Online videoteka, Rucnik zdarma', cta: 'Chci cvicit naplno' } },
      { type: 'limited-offer', props: { title: 'Prvni tyden za 290 Kc', subtitle: 'Vyzkousejte libovolny pocet lekci a najdete styl, ktery vam sedi.', code: 'PRVNINADECH', cta: 'Aktivovat tyden' } },
      { type: 'separator', props: { text: 'Nasi lektori' } },
      { type: 'avatar', props: { name: 'Michaela Urbanova, vinyasa a zdrava zada', src: 'https://i.pravatar.cc/120?img=45' } },
      { type: 'avatar', props: { name: 'Tomas Kral, dech a meditace', src: 'https://i.pravatar.cc/120?img=11' } },
      { type: 'text', props: { text: 'Nasi lektori pravidelne studuji, sdileji zkusenosti a upravuji praxi podle lidi v sale. Nejde nam o dokonale pozice. Dulezite je, abyste rozumeli svemu telu a odchazeli s pocitem, ze jste pro sebe udelali neco dobreho.' } },
      { type: 'quote', props: { text: 'Po trech mesicich me prestala bolet zada a konecne se tesim na pohyb. Studio je krasne, ale nejvic si vazim osobniho pristupu.', author: 'Lenka P., clenstvi Nadech 8' } },
      { type: 'separator', props: { text: 'Rezervujte prvni lekci' } },
      { type: 'input', props: { label: 'Jmeno', placeholder: 'Vase jmeno' } },
      { type: 'input', props: { label: 'E-mail', placeholder: 'vas@email.cz' } },
      { type: 'select', props: { label: 'Lekce', options: 'Ranni flow, Zdrava zada, Vecerni yin, Dech a meditace, Nejsem si jisty/a' } },
      { type: 'radio-group', props: { label: 'Zkusenosti', options: 'Jdu poprve, Obcas cvicim, Cvicim pravidelne', selected: 'Jdu poprve' } },
      { type: 'checkbox', props: { label: 'Poslete mi take aktualni rozvrh a tipy pro prvni navstevu', checked: true } },
      { type: 'button', props: { text: 'Rezervovat prvni lekci zdarma', href: '#' } },
      { type: 'accordion', props: { title: 'Co si mam vzit s sebou?', content: 'Pohodlne obleceni a lahev s vodou. Podlozky, bloky, deky i dalsi pomucky jsou pripraveny ve studiu.', open: false } },
      { type: 'accordion', props: { title: 'Mohu rezervaci zrusit?', content: 'Ano, bezplatne do sesti hodin pred zacatkem lekce primo ve vasem online profilu.', open: false } },
      { type: 'footer', props: { brand: 'Nadech Studio', note: 'Jungmannova 18, Praha | denne 6:30-21:00 | ahoj@nadechstudio.cz', links: 'Rozvrh, Caste dotazy, Instagram, Podminky' } },
    ],
  },
  {
    id: 'full-online-course',
    label: 'Cely web Online kurz',
    description: 'Prodejni web online kurzu s osnovou, lektorem, referencemi, cenou a FAQ.',
    blocks: [
      { type: 'header', props: { brand: 'Akademie Fokus', links: 'O kurzu, Obsah, Lektor, Reference, FAQ', cta: 'Chci do kurzu' } },
      { type: 'badge', props: { text: 'Prakticky online kurz na 6 tydnu' } },
      { type: 'heading', props: { text: 'Naucte se ridit projekty bez chaosu a nekonecnych porad' } },
      { type: 'subheading', props: { text: 'System pro freelancery a male tymy, ktery premeni nejasne ukoly na srozumitelny plan. Kratka videa, sablony a kazdy tyden ziva konzultace.' } },
      { type: 'button-group', props: { items: 'Prohlednout obsah kurzu, Koupit pristup' } },
      { type: 'video', props: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Ukazka z online kurzu Akademie Fokus' } },
      { type: 'logo-row', props: { items: 'Freelo, CzechCrunch, StartupJobs, Digiskills, Na volne noze' } },
      { type: 'separator', props: { text: 'Pro koho kurz je' } },
      { type: 'card', props: { title: 'Freelanceri', content: 'Mate vice klientu, ukoly na mnoha mistech a casto resite, co hori nejvic. Vytvorite si jednoduchy system od poptavky po odevzdani.' } },
      { type: 'card', props: { title: 'Vedouci malych tymu', content: 'Potrebujete delegovat bez mikromanagementu a mit prehled bez dalsi porady. Nastavite role, priority a rytmus komunikace.' } },
      { type: 'card', props: { title: 'Zacinajici projektaci', content: 'Chcete pevne zaklady bez stovek stran teorie. Kurz vysvetluje postup na realnych situacich a dava hotove pracovni sablony.' } },
      { type: 'alert', props: { text: 'Kurz neni o jedne dokonale aplikaci. Principy pouzijete v Notionu, Trellu, Asane, Freelu i obycejnem dokumentu.' } },
      { type: 'separator', props: { text: 'Co se naucite za 6 tydnu' } },
      { type: 'accordion', props: { title: '1. tyden: Cile a zadani', content: 'Jak prevest napad do vysledku, ktery jde zmerit. Vytvorite projektovy brief, hranice rozsahu a seznam rozhodnuti.', open: true } },
      { type: 'accordion', props: { title: '2. tyden: Plan bez falesne presnosti', content: 'Rozdeleni prace, odhady, zavislosti a milniky. Poznate, kdy plan pomaha a kdy uz jen vytvari pocit kontroly.', open: false } },
      { type: 'accordion', props: { title: '3. tyden: Priority a kapacita', content: 'Jednoduche rozhodovani mezi dulezitym a urgentnim. Nastavite realisticke mnozstvi rozdelane prace.', open: false } },
      { type: 'accordion', props: { title: '4. tyden: Komunikace s klientem a tymem', content: 'Statusy, zapisy, zpetna vazba a neprijemne zpravy bez konfliktu. Dostanete konkretni textove vzory.', open: false } },
      { type: 'accordion', props: { title: '5.-6. tyden: Rizika, retrospektiva a vlastni system', content: 'Vcasne zachyceni problemu, pouceni po projektu a finalni pracovni postup sestaveny podle vasi reality.', open: false } },
      { type: 'feature-list', props: { items: '36 kratkych video lekci, 18 upravitelnych sablon, 6 zivych skupinovych konzultaci, Komunita po dobu tri mesicu, Certifikat o absolvovani, Dozivotni pristup k aktualizacim' } },
      { type: 'progress', props: { value: 74, label: '74 % studentu zavede novy system uz behem kurzu' } },
      { type: 'separator', props: { text: 'Vas lektor' } },
      { type: 'avatar', props: { name: 'David Kolar, projektovy konzultant', src: 'https://i.pravatar.cc/120?img=15' } },
      { type: 'text', props: { text: 'Poslednich dvanact let vedu digitalni projekty pro male firmy i mezinarodni tymy. Kurz vznikl z workshopu, na kterych jsem videl stejne problemy znovu a znovu: nejasne zadani, prilis mnoho priorit a komunikaci roztristenou v peti nastrojich. Ucim pouze postupy, ktere pouzivam ve vlastni praci.' } },
      { type: 'separator', props: { text: 'Co rikaji absolventi' } },
      { type: 'quote', props: { text: 'Po druhem tydnu jsme zrusili polovinu status meetingu. Klienti maji lepsi prehled a ja poprve po dlouhe dobe nekoncim kazdy den s pocitem, ze jsem na neco zapomnela.', author: 'Barbora H., kreativni studio' } },
      { type: 'quote', props: { text: 'Nejcennejsi byly konkretni sablony a ziva zpetna vazba. Nas projektovy plan je ted kratsi, ale tym mu konecne rozumi.', author: 'Ondrej K., SaaS startup' } },
      { type: 'separator', props: { text: 'Vyberte si pristup' } },
      { type: 'pricing-card', props: { plan: 'Samostudium', price: '4 490 Kc', period: 'jednorazove', features: 'Vsechny video lekce, Sablony a checklisty, Dozivotni aktualizace', cta: 'Koupit samostudium' } },
      { type: 'pricing-card', props: { plan: 'Kompletni program', price: '7 990 Kc', period: 'jednorazove', features: 'Vse ze samostudia, Sest zivych konzultaci, Zpetna vazba na vas system, Trimesicni komunita', cta: 'Vstoupit do programu' } },
      { type: 'countdown', props: { label: 'Registrace aktualniho behu konci za', days: 4, hours: 18, minutes: 30 } },
      { type: 'input', props: { label: 'E-mail pro ukazkovou lekci zdarma', placeholder: 'vas@email.cz' } },
      { type: 'button', props: { text: 'Poslat ukazkovou lekci', href: '#' } },
      { type: 'accordion', props: { title: 'Kolik casu kurz zabere?', content: 'Pocitejte se dvema az tremi hodinami tydne vcetne praktickeho ukolu. Lekce si muzete pustit kdykoliv.', open: false } },
      { type: 'accordion', props: { title: 'Co kdyz kurz nebude pro me?', content: 'Do 14 dnu od nakupu muzete pozadat o vraceni penez. Staci napsat e-mail, bez sloziteho vysvetlovani.', open: false } },
      { type: 'footer', props: { brand: 'Akademie Fokus', note: 'Prakticke vzdelavani pro klidnejsi praci | podpora@akademiefokus.cz', links: 'Obchodni podminky, Ochrana udaju, Kontakt, LinkedIn' } },
    ],
  },
  {
    id: 'full-clinic',
    label: 'Cely web Klinika',
    description: 'Profesionalni web kliniky nebo ordinace se sluzbami, tymem, cenikem a objednanim.',
    blocks: [
      { type: 'header', props: { brand: 'Vita Klinika', links: 'Pece, Lekari, Cenik, Pro pacienty, Kontakt', cta: 'Objednat termin' } },
      { type: 'badge', props: { text: 'Komplexni pece pro dospele i deti' } },
      { type: 'heading', props: { text: 'Medicina, ktera ma cas naslouchat' } },
      { type: 'subheading', props: { text: 'Spojujeme prakticke lekare, fyzioterapii a prevenci pod jednou strechou. Srozumitelne vysvetlujeme moznosti a hledame reseni, ktere odpovida vasemu zdravi i zivotu.' } },
      { type: 'button-group', props: { items: 'Objednat vysetreni, Zavolat na recepci, Pece pro nove pacienty' } },
      { type: 'alert', props: { text: 'Akutni potize? V pracovni dny volejte recepci od 7:00. Pri ohrozeni zivota volejte linku 155.' } },
      { type: 'aspect-ratio', props: { ratio: '16/9', src: 'https://picsum.photos/seed/clinic-hero/1200/675' } },
      { type: 'separator', props: { text: 'Pece na jednom miste' } },
      { type: 'card', props: { title: 'Prakticke lekarstvi', content: 'Preventivni prohlidky, diagnostika beznych potizi, dlouhodoba pece o chronicka onemocneni a koordinace navazujicich vysetreni.' } },
      { type: 'card', props: { title: 'Fyzioterapie', content: 'Individualni terapie bolesti zad a kloubu, pece po operacich i navrat ke sportu. Kazda navsteva zacina podrobnym vysetrenim pohybu.' } },
      { type: 'card', props: { title: 'Preventivni programy', content: 'Rozsirene krevni testy, vysetreni srdce, konzultace zivotniho stylu a osobni plan prevence podle veku a rodinne anamnezy.' } },
      { type: 'feature-list', props: { items: 'Objednani na konkretni cas, Vysledky v zabezpecenem portalu, Navazujici specialisté bez zbytecneho cekani, Bezbariérovy pristup, Pece v cestine a anglictine' } },
      { type: 'separator', props: { text: 'Nas tym' } },
      { type: 'avatar', props: { name: 'MUDr. Petra Mala, prakticka lekarka', src: 'https://i.pravatar.cc/120?img=44' } },
      { type: 'avatar', props: { name: 'Mgr. Lukas Vesely, fyzioterapeut', src: 'https://i.pravatar.cc/120?img=13' } },
      { type: 'avatar', props: { name: 'MUDr. Hana Jelinkova, interna a prevence', src: 'https://i.pravatar.cc/120?img=49' } },
      { type: 'text', props: { text: 'Lekari a terapeuti se pravidelne potkavaji nad slozitejsimi pripady, aby pece nebyla rozdelena mezi jednotlive ordinace. Vzdy vite, kdo vasim pripadem provazi a na koho se muzete obratit s dalsi otazkou.' } },
      { type: 'quote', props: { text: 'Poprve jsem nemela pocit, ze musim vse stihnout rict za dve minuty. Pani doktorka mi vysledky vysvetlila a spolecne jsme nastavily dalsi kroky.', author: 'Jana R., pacientka preventivniho programu' } },
      { type: 'separator', props: { text: 'Orientacni cenik' } },
      { type: 'pricing-card', props: { plan: 'Komplexni prevence', price: '3 900 Kc', period: '/ program', features: 'Vstupni rozhovor, Rozsirene laboratorni testy, EKG a zakladni screening, Zaverecna konzultace', cta: 'Objednat program' } },
      { type: 'pricing-card', props: { plan: 'Fyzioterapie', price: '1 200 Kc', period: '/ 55 minut', features: 'Vstupni vysetreni pohybu, Individualni terapie, Domaci cviceni v aplikaci', cta: 'Najit termin' } },
      { type: 'text', props: { text: 'Bezna pece praktickeho lekare je pro registrovane pacienty hrazena ze zdravotniho pojisteni. Pred kazdym nehrazenym vykonem vas informujeme o cene a dostupnych alternativach.' } },
      { type: 'separator', props: { text: 'Objednani' } },
      { type: 'input', props: { label: 'Jmeno a prijmeni', placeholder: 'Vase jmeno' } },
      { type: 'input', props: { label: 'Telefon', placeholder: '+420 000 000 000' } },
      { type: 'select', props: { label: 'Pozadovana pece', options: 'Prakticky lekar, Preventivni program, Fyzioterapie, Konzultace vysledku, Nevim - poradte mi' } },
      { type: 'textarea', props: { label: 'Strucny duvod navstevy', placeholder: 'Popiste potize nebo pozadavek bez citlivych osobnich udaju...' } },
      { type: 'checkbox', props: { label: 'Souhlasim, aby me recepce kontaktovala kvuli domluveni terminu', checked: true } },
      { type: 'button', props: { text: 'Pozadat o termin', href: '#' } },
      { type: 'accordion', props: { title: 'Prijimate nove pacienty?', content: 'Kapacita se meni podle konkretni ordinace. Vyplnte formular a recepce vam do jednoho pracovniho dne potvrdi aktualni moznosti.', open: false } },
      { type: 'accordion', props: { title: 'Kde najdu vysledky vysetreni?', content: 'Vysledky zverejnujeme v zabezpecenem pacientskem portalu. Pokud vyzaduji vysvetleni, rovnou navrhneme termin konzultace.', open: false } },
      { type: 'footer', props: { brand: 'Vita Klinika', note: 'Karlovo namesti 8, Praha | Po-Pa 7:00-19:00 | recepce@vitaklinika.cz', links: 'Pacientsky portal, Pojistovny, Dokumenty, Ochrana udaju' } },
    ],
  },
]

const PREMADE_WEBS = PREMADE_SECTIONS.filter(
  (section) => section.id.startsWith('boilerplate-') || section.id.startsWith('full-'),
)

const PREMADE_BLOCKS = PREMADE_SECTIONS.filter(
  (section) => !section.id.startsWith('boilerplate-') && !section.id.startsWith('full-'),
)

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

  if (type === 'hero-banner') {
    return (
      <section
        key={block.id}
        className="preview-hero-banner"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, .88), rgba(15, 23, 42, .35)), url("${props.src}")` }}
      >
        <div>
          <span>{props.eyebrow}</span>
          <h2>{props.title}</h2>
          <p>{props.subtitle}</p>
          <a href={props.href}>{props.cta}</a>
        </div>
      </section>
    )
  }

  if (type === 'tabs') {
    const tabs = toList(props.items).map((item) => item.split('|').map((part) => part.trim()))
    const activeIndex = clampNumber(getStateValue('activeIndex', 0), 0, Math.max(0, tabs.length - 1), 0)
    return (
      <div key={block.id} className="preview-advanced-tabs">
        <div className="preview-advanced-tab-list" role="tablist">
          {tabs.map(([label], index) => (
            <button type="button" role="tab" aria-selected={activeIndex === index} className={activeIndex === index ? 'is-active' : ''} onClick={() => onStateChange({ activeIndex: index })} key={`${label}-${index}`}>
              {label}
            </button>
          ))}
        </div>
        <p>{tabs[activeIndex]?.[1] ?? ''}</p>
      </div>
    )
  }

  if (type === 'stats-grid') {
    return (
      <div key={block.id} className="preview-stats-grid">
        {toList(props.items).map((item, index) => {
          const [value = '', label = '', note = ''] = item.split('|').map((part) => part.trim())
          return <article key={index}><strong>{value}</strong><span>{label}</span><small>{note}</small></article>
        })}
      </div>
    )
  }

  if (type === 'timeline') {
    return (
      <div key={block.id} className="preview-timeline">
        {toList(props.items).map((item, index) => {
          const [date = '', title = '', content = ''] = item.split('|').map((part) => part.trim())
          return <article key={index}><span>{date}</span><div><h3>{title}</h3><p>{content}</p></div></article>
        })}
      </div>
    )
  }

  if (type === 'testimonials-grid') {
    return (
      <div key={block.id} className="preview-testimonials-grid">
        {toList(props.items).map((item, index) => {
          const [text = '', author = '', role = ''] = item.split('|').map((part) => part.trim())
          return <figure key={index}><div aria-label="5 hvezdice">★★★★★</div><blockquote>&quot;{text}&quot;</blockquote><figcaption><strong>{author}</strong><span>{role}</span></figcaption></figure>
        })}
      </div>
    )
  }

  if (type === 'comparison-table') {
    const headers = toList(props.headers)
    const rows = String(props.rows).split(';').map((row) => row.trim()).filter(Boolean).map((row) => row.split('|').map((cell) => cell.trim()))
    return (
      <div key={block.id} className="preview-comparison-wrap">
        <table className="preview-comparison-table"><thead><tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>
      </div>
    )
  }

  if (type === 'faq-list') {
    return (
      <div key={block.id} className="preview-faq-list">
        {toList(props.items).map((item, index) => {
          const [question = '', answer = ''] = item.split('|').map((part) => part.trim())
          return <details key={index} defaultOpen={index === 0 && props.firstOpen}><summary>{question}</summary><p>{answer}</p></details>
        })}
      </div>
    )
  }

  if (type === 'team-grid') {
    return <div key={block.id} className="preview-team-grid">{toList(props.items).map((item, index) => { const [name = '', role = '', src = ''] = item.split('|').map((part) => part.trim()); return <article key={index}><img src={src} alt={name} loading="lazy" /><h3>{name}</h3><p>{role}</p></article> })}</div>
  }

  if (type === 'gallery-grid') {
    return <div key={block.id} className="preview-gallery-grid">{toList(props.images).map((src, index) => <img src={src} alt={`${props.alt} ${index + 1}`} loading="lazy" key={`${src}-${index}`} />)}</div>
  }

  if (type === 'contact-panel') {
    return <section key={block.id} className="preview-contact-panel"><div><span>Kontakt</span><h2>{props.title}</h2><p>{props.text}</p></div><address><a href={`mailto:${props.email}`}>{props.email}</a><a href={`tel:${props.phone}`}>{props.phone}</a><span>{props.address}</span><span>{props.hours}</span></address></section>
  }

  if (type === 'newsletter') {
    const email = String(getStateValue('email', ''))
    const submitted = Boolean(getStateValue('submitted', false))
    return <section key={block.id} className="preview-newsletter"><div><h3>{props.title}</h3><p>{props.text}</p></div>{submitted ? <strong>Dekujeme za prihlaseni.</strong> : <form onSubmit={(event) => { event.preventDefault(); onStateChange({ submitted: true }) }}><label><span className="sr-only">E-mail</span><input type="email" required placeholder={props.placeholder} value={email} onChange={(event) => onStateChange({ email: event.target.value })} /></label><button type="submit">{props.cta}</button></form>}<small>{props.note}</small></section>
  }

  if (type === 'split-cta') {
    return <section key={block.id} className="preview-split-cta"><div><span>{props.badge}</span><h2>{props.title}</h2></div><div><p>{props.text}</p><div><a href="#">{props.primary}</a><a href="#" className="is-secondary">{props.secondary}</a></div></div></section>
  }

  if (type === 'marquee') {
    return <section key={block.id} className="preview-marquee"><p>{props.label}</p><div>{toList(props.items).map((item, index) => <strong key={`${item}-${index}`}>{item}</strong>)}</div></section>
  }

  if (type === 'countdown') {
    const days = clampNumber(props.days, 0, 365, 0)
    const hours = clampNumber(props.hours, 0, 23, 0)
    const minutes = clampNumber(props.minutes, 0, 59, 0)
    return <div key={block.id} className="preview-countdown"><p>{props.label}</p><div><span><strong>{days}</strong><small>dnu</small></span><span><strong>{hours}</strong><small>hod</small></span><span><strong>{minutes}</strong><small>min</small></span></div></div>
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

  if (type === 'hero-banner') {
    return (
      <>
        <input type="text" value={props.eyebrow} onChange={(event) => onChange('eyebrow', event.target.value)} placeholder="Eyebrow" />
        <input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" />
        <textarea value={props.subtitle} onChange={(event) => onChange('subtitle', event.target.value)} rows={3} placeholder="Podnadpis" />
        <input type="text" value={props.src} onChange={(event) => onChange('src', event.target.value)} placeholder="Background image URL" />
        <input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="CTA text" />
        <input type="text" value={props.href} onChange={(event) => onChange('href', event.target.value)} placeholder="CTA odkaz" />
      </>
    )
  }

  if (type === 'tabs' || type === 'stats-grid' || type === 'timeline' || type === 'testimonials-grid' || type === 'team-grid') {
    return <textarea value={props.items} onChange={(event) => onChange('items', event.target.value)} rows={5} placeholder="Polozky oddel carkou, casti polozky znakem |" />
  }

  if (type === 'comparison-table') {
    return <><input type="text" value={props.headers} onChange={(event) => onChange('headers', event.target.value)} placeholder="Hlavicky oddelene carkou" /><textarea value={props.rows} onChange={(event) => onChange('rows', event.target.value)} rows={5} placeholder="Bunky oddel | a radky strednikem" /></>
  }

  if (type === 'faq-list') {
    return <><textarea value={props.items} onChange={(event) => onChange('items', event.target.value)} rows={5} placeholder="Otazka|Odpoved, Otazka|Odpoved" /><label className="tiny-check"><input type="checkbox" checked={props.firstOpen} onChange={(event) => onChange('firstOpen', event.target.checked)} /><span>Prvni odpoved otevrena</span></label></>
  }

  if (type === 'gallery-grid') {
    return <><textarea value={props.images} onChange={(event) => onChange('images', event.target.value)} rows={4} placeholder="URL obrazku oddelene carkou" /><input type="text" value={props.alt} onChange={(event) => onChange('alt', event.target.value)} placeholder="Alternativni popis" /></>
  }

  if (type === 'contact-panel') {
    return <><input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" /><textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} /><input type="text" value={props.address} onChange={(event) => onChange('address', event.target.value)} placeholder="Adresa" /><input type="email" value={props.email} onChange={(event) => onChange('email', event.target.value)} placeholder="E-mail" /><input type="text" value={props.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="Telefon" /><input type="text" value={props.hours} onChange={(event) => onChange('hours', event.target.value)} placeholder="Oteviraci doba" /></>
  }

  if (type === 'newsletter') {
    return <><input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" /><textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={2} /><input type="text" value={props.placeholder} onChange={(event) => onChange('placeholder', event.target.value)} placeholder="Placeholder e-mailu" /><input type="text" value={props.cta} onChange={(event) => onChange('cta', event.target.value)} placeholder="Tlacitko" /><input type="text" value={props.note} onChange={(event) => onChange('note', event.target.value)} placeholder="Poznamka" /></>
  }

  if (type === 'split-cta') {
    return <><input type="text" value={props.badge} onChange={(event) => onChange('badge', event.target.value)} placeholder="Badge" /><input type="text" value={props.title} onChange={(event) => onChange('title', event.target.value)} placeholder="Nadpis" /><textarea value={props.text} onChange={(event) => onChange('text', event.target.value)} rows={3} /><input type="text" value={props.primary} onChange={(event) => onChange('primary', event.target.value)} placeholder="Primarni CTA" /><input type="text" value={props.secondary} onChange={(event) => onChange('secondary', event.target.value)} placeholder="Sekundarni CTA" /></>
  }

  if (type === 'marquee') {
    return <><input type="text" value={props.label} onChange={(event) => onChange('label', event.target.value)} placeholder="Popisek" /><textarea value={props.items} onChange={(event) => onChange('items', event.target.value)} rows={3} placeholder="Nazvy oddelene carkou" /></>
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
          <div className="component-list">
            {PREMADE_BLOCKS.map((section) => (
              <button
                key={section.id}
                type="button"
                className="component-item"
                onClick={() => addPremadeSection(section.id)}
              >
                <span>{section.label}</span>
                <small>{section.description}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="premade-picker">
          <p className="panel-muted">Premade web</p>
          <div className="component-list">
            {PREMADE_WEBS.map((section) => (
              <button
                key={section.id}
                type="button"
                className="component-item"
                onClick={() => addPremadeSection(section.id)}
              >
                <span>{section.label}</span>
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
