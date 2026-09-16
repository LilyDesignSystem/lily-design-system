# AGENTS — `<text-size-picker>` (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable vanilla HTML/JS headless text-size picker, packaged as the
`<text-size-picker>` custom element. The control is an **icon button
that opens a dropdown listbox** (WAI-ARIA APG listbox pattern) — not a
native `<select>`. On change it applies the chosen slug to the document
root via `data-text-size`, with optional `localStorage` persistence.
Ships no CSS; the consumer styles the `text-size-picker` class hooks on
the rendered children, maps each `[data-text-size="…"]` slug to real
typography, and must supply the list's positioning.

Structurally identical to its `theme-picker` and `locale-picker`
siblings in this catalog — all three helpers are the same shape.

## Files

| File                        | Purpose                                          |
| --------------------------- | ------------------------------------------------ |
| `spec/index.md`             | Specification-driven contract (canonical).       |
| `text-size-picker.ts`       | Implementation (TypeScript class).               |
| `text-size-picker.test.ts`  | Vitest + jsdom spec, one assertion per §7 item.  |
| `index.ts`                  | Barrel re-export + side-effectful registration.  |
| `index.md`                  | Human-readable guide.                            |
| `docs/accessibility.md`     | Roles, keyboard contract, known tradeoffs.       |

## Public surface

- Class `TextSizePicker extends HTMLElement` (registered as
  `<text-size-picker>` on import of `index.ts`).
- Named exports: `TextSizePicker`, `sizeName`, `nextTextSizePickerId`.
  No glyph constant — the default icon is a bundled SVG, not a Unicode
  character (reversed 2026-09-16). `sizeName` is the mirror of
  theme-picker's `themeName` and locale-picker's `localeName`.
- Type exports: `TextSizePickerProps`, `TextSizePickerChangeDetail`.
- Instance members beyond the attribute mirrors: `open` (getter),
  `listId` (getter), `optionId(index)`, `openList(startIndex?)`,
  `closeList(refocus = true)`, `labelFor(slug)`, and
  `renderButtonContent()` — the overridable rendering hook.

Required attributes: `label`, `sizes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-observed-attributes).

There is deliberately **no detection attribute**: the platform exposes
no preferred-text-size signal equivalent to `prefers-color-scheme` or
`navigator.languages`, so there is no counterpart to theme-picker's
`detect-from-system` or locale-picker's `detect-from-navigator`.

## Behaviour contract (one paragraph)

On every size change the element (1) sets `data-text-size="{slug}"` on
`target` (default `document.documentElement`), (2) optionally writes
the slug to `localStorage[storageKey]`, and (3) dispatches a
`textsizechange` `CustomEvent` carrying the slug. Initial value
resolves from `value` > storage > `default-value` > `"medium"` (if
present) > `sizes[0]`. All DOM writes happen inside `connectedCallback`
/ `attributeChangedCallback`, so the element is SSR-safe.

The real selection lives on `this.value` (attribute + property);
consumers read it from there or from the `textsizechange` detail. A
`value` change syncs state attributes in place rather than rebuilding
the DOM, because a rebuild while the listbox is open would destroy
focus and the active descendant.

## HTML

`<text-size-picker>` contains one rendered
`<div class="text-size-picker {class}">` holding, in order: a hidden
`<input name="{name}">` for form participation; a
`<button type="button" class="text-size-picker-button" aria-label="{label}"
aria-haspopup="listbox" aria-expanded aria-controls="{listId}">`
whose content defaults to a bundled stroke-drawn "A"
`<svg class="text-size-picker-icon" viewBox="0 0 16 16"
aria-hidden="true">` (not a Unicode character — reversed
2026-09-16); and a
`<ul class="text-size-picker-list" id="{listId}" role="listbox"
aria-label="{label}" tabindex="-1" hidden>` with one
`<li class="text-size-picker-option" role="option" aria-selected>` per
slug. `aria-activedescendant` sits on the `<ul>` only while open;
`data-active` marks the keyboard-highlighted option, which is a
different thing from `aria-selected`. Full markup:
[spec/index.md §4.5](./spec/index.md#45-dom-contract).

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern. This helper's
  specific concern is **1.4.4 Resize Text** (plus 1.4.10 Reflow and
  1.4.12 Text Spacing) — see
  [spec/index.md §6.4](./spec/index.md#64-wcag-144-resize-text).
- The keyboard contract is implemented in JS, not inherited from the
  platform. Button: `ArrowDown`/`Enter`/`Space` open, `ArrowUp` opens
  on the last option. List: arrows move and clamp, `Home`/`End` jump,
  `PageUp`/`PageDown` move by ten (clamped), `Enter`/`Space` select
  and refocus the button, `Escape` closes without changing the value,
  `Tab` puts focus on the button first and then closes — without
  cancelling the key, so the default Tab proceeds from the picker's
  position — and printable characters run a 500 ms typeahead where a
  repeated character cycles through its matches and a buffer of
  differing characters refines from the active option. Table:
  [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- Focus sits on the `<ul>` while open, never on an `<li>`; the
  highlighted option is conveyed by `aria-activedescendant`.
- `aria-label` carries the consumer-supplied accessible name on both
  the button and the list. The icon is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the word "default" is
  never emitted.
- Two known tradeoffs — icon-only naming (and WCAG 2.5.3) and a custom
  listbox being weaker than a native `<select>` — are recorded in
  [spec/index.md §6.5](./spec/index.md#65-known-tradeoffs) and
  `docs/accessibility.md`. (The font-dependent-glyph tradeoff no
  longer applies: the icon is a bundled SVG, not a Unicode character —
  reversed 2026-09-16.) The closed button shows only an icon, so
  consumers should surface the active size in visible text or a polite
  live region.

## Conventions this package follows

- Vanilla web component (custom element extending `HTMLElement`).
- Light DOM only (no Shadow DOM).
- Strict TypeScript on the public surface.
- No runtime dependencies.
- No bundled CSS, fonts, or images. The one deliberate exception is
  the default button icon: a bundled SVG (reversed 2026-09-16 from a
  Unicode glyph).
- All user-facing strings come from attributes / properties.
- Mirrors the Svelte sibling's §7 acceptance criteria.
