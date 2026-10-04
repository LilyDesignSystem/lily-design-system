# Changelog — PickerBar (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**`search-picker` joins the bar, first in the row.** `PickerBar` now
renders `SearchPicker` before the theme, locale, text-size and share
pickers, and depends on `@lilydesignsystem/vue-search-picker`.
**Breaking:** `labels` gains three required names — `search` (the icon
button and search landmark), `searchInput` (the field) and
`searchSubmit` (the `⏎` button) — with no English default, so existing
call sites must add them. A new `searchProps` bag forwards anything
else (`action`, `navigate`, `placeholder`), and `SearchPicker`'s own
`search` event is re-emitted as the bar's `search` event (the Vue
equivalent of the Svelte canonical's `onSearch` inside `searchProps`).
Release as a minor bump.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-vue-picker-bar` → `@lilydesignsystem/vue-picker-bar`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-vue-picker-bar`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-vue-picker-bar`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
