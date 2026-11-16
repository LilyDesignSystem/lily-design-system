# Changelog

This subproject is a directory of the canonical Lily Design System™ monorepo,
and does not keep a separate change history.

**The canonical changelog is
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).** It records every change to
this subproject, with reasoning, alongside the rest of the system.

Release highlights and project news: [NEWS.md](NEWS.md).

---

Lily™ and Lily Design System™ are trademarks.

## 0.11.0 — 2026-11-16 (breaking)

- Removed (breaking): the thirteen pickers and picker buttons the radio groups supersede — `color-picker` and
  `emoji-character-picker` and the five rating and status pickers, each with its `-button`. Use the matching
  `*-radio-group` with its `*-radio-input`.
- Added: fourteen radio groups and inputs, each a `<fieldset role="radiogroup">` of native radios: `red-amber-green-`,
  `red-orange-yellow-green-blue-`, `five-face-rating-`, `five-star-rating-`, `net-promoter-score-`, `color-` and
  `emoji-character-radio-group`, each with its `-radio-input`.
- Added: `international-patient-summary` and `international-patient-summary-section` (structure only: the root adds any
  missing required section, in words; `idPrefix`).
- The monorepo [CHANGELOG](../CHANGELOG.md) has the detail.
