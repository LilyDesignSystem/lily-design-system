# AGENTS — PickerBar (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A composed Vue 3 header control: one `<div class="picker-bar">` that
renders `ThemePicker`, `LocalePicker`, `TextSizePicker`, and
`SharePicker` — four of the six `*-picker` helpers — in that fixed
order, each imported as a normal npm dependency from its own published
package (`lily-design-system-vue-theme-picker`, `-locale-picker`,
`-text-size-picker`, `-share-picker`). It adds no lifecycle of its own
beyond two catalog-specific defaults: the full 45-theme reference list
(§5.1 of the spec) and the seven-step text-size scale (§5.2).
`motion-picker` and `date-time-picker` are deliberately not included —
see spec §1. Ported from the canonical
[Svelte picker-bar](../../lily-design-system-svelte-helpers/lily-design-system-svelte-picker-bar/AGENTS.md).

## Files

| File                | Purpose                                       |
| -------------------- | ---------------------------------------------- |
| `spec/index.md`      | Specification-driven contract (canonical).     |
| `PickerBar.vue`      | Implementation. `<script setup lang="ts">`.    |
| `PickerBar.test.ts`  | Vitest + `@vue/test-utils` spec, one test per §7 acceptance. |
| `shims.d.ts`         | Local-only ambient module declarations for the four sibling packages — works around a real vue-tsc limitation (spec §9). Not published (`package.json` `files` ships only `dist/`, `index.md`, `README.md`). |
| `index.ts`           | Barrel re-export.                              |
| `index.md`           | Comprehensive user guide.                      |

## Public surface

- Default export: `PickerBar` component.
- Named exports: `PickerBar`, `DEFAULT_THEMES`, `DEFAULT_SIZES`.
- Type exports: `Props`, `PickerBarLabels`.

Required props: `labels`, `themesUrl`, `locales`. Full table in
[spec/index.md §4](./spec/index.md#4-props). Events in
[spec/index.md §4.1](./spec/index.md#41-events).

## Behaviour contract (one paragraph)

`PickerBar` renders the four wrapped pickers unmodified, binding each
its own required props plus any extras from that picker's `*Props`
bag (`themeProps`, `localeProps`, `textSizeProps`, `shareProps`) via
`v-bind`, placed **after** the bar's own `:prop` bindings so a
consumer can override anything. `themes` defaults to `DEFAULT_THEMES`
(all 45 reference theme slugs, alphabetical with the UK/US themes
moved to one alphabetical group at the bottom); `sizes` defaults to
`DEFAULT_SIZES` (`largest` … `smallest`, seven slugs) with the nested
`TextSizePicker`'s `defaultValue` bound to `"normal"`
(`text-size-picker`'s own `"medium"` fallback does not exist in this
seven-slug scale). `PickerBar` re-emits each wrapped picker's own
event under a bar-scoped name (`theme-change`, `locale-change`,
`text-size-change`, `share`, `copy`, `native-share`) — the Vue-idiomatic
equivalent of the Svelte canonical's `onChange` callback prop. Every
other prop — persistence, initial value, detection, glyph override —
is exactly the wrapped picker's own contract; see that picker's own
`AGENTS.md`.

## HTML

```html
<div class="picker-bar {class}">
  <div class="theme-picker">…</div>
  <div class="locale-picker">…</div>
  <div class="text-size-picker">…</div>
  <div class="share-picker">…</div>
</div>
```

No new class hooks — each child keeps its own package's class
contract. `PickerBar` contributes only the `picker-bar` root class.
Extra attributes fall through onto the root via Vue's default
single-root `inheritAttrs` behaviour.

## Accessibility

WCAG 2.2 AAA target — unchanged from each wrapped picker, since
`PickerBar` adds no new interaction. `labels` supplies all four
accessible names; there is no English default (see
`date-time-picker`'s precedent in AGENTS/helpers.md for why a bar of
structural labels this catalog invented gets none).

## Conventions this package follows

- Vue 3 Composition API, `<script setup lang="ts">`, `defineProps`,
  `defineEmits`, `withDefaults`.
- Strict TypeScript on the public surface.
- Depends on the four wrapped pickers as real npm `dependencies` —
  the same way any consumer would — not vendored or duplicated source.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props (`labels`, and whatever each
  wrapped picker's own props require).

## Local development notes

This catalog has no pnpm workspace linking (`pnpm-workspace.yaml`
carries no `packages:` glob). `../vite.config.js` aliases the four bare
package specifiers to each sibling's already-built `dist/` so tests
resolve locally. Neither alias is read when this package's own `dist/`
is built (`../build.mjs` → `vite.lib.config.ts`, Vite library mode) —
the four specifiers are added to that config's `rollupOptions.external`
so the published `dist/index.js` keeps real `import` statements instead
of bundling each sibling's implementation in.

Declaration emission needed a separate workaround: this package's own
`shims.d.ts` (loose `any`-typed ambient declarations for the four
specifiers, included only for this package's build via a generic
addition to `../build.mjs`'s throwaway tsconfig) — see spec §9 for why
`vue-tsc` cannot otherwise build this package's declarations at all.
