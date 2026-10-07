# Changelog — PickerBar (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

**Picks up the pickers' new tooltips (no code change).** The composed pickers now each render a `.{helper}-tooltip` element after their icon button and wire it in their own `init*Picker`; `pickerBar` and `initPickerBar` need no change. Verified by the bar's tests: every picker in the bar renders its tooltip and `initPickerBar` wires it.

## 0.3.0 — 2026-10-07

**Added: an optional leftmost link picker (minor, additive).** New `links` (page links the app defines) and `labels.link` render a
`link-picker` (a home icon opening a disclosure of those links) FIRST in the bar, before search. It renders only when both are
supplied, so existing consumers see no change. No default links and no English. See the spec §7a (§L1–§L4).

## 0.2.0 — 2026-10-04

**`search-picker` joins the bar, first in the row** (ports the
canonical `@lilydesignsystem/svelte-picker-bar` change). `pickerBar`
now renders `searchPicker` before the theme, locale, text-size and
share pickers, and depends on `@lilydesignsystem/nunjucks-search-picker`
`^0.1.0`; `initPickerBar`/`autoInit` wire it alongside the other four
and return it as `search`, and `autoInitSearchPicker` is re-exported.
**Breaking:** `labels` gains three required names — `search` (the icon
button and search landmark), `searchInput` (the field) and
`searchSubmit` (the `⏎` button) — with no English default, so existing
call sites must add them. A new `searchProps` object forwards the rest:
on the macro, the renderable options (`placeholder`, `value`, `action`,
`name`, `id`, `classes`, `attributes`); on the client
(`initPickerBar`/`autoInit`), the function-valued `navigate` and
`onSearch`, which a macro cannot carry (spec §3.4). Release as a minor
bump.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-nunjucks-picker-bar` → `@lilydesignsystem/nunjucks-picker-bar`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-nunjucks-picker-bar`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-nunjucks-picker-bar`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
