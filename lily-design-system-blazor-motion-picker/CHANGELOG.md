# Changelog — motion-picker (Blazor)

All notable changes to this helper are documented in this file.

## 0.3.0 — 2026-10-16

- Added `Open` (bindable: `@bind-Open`, with `OpenChanged`) and `Disabled`, ported from the Svelte package's `open`, `onOpenChange` and `disabled` (spec "Open state and disabled"). `OpenChanged` is raised with the new state whenever the picker changes it (the user's action, or `Disabled` closing it); changing `Open` from the parent opens or closes the popup without moving focus; `Disabled` disables the button.

## 0.2.0 — 2026-10-04

**Added (minor, additive): picker tooltip.** A new `.motion-picker-tooltip` element
(`<div role="tooltip">`, a sibling right after the icon button, always rendered, `hidden` at rest)
holding the button's `Label` text, shown on pointer hover (hoverable) and keyboard focus, dismissed
by `Escape`, never shown while the popup is open. No new parameters, no new English text, no
`aria-describedby`. Blazor deviation: keyboard focus is told from pointer focus via
`@onmousedown` + `@onfocus` rather than `:focus-visible` (no JS interop). 6 new tests.

**Tooltip Escape works wherever focus is inside the picker.** `@onkeydown` on the root and tooltip dismisses a visible tooltip, not just on the button (WCAG 1.4.13). Blazor deviation: no document-level listener without JS interop, so Escape with focus entirely outside the picker (hover only) is not supported. 2 new tests.
