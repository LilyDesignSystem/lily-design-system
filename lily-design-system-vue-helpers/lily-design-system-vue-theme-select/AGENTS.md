# AGENTS — ThemeSelect (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless theme select that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL.
Ships no CSS; consumer styles the `theme-select` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`                  | Specification-driven contract (canonical).       |
| `ThemeSelect.vue`          | Implementation. `<script setup lang="ts">`.      |
| `ThemeSelect.test.ts`      | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Default export: `ThemeSelect` component.
- Named exports: `ThemeSelect`, `normaliseThemesUrl`, `themeHref`,
  `themeName`, `matchSystemTheme`,
  `nextThemeSelectId`, `CIRCLE_WITH_RIGHT_HALF_BLACK`.
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `themesUrl`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props). There is no
`placeholder` prop — it was removed with the `<select>`.

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-select="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits the `change` event. SSR-safe
— all DOM writes happen inside `onMounted` / `watch`. Initial value
resolves from `value` > storage > `matchSystemTheme` (if
`detectFromSystem`) > `defaultValue` > `"light"` (if
present) > `themes[0]`. The control is an icon button that opens a
listbox; the selection lives in `value` / `v-model:value`, in the
hidden input, and in `data-theme` on the target.

## HTML

A root `<div class="theme-select {class}">` (`$attrs` falls through to
it) containing three things: a hidden `<input type="hidden"
name="{name}" value="{value}">` for form participation; a
`<button type="button" class="theme-select-button" aria-label="{label}"
aria-haspopup="listbox" aria-expanded aria-controls="{listId}">`
wrapping `<span class="theme-select-icon" aria-hidden="true">◑</span>`;
and a `<ul class="theme-select-list" role="listbox" aria-label="{label}"
tabindex="-1" hidden aria-activedescendant>` of
`<li class="theme-select-option" role="option" aria-selected
data-active>`. The glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK,
exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`. The default scoped slot
replaces the **button glyph** — not the options — and receives
`{ value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target.
- The component implements the WAI-ARIA APG listbox keyboard contract
  itself: Arrow keys (clamping, no wrap), Home / End, Enter / Space to
  commit, Escape to cancel, Tab to close, printable-character typeahead
  with a 500 ms buffer. Focus moves to the `<ul>` on open and returns to
  the button on commit or cancel.
- The button is icon-only, so `aria-label` is its **only** accessible
  name; the glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Because the closed control shows only a glyph, the documented pattern
  pairs the select with a consumer-rendered
  `.theme-select-status` live region. See
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps`, `defineEmits`, `defineModel` for props / events /
  v-model.
- `ref`, `watch`, `onMounted` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
