# Changelog — PickerBar (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
