# Changelog — SearchPicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-02, additions before first publication

**Added: hover/keyboard-focus tooltip (minor, additive).** A new
`<div class="search-picker-tooltip" role="tooltip">` sits right after the icon button, always in the DOM and `hidden` at rest, holding the button's existing `label` text (no new props, no new English text). It is shown while the pointer is over the button or the tooltip (hoverable), or while the button has keyboard focus (`:focus-visible`); `Escape` on the button dismisses it without moving focus; it is never shown while the panel is open. Not linked with `aria-describedby` (it would duplicate the `aria-label`). New class hook `.search-picker-tooltip`; styling is the theme CSS's. Spec clauses §7.25–§7.30.

**Fixed: tooltip `Escape` now works wherever focus is (WCAG 1.4.13).** While the tooltip is visible a document `keydown` listener dismisses it on `Escape`, so a hover-only tooltip (focus elsewhere) is dismissable too; added only while visible, removed on hide/unmount. Spec clause §7.31.

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
