# AGENTS — SettingsPicker (HTML helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A HTML headless dropdown control. A single-icon button (a bundled **cog** SVG) that opens a disclosure panel holding
**whatever the app provides** — links, buttons, forms. Ships no CSS, no content and no English; the one bundled asset is the
default button icon.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `settings-picker.ts` | Implementation. A custom element + TypeScript. |
| `settings-picker.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | A links panel, a form panel using `close`, and a custom icon. |

## Public surface

Custom element `<settings-picker>` (class `SettingsPicker`); exports `SettingsPicker`, `nextSettingsPickerId`, `FOCUSABLE`, types `SettingsPickerProps`, `SettingsPickerOpenChangeDetail`.
Required attribute: `label`.

## Behaviour contract (one paragraph)

Activating the button toggles a panel holding the element's light-DOM children. Focus stays on the button on click;
`ArrowDown`/`ArrowUp` on the button move into the panel's first/last focusable element. `Escape` closes and refocuses the
button; `Tab`, an outside click or focus leaving closes. Activating a link, button or `[role="menuitem"]` inside closes the
panel unless `closeOnSelect={false}` or a `data-settings-picker-keep-open` ancestor says otherwise. Nothing is applied to the
document and nothing is persisted.

## HTML

`<div class="settings-picker">` → `<button class="settings-picker-button">` with an `aria-hidden` SVG (`settings-picker-icon`) →
`<div class="settings-picker-tooltip" role="tooltip">` → `<div class="settings-picker-panel" role="group" hidden>`.

**Not an ARIA menu.** The panel's content is arbitrary, so there is no `role="menu"` and no roving focus; it is a disclosure.

## Conventions this package follows

- A custom element; strict TypeScript on the public surface.
- Runtime dependency: no runtime dependency (the trigger is a plain `<button>`).
- No bundled CSS, fonts, images, links or English. The one bundled asset is the default cog icon, always overridable
  through `icon`.
- Every user-facing string comes from props or from the app's own content.
