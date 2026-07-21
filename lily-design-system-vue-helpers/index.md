# Lily Design System™ — Vue Helpers

A catalog of opinionated, reusable Vue 3 helper components that sit
alongside the headless [`lily-design-system-vue-headless`](../lily-design-system-vue-headless/)
library. Where the headless library ships pure markup primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                            | Purpose                                                        |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`lily-design-system-vue-theme-chooser`](./lily-design-system-vue-theme-chooser/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap.     |
| [`lily-design-system-vue-locale-chooser`](./lily-design-system-vue-locale-chooser/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |
| [`lily-design-system-vue-text-size-chooser`](./lily-design-system-vue-text-size-chooser/) | Pick a text size; sets `data-text-size` on the document root. |
| [`lily-design-system-vue-share-chooser`](./lily-design-system-vue-share-chooser/) | Share the page: native share sheet where available, else a destination list + copy the URL. |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-vue-<name>/
├── spec/index.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── CLAUDE.md                ← loads AGENTS.md
├── index.md                 ← comprehensive user guide
├── index.ts                 ← barrel re-export
├── {Pascal}.vue             ← the component (`<script setup lang="ts">`)
├── {Pascal}.test.ts         ← vitest spec (one test per §7 acceptance)
├── AGENTS/                  ← topic-by-topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── docs/                    ← human-readable topic guides
└── examples/                ← runnable Vue 3 SFCs
```

The catalog parent shares its own `AGENTS/` and `AGENTS/shared/`
directories with conventions, testing, accessibility, and SSR rules,
plus the Lily™-wide headless / i18n / theme principles ported from
the root canonical AGENTS files.

Shared design decisions across the catalog:

- **Vue 3 Composition API** with `<script setup lang="ts">`. No
  Options API, no `mixins`, no `defineComponent` wrappers around SFCs.
- **TypeScript** on the public surface; types exported from
  `index.ts`.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe**: no DOM writes outside `onMounted` / `watch`.
- **i18n-clean**: every user-facing string comes from a prop.
- **One job per helper**: each helper owns one complete interaction
  end to end and composes cleanly with the others. For the three
  `*-chooser` preference helpers that job is a user-preference
  lifecycle (selection + DOM application + optional persistence); for
  `share-chooser` it is an **action** — it applies nothing to the
  document and persists nothing.
- **Spec-driven**: every helper has a `spec/index.md` numbered with §
  references; tests assert against those numbers; docs link back.

## Differences from the headless library

The headless library mirrors the canonical 490-component catalog.
Each component is a pure container with no lifecycle. A consumer
typing on top of `ThemeChooser` from `lily-design-system-vue-headless`
writes their own option markup, their own persistence, and their own
loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application, and
they expose a smaller, more opinionated API. Both layers can coexist
in one app; the helpers are not a replacement.

## Vue idioms used throughout

The helpers commit to a small set of Vue 3 features:

- `<script setup lang="ts">` for every SFC.
- `defineProps<Props>()` + `withDefaults` for typed props.
- `defineEmits<...>()` for typed events.
- `v-model:value` for two-way binding (so `value` round-trips and
  Vue's `update:value` event drives it).
- Default scoped slot (`<slot ... />` with named scoped props) for
  custom rendering — the Vue equivalent of Svelte snippets / React
  render props.
- `onMounted`, `watch`, and `ref` from `vue` — no third-party state
  libraries.

These choices map 1:1 to the Svelte canonical helpers so behaviour
and tests stay in lock-step across frameworks.

## Sibling helper catalogs

- [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  — the canonical Svelte 5 reference implementation. When the Vue
  port and the Svelte canonical disagree, the Svelte side wins and
  the Vue side is patched.

## Testing

Each helper ships a vitest suite that runs under jsdom +
`@vue/test-utils`. The acceptance criteria are listed in each
`spec/index.md` §7 and the test file matches one `it(...)` per numbered
item, named with the section number for fast cross-referencing.

```bash
cd lily-design-system-vue-theme-chooser
pnpm test
```

The shared rules around test setup (jsdom, `@vue/test-utils`,
`flushPromises`, `mount` + `await wrapper.vm.$nextTick()`) live in
[`AGENTS/testing.md`](./AGENTS/testing.md).

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.

---

Lily™ and Lily Design System™ are trademarks.
