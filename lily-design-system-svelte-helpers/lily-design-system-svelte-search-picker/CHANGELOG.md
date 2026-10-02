# Changelog — SearchPicker (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed).** A magnifying-glass icon button that
opens a dropdown holding a search field and a `⏎` submit button at its
right. Return in the field, or the `⏎` button, navigates to `/?<query>`
(`foo` → `/?foo`). The query is trimmed and URI-encoded; an empty query
goes nowhere. `action` changes the path, `navigate` swaps in a client-side
router, `onSearch` observes the query. Required labels, no English
defaults. 24 tests, one per spec §7 clause. Not yet published.

Safari-safe before release: a focusout with no `relatedTarget` (Safari
does not focus a `<button>` on click) no longer closes the panel —
reproduced in real WebKit, where clicking `⏎` closed the panel before
the click landed and the search never ran (§7.24).
