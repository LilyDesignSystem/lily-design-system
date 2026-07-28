# Changelog — DateTimePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-28

Initial release. A Blazor 10 port of the canonical Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/).

`date-time-picker` is the catalog's **fifth helper**, and its first port
outside Svelte. Unlike the three `*-select` preference helpers and
`SharePicker`'s action, this one owns a **form value**: it applies nothing
to the document and persists nothing.

### Added

- **`DateTimePicker`** — a headless date/time-picking form control. A text
  field plus an icon button (📅, U+1F4C5) that opens a WAI-ARIA APG **Date
  Picker Dialog**: a month grid with a full keyboard contract.

  ```html
  <div class="date-time-picker {CssClass}">
    <input type="hidden" name="{Name}" value="{Value}" />
    <div class="date-time-picker-field">
      <input class="date-time-picker-input" type="text" value="{display}" />
      <button class="date-time-picker-button" aria-haspopup="dialog">
        <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
      </button>
    </div>
    <div class="date-time-picker-dialog" role="dialog" aria-modal="true" hidden>
      <!-- header nav, role="grid" calendar, time selects, shortcuts, footer -->
    </div>
  </div>
  ```

- **Locale-correct by construction.** Month names, weekday names, first
  day of week, numeric field order, and the 12/24-hour clock all come from
  .NET's `CultureInfo` / `DateTimeFormatInfo` — never a baked-in table.
  `Locale`, `FirstDayOfWeek`, and `Hour12` override the derived defaults.

- **Civil dates, never a zoned `DateTime`.** All arithmetic is backed by
  `DateOnly` / `TimeOnly`, which have no time zone attached at all — the
  .NET analogue of the local-midnight-`Date` defect the Svelte canonical
  works around with UTC epoch days. The epoch-day helpers (`ToEpochDay` /
  `FromEpochDay`) are kept as pure functions for parity with the other
  ports' surface area, but are thin wrappers over `DateOnly.DayNumber`.

- **Full civil-date/time arithmetic exported as `public static` members**:
  `DaysInMonth`, `FormatIsoDate`, `ParseIsoDate`, `ToEpochDay`,
  `FromEpochDay`, `AddDays`, `AddMonths` (clamps the day rather than
  rolling over), `WeekdayOf`, `IsoWeek` (via `System.Globalization.ISOWeek`),
  `ParseIsoTime`, `FormatIsoTime`, `SplitValue`, `JoinValue`, `WithinRange`,
  `MonthMatrix` (fixed 6×7), `FirstDayOfWeekFor`, `MonthNames`,
  `NumericFieldOrder`, `ParseDateInput`, `ParseTimeInput`,
  `NextDateTimePickerId`.

- **Pending state, separate from `Value`.** Selection inside the dialog is
  held privately; only Confirm, or a day click when `ConfirmOnSelect`
  resolves true (the default for `Date` mode), commits it. Cancel and
  `Escape` close without touching `Value`.

- **A real focus trap.** `aria-modal="true"` is a promise the browser does
  not keep on its own. Because whether Tab's default action should be
  prevented depends on `document.activeElement` at the instant of the
  keypress — only knowable synchronously in the browser — the trap is
  implemented as one small `IJSRuntime`-installed keydown listener on the
  dialog element, idempotent and needing no callback into .NET. This is
  the one piece of behaviour this port genuinely could not get from a
  declarative Razor `@onkeydown` attribute alone.

- **Typed-input parsing cascade**: the caller's own `ParseInput` first,
  then ISO `YYYY-MM-DD`, then a numeric form whose field order follows the
  locale (so `03/04/2026` is 3 April in en-GB and 4 March in en-US), then a
  form with a written month matched against the locale's own month names
  (three-character prefix match, so "Sept" finds September). Two-digit
  years pivot at 70. Unparseable or out-of-range text is marked
  `aria-invalid` and left exactly as typed — never silently corrected to a
  nearby legal date.

- **`Min` / `Max` / `IsDateDisabled`** constrain selection. The keyboard
  cursor may still land on a vetoed day inside the range (so arrowing
  across a blocked week works) but cannot leave the `Min`/`Max` window. A
  shortcut resolving to a blocked date does nothing rather than landing
  near it.

- **`Shortcuts`** — quick-pick buttons offsetting by days, calendar
  months, or an absolute date, each firing `OnShortcut` before the pending
  selection settles.

- **`DateTimePickerLabels`** — one required object carrying all ten
  user-facing strings, matching the Svelte canonical's rationale exactly:
  the four navigation labels and the two footer labels are required
  because they name buttons that always render; `Hour`/`Minute`/`Meridiem`/
  `Week` gate their own UI, and `Clear` gates the clear button's existence.
  No English defaults anywhere.

- **`Mode`** — `Date`, `Time`, or `DateTime`. An incomplete `DateTime` (a
  date with no time, or the reverse) is never committed.

- **`ShowWeekNumbers`** renders an ISO-8601 week-number column via
  `System.Globalization.ISOWeek`.

- **`Value` + `ValueChanged`** for `@bind-Value`, plus a separate
  `OnChange` that fires alongside whenever the committed value actually
  changes — matching the task contract's explicit port of the Svelte
  canonical's `onChange`.

- **SSR / prerender safe.** No `IJSRuntime` call happens outside
  `OnAfterRenderAsync`. Instance ids come from a monotonic
  `Interlocked.Increment` counter, never `Guid.NewGuid()` or a clock read,
  so server and client renders agree. "Today" is deliberately left unread
  until the first client-side render, so a prerendered page never bakes in
  a clock read that could disagree with the interactive render replacing it.

- **58 bUnit + xUnit cases**, one or more per `spec/index.md` §7 clause,
  mapped 1:1 onto the canonical Svelte suite's clause numbering.

- Documentation: `spec/index.md` (the contract), `index.md` (user guide),
  `AGENTS.md`, `docs/accessibility.md`, and two runnable `examples/*.razor`.

### Blazor deviations from the canonical Svelte implementation

Full list in
[`spec/index.md` §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation).
In short: the Tab-trap is genuine injected JS (the one piece Razor alone
cannot provide); grid-navigation keys are not `preventDefault`ed (the same
tradeoff `SharePicker` already documents); outside-dismissal is a root
`focusout` rather than a document click (also already precedented);
mousedown's default is suppressed on button-only regions of the dialog so
clicking one control while another holds focus does not spuriously fire
that `focusout` before the click's own handler runs (not applied to the
time `<select>`s, which need their own mousedown to open); civil dates are
`DateOnly`/`TimeOnly` rather than a hand-rolled epoch-day type; locale
resolution uses `CultureInfo`/`DateTimeFormatInfo`/`ISOWeek` in place of
`Intl`; and `NowProvider` is the testable-clock seam replacing
`vi.useFakeTimers()`.

---

Lily™ and Lily Design System™ are trademarks.
