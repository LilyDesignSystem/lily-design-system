# Examples

Self-contained Vue 3 examples for
`lily-design-system-vue-text-size-picker`. Each file is a runnable
component that can be dropped into any Vue 3 host (Nuxt 3 page,
Vite + Vue route, Astro `.vue` island, Storybook story).

Every example assumes:

- Your stylesheet maps each `[data-text-size="<slug>"]` on `:root` to a
  relative font size — see
  [`../docs/accessibility.md`](../docs/accessibility.md#this-helpers-specific-concern-wcag-144-resize-text).
  Without that mapping the control works but nothing visibly resizes.
- The root and list are positioned (`position: relative` /
  `position: absolute`), or an open dropdown shoves the page around.
  The package ships no CSS.

| #   | File                                                | Demonstrates                                                                            |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | [`basic.vue`](./basic.vue)                           | Minimal four-size picker, plus the `.text-size-picker-status` live region every consumer should ship. |
| 2   | [`two-way-binding.vue`](./two-way-binding.vue)       | `v-model:value` and `@change`.                                                           |
| 3   | [`persistence.vue`](./persistence.vue)               | `localStorage` survival across reloads.                                                  |
| 4   | [`custom-labels.vue`](./custom-labels.vue)           | `sizeLabels` for i18n / display names.                                                   |
| 5   | [`custom-rendering.vue`](./custom-rendering.vue)     | Custom button glyph via the default scoped slot (the conventional two-size "A A" affordance). |
| 6   | [`multiple-pickers.vue`](./multiple-pickers.vue)     | Two pickers in one page via `name` and per-picker `target`.                              |
| 7   | [`external-buttons.vue`](./external-buttons.vue)     | Driving the picker from your own preset buttons via `v-model:value` and `sizeName`.       |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Vue 3 project (or Nuxt 3), drop the example
   into a route component.
2. Add the slug → font-size mapping from
   [`../docs/accessibility.md`](../docs/accessibility.md#this-helpers-specific-concern-wcag-144-resize-text)
   to your site stylesheet (or copy the inline `<style>` block from
   [`basic.vue`](./basic.vue)).
3. `pnpm dev` and visit the route.

## What is deliberately missing

There is no `system-preference.vue` here, unlike the theme-picker and
locale-picker example sets. Browsers expose no "preferred text size"
signal — there is no media query equivalent to `prefers-color-scheme`
and no `navigator.languages` analogue — so the component ships no
detection prop to demonstrate. There is also no `preloaded.vue` or
`lily-themes.vue` equivalent: this helper has no CSS-catalog / stylesheet-
swapping concept the way `theme-picker` does — it only ever toggles a
`data-text-size` attribute.

## Default rendering

By default the component renders an icon button that opens a listbox:

```html
<div class="text-size-picker">
  <input type="hidden" name="text-size" value="medium" />
  <button
    type="button"
    class="text-size-picker-button"
    aria-label="Text size"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="text-size-picker-1-list"
  >
    <span class="text-size-picker-icon" aria-hidden="true">A</span>
  </button>
  <ul
    class="text-size-picker-list"
    id="text-size-picker-1-list"
    role="listbox"
    aria-label="Text size"
    tabindex="-1"
    hidden
  >
    <li
      class="text-size-picker-option"
      id="text-size-picker-1-option-0"
      role="option"
      aria-selected="false"
    >
      Small
    </li>
    <li
      class="text-size-picker-option"
      id="text-size-picker-1-option-1"
      role="option"
      aria-selected="true"
    >
      Medium
    </li>
    <li
      class="text-size-picker-option"
      id="text-size-picker-1-option-2"
      role="option"
      aria-selected="false"
    >
      Large
    </li>
  </ul>
</div>
```

Style hooks: `text-size-picker` on the root `<div>`,
`text-size-picker-button` on the trigger, `text-size-picker-icon` on the
glyph span, `text-size-picker-list` on the `<ul>`,
`text-size-picker-option` on each `<li>`. Plus two attribute hooks on
the options: `[aria-selected]` for the committed size, `[data-active]`
for the keyboard-active one.

The package ships **no CSS at all**, including no positioning — so
without consumer styles the listbox opens in normal document flow and
pushes the page down.

Keyboard and ARIA are **implemented by the component**, following the
WAI-ARIA APG listbox pattern — there is no native `<select>` doing this
for us. On the button, `ArrowDown` / `Enter` / `Space` open the listbox
with the selected option active, and `ArrowUp` opens with the last
option active; opening moves focus to the `<ul>`. On the listbox,
`ArrowUp` / `ArrowDown` move the active option and clamp at both ends
(no wrapping — see `../docs/accessibility.md`), `Home` / `End` jump to
the first / last, `Enter` / `Space` commit and return focus to the
button, `Escape` cancels without changing the value, `Tab` closes via the
button so the default Tab proceeds from the picker's position, and
printable characters run a typeahead over the option labels with a
500 ms buffer (a repeated character cycles through its matches). Clicking an option selects
it; clicking outside, or moving focus out of the root, closes the
listbox.

Because focus stays on the `<ul>` and the active option is conveyed
with `aria-activedescendant`, the options are never focused and never
tab stops.

## Default slot scoped args

The default slot replaces the **button glyph** — not the options. The
listbox, its options, the keyboard contract, and the apply lifecycle
are all component-owned.

```ts
type SlotArgs = {
  value: string; // the active slug
  open: boolean; // is the listbox open?
  labelFor: (size: string) => string; // resolved display label
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

The picker exposes its bindable on `value` (not the default
`modelValue`). Always use `v-model:value="size"` in templates, and
pair with `@change` for one-shot side effects.

## Naming

Vue templates use kebab-case for props: `size-labels`,
`default-value`, `storage-key`. In `<script setup>` we use camelCase
to match the TypeScript types.
