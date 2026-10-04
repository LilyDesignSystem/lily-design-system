# Changelog — SearchPicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Added (minor, additive): a picker tooltip.** A new `.search-picker-tooltip` element (`role="tooltip"`, `hidden` at rest) follows the icon button and shows the button's existing `label` on pointer hover, on the tooltip itself (hoverable), and on keyboard focus (`:focus-visible`); `Escape` dismisses it without moving focus, and it is never shown while the panel is open. No new props and no new text; deliberately not linked by `aria-describedby`, since it duplicates the button's `aria-label`. The existing "no user-facing text of its own" test now allows the tooltip text (the label). Position and appearance are theme CSS keyed on `hidden`.

**Fix: tooltip `Escape` now works wherever focus is.** While the tooltip is visible, a `document` `keydown` listener (added only while visible, removed on hide/unmount) dismisses it, so a pointer-hover-only tooltip is dismissable without moving pointer or focus (WCAG 1.4.13). Does not prevent default, stop propagation, or move focus.

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed), ported from
`@lilydesignsystem/svelte-search-picker` 0.1.0.** A magnifying-glass icon
button that opens a dropdown holding a search field and a `⏎` submit
button at its right. Return in the field, or the `⏎` button, navigates to
`/?<query>` (`foo` → `/?foo`). The query is trimmed and URI-encoded; an
empty query goes nowhere. `action` changes the path, `navigate` swaps in
a client-side router, `onSearch` observes the query. Required labels, no
English defaults. The trigger composes `@lilydesignsystem/react-headless`'s
`IconButton`. Svelte's bindable `value` is expressed as React's
controlled `value` + `onChange` or uncontrolled `defaultValue`. 25 tests
covering all 24 spec §7 clauses. Safari-safe focusout: the panel closes
only when focus moves to a known element outside the root — a focusout
with no `relatedTarget` (Safari's click on `⏎` or the icon button, which
does not focus the button) leaves it open so the click still lands
(§7.24; reproduced in real WebKit). Not yet published.
