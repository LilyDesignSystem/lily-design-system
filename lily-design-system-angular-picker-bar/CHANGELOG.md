# Changelog — PickerBar (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-10-07

**Added: an optional leftmost link picker (minor, additive).** New `links` (page links the app defines) and `labels.link` render a
`link-picker` (a home icon opening a disclosure of those links) FIRST in the bar, before search. It renders only when both are
supplied, so existing consumers see no change. No default links and no English. See the spec §7a (§L1–§L4).

## 0.2.0 — 2026-10-04

**`search-picker` joins the bar, first in the row.** `PickerBar` now
renders `SearchPicker` before the theme, locale, text-size and share
pickers, and depends on `@lilydesignsystem/angular-search-picker`
`^0.1.0`. **Breaking:** `labels` gains three required names — `search`
(the icon button and search landmark), `searchInput` (the field) and
`searchSubmit` (the `⏎` button) — with no English default, so existing
call sites must add them. Following this port's flattened-inputs idiom
(no generic `searchProps` spread in Angular), new inputs
`searchPlaceholder`, `searchValue` (`model()`), `searchAction`, and
`searchNavigate` forward to the search picker, and its `searched`
output is re-emitted. Two new tests (§7.12, §7.13). Release as a minor
bump.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-angular-picker-bar` → `@lilydesignsystem/angular-picker-bar`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-angular-picker-bar`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-angular-picker-bar`) is recorded in the root
[CHANGELOG.md](../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
