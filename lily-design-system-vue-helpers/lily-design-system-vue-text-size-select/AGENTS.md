# AGENTS — TextSizeSelect (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Vue 3 headless text-size select. Renders an icon button
that opens a WAI-ARIA APG listbox of size slugs, and applies the
chosen slug to the document root via `data-text-size`, with optional
`localStorage` persistence. Ships no CSS; consumer styles the
`text-size-select` class hook and maps each `[data-text-size="…"]`
slug to real typography.

Same shape as `theme-select` and `locale-select` — all three helpers
are icon button + listbox.

## Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `spec/index.md`            | Specification-driven contract (canonical).       |
| `TextSizeSelect.vue`       | Implementation. `<script setup lang="ts">`.      |
| `TextSizeSelect.test.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                 | Barrel re-export.                                |
| `index.md`                 | Human-readable guide.                            |
| `docs/accessibility.md`    | Accessibility rationale and the three tradeoffs. |
| `CHANGELOG.md`             | Release record.                                  |

## Public surface

- Default export: `TextSizeSelect` component.
- Named exports: `TextSizeSelect`, `sizeName`,
  `nextTextSizeSelectId`, `LATIN_CAPITAL_LETTER_A`.
- Type exports: `Props`, `SlotArgs`, `ChildArgs` (alias of `SlotArgs`).

Required props: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-props). There is no
`placeholder` prop — it was removed with the `<select>` — and no
detection prop: there is no OS "preferred text size" media query
equivalent to `prefers-color-scheme`.

## Behaviour contract (one paragraph)

On every size change the select (1) sets `data-text-size="{slug}"` on
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

A root `<div class="text-size-select {class}">` (`$attrs` falls
through to it) containing three things: a hidden `<input type="hidden"
name="{name}" value="{value}">` for form participation; a
`<button type="button" class="text-size-select-button"
aria-label="{label}" aria-haspopup="listbox" aria-expanded
aria-controls="{listId}">` wrapping
`<span class="text-size-select-icon" aria-hidden="true">A</span>`; and
a `<ul class="text-size-select-list" role="listbox"
aria-label="{label}" tabindex="-1" hidden aria-activedescendant>` of
`<li class="text-size-select-option" role="option" aria-selected
data-active>`. The glyph is U+0041 LATIN CAPITAL LETTER A, exported as
`LATIN_CAPITAL_LETTER_A` — a plain letter rather than a pictograph,
because U+1F5DB DECREASE FONT SIZE SYMBOL has no real glyph in common
font stacks and means *decrease* rather than *size*. The default
scoped slot replaces the **button glyph** — not the options — and
receives `{ value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text) — this
  helper's specific concern.
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
  `.text-size-select-status` live region. See
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Vue 3 `<script setup lang="ts">` Composition API.
- `defineProps` + `withDefaults`, `defineEmits` for props / events.
- `ref`, `watch`, `onMounted`, `nextTick` for state and lifecycle.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `vue`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props.
