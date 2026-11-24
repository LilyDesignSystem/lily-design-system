# Changelog — PickerBar (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.11.0 — 2026-11-24

- **Behaviour change**, from `@lilydesignsystem/angular-theme-picker` 0.6.0: the theme cookie is off by default (tasks.md P41-T5c). Pass the cookie name through `themeProps` (for example `cookieName: "lily-theme"`) to keep it for a server-rendered page.

## 0.10.0 — 2026-11-23

- **Changed:** the default `themes` list has 65 entries: it gains "Light High-Contrast" and "Dark High-Contrast" (WCAG 2.2 AAA), sorted with the rest by the name shown. Pickers: `theme-picker`.

## 0.9.0 — 2026-11-22

- **Order change:** the default `themes` are one list sorted by the name shown, not the 36 generic themes first and then the 27 company and public-sector ones; the theme picker inside sorts the same way whatever order it is given (`sortThemes`, default on). Depends on the theme picker's new release.

## 0.8.0 — 2026-11-21

- **Order change:** the default themes list the 36 generic themes first, alphabetically, then the 27 company and
  public-sector themes alphabetically by label, so "NHS England (patients)" sorts under N. It replaces the order that put
  only the UK and US government themes last.
- `DEFAULT_THEME_LABELS` (exported) gives the default themes whose title-cased slug reads wrongly their own names: "IBM
  Carbon", "SAP Fiori", "CMYK", "GitHub Primer", "Brazil Padrão Digital de Governo", "Canada Government of Canada Design
  System", "GOV.UK Design System", the six "NHS …" themes and "U.S. Web Design System". The consumer's own theme labels
  still win.

## 0.7.0 — 2026-11-16

- Depends on theme-picker ^0.4.0: the theme picker in the bar now offers "Follow this device" (pass `systemLabel` through
  the theme picker's props) and keeps the choice in both `localStorage` and a first-party cookie, under `lily-theme`,
  written only when the choice changes. Pass an empty `storageKey` / `cookieName` through the theme picker's props to
  turn a store off.

## 0.6.0 — 2026-11-14

- Search is optional: without `labels.search` the bar renders no search picker (tasks.md P28-T7). A client-side app
  can leave it out, since a search navigates to `/?text` and drops the app's state. `search`, `searchInput` and
  `searchSubmit` are optional in the labels type; give all three to keep search. Not breaking: a bar given them is unchanged.

## 0.4.0 — 2026-10-16

- The default `themes` list now has all 57 root `themes/` slugs (49 general and design-system themes, then the 8 UK and US government themes), up from 45: adds ant-design, atlassian, cappuccino, excel, fluent, github-primer, ibm-carbon, linear, notion, salesforce, sap-fiori and vercel.

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
