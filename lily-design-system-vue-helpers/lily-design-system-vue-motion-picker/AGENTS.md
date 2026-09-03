# AGENTS — MotionPicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless motion (reduced-motion) picker. Renders an
icon button that opens a WAI-ARIA APG listbox of motion slugs, and
applies the chosen slug to the document root via `data-motion`, with
optional `localStorage` persistence. Ships no CSS; consumer styles the
`motion-picker` class hook and decides what `[data-motion="reduce"]`
actually suppresses.

Same shape as `theme-picker`, `locale-picker`, and `text-size-picker` —
icon button + listbox — with one behaviour difference: its initial
value defers to the platform's `(prefers-reduced-motion: reduce)`
media query before falling back to a fixed default.

## Files

| File                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `spec/index.md`         | Specification-driven contract (canonical, Svelte-sourced). |
| `MotionPicker.vue`      | Implementation. `<script setup lang="ts">`.      |
| `MotionPicker.test.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`              | Barrel re-export.                                |
| `index.md`              | Human-readable guide.                            |

## Public surface

- Default export: `MotionPicker` component.
- Named exports: `MotionPicker`, `motionName`, `nextMotionPickerId`,
  `prefersReducedMotion`, `PAUSE_SIGN`.
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `motions`.

## Behaviour contract (one paragraph)

On every motion change the picker (1) sets `data-motion="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) emits the
`change` event with the slug. SSR-safe — all DOM writes happen inside
`onMounted` / `watch`. Initial value resolves from `value` > storage >
`defaultValue` > `(prefers-reduced-motion: reduce)` (mapped to
`"reduce"` / `"no-preference"` when offered) > `motions[0]`. An
internal `current` ref is the source of truth so an uncontrolled mount
still applies a default.

## HTML

A root `<div class="motion-picker {class}">` (`$attrs` falls through
to it) containing a hidden `<input type="hidden" name="{name}"
value="{value}">`; a `<button type="button" class="motion-picker-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls="{listId}">` wrapping
`<span class="motion-picker-icon" aria-hidden="true">` (pause-sign
glyph); and a `<ul class="motion-picker-list" role="listbox"
aria-label="{label}" tabindex="-1" hidden aria-activedescendant>` of
`<li class="motion-picker-option" role="option" aria-selected
data-active>`. The default scoped slot replaces the **button glyph** —
not the options — and receives `{ value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- The component implements the WAI-ARIA APG listbox keyboard contract
  itself: Arrow keys (clamping, no wrap), Home / End, PageUp / PageDown
  (by ten, clamping), Enter / Space to commit, Escape to cancel, Tab to
  close via the button so the default Tab proceeds from the picker's
  position, and printable-character typeahead with a 500 ms buffer.
- The button is icon-only, so `aria-label` is its only accessible
  name; the glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps` + `withDefaults`, `defineEmits` for props / events.
- `ref`, `watch`, `onMounted`, `nextTick` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
- Glyph escaped in source (`PAUSE_SIGN`, U+23F8 + U+FE0E) per
  `AGENTS/helpers.md`'s glyph-escaping rule.
