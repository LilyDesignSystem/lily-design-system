# AGENTS — ThemePicker (Vue helper)

Single source of truth: [spec.md](./spec.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless theme picker that **loads theme CSS files
dynamically at runtime** from a developer-supplied directory URL.
Ships no CSS; consumer styles the `theme-picker` class hook.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec.md`                  | Specification-driven contract (canonical).       |
| `ThemePicker.vue`          | Implementation. `<script setup lang="ts">`.      |
| `ThemePicker.test.ts`      | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |

## Public surface

- Default export: `ThemePicker` component.
- Named exports: `ThemePicker`, `normaliseThemesUrl`, `themeHref`.
- Type exports: `Props`, `SlotArgs`.

Required props: `label`, `themesUrl`, `themes`. Full table in
[spec.md §4.1](./spec.md#41-props).

## Behaviour contract (one paragraph)

On every theme change the picker (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-picker="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits the `change` event. SSR-safe
— all DOM writes happen inside `onMounted` / `watch`. Initial value
resolves from `value` > storage > `defaultValue` > `"light"` (if
present) > `themes[0]`.

## HTML

`<fieldset class="theme-picker {class}" role="radiogroup"
aria-label="{label}">` with one native `<input type="radio">` per
slug. Custom rendering via the default scoped slot receiving
`{ themes, value, setTheme, name, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target.
- Native radio inputs provide Arrow / Space / Tab semantics.
- `aria-label` carries the consumer-supplied group name.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps`, `defineEmits`, `defineModel` for props / events /
  v-model.
- `ref`, `watch`, `onMounted` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
