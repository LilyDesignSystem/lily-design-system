# Changelog — SearchPicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed), ported from the Svelte canonical.**
A magnifying-glass icon button that opens a dropdown holding a search
field and a `⏎` submit button at its right. Return in the field, or the
`⏎` button, navigates to `/?<query>` (`foo` → `/?foo`). The query is
trimmed and URI-encoded; an empty query goes nowhere. `action` changes
the path, `navigate` swaps in a client-side router, the `search` event
observes the query, `v-model:value` binds the text. Required labels, no
English defaults. The trigger composes `@lilydesignsystem/vue-headless`'s
`IconButton`. Safari-safe focusout: the panel closes only when focus
moves to a known element outside the picker — a focusout with no
`relatedTarget` (Safari's click on `⏎` or the icon button, which does not
focus a `<button>`) leaves it open, so the click still lands. 24 tests,
one per spec §7 clause. Not yet published.
