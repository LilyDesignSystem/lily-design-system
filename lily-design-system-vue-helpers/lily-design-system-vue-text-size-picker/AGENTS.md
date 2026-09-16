# AGENTS — TextSizePicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless text-size picker. Renders an icon button
that opens a WAI-ARIA APG listbox of size slugs, and applies the
chosen slug to the document root via `data-text-size`, with optional
`localStorage` persistence. Ships no CSS; consumer styles the
`text-size-picker` class hook and maps each `[data-text-size="…"]`
slug to real typography.

Same shape as `theme-picker` and `locale-picker` — all three helpers
are icon button + listbox.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`            | Specification-driven contract (canonical).       |
| `TextSizePicker.vue`       | Implementation. `<script setup lang="ts">`.      |
| `TextSizePicker.test.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |
| `docs/accessibility.md`    | Accessibility rationale and the three tradeoffs. |
| `CHANGELOG.md`             | Release record.                                  |

## Public surface

- Default export: `TextSizePicker` component.
- Named exports: `TextSizePicker`, `sizeName`,
  `nextTextSizePickerId`. No glyph constant — the default icon is a
  bundled SVG, not a Unicode character (reversed 2026-09-16).
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props). There is no
`placeholder` prop — it was removed with the `<select>` — and no
detection prop: there is no OS "preferred text size" media query
equivalent to `prefers-color-scheme`.

## Behaviour contract (one paragraph)

On every size change the picker (1) sets `data-text-size="{slug}"` on
`target` (defaults to `document.documentElement`), (2) optionally
writes the slug to `localStorage[storageKey]`, and (3) emits the
`change` event with the slug. SSR-safe — all DOM writes happen inside
`onMounted` / `watch`. Initial value resolves from `value` > storage >
`defaultValue` > `"medium"` (if present) > `sizes[0]`. An internal
`current` ref is the source of truth so an uncontrolled mount still
applies a default. The control is an icon button that opens a listbox;
the selection lives in `value` / `v-model:value`, in the hidden input,
and in `data-text-size` on the target.

## HTML

A root `<div class="text-size-picker {class}">` (`$attrs` falls
through to it) containing three things: a hidden `<input type="hidden"
name="{name}" value="{value}">` for form participation; a
`<button type="button" class="text-size-picker-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls="{listId}">` wrapping
`<svg class="text-size-picker-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2"/></svg>`; and
a `<ul class="text-size-picker-list" role="listbox"
aria-label="{label}" tabindex="-1" hidden aria-activedescendant>` of
`<li class="text-size-picker-option" role="option" aria-selected
data-active>`. The icon is a bundled SVG (a stylised "A"), not a
Unicode character — reversed 2026-09-16 from U+0041 LATIN CAPITAL
LETTER A (exported as `LATIN_CAPITAL_LETTER_A`). The default
scoped slot replaces the **button icon** — not the options — and
receives `{ value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) — this
  helper's specific concern.
- The component implements the WAI-ARIA APG listbox keyboard contract
  itself: Arrow keys (clamping, no wrap), Home / End, PageUp / PageDown
  (by ten, clamping), Enter / Space to commit, Escape to cancel, Tab to
  close via the button so the default Tab proceeds from the picker's
  position, and printable-character typeahead with a 500 ms buffer — a
  repeated character cycles through its matches; differing characters
  refine from the active option. Focus moves to the `<ul>` on open and returns to
  the button on commit or cancel.
- The button is icon-only, so `aria-label` is its **only** accessible
  name; the icon is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Because the closed control shows only an icon, the documented pattern
  pairs the picker with a consumer-rendered
  `.text-size-picker-status` live region. See
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps` + `withDefaults`, `defineEmits` for props / events.
- `ref`, `watch`, `onMounted`, `nextTick` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, or images. The one deliberate exception is
  the default button icon: a bundled SVG (reversed 2026-09-16 from a
  Unicode glyph), overridable via the default scoped slot.
- All user-facing strings come from props.
