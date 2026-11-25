# Changelog

This subproject is a directory of the canonical Lily Design System™ monorepo,
and does not keep a separate change history.

**The canonical changelog is
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).** It records every change to
this subproject, with reasoning, alongside the rest of the system.

Release highlights and project news: [NEWS.md](NEWS.md).

---

Lily™ and Lily Design System™ are trademarks.

## 0.16.0 — 2026-11-25 (behaviour changes; published under `next`)

- **Behaviour change:** `observation-view` shows only the words of an `entered-in-error` result; `showWithdrawn`, for an authorised history view, adds its former value struck through. A result that is not final and has no `statusLabel` shows no value. A withheld or withdrawn result renders no flag, range, meter or `data-interpretation`. `registered` and `unknown` are new.
- **Behaviour change:** `ageParts` refuses a year, a year and month, a time with no offset, an offset beyond 14:00 and an impossible date, and gives whole days or longer for a date with no time. A value finer than 20 decimal places is refused, not shown as 0. `formatProportion` adds no digits to a percent. No formatter error holds the value it was given.
- **Added:** `precision` on the quantity and range formatters, for a result's recorded precision; durations accept `,` as the decimal sign.
- **Behaviour change:** invalid input throws instead of being clamped or defaulted: an empty section key, id or id prefix, or a missing required heading, in `international-patient-summary` (`IpsSectionsError`); a malformed `end` or `maxWidth` in `middle-truncation` (`TruncateMiddleError`); an index, centre or page size out of range in `wheel-picker` (`WheelPickerError`).
- **Fixed:** `age-view`, `duration-view` and `date-time-view` no longer leave what they were given on the host element.
- The licence expression offers CC-BY-SA-4.0 where it offered CC-BY-NC-SA-4.0.

## 0.14.0 — 2026-11-21

- **Added:** `whole-card-link` on `lily-card`: with `href`, the heading link carries `data-lily-card-link`, so the themes' shared "Whole-card link"
  section makes the whole card its target and draws its focus ring round the card.
- **Added:** `statistic` takes a `change` (with `trend`: up, down or flat, as `data-trend`) and an "as of" time
  (`asOf` with `asOfLabel`, rendered as a `<time>`); it draws no arrow, and every word is yours.
- **Added:** `observation-view` takes `meterValue`, `meterMin` and `meterMax` (with optional `meterLow`, `meterHigh` and
  `meterOptimum`) and draws an `aria-hidden` native `<meter>`; the value, range and flag stay the text.
- **Fixed:** `tool-bar` uses the shared toolbar keys.
- Other changes in this range, including the 2026-11-20 backlog batch, are recorded in the root
  [CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.13.0 — 2026-11-18

- **Changed:** an `id` given to an input component (`lily-text-input`, `lily-email-input`, `lily-select` and the other
  components that render one labelable control) moves to that control instead of being copied, so there is one element
  with the id and a `<label for>` or `aria-labelledby` reaches the control. Code that looked the custom element up by
  that id now finds the control (P38-T3).
- **Fixed:** `lily-field` labels the control inside an input component: its generated id, or the component's own, goes
  on the inner `<input>` or `<select>`, so `input.labels` has one entry. Before, the label pointed at the custom element,
  which cannot be labelled, and labelled nothing.

## 0.12.0 — 2026-11-18 (breaking)

- **Breaking:** the 164 national personal identifier components (an `-input` and a `-view` for each of 82 identifier
  types) move to their own package, `@lilydesignsystem/web-components-headless-identifiers`. They are removed, not re-exported; this package now has the 473 other
  catalog components.
- **Migration:** install `@lilydesignsystem/web-components-headless-identifiers` and import the identifier components from it; their props, class hooks and behaviour
  are unchanged.

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
