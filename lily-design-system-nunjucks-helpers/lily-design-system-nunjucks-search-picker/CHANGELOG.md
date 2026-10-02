# Changelog — SearchPicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02

**New helper (maintainer-directed)**, ported from the canonical
`@lilydesignsystem/svelte-search-picker` the same day. A
magnifying-glass icon button that opens a dropdown holding a search
field and a `⏎` submit button at its right. Return in the field, or the
`⏎` button, navigates to `/?<query>` (`foo` → `/?foo`). The query is
trimmed and URI-encoded; an empty query goes nowhere. `action` changes
the path; the client options `navigate` and `onSearch` swap in a
client-side router and observe the query. Required labels, no English
defaults. Macro + client.js pair; the API reshaping the split forces is
documented in spec §3.3. Focus leaving the picker closes the panel only
when focus moves to a known element outside it: a focusout with no
`relatedTarget` (Safari, which does not focus a `<button>` on click)
leaves it open, so the `⏎` click still searches and the icon button
still toggles closed (spec §5.2, §7.24). Tests cover every spec §7
clause plus the §6 no-JS checks. Not yet published.
