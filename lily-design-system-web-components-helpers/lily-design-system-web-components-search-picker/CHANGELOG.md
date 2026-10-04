# Changelog

All notable changes to `@lilydesignsystem/web-components-search-picker` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/),
and this package uses [semantic versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Tooltip (additive, minor).** New `.search-picker-tooltip` element
(`role="tooltip"`, a sibling right after the icon button, `hidden` at rest,
holding the button's `label`) and class hook, shown on pointer hover
(hoverable), on keyboard focus (`:focus-visible`), dismissed by `Escape`,
never shown while the panel is open. Not linked by `aria-describedby`
(it duplicates `aria-label`). 8 new tests, spec §7.32–§7.37.

**Tooltip Escape works wherever focus is.** While the tooltip is visible a `document` `keydown` listener dismisses it on `Escape` (hover-only tooltips now dismiss, WCAG 1.4.13); removed on hide/disconnect. 2 new tests, spec clause 38.

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed)**, ported from the canonical Svelte
`@lilydesignsystem/svelte-search-picker` the same day. A
magnifying-glass icon button that opens a dropdown holding a search
field and a `⏎` submit button at its right. Return in the field, or the
`⏎` button, navigates to `/?<query>` (`foo` → `/?foo`). The query is
trimmed and URI-encoded; an empty query goes nowhere. `action` changes
the path, the `navigate` property swaps in a client-side router, and
`onSearch` / the bubbling `search` event observe the query. The trigger
composes `@lilydesignsystem/web-components-headless`'s
`<lily-icon-button>`, as `<lily-share-picker>` does. Required labels,
no English defaults. 32 tests covering spec §7.1–§7.31.

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
