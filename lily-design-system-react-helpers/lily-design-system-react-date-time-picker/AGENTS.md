# AGENTS — DateTimePicker (React helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A React 19 headless control for collecting a **date**, a **time**, or
**both**: a typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E)
that opens a WAI-ARIA APG **Date Picker Dialog**. Ships no CSS, no icons,
and no hardcoded user-facing strings — month and weekday names come from
`Intl`, everything else from props.

Ported from the canonical Svelte helper
(`../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/`),
whose spec numbering this package mirrors clause for clause. It is the
**fifth** helper in this catalog and the first that is a form control
rather than a page-header preference control — see
`AGENTS/helpers.md` at the repo root.

## Files

| File                      | Purpose                                            |
| ------------------------- | --------------------------------------------------- |
| `spec/index.md`           | Specification-driven contract (canonical).         |
| `DateTimePicker.tsx`      | Implementation. React 19 hooks + TypeScript.        |
| `DateTimePicker.test.tsx` | Vitest spec, mapped to the §7 clauses (65 tests).   |
| `index.ts`                | Barrel re-export.                                   |
| `index.md`                | User guide.                                         |
| `docs/accessibility.md`   | Tradeoffs, stated plainly.                          |
| `examples/`               | Runnable React 19 examples.                         |

## Public surface

Default export `DateTimePicker`; named `DateTimePicker`, the `CALENDAR`
glyph constant, `nextDateTimePickerId`, and the civil-date arithmetic
(`addDays`, `addMonths`, `parseIsoDate`, `formatIsoDate`, `toEpochDay`,
`fromEpochDay`, `weekdayOf`, `isoWeek`, `daysInMonth`, `parseIsoTime`,
`formatIsoTime`, `splitValue`, `joinValue`, `withinRange`, `monthMatrix`,
`firstDayOfWeekFor`, `monthNames`, `numericFieldOrder`, `parseDateInput`,
`parseTimeInput`, `pad`). Types: `Props`, `ChildArgs`, `CivilDate`,
`CivilTime`, `DateTimeMode`, `DateTimeShortcut`, `DateTimePickerLabels`.

Required props: `label`, `labels`.

## Behaviour contract (one paragraph)

The value is an ISO string shaped by `mode`: `YYYY-MM-DD`, `HH:MM`, or
`YYYY-MM-DDTHH:MM`. Selection inside the dialog writes to *pending* React
state; only Confirm — or a day click when `confirmOnSelect` (default:
date-only mode) — commits it and fires `onChange`. Cancel, Escape and
click-outside close without committing. Typed text resolves on blur or
Enter through ISO → locale-ordered numerics → written month names; text
that will not parse, or that lands outside `min`/`max`/`isDateDisabled`,
sets `aria-invalid` and fires `onInvalidInput` rather than being snapped
to something legal. Nothing is persisted: a date in a form is data, not a
preference. `value` follows this catalog's controlled-or-uncontrolled
convention — supply `value` + `onChange` to control it, or omit `value`
and the component manages its own copy.

## Things not to undo

These each encode a bug that was avoided on purpose, in the Svelte
original and carried over here.

- **Civil dates, never local-midnight `Date`.** All arithmetic goes
  through UTC epoch days. `new Date(y, m, d)` is an instant at local
  midnight and resolves to the previous day in some zones on DST days.
- **The focus trap is load-bearing.** `aria-modal="true"` is a promise
  the browser does not keep. Removing the trap makes the ARIA a lie.
- **Pending state is separate from `value`.** Collapsing them removes
  any meaning from Cancel and Escape.
- **Vetoed days are `aria-disabled` + `data-disabled`, never the
  `disabled` attribute.** A `disabled` button refuses focus, so arrowing
  the roving cursor across a blocked week goes silent for a screen
  reader while the visible focus stays behind — and the "exactly one
  tabbable day" invariant breaks whenever the cursor sits on a vetoed
  day. Activation is refused in `selectDay` instead.
- **Closing returns focus to the opener, not always the button.** The
  `openerRef` captured in `openDialog` is what makes Escape after
  `Alt`+`ArrowDown` land back on the text field — the APG dialog rule.
