# Changelog — @lilydesignsystem/svelte-picker-bar

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/) and the package follows
[Semantic Versioning](https://semver.org/). Each entry names the pickers and props that changed, and marks anything that can
change what a page shows. The monorepo's root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md) has the reasoning behind each change.

## 0.9.0 — 2026-11-22

- **Changed (order):** the default `themes` are one list sorted alphabetically by the name shown, not the 36 generic themes first
  and then the 27 company and public-sector ones. The theme picker inside sorts the same way whatever order it is given
  (`sortThemes`, default on; `sortThemes={false}` keeps the order of `themes`). Pickers: `theme-picker`.
- **Order change:** the default `themes` are one list sorted by the name shown, not the 36 generic themes first and then the 27 company and public-sector ones; the theme picker inside sorts the same way whatever order it is given (`sortThemes`, default on). Depends on the theme picker's new release.

## 0.8.0 — 2026-11-21

- **Changed (order):** the default `themes` list the 36 generic themes first, then the 27 company and public-sector themes
  alphabetically by label. **Fixed:** `DEFAULT_THEME_LABELS` spells the names title-casing got wrong ("IBM Carbon", "SAP Fiori",
  "CMYK", "GitHub Primer", "GOV.UK Design System" and the six "NHS …" themes); a consumer's own `themeLabels` win. Pickers:
  `theme-picker`.

## 0.7.0 and earlier

See the root [CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md). Versions 0.7.0
(2026-11-16) and before were published without an entry here.
