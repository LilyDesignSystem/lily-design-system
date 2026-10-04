# Changelog

All notable changes to `@lilydesignsystem/html-search-picker` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/),
and this package uses [semantic versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Added: picker tooltip (minor, additive).** The button now has a purely visual `<div class="search-picker-tooltip" role="tooltip" hidden>` sibling holding its `label` text, shown on pointer hover (hoverable, WCAG 1.4.13) or keyboard focus, dismissible with `Escape`, never shown while the panel is open, and deliberately not linked with `aria-describedby`. New `.search-picker-tooltip` class hook; no new attributes or text. The "no user-facing text of its own" clause now also allows the tooltip's `label` text. Spec clauses 32-37.

**Fixed: tooltip `Escape` now works wherever focus is (WCAG 1.4.13).** The `Escape` handler was on the button only, so a tooltip shown by pointer hover alone could not be dismissed. While visible, the tooltip now listens for `Escape` on the document (no `preventDefault`, no focus move); the listener is added only while visible and removed on hide, re-render and disconnect. Spec clause 38.

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed)**, ported from the canonical Svelte
`@lilydesignsystem/svelte-search-picker` the same day. A
magnifying-glass icon button that opens a dropdown holding a search
field and a `⏎` submit button at its right. Return in the field, or the
`⏎` button, navigates to `/?<query>` (`foo` → `/?foo`). The query is
trimmed and URI-encoded; an empty query goes nowhere. `action` changes
the path, the `navigate` property swaps in a client-side router, and
`onSearch` / the bubbling `search` event observe the query. Required
labels, no English defaults. 32 tests covering spec §7.1–§7.31.

**Safari-safe dismissal.** The panel closes on focusout only when focus
moves to a known element outside the picker; a focusout with no
`relatedTarget` never closes it. Safari does not focus a `<button>` on
click, so pressing `⏎` (or the icon button) blurs the field with no
related target and leaves `document.activeElement` on `<body>` —
closing there (even after a deferred `activeElement` re-check) hid the
panel before the click landed, so `⏎` never searched and the icon
button re-opened instead of closing. Reproduced in real WebKit; spec
§5.2, regression test §7.24. Clicks outside are still handled by the
document click listener. Not yet
published.
