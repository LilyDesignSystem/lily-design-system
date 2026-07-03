# Lily Design System - Angular Examples

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/examples.md
@AGENTS/theme.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- Package: lily-design-system-angular-examples
- Version: 0.1.0
- Created: 2026-05-28
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT architecture

- Angular 20 + Analog.js v1
- File-based routing under `src/app/pages/`
- Signal-driven, zoneless change detection
- Standalone components only (no NgModules)
- Headless components copied into `src/app/components/` (same copy-pattern the other 6 example apps use; no workspace dep)
- Vite-based dev + build, SSG prerender for every catalog + composed route
- NHS UK CSS via single global `src/styles/nhs.css`
- Playwright + axe-core e2e (same pattern as the other 6 example apps)

## STRICT prohibitions

- No NgModules (standalone components only)
- No CSS framework dependency (Tailwind, DaisyUI, Bootstrap)
- No bundled fonts, icons, or images
- No hardcoded user-facing strings in components (the demo strings here ARE the content; the headless components themselves take strings as props)

## Required routes (per `AGENTS/examples.md`)

- `/` — home; links to all composed-page demos and the catalog
- `/components` — searchable / filterable index of all 490 components
- `/components/[slug]` — per-component detail page rendering the demo HTML

Composed-page demos:

- `/contact-form` — Form + Field + TextInput + EmailInput + TextAreaInput + Button
- `/dashboard` — Card, Badge, Progress, Banner
- `/dialog-flow` — Dialog + Button
- `/file-upload-form` — FileInput + Button
- `/navigation-and-menus` — NavigationMenu + MenuBar + HamburgerMenu
- `/page-layout` — Header, Footer, BreadcrumbNav, Sidebar, Panel
- `/rating-and-feedback` — FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker
- `/search-and-filter` — SearchInput + Combobox + TagGroup + Badge
- `/settings-page` — Fieldset, SwitchButton, RadioGroup, Select
- `/tabbed-interface` — TabBar + TabBarButton + TabPanel
- `/task-management` — TaskList + TaskListItem + Badge
- `/timeline-and-cards` — TimelineList + Card + DateRange + ReviewDate

## File layout

```
src/
  app/
    app.ts                  — root standalone component (skip link, header, router-outlet, footer)
    app.config.ts           — provideFileRouter() + zoneless change detection
    component-demos.ts      — slug → demo HTML registry (copied from svelte-sveltekit-examples)
    pages/
      index.page.ts                  — /
      components/
        index.page.ts                — /components
        [slug].page.ts               — /components/:slug
      contact-form.page.ts           — /contact-form
      dashboard.page.ts              — /dashboard
      …                              — (12 composed pages total)
  styles/
    nhs.css                 — NHS UK token + class styles
  main.ts                   — bootstrapApplication
e2e/
  accessibility.spec.ts     — axe-core sweep across 29 routes
  responsive.spec.ts        — 4-viewport × 10-route smoke
playwright.config.ts        — runs `pnpm build && pnpm start` (port 4173)
package.json
tsconfig.json
vite.config.ts              — Analog plugin + prerender route list
```

## Component-demo rendering

Each `/components/[slug]` page reads the demo HTML string from
`component-demos.ts` (a `Record<string, string>` registry covering all
490 slugs) and renders it via `[innerHTML]` after `DomSanitizer`
`bypassSecurityTrustHtml`. This matches how the svelte-sveltekit /
react-next / vue-nuxt apps render demos via `{@html}` /
`dangerouslySetInnerHTML` / `v-html`.

## Build

`pnpm build` writes the SSG output to `dist/analog/public/`. The
Playwright config runs `pnpm build && pnpm start` (http-server on port
4173) so e2e tests hit the production-shaped static output.

## Internationalization

- All headless components take text as props; no strings are baked in.
- Demo strings in this example app are concrete English copy.
- Consumer apps porting to another locale swap the prop values.
