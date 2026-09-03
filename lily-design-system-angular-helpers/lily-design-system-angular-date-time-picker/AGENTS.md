# AGENTS — DateTimePicker (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

The canonical cross-framework contract is the Svelte helper's
[spec](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md);
per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree.

## What this package is

An Angular 20 headless control for collecting a date, a time, or both: a
typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E) that opens a
WAI-ARIA APG **Date Picker Dialog**. Ships no CSS, no icons, and no
hardcoded user-facing strings — month and weekday names come from `Intl`,
everything else from inputs.

It is the Angular port of the fifth Lily helper, currently Svelte-only
elsewhere. It implements everything in the DHCW / NHSW `nhsw-date-picker`
and fixes twelve defects along the way; parity table in spec §8,
departures in §9.

Unlike the three preference helpers, this is a **form control**, not a
page-header preference control: it applies nothing to the document root
and persists nothing. No `localStorage`, no `data-*` on `<html>`.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `date-time-picker.component.ts` | Implementation. Standalone, signal-based, OnPush. |
| `date-time-picker.component.spec.ts` | Vitest spec, mapped to the §7 clauses (67 tests). |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Runnable standalone example components. |
| `index.ts` | Barrel re-export. |
| `index.md` | User guide. |

## Public surface

- `DateTimePicker` (component class, selector `lily-date-time-picker`).
- `DateTimePickerIcon` (optional marker directive,
  `ng-template[lilyDateTimePickerIcon]`, for typed `let-` variables).
- `CALENDAR` (the default glyph, `"📅︎"`).
- The civil-date arithmetic: `pad`, `addDays`, `addMonths`, `parseIsoDate`,
  `formatIsoDate`, `toEpochDay`, `fromEpochDay`, `weekdayOf`, `isoWeek`,
  `daysInMonth`, `parseIsoTime`, `formatIsoTime`, `splitValue`,
  `joinValue`, `withinRange`, `monthMatrix`, `firstDayOfWeekFor`,
  `monthNames`, `numericFieldOrder`, `parseDateInput`, `parseTimeInput`,
  `nextDateTimePickerId`.
- Types `ChildArgs`, `CivilDate`, `CivilTime`, `DateTimeMode`,
  `DateTimeShortcut`, `DateTimePickerLabels`, `ShortcutEvent`.

Required inputs: `label`, `labels`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

The value is an ISO string shaped by `mode`: `YYYY-MM-DD`, `HH:MM`, or
`YYYY-MM-DDTHH:MM`, held in the `value` `model()` (`[(value)]`). Selection
inside the dialog writes to *pending* signals; only Confirm — or a day
click when `confirmOnSelect` (default: date-only mode) — writes to
`value` and fires `(change)`. Cancel, Escape and click-outside close
without committing. Typed text resolves on blur or Enter through
ISO → locale-ordered numerics → written month names; text that will not
parse, or that lands outside `min`/`max`/`isDateDisabled`, sets
`aria-invalid` and fires `(invalidInput)` rather than being snapped to
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
  more than once across the catalog.
- **The six required label keys stay required.** Inventing an English
  accessible name for a nav button is the defect this package exists to
  avoid — most of all in a Welsh-language context.
- **Fixed six-row grid.** Variable height moves the confirm button as the
  user pages.
- **The once-only view/cursor seed lives in a single guarded `effect()`.**
  Splitting it, or removing the `initialised` guard, reruns the seed on
  every `value` write and silently repages the calendar out from under an
  open dialog.
- **Vetoed days are `aria-disabled`, never the `disabled` attribute.** A
  `disabled` button refuses focus, so arrowing across a blocked week goes
  silent for a screen reader while visible focus stays behind. Activation
  is refused in `selectDay` instead.
- **Focus returns to the element that opened the dialog** — the text
  field after `Alt`+`Arrow Down`, the button after a click. Hardcoding
  the button strands keyboard users one Tab stop past where they were.
