---
name: lily-design-system-solid-skill
description: Explains what's available for Solid 2.0 in Lily Design System and which of the three layers to reach for — the headless component library, the 21 helper packages, or the example app — and covers the example app itself (a Vite single-page app on Solid Router 2.0). Use when someone asks what Solid support Lily Design System has, which Solid package they need, wants to see Lily's components styled and running in Solid, or asks about the Solid example app's routes or setup.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Solid

Three Solid 2.0 layers exist in this monorepo. This skill maps them and covers the example app; two sibling skills go
deep on the first two.

| Subproject                                                                   | What it is                                                                                                   | Reach for it when                                                                  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [`@lilydesignsystem/solid-headless`](../lily-design-system-solid-headless/)  | An npm package: the 637-component headless catalog as Solid 2.0 components. No CSS.                          | You are building your own app and want the library you install and depend on.      |
| [the Solid helper packages](../spec/helpers/index.md)                        | 21 npm packages, `@lilydesignsystem/solid-*`: the pickers, `picker-bar`, editors, filter, grid-like helpers. | You need a ready-made control that owns a whole interaction.                       |
| [`lily-design-system-solid-examples`](../lily-design-system-solid-examples/) | A Vite single-page app on Solid Router 2.0: every component with a live demo, styled. Not a package.         | You want to see a component working, copy its CSS, or start from a working setup. |

## Deep-dive skills

- [`lily-design-system-solid-headless-skill`](../lily-design-system-solid-headless-skill/): install, the two builds,
  `class` and rest props, controlled props with signals, form reset.
- [`lily-design-system-solid-helpers-skill`](../lily-design-system-solid-helpers-skill/): the helper packages, their
  props, render-prop icons, server rendering and label packs.

## The example app: `lily-design-system-solid-examples`

- **Stack**: Solid 2.0 with `@solidjs/vite-plugin` and Solid Router 2.0 (`createRouter` with route config objects;
  links are plain `<a href>` elements the router intercepts). SolidStart is retired for Solid 2.0, so it is a
  single-page app: a static host must answer every route with `index.html`.
- **Packages**: the published `@lilydesignsystem/solid-headless` (the skip link) and the theme, locale and text-size
  pickers in the header, installed from npm as an adopter would.
- **Routes**: `/`, `/components` (searchable, with category and suffix-pattern filters) and `/components/{slug}` (the
  live demo, its markup, more examples, details, a usage example and the import line). The React app's composed pages
  are not ported yet.
- **Data**: generated (`bin/generate-registries`, `bin/generate-examples`); the themes are copied by `bin/sync`. The
  theme is applied before first paint by a script in `index.html`.
- **Running it**: `pnpm install`, `pnpm dev`; `pnpm build` and `pnpm preview` for production; `pnpm test:e2e` runs the
  Playwright specs (catalog search, axe, the responsive sweep) in Chromium, Firefox and WebKit.

## Solid-wide conventions

- Solid 2.0 only (`solid-js` and `@solidjs/web` `^2.0.0`); `class`, not `className`; rest props spread on the root.
- No hardcoded user-facing strings: every label is a prop.
- Every package ships a `solid` export condition (JSX source) and a compiled bundle.

For framework-agnostic Lily concepts, use [`lily-design-system-skill`](../lily-design-system-skill/).
