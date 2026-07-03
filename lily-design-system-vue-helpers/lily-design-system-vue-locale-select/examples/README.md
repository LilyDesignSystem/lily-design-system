# Examples

Self-contained Vue 3 examples for
`lily-design-system-vue-locale-select`. Each file is a runnable
component that can be dropped into any Vue 3 host (Nuxt 3 page,
Vite + Vue route, Astro `.vue` island, Storybook story).

Every example assumes:

- Vue 3 with `<script setup lang="ts">`.
- No CSS dependency — the select is headless. Consumers style the
  `locale-select` (the `<select>`) and `locale-select-option` (each
  `<option>`) class hooks.

| #  | File                                            | Demonstrates                                                       |
|----|-------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-radios.vue`](./01-radios.vue)              | Default native `<select>` rendering.                               |
| 2  | [`02-select.vue`](./02-select.vue)              | Custom `<option>` markup / styling the native select via the default scoped slot. |
| 3  | [`03-buttons.vue`](./03-buttons.vue)            | Toggle-button group with short codes / glyphs and `aria-pressed`.  |
| 4  | [`04-rtl-demo.vue`](./04-rtl-demo.vue)          | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| 5  | [`05-nhs-style.vue`](./05-nhs-style.vue)        | NHS UK-style language banner with endonyms and a `class` hook.     |
| 6  | [`06-with-vue-i18n.vue`](./06-with-vue-i18n.vue) | Binding to vue-i18n's `locale` ref.                              |
| 7  | [`07-with-paraglide.vue`](./07-with-paraglide.vue) | Driving Paraglide JS's `setLocale()` from `@change`.            |
| 8  | [`08-ssr-cookie.vue`](./08-ssr-cookie.vue)      | Nuxt 3 `useCookie()` + `useHead()` for flicker-free SSR.           |
| 9  | [`09-scoped-target.vue`](./09-scoped-target.vue) | Multiple per-region selects, each scoped to its own panel.        |
| 10 | [`10-combobox.vue`](./10-combobox.vue)          | Native `<datalist>` type-ahead for all 436 built-in locales.       |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Vue 3 project (or Nuxt 3), drop the example
   into a route component or a Storybook story.
2. Import the `LocaleSelect.vue` from this directory (or the
   `index.ts` barrel).
3. `pnpm dev` and visit the route.

## v-model conventions

The select exposes its bindable on `value` (not the default
`modelValue`). Always use `v-model:value="locale"` in templates,
and pair with `@change` for one-shot side effects (cookie writes,
imperative i18n-library calls, analytics).

## Naming

Vue templates use kebab-case for props: `storage-key`,
`detect-from-navigator`, `locale-labels`, `apply-dir`. In
`<script setup>` we use camelCase to match the TypeScript types
exported from `LocaleSelect.vue` (`Props`, `SlotArgs`).

## Default slot scoped args

Every example that uses the default slot destructures these:

```ts
type SlotArgs = {
    locales: string[];        // The locale codes to render.
    value: string;            // Currently selected code (consumer form).
    setLocale: (code: string) => void; // Apply imperatively.
    name: string;             // Shared `name` attribute for the control.
    labelFor: (code: string) => string; // Display label.
    tagFor: (code: string) => string;   // BCP 47 hyphen form.
    isRtl: (code: string) => boolean;   // RTL detection.
};
```

The select still owns the apply lifecycle (lang/dir/storage/change)
regardless of what markup the slot emits.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / Nuxt 3 / Vite SSR
  recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring vue-i18n, @nuxtjs/i18n, Paraglide JS, raw `Intl.*`.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
