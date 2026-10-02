# Changelog — PickerBar (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

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
