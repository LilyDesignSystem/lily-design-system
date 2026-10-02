# Changelog — SearchPicker (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed), ported from the Svelte canonical
`@lilydesignsystem/svelte-search-picker`.** A magnifying-glass icon
button (composing the headless `IconButton`) that opens a dropdown
holding a search field and a `⏎` submit button at its right. Return in
the field, or the `⏎` button, navigates to `/?<query>` (`foo` →
`/?foo`). The query is trimmed and URI-encoded; an empty query goes
nowhere. `action` changes the path, `navigate` swaps in a client-side
router, the `searched` output observes the query. Required labels, no
English defaults. Angular idiom deviations (output named `searched`,
`model()` value, `className`, host attributes in place of rest props,
synchronous focus moves) are recorded in spec §3. Safari-safe
focusout: the panel closes only when focus moves to a known element
outside the root — a focusout with no `relatedTarget` (Safari does not
focus a clicked `<button>`, so clicking ⏎ or the icon button blurs the
field with `relatedTarget = null`) leaves it open, so the click still
lands; clicks outside are handled by the document click listener
(§5.2, §7.24). 24 tests, one per spec §7 clause. Not yet published.
