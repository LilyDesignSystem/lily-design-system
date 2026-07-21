# Examples

Self-contained Vue 3 examples for
`lily-design-system-vue-theme-chooser`. Each file is a runnable
component that can be dropped into any Vue 3 host (Nuxt 3 page,
Vite + Vue route, Astro `.vue` island, Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `public/assets/themes/light.css`,
  `public/assets/themes/dark.css`, …). The
  [Lily themes](../../../themes/) catalog ships 45 ready-to-use
  themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| # | File                                          | Demonstrates                              |
|---|-----------------------------------------------|-------------------------------------------|
| 1 | [`basic.vue`](./basic.vue)                    | Minimal three-theme chooser, plus the `.theme-chooser-status` live region every consumer should ship. |
| 2 | [`two-way-binding.vue`](./two-way-binding.vue)| `v-model:value` and `@change`.            |
| 3 | [`persistence.vue`](./persistence.vue)        | `localStorage` survival across reloads.   |
| 4 | [`custom-labels.vue`](./custom-labels.vue)    | `themeLabels` for i18n / display names.   |
| 5 | [`custom-rendering.vue`](./custom-rendering.vue) | Custom button glyph via the default scoped slot. |
| 6 | [`preloaded.vue`](./preloaded.vue)            | Zero-flicker switching via preloading.    |
| 7 | [`multiple-choosers.vue`](./multiple-choosers.vue) | Two choosers in one page via `name`.    |
| 8 | [`system-preference.vue`](./system-preference.vue) | Follow `prefers-color-scheme`.      |
| 9 | [`lily-themes.vue`](./lily-themes.vue)        | All 45 Lily themes at once.     |
| 10 | [`nuxt-cookie/`](./nuxt-cookie/)             | SSR-resolved theme via a cookie (Nuxt 3). |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Vue 3 project (or Nuxt 3), drop the example
   into a route component.
2. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `public/assets/themes/`.
3. `pnpm dev` and visit the route.

## Default rendering

By default the component renders an icon button that opens a listbox:

```html
<div class="theme-chooser">
  <input type="hidden" name="theme" value="light" />
  <button type="button" class="theme-chooser-button" aria-label="Theme"
          aria-haspopup="listbox" aria-expanded="false"
          aria-controls="theme-chooser-1-list">
    <span class="theme-chooser-icon" aria-hidden="true">◑</span>
  </button>
  <ul class="theme-chooser-list" id="theme-chooser-1-list" role="listbox"
      aria-label="Theme" tabindex="-1" hidden>
    <li class="theme-chooser-option" id="theme-chooser-1-option-0"
        role="option" aria-selected="true">Light</li>
    <li class="theme-chooser-option" id="theme-chooser-1-option-1"
        role="option" aria-selected="false">Dark</li>
    <li class="theme-chooser-option" id="theme-chooser-1-option-2"
        role="option" aria-selected="false">Abyss</li>
  </ul>
</div>
```

Style hooks: `theme-chooser` on the root `<div>`, `theme-chooser-button`
on the trigger, `theme-chooser-icon` on the glyph span,
`theme-chooser-list` on the `<ul>`, `theme-chooser-option` on each
`<li>`. Plus two attribute hooks on the options: `[aria-selected]` for
the committed theme, `[data-active]` for the keyboard-active one.

The package ships **no CSS at all**, including no positioning — so
without consumer styles the listbox opens in normal document flow and
pushes the page down. See
[`../docs/styling.md`](../docs/styling.md#positioning-the-listbox).

Keyboard and ARIA are **implemented by the component**, following the
WAI-ARIA APG listbox pattern — there is no native `<select>` doing this
for us. On the button, `ArrowDown` / `Enter` / `Space` open the listbox
with the selected option active, and `ArrowUp` opens with the last
option active; opening moves focus to the `<ul>`. On the listbox,
`ArrowUp` / `ArrowDown` move the active option and clamp at both ends
(no wrapping), `Home` / `End` jump to the first / last, `Enter` /
`Space` commit and return focus to the button, `Escape` cancels without
changing the value, `Tab` closes without stealing focus back, and
printable characters run a typeahead over the option labels with a
500 ms buffer. Clicking an option selects it; clicking outside, or
moving focus out of the root, closes the listbox.

Because focus stays on the `<ul>` and the active option is conveyed
with `aria-activedescendant`, the options are never focused and never
tab stops.

## Default slot scoped args

The default slot replaces the **button glyph** — not the options. The
listbox, its options, the keyboard contract, and the apply lifecycle
are all component-owned.

```ts
type SlotArgs = {
    value: string;                       // the active slug
    open: boolean;                       // is the listbox open?
    labelFor: (theme: string) => string; // resolved display label
};
```

`ChildArgs` is an exported alias of `SlotArgs`, matching the canonical
Svelte helper's type name.

Slot content is decorative: the button's accessible name always comes
from `label` via `aria-label`, so keep it `aria-hidden="true"` or
text-free, and never render interactive markup inside it — it lands
inside the `<button>`. See
[`custom-rendering.vue`](./custom-rendering.vue).

## v-model conventions

The chooser exposes its bindable on `value` (not the default
`modelValue`). Always use `v-model:value="theme"` in templates, and
pair with `@change` for one-shot side effects.

## Naming

Vue templates use kebab-case for props: `themes-url`, `default-value`,
`theme-labels`, `storage-key`. In `<script setup>` we use camelCase
to match the TypeScript types.
