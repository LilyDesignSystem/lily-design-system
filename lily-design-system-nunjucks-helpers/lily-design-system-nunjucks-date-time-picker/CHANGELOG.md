# Changelog — DateTimePicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-28

First release. A port of the canonical
`lily-design-system-svelte-date-time-picker` helper — itself the fifth
helper in the Lily™ catalog, currently Svelte-only elsewhere, listed as
a "fifth helper" alongside the four preference/action helpers in
`AGENTS/helpers.md` — following this catalog's macro + `client.js`
split. It is the hardest port so far: a server-rendered macro cannot
run the interactive dialog logic itself, and — unlike the other four
helpers — cannot even render the calendar's *static* interior, because
producing it needs `Intl.DateTimeFormat` and civil-date arithmetic that
Nunjucks has no access to.

### The package as it stands

- **`date-time-picker.njk`** — the `dateTimePicker(opts)` macro.
  Renders the trigger, the hidden input, the header's four navigation
  buttons, the hour/minute `<label>`s, any shortcut buttons, and the
  clear/cancel/confirm footer — everything whose text is fixed at
  render time. Deliberately leaves the weekday header row, the day
  grid, the period heading, and the hour/minute/meridiem option lists
  empty, because none of it can be produced by a template. See
  `spec/index.md` §3.2 for the full account.
- **`date-time-picker.client.js`** — the runtime. Ports the canonical
  helper's civil-date arithmetic (`addDays`, `addMonths`,
  `parseIsoDate`, `toEpochDay`/`fromEpochDay`, `isoWeek`,
  `parseDateInput`, `parseTimeInput`, …) and locale-driven formatting
  (`firstDayOfWeekFor`, `monthNames`, `dayLabel`, `defaultFormatValue`,
  …) near-verbatim, then adds `initDateTimePicker(root, opts)` and
  `autoInit(opts)`, which build the grid, weekday header, period
  heading, and time-select options imperatively on every open and every
  month/year page — there being no framework reactivity here to lean
  on. Owns the full keyboard contract (grid arrows / Home / End /
  PageUp / PageDown / Shift+PageUp / Shift+PageDown / Enter / Space),
  a real focus trap in the dialog, and the pending-vs-committed value
  split.
- **Three documented deviations from the canonical Svelte props**,
  forced by the macro/client split — full rationale in
  `spec/index.md` §3.4:
  1. `isDateDisabled` (a function in Svelte) becomes `disabledDates`
     (an array of ISO strings) in the macro, JSON-encoded as a data
     attribute; a real `isDateDisabled` function at `initDateTimePicker`
     time **replaces** that baseline rather than unioning with it.
  2. `formatValue` / `parseInput` have no macro-side substitute at
     all — client-only concerns, passed straight through as
     `initDateTimePicker` options.
  3. `hour12`, locale-resolved when unset in Svelte, is resolved
     entirely on the client here: the macro never renders the meridiem
     select, since it cannot know whether the clock is 12-hour.
  - `shortcuts` is **not** a deviation — plain data, rendered as real
    buttons by the macro, exactly like `share-picker` renders `targets`.
- **Owns a form value, not a preference** — like `share-picker`, applies
  nothing to the document root and persists nothing to `localStorage`.
- **No usable no-JS path**, unlike `share-picker`. The calendar interior
  does not exist server-side at all; only the hidden input's initial
  value participates in a plain form post. Stated plainly in
  `docs/accessibility.md`.
- **`date-time-picker.test.ts`** — vitest cases mapped 1:1 onto the
  canonical Svelte spec's §7.1–§7.48, plus a Nunjucks-specific group
  covering deterministic ids, macro purity, the shortcuts
  macro-vs-client precedent, and the glyph-escaping rule.
- **Glyph**: 📅 U+1F4C5 CALENDAR + U+FE0E VARIATION SELECTOR-15, exported
  as `CALENDAR`. Written as `"\u{1F4C5}\uFE0E"` in the JS constant and
  `&#128197;&#65038;` in the macro's markup — never a bare character in
  either.

---

Lily™ and Lily Design System™ are trademarks.
