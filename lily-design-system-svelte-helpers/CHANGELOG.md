# Changelog — Lily Design System Svelte Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release. This is the **canonical reference catalog** for
Lily's framework-helper layer. The parallel Vue, React, Angular,
Blazor, Nunjucks, and HTML catalogs port from here; when contracts
disagree, the Svelte side wins and the others are patched.

### Added

- `lily-design-system-svelte-theme-select` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, managed `<link>`-based
  stylesheet injection, `localStorage` persistence, and a `children`
  snippet for custom rendering. 13 acceptance criteria covered.
- `lily-design-system-svelte-locale-select` v0.1.0 — BCP 47 locale
  select that writes `lang` and `dir` on the document root, with
  optional `localStorage` persistence and `navigator.languages`
  detection. Built-in 436-row locale-name table, RTL detection set,
  and lossless underscore-vs-hyphen round-tripping. 23 acceptance
  criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories. Theme select ships a runnable SvelteKit cookie
  example under `examples/sveltekit-cookie/`.

### Conventions established

- **Svelte 5 runes only.** `$props()`, `$bindable()`, `$state()`,
  `$effect()`. No Svelte 4 syntax anywhere.
- **TypeScript** on the public surface — `Props` and `ChildArgs`
  exported from a `<script lang="ts" module>` block.
- **Two-way binding** via `bind:value` on a `$bindable("")` prop.
- **Custom rendering** via a `children?: Snippet<[ChildArgs]>` prop
  rendered with `{@render children(args)}`.
- **Rest-prop spread** on the root element so consumers can pass
  `id`, `data-*`, `aria-*`, and event handlers without the component
  blocking them.
- **No `<style>` blocks** — zero CSS shipped from the helper layer.
- **SSR-safe** — all DOM writes inside `$effect`, never at the top
  level of the instance `<script>`.
- **Tests** under vitest + jsdom + `@testing-library/svelte`. One
  `it(...)` per numbered `spec/index.md` §7 acceptance criterion.

### Why Svelte is canonical

The selects were written first in Svelte 5 because the runes-based
reactivity model maps cleanly to every other framework's pattern:

- `$bindable` ↔ Vue `v-model:value` ↔ React `value`+`onChange` ↔
  Angular `[(value)]`.
- `Snippet<[Args]>` ↔ Vue scoped slot ↔ React render prop ↔ Angular
  `*ngTemplateOutlet`.
- `$effect` ↔ Vue `onMounted`+`watch` ↔ React `useEffect` ↔ Angular
  `effect()`.
- `$props()` ↔ Vue `defineProps` ↔ React function parameter ↔
  Angular `@Input`.

Locking the contract in Svelte first kept the port translations
mechanical.

### Differences carried into the ports

| Concept                 | Svelte canonical                       | Vue / React / Angular port                                  |
| ----------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Two-way binding         | `bind:value`                           | `v-model:value` / `value`+`onChange` / `[(value)]`          |
| Reactive state          | `$state`, `$bindable`                  | `ref` / `useState` / signal                                 |
| Reactive side-effects   | `$effect`                              | `watch`+`onMounted` / `useEffect` / `effect()`              |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | Scoped slot / render prop / `*ngTemplateOutlet`             |
| Stylesheet head         | `<svelte:head>` or imperative          | `<Teleport to="head">` / portal / `Head` component          |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Nuxt server middleware / Next.js middleware / Analog hooks |
| Storybook integration   | `*.stories.svelte`                     | `*.stories.ts`                                              |
| File ext for components | `.svelte`                              | `.vue` / `.tsx` / `.component.ts`                           |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause across all seven framework catalogs.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