- **Header paging never refocuses the grid.** `shiftMonth` moves focus to
  the cursor only when focus was already inside the grid; otherwise a
  user activating "next month" is yanked away after one press.
- **Render-then-focus is synchronous where the target is new.** Angular
  renders after the microtask queue drains, so a `queueMicrotask`'d focus
  into a freshly-paged month runs against the old DOM — the component
  calls `ChangeDetectorRef.detectChanges()` and then focuses. Reverting
  to `queueMicrotask` there loses focus to `<body>` on every cross-month
  page. Stable targets (button, field) keep the microtask idiom.

## HTML

`<lily-date-time-picker>` renders `<div class="date-time-picker"
data-mode>` → hidden input → `<div class="date-time-picker-field">` with
`<input class="date-time-picker-input">` and `<button
class="date-time-picker-button" aria-haspopup="dialog">` → optional
`role="status"` live region (gated on `labels.invalid`) → `<div
class="date-time-picker-dialog" role="dialog" aria-modal="true"
tabindex="-1" hidden>` containing optional keyboard help (gated on
`labels.instructions`, described-by the dialog), the header, a
`role="grid"` `<table>` of `date-time-picker-day` buttons with roving
tabindex (vetoed days `aria-disabled`, not `disabled`), optional time
selects, optional shortcuts, and the footer.

Full contract in spec §4.3.

## Angular deviations from the canonical Svelte helper

- **`value` is `model<string>("")`**, consumed as `[(value)]`, rather than
  a Svelte bindable prop.
- **Callbacks are `output()`s**: `(change)`, `(shortcut)`,
  `(invalidInput)`. `shortcut` carries a `ShortcutEvent` object
  (`{ id, isoDate }`) rather than two positional arguments, matching
  `share-picker`'s `ShareEvent` precedent.
- **`class` is `className`; `readonly` is `readOnly`.** `class` is not a
  legal Angular input name. `readonly` is legal but reads as a mistake
  next to the TypeScript `readonly` property modifier this catalog
  applies to every input declaration, so the input is `readOnly`,
  matching the DOM's own `readOnly` IDL property.
- **The `children` snippet is a projected `<ng-template>`**, queried via
  `contentChild(TemplateRef)` and typed by the `DateTimePickerIcon` marker
  directive — the same pattern as `share-picker`'s `SharePickerIcon`.
- **No `...restProps` spread.** Angular already forwards any attribute
  bound on the `<lily-date-time-picker>` host tag onto that host element
  automatically; there is nothing for this component to do.
- **The once-only view/cursor seed runs in `effect()`**, not synchronously
  at construction — signal inputs are not bound until after the
  constructor runs, so there is no Angular equivalent of Svelte's
  synchronous `$props()`-time read. See spec §3.
- **The template-cast pattern is `$any($event.target).value`** — not a
  parenthesised TS cast — used for the text field's `(input)` and the
  hour/minute/meridiem selects' `(change)`.
- **Focus moves that target freshly-paged cells call
  `ChangeDetectorRef.detectChanges()` synchronously and then focus.**
  Svelte flushes the DOM synchronously; Angular renders after the
  microtask queue drains, so the canonical `queueMicrotask` pattern would
  focus against the old DOM. See spec §3 and "Things not to undo".

## Accessibility

- WAI-ARIA APG Date Picker Dialog throughout, with a real focus trap.
- The trigger is icon-only; its whole accessible name is `label`.
- Every day cell has a full `aria-label` from `Intl`; weekday columns
  carry the full name via `abbr`.
- Full treatment in [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Angular 20 standalone component, `ChangeDetectionStrategy.OnPush`,
  `input<T>()` / `input.required<T>()`, `model<T>()`, `output<T>()`.
- `@for` / `@if` / `@let` control flow — never `*ngFor`.
- Template-inline only (no `templateUrl`, no `styles`).
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common` — no
  date library.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs or from `Intl`.
- SSR-safe: no DOM writes outside `effect()`; ids from a module counter.
