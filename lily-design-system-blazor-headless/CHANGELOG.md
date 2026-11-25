# Changelog

This subproject is a directory of the canonical Lily Design System™ monorepo,
and does not keep a separate change history.

**The canonical changelog is
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).** It records every change to
this subproject, with reasoning, alongside the rest of the system.

Release highlights and project news: [NEWS.md](NEWS.md).

---

Lily™ and Lily Design System™ are trademarks.

## 0.12.0 — 2026-11-25 (behaviour changes)

- **Behaviour change:** `observation-view` shows only the words of an `entered-in-error` result; `showWithdrawn`, for an authorised history view, adds its former value struck through. A result that is not final and has no `statusLabel` shows no value. A withheld or withdrawn result renders no flag, range, meter or `data-interpretation`. `registered` and `unknown` are new.
- **Behaviour change:** `ClinicalFormat.AgeParts` refuses a year, a year and month, a time with no offset, an offset beyond 14:00 and an impossible date, and gives whole days or longer for a date with no time. A value finer than 20 decimal places is refused, not shown as 0. `FormatProportion` adds no digits to a percent. No formatter error holds the value it was given.
- **Added:** `Precision` on the quantity and range formatters, for a result's recorded precision; durations accept `,` as the decimal sign.
- **Fixed:** `DateTimeView` takes `Value` and `Format` and writes `datetime`. `Fieldset` `Legend`; `Caption` on the calendar, data, Gantt and kanban tables; `Scope` on the five header cells (`col` by default); `Pressed` on `Button` and `IconButton`; `Urgent` on `Notification` and `Toast`; `Heading`, `Role` and `Live` on `Alert`; `Decorative` on `Icon` and `Character`; `Status` on `StepListItem` and `ValidationListItem`. These write no empty `aria-label`.

## 0.11.1 — 2026-11-24

- Targets .NET 11 (`net11.0`); the previous release targeted .NET 10.

## 0.10.0 — 2026-11-16 (breaking)

- Removed (breaking): the thirteen pickers and picker buttons the radio groups supersede — `color-picker` and
  `emoji-character-picker` and the five rating and status pickers, each with its `-button`. Use the matching
  `*-radio-group` with its `*-radio-input`.
- Added: fourteen radio groups and inputs, each a `<fieldset role="radiogroup">` of native radios: `red-amber-green-`,
  `red-orange-yellow-green-blue-`, `five-face-rating-`, `five-star-rating-`, `net-promoter-score-`, `color-` and
  `emoji-character-radio-group`, each with its `-radio-input`.
- Added: `international-patient-summary` and `international-patient-summary-section` (structure only: the root adds any
  missing required section, in words; `idPrefix`).
- The monorepo [CHANGELOG](../CHANGELOG.md) has the detail.
