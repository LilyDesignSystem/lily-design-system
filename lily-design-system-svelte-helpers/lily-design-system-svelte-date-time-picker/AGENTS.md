# AGENTS — DateTimePicker (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Svelte 5 headless control for collecting a date, a time, or both: a
typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E) that opens a
WAI-ARIA APG **Date Picker Dialog**. Ships no CSS, no icons, and no
hardcoded user-facing strings — month and weekday names come from `Intl`,
everything else from props.

It implements everything in the DHCW / NHSW `nhsw-date-picker` and fixes
twelve defects along the way; parity table in spec §8, departures in §9.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `DateTimePicker.svelte` | Implementation. Svelte 5 runes + TypeScript. |
| `DateTimePicker.test.ts` | Vitest spec, mapped to the §7 clauses (58 tests). |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable Svelte 5 examples. |

## Public surface

Default export `DateTimePicker`; named `DateTimePicker`, the `CALENDAR`
glyph constant, `nextDateTimePickerId`, and the civil-date arithmetic
(`addDays`, `addMonths`, `parseIsoDate`, `formatIsoDate`, `toEpochDay`,
`fromEpochDay`, `weekdayOf`, `isoWeek`, `daysInMonth`, `parseIsoTime`,
`formatIsoTime`, `splitValue`, `joinValue`, `withinRange`, `monthMatrix`,
`firstDayOfWeekFor`, `monthNames`, `numericFieldOrder`, `parseDateInput`,
`parseTimeInput`). Types: `Props`, `ChildArgs`, `CivilDate`, `CivilTime`,
`DateTimeMode`, `DateTimeShortcut`, `DateTimePickerLabels`.

Required props: `label`, `labels`.

## Behaviour contract (one paragraph)

The value is an ISO string shaped by `mode`: `YYYY-MM-DD`, `HH:MM`, or
`YYYY-MM-DDTHH:MM`. Selection inside the dialog writes to a *pending*
date/time; only Confirm — or a day click when `confirmOnSelect` (default:
date-only mode) — writes to `value` and fires `onChange`. Cancel, Escape
and click-outside close without committing. Typed text resolves on blur or
Enter through ISO → locale-ordered numerics → written month names; text
that will not parse, or that lands outside `min`/`max`/`isDateDisabled`,
sets `aria-invalid` and fires `onInvalidInput` rather than being snapped to
something legal. Nothing is persisted: a date in a form is data, not a
preference.

## Things not to undo

These each encode a bug that was avoided on purpose.

- **Civil dates, never local-midnight `Date`.** All arithmetic goes through
  UTC epoch days. `new Date(y, m, d)` is an instant at local midnight and
  resolves to the previous day in some zones on DST days.
- **The focus trap is load-bearing.** `aria-modal="true"` is a promise the
  browser does not keep. Removing the trap makes the ARIA a lie.
- **Pending state is separate from `value`.** Collapsing them removes any
  meaning from Cancel and Escape.
- **`el?.focus?.()` and `el?.scrollIntoView?.()` guard the METHOD.** jsdom
  implements neither; an unguarded call throws inside a keydown handler
  where a green suite never sees it. This shape has bitten these helpers
  three times.
- **The six required label keys stay required.** Inventing an English
  accessible name for a nav button is the defect this package exists to
  avoid — most of all in a Welsh-language context.
- **Fixed six-row grid.** Variable height moves the confirm button as the
  user pages.

## HTML

`<div class="date-time-picker" data-mode>` → hidden input → `<div
class="date-time-picker-field">` with `<input class="date-time-picker-input">`
and `<button class="date-time-picker-button" aria-haspopup="dialog">` →
`<div class="date-time-picker-dialog" role="dialog" aria-modal="true"
tabindex="-1" hidden>` containing the header, a `role="grid"` `<table>` of
`date-time-picker-day` buttons with roving tabindex, optional time selects,
optional shortcuts, and the footer.

Full contract in spec §4.3.

## Conventions this package follows

- Svelte 5 runes; strict TypeScript on the public surface.
- No runtime dependency beyond `svelte` — no date library.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props or from `Intl`.
- SSR-safe: no DOM writes outside `$effect`; ids from a module counter.

## Divergence from the sibling helpers

Two, both deliberate and both noted in spec §3:

1. **It is a form control, not a page-header preference control.** So it
   has a text field, and the "one shape: icon button opening a popup" rule
   in `AGENTS/helpers.md` applies only to its trigger.
2. **Strings arrive as one `labels` object**, not a dozen flat `*Label`
   props. The siblings need two or three strings; this needs ten.
