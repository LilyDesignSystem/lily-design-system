# Changelog — SearchPicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Added: picker tooltip (minor, additive).** The macro now renders `<div class="search-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>` as a sibling right after the icon button — the button's existing `label`, no new macro argument, no new English text, deliberately not linked with `aria-describedby`. The client wires it: shown on pointer hover (over the button or the tooltip itself) or keyboard focus (`:focus-visible`); `Escape` on the button dismisses it without moving focus; never shown while the popup is open; idempotent across repeated init. New class hook `.search-picker-tooltip`; theme CSS for it already ships in `themes/`. Ports the canonical Svelte change.

The 'no user-facing text of its own' clause now also allows the tooltip's `label`.

**Fixed: tooltip Escape now works wherever focus is.** While the tooltip is visible, `client.js` listens for `Escape` on the document (added only while visible, removed on hide, `destroy()` and re-init), so a tooltip shown by pointer hover alone with focus elsewhere can be dismissed (WCAG 1.4.13). It never calls `preventDefault`/`stopPropagation` and never moves focus.

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
