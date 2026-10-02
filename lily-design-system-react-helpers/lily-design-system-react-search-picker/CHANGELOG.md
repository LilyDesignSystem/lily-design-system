# Changelog — SearchPicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
