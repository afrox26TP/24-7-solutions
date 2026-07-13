# 247solutions

Landing page builder with live preview, premade templates, and per-component style inspector.

## Features

- Studio editor with premade sections and component inspector.
- Live preview subpage at `/preview` (auto-sync from Studio).
- Export current page as functional static source (`landing-page-export.html`).
- Export current page as full React/Vite project zip (`landing-page-react-project.zip`).

## Quick Start

- `npm install`
- `npm run dev`

## Build

- `npm run build`

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback for all routes is configured in `public/_redirects`.
- Wrangler Pages config is in `wrangler.toml`.
