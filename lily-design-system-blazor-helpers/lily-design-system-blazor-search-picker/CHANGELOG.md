# Changelog — SearchPicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Added (minor, additive): picker tooltip.** A new `.search-picker-tooltip` element
(`<div role="tooltip">`, a sibling right after the icon button, always rendered, `hidden` at rest)
holding the button's `Label` text, shown on pointer hover (hoverable) and keyboard focus, dismissed
by `Escape`, never shown while the popup is open. No new parameters, no new English text, no
`aria-describedby`. Blazor deviation: keyboard focus is told from pointer focus via
`@onmousedown` + `@onfocus` rather than `:focus-visible` (no JS interop). 6 new tests.

**Tooltip Escape works wherever focus is inside the picker.** `@onkeydown` on the root and tooltip dismisses a visible tooltip, not just on the button (WCAG 1.4.13). Blazor deviation: no document-level listener without JS interop, so Escape with focus entirely outside the picker (hover only) is not supported. 2 new tests.

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed)**, ported from the canonical
`@lilydesignsystem/svelte-search-picker` the same day. A
magnifying-glass icon button that opens a dropdown holding a search
field and a `⏎` submit button at its right. Return in the field, or the
`⏎` button, navigates to `/?<query>` (`foo` → `/?foo`). The query is
trimmed and encoded exactly as `encodeURIComponent` would; an empty
query goes nowhere. `Action` changes the path, `Navigate` replaces the
default `NavigationManager.NavigateTo(href, forceLoad: true)`,
`OnSearch` observes the query. Required labels, no English defaults.
The trigger composes the headless `IconButton`. 26 tests, one per spec
§7 clause. Blazor deviations are recorded in spec §9. Not yet published.

**Safari focus fix (before release).** Clicking the icon button with
the panel open in Safari — which does not focus a button on click —
blurred the field to `<body>`; the focusout check read that as "focus
left", closed the panel, and the click then re-opened it, so the toggle
never closed. The check now follows the canonical rule (spec §7.18,
§7.24): only focus confirmed to have moved outside the root, or a click
confirmed to have landed outside it, closes the panel; a blur to
`<body>` with the click landing inside — or an interop failure — leaves
it open. `FocusInsideScript` became `FocusLeftScript`. Two §7.24 tests
added.
