# Changelog — lily-design-system-svelte-date-time-picker

All notable changes to this package. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow
[Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-27

Initial release. The fifth helper in the Svelte catalog, and the first that
is a **form control** rather than a page-header preference control.

### Added

- `DateTimePicker.svelte` — a headless date / time / datetime control: a
  typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E) opening a
  WAI-ARIA APG Date Picker Dialog.
- Three modes (`date`, `time`, `datetime`) over an ISO value contract:
  `YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM` — the same shape
  `<input type="date">` posts.
- Constraint props: `min`, `max`, and an arbitrary `isDateDisabled`
  predicate.
- `shortcuts` — consumer-labelled quick picks by day offset, calendar-month
  offset, or absolute date.
- Optional ISO-8601 week-number column (`showWeekNumbers`), with the
  Thursday rule, so the week containing 1 January 2021 is week 53.
- Typed input: ISO, locale-ordered numerics, and written month names in the
  locale's own vocabulary.
- `formatValue` / `parseInput` escape hatches.
- Exported civil-date arithmetic — `addDays`, `addMonths`, `isoWeek`,
  `monthMatrix`, `parseDateInput` and the rest — because a consumer wiring
  `min` / `max` / `shortcuts` is doing date maths too, and the alternative
  is that they reach for a `Date` and reintroduce the bug below.
- 58 tests, one per acceptance clause in `spec/index.md` §7.

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

Twelve departures, each fixing a defect rather than expressing a taste.
Full list in `spec/index.md` §9; the four that matter most:

- **No hardcoded English.** DHCW bakes in `MONTHS`, `SHORT_MONTHS`,
  `"Today"`, `"+1 week"`, `"Cancel"`, `"OK"`, `"Previous year"` and
  `"Open calendar for …"`. Here, month and weekday names come from `Intl`
  and every other string is a prop. For a *Welsh* design system this is not
  a technicality: it is the difference between a bilingual service and an
  English one with a Welsh veneer.
- **Monday is not assumed.** DHCW hardcodes a Monday-first grid. First day
  of week comes from `Intl.Locale.getWeekInfo`, overridable by prop.
- **The focus trap exists.** DHCW declares `aria-modal="true"` and traps
  nothing, which is worse than not declaring it: the user is told the rest
  of the page is inert while Tab quietly walks into it.
- **Civil dates, not local-midnight `Date`.** DHCW builds every date with
  `new Date(y, m, d)`, which is an *instant* at local midnight and resolves
  to the previous day in zones whose DST transition falls at midnight. All
  arithmetic here goes through UTC epoch days.

Also fixed in passing: `min`/`max` support (DHCW cannot constrain selection
at all, so a booking picker will offer last Tuesday); a fixed six-row grid
so the dialog does not change height as you page; no `innerHTML` string
building with interpolated attributes; SSR-safe ids instead of
`Math.random()`; Escape that genuinely discards; and typed text that is
*marked* invalid rather than silently ignored while the field goes on
showing something that is not the value.

### Notes

- **Nothing is persisted.** Unlike the four preference helpers, this writes
  no `localStorage`: a date in a form is data, not a preference, and
  restoring a stale appointment date on a later visit would be a defect.
- **No time zones, no seconds, no ranges, no recurrence.** Scope and
  reasoning in `spec/index.md` §2.
- **Two divergences from the sibling helpers**, both deliberate: it is a
  form control so it has a text field, and its ten user-facing strings
  arrive as one `labels` object rather than ten flat props.
- Ports to the other six catalogs are pending. Svelte is canonical per
  `AGENTS/helpers.md`.
