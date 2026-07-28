# AGENTS — DateTimePicker (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Nunjucks 3 + vanilla-JS headless date/time-picking form control: a
text field + icon button (📅, U+1F4C5 + U+FE0E) that opens a WAI-ARIA
APG **Date Picker Dialog** — a month grid with a full keyboard
contract, optional hour/minute/meridiem selects, and optional shortcut
buttons. Ships no CSS, no icons, and persists nothing: unlike the three
preference helpers, this control owns a **form value**, not a
preference.

It is the fifth helper in this catalog, ported from the canonical
Svelte `date-time-picker` (currently Svelte-only elsewhere in the
Lily™ catalogs), and the hardest port here by a wide margin.

## Why this one is different from the other four

Every other helper's macro renders a complete-or-nearly-complete piece
of markup and the client.js wires interaction onto it. This control's
interior — the calendar grid, weekday headers, period heading, and
hour/minute option lists — **cannot be rendered by a template at all**:
producing it needs `Intl.DateTimeFormat` and civil-date arithmetic, and
Nunjucks has no access to either. So the macro renders only the fixed
chrome (trigger, header nav buttons, hour/minute `<label>`s, shortcut
buttons, footer) and leaves genuinely empty containers for
`date-time-picker.client.js` to fill in on every view change. See
`spec/index.md` §3.2–§3.3 for the full account, and `docs/accessibility.md`
for what this costs without JavaScript.

## Files

| File                          | Purpose                                              |
| ----------------------------- | ----------------------------------------------------- |
| `spec/index.md`               | Specification-driven contract (canonical).            |
| `date-time-picker.njk`        | Nunjucks macro (`dateTimePicker(opts)`).             |
| `date-time-picker.client.js`  | ES module — civil-date arithmetic, Intl formatting, `initDateTimePicker`, `autoInit`. |
| `date-time-picker.test.ts`    | Vitest spec, mapped to the §7 clauses.               |
| `index.md`                    | User guide.                                           |
| `docs/accessibility.md`       | Tradeoffs, stated plainly.                            |
| `examples/`                   | Runnable `.njk` template fragments.                   |

## Public surface

### Macro

- Import: `{% from "./date-time-picker.njk" import dateTimePicker %}`
- Call: `{{ dateTimePicker({label, labels, …}) }}`
- Required `opts` keys: `label`, `labels`.
- Full table in [spec/index.md §4.1](./spec/index.md).

### Client.js

Civil-date arithmetic (`pad`, `daysInMonth`, `formatIsoDate`,
`parseIsoDate`, `toEpochDay`, `fromEpochDay`, `addDays`, `addMonths`,
`weekdayOf`, `isoWeek`, `parseIsoTime`, `formatIsoTime`, `splitValue`,
`joinValue`, `withinRange`, `firstDayOfWeekFor`, `monthMatrix`,
`monthNames`, `numericFieldOrder`, `parseDateInput`, `parseTimeInput`),
locale formatting (`localeUsesHour12`, `dayPeriodName`, `dayLabel`,
`defaultFormatValue`), and lifecycle (`initDateTimePicker`, `autoInit`,
`nextDateTimePickerId`, `CALENDAR`).

## THE DEVIATIONS

The canonical Svelte helper types four props as functions, plus one
prop whose rendering needs a runtime computation a macro cannot make.
Full accounts in [spec/index.md §3.4](./spec/index.md); summary:

1. **`isDateDisabled`** (function) → the macro takes `disabledDates`
   (an array of ISO strings, JSON-encoded as a data attribute) as the
   baseline disabled set. `initDateTimePicker`'s `isDateDisabled`
   option, when supplied, **replaces** that baseline rather than
   unioning with it.
2. **`formatValue` / `parseInput`** (functions) → no macro-side
   substitute needed; pass straight through as `initDateTimePicker`
   options.
3. **`hour12`** (locale-resolved when unset) → the macro never renders
   the meridiem select at all (it cannot know whether the clock is
   12-hour); `date-time-picker.client.js` resolves it and builds the
   select itself, only when needed.
4. **`onChange` / `onShortcut` / `onInvalidInput`** (functions) → pass
   straight through as callback options, no deviation.

`shortcuts` is explicitly **not** a deviation: it is plain data, so the
macro renders every shortcut as a real button, the same as
`share-picker` renders `targets`.

**Do not** attempt to "fix" deviation 1 by having the client union a
list and a predicate on the consumer's behalf, or deviation 3 by having
the macro guess `hour12` from a hardcoded region table. Both are
documented, tested, and deliberate.

## Behaviour contract (one paragraph)

Activating the trigger opens a dialog seeded from the committed value
(or today); the grid, weekday header, period heading, and time options
are (re)built by `date-time-picker.client.js` on every open and every
month/year page, because none of it exists until the client builds it.
Selecting a day either commits immediately (`confirmOnSelect`, default
for `"date"` mode) or updates pending state only, in which case Confirm
commits and Cancel/Escape discard. Typed text is parsed on blur/Enter
through the same cascade as the canonical helper (custom `parseInput`,
then ISO, then locale-ordered numerics, then written months);
unparseable or out-of-range text is marked `aria-invalid` and left in
place, never silently corrected. Nothing is applied to the document
root and nothing is persisted — this helper owns a form value, not a
preference.

## HTML

`<div class="date-time-picker {classes}" data-lily-date-time-picker-root>`
→ field (`<input class="date-time-picker-input">` +
`<button class="date-time-picker-button">` with an `aria-hidden` glyph
span) → `<div class="date-time-picker-dialog" role="dialog" hidden>`
containing the header nav buttons, a `<table role="grid">` calendar
(date modes), a `.date-time-picker-time` block (time modes), a
`.date-time-picker-shortcuts` container, and a
`.date-time-picker-footer` with clear/cancel/confirm.

Full DOM contract, including which elements the macro renders versus
which `date-time-picker.client.js` builds: [spec/index.md §4.3](./spec/index.md).

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG Date Picker Dialog pattern.
- Real focus movement and a real focus trap in the dialog (no
  `aria-activedescendant`); roving `tabindex` on the grid.
- `label` names both the trigger and the dialog; every entry in
  `labels` is required or optional exactly as the canonical helper
  specifies (`spec/index.md` §4.2) — no English defaults anywhere.
- **No usable no-JS path**, unlike `share-picker`: the calendar
  interior does not exist server-side at all (`spec/index.md` §3.3,
  `docs/accessibility.md`).

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency on the client side beyond standard DOM + Intl.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from `opts.label` / `opts.labels`.
- No inline `<script>` in the macro output.
- No `localStorage`, and no `data-*` written to the document root.
- Deterministic ids derived from `name` / `id`, matching `share-picker`'s
  `{id}-list` pattern.
