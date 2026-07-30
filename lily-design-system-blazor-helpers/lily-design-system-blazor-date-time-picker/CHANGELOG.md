# Changelog — DateTimePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Accessibility hardening (2026-07-29/30)

Accessibility hardening, ported from the canonical Svelte helper's own
unreleased sweep: seven changes, each fixing something a screen reader or
keyboard user would actually hit. Test count 58 → 65 (§7.49–§7.55); the
§7.29–§7.31 assertions moved from `disabled` to `aria-disabled`.

#### Changed

- **Vetoed days render `aria-disabled="true"` + `data-disabled` instead
  of the `disabled` attribute.** A `disabled` button refuses focus, so
  arrowing the roving cursor across a blocked week went silent for a
  screen reader while the visible focus stayed behind — and the "exactly
  one tabbable day" invariant broke whenever the cursor sat on a vetoed
  day. Days stay focusable and announce as unavailable; activation is
  still refused in `SelectDayAsync`. **CSS note:** `:disabled` selectors
  on `.date-time-picker-day` stop matching — target `[data-disabled]` or
  `[aria-disabled="true"]`.
- **Closing the dialog returns focus to the element that opened it** —
  the text field after `Alt`+`ArrowDown`, the trigger button after a
  click. It previously always went to the button, stranding keyboard
  users one Tab stop past where they were. This is the APG dialog rule.
  (Blazor cannot read `document.activeElement`, so the opener is tracked
  by which of the two open paths ran — same outcome, see spec §9.)
- **Paging from the header buttons no longer steals focus into the
  grid.** The cursor still carries (clamped into the new month), but only
  grid-originated `PageUp`/`PageDown` refocuses it — a user activating
  "next month" now stays on "next month" and can page repeatedly. Along
  the way this fixed a latent staleness bug: the day-button
  `ElementReference` map was keyed by date, but Blazor runs a reference
  capture only when an element is first created and the grid's 42 buttons
  are reused across paging — so grid-paging focus silently targeted
  nothing the moment the view left the opening month. The map is now
  keyed by grid position, which is stable across paging.
- **Clicking the component's own text field while the dialog is open
  closes it** — without committing and without moving focus. The dialog
  claims `aria-modal="true"`; staying open while the user edits the field
  behind it told assistive technology one thing and did another. (The
  general click-anywhere-outside dismissal remains the documented
  root-`focusout` mechanism; the field is inside the root, so it gets an
  explicit handler.)

#### Added

- **`Labels.Invalid`** (optional): a `role="status"` live region — class
  hook `date-time-picker-status`, present-but-empty while valid — that
  fills with the message when typed text is refused, wired to the field
  via `aria-errormessage` and appended to `aria-describedby`. Previously
  `aria-invalid` flipped with no announcement at all, so a user who had
  already blurred the field never learned their date was rejected.
- **`Labels.Instructions`** (optional): keyboard help rendered inside the
  dialog — class hook `date-time-picker-instructions` — and referenced by
  the dialog's `aria-describedby`, so screen readers speak it once on
  open. The APG date-picker example ships exactly this affordance.
- **`Escape` in the text field discards a pending edit**, restoring the
  committed display and clearing `aria-invalid`, mirroring the dialog's
  Escape contract; with no pending edit the key is untouched. (Unlike
  the canonical Svelte build, the keystroke still propagates — Blazor
  cannot stop propagation conditionally per key; see spec §9.)

### Initial entry — 2026-07-28

Initial release. A Blazor 10 port of the canonical Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/).

`date-time-picker` is the catalog's **fifth helper**, and its first port
outside Svelte. Unlike the three `*-select` preference helpers and
`SharePicker`'s action, this one owns a **form value**: it applies nothing
to the document and persists nothing.

#### Added

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

#### Blazor deviations from the canonical Svelte implementation

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