- **`shiftMonth` refocuses the grid cursor only when focus was already
  in the grid.** Grid `PageUp`/`PageDown` must carry focus (the focused
  cell is unrendered); the header prev/next buttons must NOT steal it,
  or "next month" cannot be activated twice in a row.
- **The six required label keys stay required.** Inventing an English
  accessible name for a nav button is the defect this package exists to
  avoid. `labels.invalid` and `labels.instructions` stay *optional* for
  the same reason: without them the component announces nothing rather
  than announcing in a language it invented.
- **Fixed six-row grid.** Variable height moves the confirm button as
  the user pages.
- **`el?.focus?.()` and `el?.scrollIntoView?.()` guard the METHOD.**
  jsdom implements neither; an unguarded call throws inside a handler
  where a green suite never sees it. This shape has bitten these
  helpers three times.
- **`commit()` and `applyShortcut()` take explicit date/time overrides**
  rather than reading `pendingDate` / `pendingTime` state. This is a
  React-specific correction the Svelte port did not need: `setState` does
  not take effect until the next render, so a day click or a shortcut
  that both updates the pending selection *and* commits in the same
  handler must pass the fresh value in, or it commits the *previous*
  render's selection. See the comment on `commit` in
  `DateTimePicker.tsx`.

## HTML

`<div class="date-time-picker" data-mode>` → hidden input → `<div
class="date-time-picker-field">` with `<input class="date-time-picker-input">`
and `<button class="date-time-picker-button" aria-haspopup="dialog">` →
optional `<span class="date-time-picker-status" role="status">` (only
with `labels.invalid`; present-but-empty while valid) → `<div
class="date-time-picker-dialog" role="dialog" aria-modal="true"
tabindex="-1" hidden>` containing an optional `<p
class="date-time-picker-instructions">` first (only with
`labels.instructions`, referenced by the dialog's `aria-describedby`),
the header, a `role="grid"` `<table>` of `date-time-picker-day` buttons
with roving tabindex (vetoed days `aria-disabled` + `data-disabled`, not
`disabled`), optional time selects, optional shortcuts, and the footer.

Full contract in spec §4.3.

## React specifics an agent will trip over

- Focus moves in a single unconditional `useEffect` (no dependency array)
  that reads a `focusRequestRef` ref set by whichever handler just ran,
  then clears it. The target — a grid cell after paging, the trigger
  after a close, the first control on open — may not exist in the DOM
  until the state change that handler queued has actually re-rendered,
  so focus cannot move inline in the handler itself.
- `commit()` and `applyShortcut()` accept explicit date/time overrides
  (see above) rather than trusting `pendingDate` / `pendingTime` — the
  one genuine logic change forced by React's state model, not a taste
  choice.
- `value` follows the `isControlled` / `internalValue` / `currentValue`
  pattern used by `ThemePicker` and `LocalePicker` in this catalog: this
  is the React idiom for the Svelte original's `$bindable("")`.
- Ids come from `React.useId()`, not the exported `nextDateTimePickerId`
  counter — that function ships only for parity with the Svelte helper
  and for consumers labelling a control from outside the component tree.
- The text `<input>` is a controlled input (`value` + `onChange`), unlike
  the Svelte version's `oninput`/`bind:value` split — React has no
  equivalent of an uncommitted DOM value coexisting with a bound one, so
  `typed` (pending display text) plays that role identically either way.
- The day grid is a real roving-tabindex + real-focus-move pattern (like
  `share-picker`'s list, not like the three listbox helpers' the
  `aria-activedescendant` pattern): the cells are real focusable buttons.

## Conventions this package follows

- React 19 function components with hooks; strict TypeScript on the
  public surface.
- No runtime dependency beyond `react` — no date library.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from props or from `Intl`.
- SSR-safe: no DOM reads/writes outside `useEffect`; no `Math.random()` /
  `Date.now()` in anything that must match between server and client
  render.

## Divergence from the sibling helpers

Two, both deliberate and both noted in spec §3, inherited from the
canonical Svelte helper:

1. **It is a form control, not a page-header preference control.** So it
   has a text field, and the "one shape: icon button opening a popup"
   rule in `AGENTS/helpers.md` applies only to its trigger.
2. **Strings arrive as one `labels` object**, not a dozen flat `*Label`
   props. The siblings need two or three strings; this needs ten.
