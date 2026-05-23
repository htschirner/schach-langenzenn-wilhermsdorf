# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static website for the German chess club association SG Langenzenn/Wilhermsdorf, built with Astro 6 and deployed to GitHub Pages.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Build to dist/
npm run preview   # Preview built site locally
```

No tests, no linter configured.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which runs `npm ci && astro build` and deploys to GitHub Pages. The site is served under the base path `/schach-langenzenn-wilhermsdorf`, configured in `astro.config.mjs`.

## Architecture

### Layouts vs Pages

Two layouts in `src/layouts/`:
- `MainLayout.astro` — two-column layout (main content + sidebar widgets) used only by the homepage
- `SubLayout.astro` — single-column layout with a back-navigation link, used by all sub-pages

All pages live in `src/pages/` as `.astro` files. The homepage (`index.astro`) is the most complex: it imports `termine.ts` to display upcoming events and wires up the burger-menu toggle script.

### Event Data Flow

`termine.csv` at the repo root stores upcoming chess events (columns: `datum DD.MM.YYYY`, `titel`, `ort`, `linkUrl`, `linkText`). `src/lib/termine.ts` reads and parses this file at build time, filters out past events, sorts by date, and exports a `Termin[]` array. The homepage imports this and renders the schedule table.

To add or update events, edit `termine.csv` directly.

### Styling

All styles are in `src/styles/global.css` (imported by both layouts). Design tokens are CSS custom properties on `:root`:
- `--accent` (#2a5c8a, chess-club blue)
- `--gold` (highlight color)
- `--bg` (beige background)
- Fonts: Lora (headings) and Source Sans 3 (body) via Google Fonts

Responsive layout uses a burger-menu pattern for mobile; the toggle logic is an inline `<script>` in the layouts.

### Email Obfuscation

Contact emails are split across inline `<script>` tags (string concatenation) to prevent scraper harvesting. When adding new email links, follow the same pattern rather than writing plain `mailto:` links.

### No i18n Framework

The site is entirely in German — hardcoded strings, no translation layer.
