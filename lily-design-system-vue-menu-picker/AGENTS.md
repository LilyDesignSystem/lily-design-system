# AGENTS — MenuPicker (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything below is a fast index.

## What this package is

A Vue headless dropdown control. A single-icon button (a bundled **hamburger** SVG) that opens a disclosure panel holding
**whatever the app provides** — links, buttons, forms. Ships no CSS, no content and no English; the one bundled asset is the
default button icon.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `MenuPicker.vue` | Implementation. Vue 3 `<script setup>` + TypeScript. |
| `MenuPicker.test.ts` | Vitest spec, mapped to the §7 clauses. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | A links panel, a form panel using `close`, and a custom icon. |

## Public surface

Default export `MenuPicker`; named `MenuPicker`, `nextMenuPickerId`, `FOCUSABLE`; types `Props`, `SlotArgs`, `ChildArgs`.
Required prop: `label`. `v-model:open` is bindable.

## Behaviour contract (one paragraph)

Activating the button toggles a panel rendered from the default slot (`{ open, close }`). Focus stays on the button on click;
`ArrowDown`/`ArrowUp` on the button move into the panel's first/last focusable element. `Escape` closes and refocuses the
button; `Tab`, an outside click or focus leaving closes. Activating a link, button or `[role="menuitem"]` inside closes the
panel unless `closeOnSelect={false}` or a `data-menu-picker-keep-open` ancestor says otherwise. Nothing is applied to the
document and nothing is persisted.

## HTML

`<div class="menu-picker">` → `<button class="menu-picker-button">` with an `aria-hidden` SVG (`menu-picker-icon`) →
`<div class="menu-picker-tooltip" role="tooltip">` → `<div class="menu-picker-panel" role="group" hidden>`.

**Not an ARIA menu.** The panel's content is arbitrary, so there is no `role="menu"` and no roving focus; it is a disclosure.

## Conventions this package follows

- Vue 3 `<script setup>`; strict TypeScript on the public surface.
- Runtime dependency: `@lilydesignsystem/vue-headless` (the trigger's `IconButton`) beside `vue`.
- No bundled CSS, fonts, images, links or English. The one bundled asset is the default hamburger icon, always overridable
  through `icon`.
- Every user-facing string comes from props or from the app's own content.
