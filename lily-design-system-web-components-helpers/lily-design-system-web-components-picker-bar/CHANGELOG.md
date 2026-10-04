# Changelog — `<lily-picker-bar>` (Web Components helper)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**`search-picker` joins the bar, first in the row.** `<lily-picker-bar>`
now renders `<lily-search-picker>` before the theme, locale, text-size
and share pickers, and depends on
`@lilydesignsystem/web-components-search-picker` ^0.1.0.
**Breaking:** `labels` gains three required names — `search` (the icon
button and search landmark), `searchInput` (the field) and
`searchSubmit` (the `⏎` button) — with no English default, so existing
call sites must add them. A new property-only `searchProps` bag
(`Object.assign`ed like the other bags) forwards anything else
(`action`, `navigate`, `placeholder`, `onSearch`). Ports the Svelte
canonical's change. Release as a minor bump.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-web-components-picker-bar` → `@lilydesignsystem/web-components-picker-bar`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-web-components-picker-bar`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-web-components-picker-bar`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
