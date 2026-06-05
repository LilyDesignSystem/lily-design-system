# Lily Design System — Svelte Helpers

A catalog of opinionated, reusable Svelte 5 helper components that sit
alongside the headless [`lily-design-system-svelte-headless`](../lily-design-system-svelte-headless/)
library. Where the headless library ships pure markup primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                  | Purpose                                                        |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`lily-design-system-svelte-theme-picker`](./lily-design-system-svelte-theme-picker/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap.     |
| [`lily-design-system-svelte-locale-picker`](./lily-design-system-svelte-locale-picker/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-svelte-<name>/
├── spec.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── CLAUDE.md                ← loads AGENTS.md
├── index.md                 ← human-readable guide
├── index.ts                 ← barrel re-export
├── {Pascal}.svelte          ← the component
├── {Pascal}.test.ts         ← vitest spec (one test per §7 acceptance)
├── {Pascal}.stories.svelte  ← Storybook story (optional)
├── docs/                    ← topic guides (optional)
└── examples/                ← runnable Svelte 5 examples (optional)
```

Shared design decisions across the catalog:

- **Svelte 5 runes** (`$props`, `$bindable`, `$effect`). No legacy
  Svelte 4 syntax.
- **TypeScript** on the public surface; types exported from
  `index.ts`.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe**: no DOM writes outside `$effect` / `onMount`.
- **i18n-clean**: every user-facing string comes from a prop.
- **One job per helper**: each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven**: every helper has a `spec.md` numbered with §
  references; tests assert against those numbers; docs link back.

## Differences from the headless library

The headless library mirrors the canonical 492-component catalog.
Each component is a pure container with no lifecycle. A consumer
typing on top of `ThemePicker` from `lily-design-system-svelte-headless`
writes their own radio markup, their own persistence, and their own
loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application, and
they expose a smaller, more opinionated API. Both layers can coexist
in one app; the helpers are not a replacement.

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.
