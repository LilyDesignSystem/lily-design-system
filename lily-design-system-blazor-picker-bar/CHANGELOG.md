# Changelog — PickerBar (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.7.0 — 2026-11-24

- **Order change:** the default themes list the 36 generic themes first, alphabetically, then the 27 company and
  public-sector themes alphabetically by label, so "NHS England (patients)" sorts under N. It replaces the order that put
  only the UK and US government themes last.
- `PickerBar.DefaultThemeLabels` gives the default themes whose title-cased slug reads wrongly their own names: "IBM
  Carbon", "SAP Fiori", "CMYK", "GitHub Primer", "Brazil Padrão Digital de Governo", "Canada Government of Canada Design
  System", "GOV.UK Design System", the six "NHS …" themes and "U.S. Web Design System". A `ThemeLabels` entry in
  `ThemeAttributes` still wins.

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

**`search-picker` joins the bar, first in the row** (maintainer-directed,
ported from the canonical Svelte change). `PickerBar` now renders
`SearchPicker` before the theme, locale, text-size and share pickers,
and gains a `ProjectReference` to `LilyDesignSystem.Blazor.SearchPicker`
(packed as a real NuGet dependency).

**Breaking:** `PickerBarLabels` gains three `required` members —
`Search` (the icon button and search landmark), `SearchInput` (the
field) and `SearchSubmit` (the `⏎` button) — with no English default,
so existing call sites must add them. A new `SearchAttributes`
dictionary is splatted onto the nested `SearchPicker` after the bar's
own parameters (last value wins), so `Action`, `Navigate`,
`Placeholder` and `OnSearch` reach it. Release as a minor bump.

## 0.1.0 — 2026-09-15

First release: composes `ThemePicker`, `LocalePicker`,
`TextSizePicker` and `SharePicker` into one page-header row, with the
45-theme reference list and the seven-step text-size scale pre-wired.
