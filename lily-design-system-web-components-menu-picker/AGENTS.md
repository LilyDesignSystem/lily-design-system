# AGENTS — MenuPicker (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Web Components headless dropdown control. A single-icon button (a bundled **hamburger** SVG) that opens a disclosure panel holding
**whatever the app provides** — links, buttons, forms. Ships no CSS, no content and no English; the one bundled asset is the
default button icon.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `menu-picker.ts` | Implementation. A custom element + TypeScript. |
| `menu-picker.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | A links panel, a form panel using `close`, and a custom icon. |

## Public surface

Custom element `<lily-menu-picker>` (class `MenuPicker`); exports `MenuPicker`, `nextMenuPickerId`, `FOCUSABLE`, types `MenuPickerProps`, `MenuPickerOpenChangeDetail`.
Required attribute: `label`.

## Behaviour contract (one paragraph)

Activating the button toggles a panel holding the element's light-DOM children. Focus stays on the button on click;
`ArrowDown`/`ArrowUp` on the button move into the panel's first/last focusable element. `Escape` closes and refocuses the
button; `Tab`, an outside click or focus leaving closes. Activating a link, button or `[role="menuitem"]` inside closes the
panel unless `closeOnSelect={false}` or a `data-menu-picker-keep-open` ancestor says otherwise. Nothing is applied to the
document and nothing is persisted.

## HTML

`<div class="menu-picker">` → `<button class="menu-picker-button">` with an `aria-hidden` SVG (`menu-picker-icon`) →
`<div class="menu-picker-tooltip" role="tooltip">` → `<div class="menu-picker-panel" role="group" hidden>`.

**Not an ARIA menu.** The panel's content is arbitrary, so there is no `role="menu"` and no roving focus; it is a disclosure.

## Conventions this package follows

- A custom element; strict TypeScript on the public surface.
- Runtime dependency: no runtime dependency beyond `@lilydesignsystem/web-components-headless` (the trigger is its `<lily-icon-button>`).
- No bundled CSS, fonts, images, links or English. The one bundled asset is the default hamburger icon, always overridable
  through `icon`.
- Every user-facing string comes from props or from the app's own content.
