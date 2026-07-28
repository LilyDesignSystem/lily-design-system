# Changelog — lily-design-system-angular-date-time-picker

All notable changes to this package. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-28

Initial release. The Angular port of the fifth Lily helper, and the first
in this catalog that is a **form control** rather than a page-header
preference control.

### Added

- `DateTimePicker` — a headless date / time / datetime control: a typeable
  text field plus an icon button (📅 U+1F4C5 + U+FE0E) opening a
  WAI-ARIA APG Date Picker Dialog.
- Three modes (`date`, `time`, `datetime`) over an ISO value contract:
  `YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM` — the same shape
  `<input type="date">` posts. `value` is a `model<string>()`, bound with
  `[(value)]`.
- Constraint inputs: `min`, `max`, and an arbitrary `isDateDisabled`
  predicate.
- `shortcuts` — consumer-labelled quick picks by day offset, calendar-month
  offset, or absolute date; reported via the `(shortcut)` output.
- Optional ISO-8601 week-number column (`showWeekNumbers`), with the
  Thursday rule, so the week containing 1 January 2021 is week 53.
- Typed input: ISO, locale-ordered numerics, and written month names in the
  locale's own vocabulary.
- `formatValue` / `parseInput` escape hatches.
- A projected `<ng-template>` icon slot, typed by the `DateTimePickerIcon`
  marker directive, replacing the default glyph.
- Exported civil-date arithmetic — `addDays`, `addMonths`, `isoWeek`,
  `monthMatrix`, `parseDateInput` and the rest — because a consumer wiring
  `min` / `max` / `shortcuts` is doing date maths too, and the alternative
  is that they reach for a `Date` and reintroduce the bug below.
- One test per acceptance clause in `spec/index.md` §7.

### Implemented from DHCW

This package exists because Digital Health and Care Wales publishes a date
picker in its [NHSW component
library](https://github.com/dhcw-digital-health-and-care-wales/nhsw-component-library)
and Lily had no equivalent. Everything it does is here: the field and
toggle, the dialog, month and year navigation, the live-region heading,
weekday headers with `abbr`, full-date `aria-label`s on day cells, roving
tabindex, today / other-month / pending states, the whole keyboard contract
(arrows, Home/End, PageUp/Down, Shift+PageUp/Down, Enter, Escape),
shortcuts, the Cancel/OK footer, parse-on-open, change notification,
pre-population, `disabled`, `aria-describedby` passthrough, and
click-outside-to-close. Parity table in `spec/index.md` §8.

### Deliberately different from DHCW

Twelve departures, ported unchanged from the canonical Svelte helper and
full list in `spec/index.md` §9; the four that matter most:

- **No hardcoded English.** DHCW bakes in `MONTHS`, `SHORT_MONTHS`,
  `"Today"`, `"+1 week"`, `"Cancel"`, `"OK"`, `"Previous year"` and
  `"Open calendar for …"`. Here, month and weekday names come from `Intl`
  and every other string is an input. For a *Welsh* design system this is
  not a technicality: it is the difference between a bilingual service
  and an English one with a Welsh veneer.
- **Monday is not assumed.** DHCW hardcodes a Monday-first grid. First day
  of week comes from `Intl.Locale.getWeekInfo`, overridable by input.
- **The focus trap exists.** DHCW declares `aria-modal="true"` and traps
  nothing, which is worse than not declaring it: the user is told the rest
  of the page is inert while Tab quietly walks into it.
- **Civil dates, not local-midnight `Date`.** DHCW builds every date with
  `new Date(y, m, d)`, which is an *instant* at local midnight and resolves
  to the previous day in zones whose DST transition falls at midnight. All
  arithmetic here goes through UTC epoch days.

### Angular-specific deviations from the Svelte original

All noted in `spec/index.md` §3 and this package's `AGENTS.md`:

- `value` is `model<string>("")`, not a Svelte bindable prop.
- `onChange` / `onShortcut` / `onInvalidInput` become the outputs
  `(change)`, `(shortcut)`, `(invalidInput)`; `shortcut` emits one
  `ShortcutEvent` object rather than two positional arguments.
- `class` → `className`; `readonly` → `readOnly` (the DOM's own IDL
  property name, chosen to avoid colliding with the TypeScript `readonly`
  modifier that decorates every input declaration in this catalog).
- The `children` snippet becomes a projected `<ng-template>`, queried via
  `contentChild(TemplateRef)` and typed by the `DateTimePickerIcon` marker
  directive.
- No `...restProps` spread: Angular already forwards unbound attributes
  from the host tag onto the host element with no component code.
- The once-only view/cursor seed runs inside a guarded `effect()` rather
  than synchronously at construction, because Angular signal inputs are
  not bound yet when the constructor runs.

### Notes

- **Nothing is persisted.** Unlike the three preference helpers, this
  writes no `localStorage`: a date in a form is data, not a preference,
  and restoring a stale appointment date on a later visit would be a
  defect.
- **No time zones, no seconds, no ranges, no recurrence.** Scope and
  reasoning in `spec/index.md` §2.
- Ports to the remaining catalogs are pending. Svelte is canonical per
  `AGENTS/helpers.md`.
