# Lily Design System™ - Angular Examples

A reference application demonstrating every component in the Lily Design System using headless Angular components (copied from `lily-design-system-angular-headless`) plus the NHS UK visual reference styling.

Built on **Angular 20 + Analog.js v1** with file-based routing, signal-driven state, OnPush change detection, and full SSG prerendering.

## Sibling apps

- [HTML CSS JS examples](../lily-design-system-html-css-js-examples)
- [Svelte SvelteKit examples](../lily-design-system-svelte-sveltekit-examples)
- [React Next.js examples](../lily-design-system-react-next-examples)
- [Vue Nuxt.js examples](../lily-design-system-vue-nuxt-examples)
- [Blazor Web examples](../lily-design-system-blazor-web-examples)
- [Nunjucks Eleventy examples](../lily-design-system-nunjucks-eleventy-examples)

## Quick start

```sh
pnpm install
pnpm dev        # Vite dev server (Analog) on http://localhost:5173
pnpm build      # SSG output → dist/analog/public/
pnpm start      # Serve dist/analog/public/ on http://localhost:4173
pnpm test:e2e   # Playwright accessibility + responsive specs
```

## Required routes

- `/` — home page linking to every composed-page demo plus the components catalog
- `/components` — searchable index of all 490 components
- `/components/[slug]` — per-component detail page rendering the headless library's HTML output via `[innerHTML]` + `DomSanitizer`
- 12 composed pages (`/contact-form`, `/dashboard`, …, `/timeline-and-cards`)

## Status

Initial scaffold. Infrastructure (package.json, vite + Analog config, tsconfig, app shell, file-based pages) and all required routes are in place. `pnpm install` + `pnpm dev` end-to-end verification deferred.

---

Lily™ and Lily Design System™ are trademarks.
