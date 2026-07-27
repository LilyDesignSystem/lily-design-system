# Examples

Self-contained Vue 3 examples for
`lily-design-system-vue-locale-chooser`. Each file is a runnable
component that can be dropped into any Vue 3 host (Nuxt 3 page,
Vite + Vue route, Astro `.vue` island, Storybook story).

Every example assumes:

- Vue 3 with `<script setup lang="ts">`.
- No CSS dependency — the chooser is headless. Consumers style the
  `locale-chooser` (root `<div>`), `locale-chooser-button`,
  `locale-chooser-icon`, `locale-chooser-list` (the
  `<ul role="listbox">`), and `locale-chooser-option` (each
  `<li role="option">`) class hooks.

| File                                                 | Demonstrates                                                       |
|------------------------------------------------------|--------------------------------------------------------------------|
| [`basic.vue`](./basic.vue)                           | The default rendering, plus the `.locale-chooser-status` live region every consumer should ship. |
| [`custom-rendering.vue`](./custom-rendering.vue)     | Custom button glyph via the default scoped slot — the active locale's short code plus a caret. |
| [`script-aware-glyph.vue`](./script-aware-glyph.vue) | Script-aware button glyph: the active locale rendered in its own script and direction. |
| [`rtl-demo.vue`](./rtl-demo.vue)                     | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [`nhs-style.vue`](./nhs-style.vue)                   | NHS UK-style utility banner with endonyms, a `class` hook, and a status line. |
| [`with-vue-i18n.vue`](./with-vue-i18n.vue)           | Binding to vue-i18n's `locale` ref.                                |
| [`with-paraglide.vue`](./with-paraglide.vue)         | Driving Paraglide JS's `setLocale()` from `@change`.               |
| [`ssr-cookie.vue`](./ssr-cookie.vue)                 | Nuxt 3 `useCookie()` + `useHead()` for flicker-free SSR.           |
| [`scoped-target.vue`](./scoped-target.vue)           | Multiple per-region choosers, each scoped to its own panel.         |
| [`combobox.vue`](./combobox.vue)                     | Built-in typeahead over all 436 built-in locales, plus a side-by-side `<datalist>` combobox. |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Vue 3 project (or Nuxt 3), drop the example
   into a route component or a Storybook story.
2. Import the `LocaleChooser.vue` from this directory (or the
   `index.ts` barrel).
3. `pnpm dev` and visit the route.

## v-model conventions

The chooser exposes its bindable on `value` (not the default
`modelValue`). Always use `v-model:value="locale"` in templates,
and pair with `@change` for one-shot side effects (cookie writes,
imperative i18n-library calls, analytics).

## Naming

Vue templates use kebab-case for props: `storage-key`,
`detect-from-navigator`, `locale-labels`, `apply-dir`. In
`<script setup>` we use camelCase to match the TypeScript types
exported from `LocaleChooser.vue` (`Props`, `SlotArgs`).

## The control the examples render

Every example renders the same control: an icon button
(`<button class="locale-chooser-button" aria-label="…"
aria-haspopup="listbox">`, showing 🌐 U+1F310 by default) that opens a
`<ul class="locale-chooser-list" role="listbox">` of
`<li class="locale-chooser-option" role="option" lang="…">`. The
component implements the WAI-ARIA APG listbox keyboard contract
itself — arrows (clamping, no wrap), `Home` / `End`, `Enter` /
`Space` to commit, `Escape` to cancel, `Tab` to close, and
printable-character typeahead with a 500 ms buffer. Focus moves to
the `<ul>` on open and returns to the button on commit or cancel.

Two consequences worth remembering while reading the examples:

- Because the button is icon-only, `label` is its **entire**
  accessible name. Several examples pair the control with a
  `.locale-chooser-status` live region so the active locale appears
  somewhere; see [`../docs/accessibility.md`](../docs/accessibility.md)
  for why that is the default pattern rather than an add-on.
- `name` is the name of the **hidden input**, not of a `<select>`, so
  the value still posts with a surrounding form.

## Default slot scoped args

The default slot replaces the **button glyph** — not the options. The
listbox, the option markup, the keyboard contract, and the apply
lifecycle (lang / dir / storage / change) all stay component-owned.
`custom-rendering.vue` and `script-aware-glyph.vue` destructure these:

```ts
type SlotArgs = {
    value: string;    // Currently selected code (consumer form).
    open: boolean;    // Is the listbox open?
    labelFor: (code: string) => string; // Display label.
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the
canonical Svelte helper's type name.

Slot content is decorative: the button's accessible name always comes
from `label` via `aria-label`, so mark slot markup `aria-hidden="true"`
or keep it text-free. If you need a different control shape entirely,
render it yourself alongside the component and bind both to the same
ref — `combobox.vue` does exactly that.

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
