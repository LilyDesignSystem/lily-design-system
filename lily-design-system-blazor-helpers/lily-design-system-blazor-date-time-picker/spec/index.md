# DateTimePicker — Specification

Single source of truth for the `lily-design-system-blazor-date-time-picker`
Blazor helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

This package is a port of the canonical Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md).
Per [`AGENTS/helpers.md`](../../../AGENTS/helpers.md), Svelte is canonical:
the behaviour contract below is the Svelte contract, and the §7 clause
numbering is deliberately identical so the two suites can be read side by
side. Where Blazor forces a difference it is called out in §9 rather than
quietly absorbed.

Sibling files in this directory's parent:

- `DateTimePicker.razor` — Razor markup
- `DateTimePicker.razor.cs` — C# code-behind (partial class), including the
  civil-date arithmetic
- `DateTimePickerTests.cs` — bUnit + xUnit spec exercising every clause in §7
- `index.md` — user-facing guide
- `docs/accessibility.md` — tradeoffs, stated plainly

---

## 1. Goal

Give a Blazor 10 application a drop-in, headless control for collecting a
**date**, a **time**, or **both**, that:

1. Renders a text field plus an icon button that opens a WAI-ARIA APG
   **Date Picker Dialog**: a month grid with a full keyboard contract.
2. Is **locale-correct by construction** — month names, weekday names,
   first day of week, numeric field order, 12- vs 24-hour clock and
   day-period names all come from .NET's `CultureInfo` /
   `DateTimeFormatInfo`, never from a baked-in table.
3. Accepts **typed input** as well as pointer and keyboard selection.
4. Constrains selection with `Min`, `Max`, and an arbitrary
   `IsDateDisabled` predicate.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `date-time-picker` class hooks.

### 1.1 Relationship to the DHCW date picker

This helper implements everything in the Digital Health and Care Wales
`nhsw-date-picker` (see the canonical Svelte spec §1.1 for the citation),
which is the closest published prior art in the NHS space and the reason
this package exists. Feature parity is in §8; the deliberate departures are
in §9 of the **canonical Svelte spec**, and apply here unchanged except
where this file's own §9 documents a further Blazor-specific difference.

## 2. Non-goals

Identical to the canonical spec §2:

- **Time zones.** The value is a civil date and/or wall-clock time with no
  zone attached, backed by `DateOnly` / `TimeOnly` rather than a zoned
  `DateTime`.
- **Seconds, or sub-minute precision.**
- **Ranges.** Use `calendar-range-picker` (not yet ported) for a start/end pair.
- **Recurrence.**
- **Persistence.** Unlike the three preference helpers, this does not write
  to `localStorage`.
- **Relative-date parsing** ("tomorrow", "next Friday").
- **Shipped positioning CSS** for the dialog. The package stays headless.

## 3. Architectural decisions

- **Civil dates, never local-midnight `DateTime`.** `DateOnly` has no time
  zone attached at all — the .NET analogue of the Svelte canonical's
  UTC-epoch-day arithmetic, and the correct fix for the same defect: a
  zoned `DateTime` constructed at local midnight can resolve to the wrong
  calendar day across a DST boundary. `ToEpochDay` / `FromEpochDay` are
  still exported as pure functions, for parity with the other ports'
  surface area, but are thin wrappers over `DateOnly.DayNumber`.
- **ISO 8601 is the value contract.** `YYYY-MM-DD`, `HH:MM`, or
  `YYYY-MM-DDTHH:MM`.
- **Pending state is separate from `Value`.** Selection inside the dialog
  writes to private pending fields; only Confirm (or a day click in
  `ConfirmOnSelect` mode) writes to `Value`. Without this split, Cancel and
  Escape have nothing to revert to.
- **A real focus trap, because `aria-modal="true"` is a promise.** The
  browser does not enforce it. Blazor's declarative `@onkeydown` cannot
  conditionally `preventDefault` a key based on where focus currently is —
  that decision needs `document.activeElement` at the instant of the
  keypress, which is only knowable synchronously in the browser — so the
  Tab-trap is the one piece of this component genuinely implemented in
  injected JS. See §9.
- **`Labels` arrives as one object.** Same reasoning as the Svelte
  canonical: ten user-facing strings as ten flat parameters is a call site
  nobody can read.
- **Fixed six-row grid.**
- **No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.**
  No date library. `CultureInfo` / `DateTimeFormatInfo` / `ISOWeek` and
  `DateOnly` / `TimeOnly` arithmetic cover everything in scope.

## 4. Public API

### 4.1 Parameters

| Parameter | Type | Required | Default | Purpose |
| --- | --- | --- | --- | --- |
| `Label` | `string` | yes | — | Accessible name for **both** the trigger button and the dialog. |
| `Labels` | `DateTimePickerLabels` | yes | — | Every other user-facing string. See §4.2. |
| `Mode` | `DateTimeMode` | no | `Date` | What to collect: `Date`, `Time`, or `DateTime`. |
| `Value` | `string` | no | `""` | ISO value. |
| `ValueChanged` | `EventCallback<string>` | no | — | Two-way binding partner for `Value`, enabling `@bind-Value`. |
| `Locale` | `string?` | no | runtime default | BCP 47 tag driving all formatting. |
| `Min` | `string?` | no | — | Earliest selectable date, ISO. |
| `Max` | `string?` | no | — | Latest selectable date, ISO. |
| `IsDateDisabled` | `Func<string, bool>?` | no | — | Veto individual dates. |
| `FirstDayOfWeek` | `int?` | no | from `Locale` | 0 = Sunday … 6 = Saturday. |
| `MinuteStep` | `int` | no | `1` | Granularity of the minute select. |
| `Hour12` | `bool?` | no | from `Locale` | 12-hour clock. |
| `ShowWeekNumbers` | `bool` | no | `false` | Render an ISO-8601 week column. |
| `Shortcuts` | `IReadOnlyList<DateTimeShortcut>` | no | empty | Quick-pick buttons. |
| `ConfirmOnSelect` | `bool?` | no | `Mode == Date` | Commit and close on day click. |
| `Name` | `string` | no | `"date-time"` | `name` of the hidden input. |
| `InputId` | `string?` | no | generated | `id` of the text field, for a consumer `<label for>`. |
| `DescribedBy` | `string?` | no | — | Forwarded as `aria-describedby`. |
| `Placeholder` | `string?` | no | — | Placeholder for the text field. |
| `Disabled` | `bool` | no | `false` | Disable the whole control. |
| `ReadOnly` | `bool` | no | `false` | Show the value, refuse edits. |
| `Required` | `bool` | no | `false` | Mark the field required. |
| `FormatValue` | `Func<string, string>?` | no | culture-driven | Override field rendering. |
| `ParseInput` | `Func<string, string?>?` | no | §5.4 | Override typed-text parsing. |
| `ChildContent` | `RenderFragment<DateTimePickerContext>?` | no | the calendar glyph | **Replaces the glyph inside the button.** |
| `OnChange` | `EventCallback<string>` | no | — | Fires after a value is committed. |
| `OnShortcut` | `EventCallback<(string Id, string IsoDate)>` | no | — | Fires when a shortcut is used. |
| `OnInvalidInput` | `EventCallback<string>` | no | — | Fires when typed text will not parse. |
| `CssClass` | `string` | no | `""` | Extra CSS class on the root `<div>`. |
| `AdditionalAttributes` | unmatched attributes | no | — | Spread onto the root `<div>`. |

```csharp
public enum DateTimeMode { Date, Time, DateTime }

public readonly record struct CivilDate(int Year, int Month, int Day);
public readonly record struct CivilTime(int Hour, int Minute);

public sealed class DateTimeShortcut
{
    public required string Id { get; init; }
    public required string Label { get; init; }
    public int? Days { get; init; }
    public int? Months { get; init; }
    public string? Date { get; init; }
}

public sealed class DateTimePickerLabels
{
    public required string PreviousYear { get; init; }
    public required string PreviousMonth { get; init; }
    public required string NextMonth { get; init; }
    public required string NextYear { get; init; }
    public required string Confirm { get; init; }
    public required string Cancel { get; init; }
    public string? Hour { get; init; }
    public string? Minute { get; init; }
    public string? Meridiem { get; init; }
    public string? Week { get; init; }
    public string? Clear { get; init; }
}

public sealed class DateTimePickerContext
{
    public required string Value { get; init; }
    public required bool Open { get; init; }
    public required string Display { get; init; }
}
```

The optional `DateTimePickerLabels` entries gate optional UI, exactly as
`SharePicker`'s `CopyLabel` gates its copy item: a control whose accessible
name was invented in English is the defect this package exists to avoid, so
the component would rather not render a control than name it for you.

### 4.2 `DateTimePickerLabels` — see the class above

Same six required / five optional split as the canonical spec's §4.2 table.

### 4.3 DOM contract

```html
<div class="date-time-picker {CssClass}" id="{rootId}" data-mode="date" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />

  <div class="date-time-picker-field">
    <input class="date-time-picker-input" id="{fieldId}" type="text"
           autocomplete="off" value="{display}" aria-invalid="true|absent" />
    <button type="button" class="date-time-picker-button" aria-label="{Label}"
            aria-haspopup="dialog" aria-expanded="false"
            aria-controls="{dialogId}">
      <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
    </button>
  </div>

  <div class="date-time-picker-dialog" id="{dialogId}" role="dialog"
       aria-modal="true" aria-label="{Label}" tabindex="-1" hidden>
    <div class="date-time-picker-header">
      <button class="date-time-picker-previous-year"  aria-label="…">…</button>
      <button class="date-time-picker-previous-month" aria-label="…">…</button>
      <span   class="date-time-picker-period" id="{periodId}" aria-live="polite">March 2026</span>
      <button class="date-time-picker-next-month"     aria-label="…">…</button>
      <button class="date-time-picker-next-year"      aria-label="…">…</button>
    </div>

    <table class="date-time-picker-calendar" role="grid" aria-labelledby="{periodId}">
      <thead><tr>
        <th class="date-time-picker-week-heading" scope="col" abbr="…">…</th>
        <th class="date-time-picker-weekday" scope="col" abbr="Monday">Mo</th>
      </tr></thead>
      <tbody><tr>
        <th class="date-time-picker-week" scope="row">10</th>
        <td role="gridcell" aria-selected="true|false">
          <button class="date-time-picker-day" data-date="2026-03-01"
                  data-outside data-today data-selected
                  tabindex="0|-1" aria-label="Sunday 1 March 2026"
                  aria-current="date">1</button>
        </td>
      </tr></tbody>
    </table>

    <div class="date-time-picker-time">
      <label class="date-time-picker-time-label" for="…">…</label>
      <select class="date-time-picker-hour">…</select>
      <select class="date-time-picker-minute">…</select>
      <select class="date-time-picker-meridiem">…</select>
    </div>

    <div class="date-time-picker-shortcuts">
      <button class="date-time-picker-shortcut" data-shortcut-id="today">…</button>
    </div>

    <div class="date-time-picker-footer">
      <button class="date-time-picker-clear">…</button>
      <button class="date-time-picker-cancel">…</button>
      <button class="date-time-picker-confirm">…</button>
    </div>
  </div>
</div>
```

Identical class hooks, `data-*` attributes and ARIA to the canonical DOM
contract. The one addition is `id="{rootId}"` on the root `<div>` — a
Blazor-only implementation detail needed for the outside-dismissal
mechanism (§9) and not part of the class-hook contract consumers style
against.

### 4.4 Public surface

Component `DateTimePicker` in namespace `LilyDesignSystem.Blazor.Helpers`,
plus `DateTimeMode`, `CivilDate`, `CivilTime`, `DateTimeShortcut`,
`DateTimePickerLabels`, `DateTimePickerContext`.

Blazor has no module barrel, so the Svelte package's re-exports become
`public static` members on `DateTimePicker` itself:

| Svelte export | Blazor equivalent |
| --- | --- |
| `CALENDAR` | `DateTimePicker.Calendar` |
| `addDays` / `addMonths` | `DateTimePicker.AddDays` / `AddMonths` |
| `parseIsoDate` / `formatIsoDate` | `DateTimePicker.ParseIsoDate` / `FormatIsoDate` |
| `toEpochDay` / `fromEpochDay` | `DateTimePicker.ToEpochDay` / `FromEpochDay` |
| `weekdayOf` / `isoWeek` | `DateTimePicker.WeekdayOf` / `IsoWeek` |
| `daysInMonth` | `DateTimePicker.DaysInMonth` |
| `parseIsoTime` / `formatIsoTime` | `DateTimePicker.ParseIsoTime` / `FormatIsoTime` |
| `splitValue` / `joinValue` | `DateTimePicker.SplitValue` / `JoinValue` |
| `withinRange` | `DateTimePicker.WithinRange` |
| `monthMatrix` | `DateTimePicker.MonthMatrix` |
| `firstDayOfWeekFor` | `DateTimePicker.FirstDayOfWeekFor` |
| `monthNames` | `DateTimePicker.MonthNames` |
| `numericFieldOrder` | `DateTimePicker.NumericFieldOrder` |
| `parseDateInput` / `parseTimeInput` | `DateTimePicker.ParseDateInput` / `ParseTimeInput` |
| `nextDateTimePickerId` | `DateTimePicker.NextDateTimePickerId` |

Internal, visible to the test project via `InternalsVisibleTo`:
`NowProvider` (the testable-clock seam, replacing `vi.useFakeTimers()`) and
`BuildInstallFocusTrapScript` (the Tab-trap script builder).

The arithmetic is exported deliberately, for the same reason as the
canonical spec: a consumer wiring `Min`, `Max`, `Shortcuts` or
`IsDateDisabled` is doing date maths too, and the alternative is that they
reach for a zoned `DateTime` and reintroduce the local-midnight bug §3
exists to prevent.

## 5. Behaviour

Sections 5.1 (Value), 5.2 (Opening), 5.3 (Committing and discarding), 5.4
(Typed input), 5.5 (Range and vetoes) are **behaviourally identical** to
the canonical Svelte spec — read it for the authoritative prose. The
Blazor implementation asserts every one of these clauses in §7 below,
under the same numbering.

### 5.6 Locale resolution

| Thing | Source |
| --- | --- |
| Month and weekday names | `DateTimeFormatInfo.GetMonthName` / `GetAbbreviatedMonthName` / `GetDayName` / `GetAbbreviatedDayName` |
| First day of week | `DateTimeFormatInfo.FirstDayOfWeek`, else Monday |
| Numeric field order | Letter order (`d` / `M` / `y`) in `DateTimeFormatInfo.ShortDatePattern` |
| 12- vs 24-hour clock | Presence of `h` in `DateTimeFormatInfo.ShortTimePattern` |
| AM / PM names | `DateTimeFormatInfo.AMDesignator` / `PMDesignator` |

Every one of these is overridable by parameter. An unresolvable `Locale`
tag (`CultureNotFoundException`) falls back to `CultureInfo.InvariantCulture`
and Monday — the .NET analogue of the Svelte canonical's `Intl` try/catch
fallback, which exists there because `getWeekInfo` is missing from some SSR
runtimes; here it exists because a consumer can pass any string.

### 5.7 SSR / prerender

No `IJSRuntime` calls happen outside `OnAfterRenderAsync`. The markup
renders with the consumer-supplied `Value`, the dialog `hidden`.
`CultureInfo` formatting is used during render and needs no interop.

`_today` (the "is this cell today?" comparison) is deliberately left empty
until the first client-side `OnAfterRenderAsync`, exactly mirroring the
canonical Svelte `$effect`: reading the clock during prerender could differ
from the client's own render and produce a hydration mismatch (Blazor's
analogue: a static-SSR render diverging from the interactive render that
replaces it). Instance ids come from a monotonic `Interlocked.Increment`
counter — never `Guid.NewGuid()` or a clock read — so server and client
renders agree.

## 6. Accessibility

### 6.1 Roles and properties

Identical to the canonical spec §6.1. Follows the **WAI-ARIA APG Date
Picker Dialog** pattern.

### 6.2 Keyboard contract

Identical key table to the canonical spec §6.2, with one implementation
difference: grid-navigation keys (`Arrow*`, `Home`, `End`, `PageUp`,
`PageDown`, `Enter`, `Space`) are handled by an ordinary Razor
`@onkeydown` handler and are **not** `preventDefault`ed, because Blazor
cannot apply `preventDefault` conditionally per key from a declarative
attribute. This is the same, already-precedented tradeoff
`SharePicker`'s `docs/accessibility.md` documents for its own arrow keys:
the browser's default scroll may also fire alongside the grid's own
navigation. `Escape` and `Tab` need no such tradeoff — see §9.

### 6.3 Internationalisation

`Label` and every entry of `Labels` pass through verbatim. No user-facing
string is hardcoded — including AM/PM, which comes from
`DateTimeFormatInfo.AMDesignator` / `PMDesignator`.

### 6.4 Accessibility tradeoffs

Stated plainly in [`../docs/accessibility.md`](../docs/accessibility.md),
which also carries the Blazor-specific costs from §9.

## 7. Testing acceptance criteria

`DateTimePickerTests.cs` asserts every clause below, one `[Fact]` (or
`[Theory]`) per clause, named `Section_7_N_...` for fast cross-referencing
— the same convention as every other helper in this catalog. The clause
numbers are identical to the canonical Svelte suite's, so the two files
can be read side by side.

### Pure arithmetic (mirrors §3, §4.4)

| Clause | Test asserts |
| --- | --- |
| §7.1 | `ParseIsoDate` rejects impossible dates (`2026-02-31`) and accepts real ones. |
| §7.1 | `DaysInMonth` handles leap years (2024-02 → 29, 2100-02 → 28). |
| §7.2 | `AddDays` crosses month and year boundaries, forwards and backwards. |
| §7.2 | `AddMonths` clamps rather than rolling over (2026-01-31 + 1 → 2026-02-28). |
| §7.2 | `AddMonths` with a negative delta crosses the year boundary correctly. |
| §7.3 | `WeekdayOf` returns 0 for Sunday. |
| §7.3 | `IsoWeek` matches the ISO-8601 definition on the known-hard cases. |
| §7.4 | `ToEpochDay` / `FromEpochDay` round-trip. |
| §7.5 | `SplitValue` / `JoinValue` round-trip per mode, and refuse a half datetime. |
| §7.6 | `MonthMatrix` always returns 6 × 7 and starts on `firstDayOfWeek`. |
| §7.7 | `FirstDayOfWeekFor` gives Monday for en-GB, Sunday for en-US, Monday for an unknown tag. |
| §7.8 | `ParseDateInput` reads ISO, locale-ordered numerics (en-GB vs en-US differ), and written months. |
| §7.8 | `ParseDateInput` returns null for junk and for impossible dates. |
| §7.9 | `ParseTimeInput` reads `9:30`, `0930`, `9.30`, `1:30pm`, and rejects `25:00`. |

### Markup contract (mirrors §4.3)

| Clause | Test asserts |
| --- | --- |
| §7.10 | Renders the trigger with `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls` pointing at the `role="dialog"` element. |
| §7.10 | The glyph renders inside `.date-time-picker-icon` with `aria-hidden="true"`. |
| §7.11 | `aria-label` names **both** the trigger and the dialog. |
| §7.12 | The hidden input carries `name` and the ISO value; the visible field carries the formatted display. |
| §7.13 | The dialog is `hidden` until the trigger is activated. |
| §7.14 | The grid renders 6 rows × 7 day cells, with `data-outside` on adjacent-month days. |
| §7.15 | Exactly one day carries `tabindex="0"`. |
| §7.16 | Extra attributes spread onto the root; `data-mode` reflects `Mode`. |
| §7.17 | Today carries `data-today` and `aria-current="date"`. |

### Selection and commit (mirrors §5.3)

| Clause | Test asserts |
| --- | --- |
| §7.18 | Clicking a day in `Date` mode commits, fires `OnChange`, and closes. |
| §7.19 | With `ConfirmOnSelect=false`, clicking a day does **not** commit; Confirm does. |
| §7.20 | Cancel closes without changing `Value`. |
| §7.21 | `Escape` closes without changing `Value`. |
| §7.22 | The clear button renders only when `Labels.Clear` is set, and commits `""`. |
| §7.23 | `OnChange` does not fire when the committed value is unchanged. |

### Keyboard (mirrors §6.2)

| Clause | Test asserts |
| --- | --- |
| §7.24 | Arrow keys move the cursor by a day and by a week. |
| §7.25 | `Home` / `End` reach the ends of the week, respecting `FirstDayOfWeek`. |
| §7.26 | `PageUp` / `PageDown` page the month; `Shift` pages the year. |
| §7.27 | `Enter` on the grid selects the cursor's day. |
| §7.28 | `Alt` + `Arrow Down` on the field opens the dialog. |

### Range, vetoes, shortcuts (mirrors §5.5)

| Clause | Test asserts |
| --- | --- |
| §7.29 | Days outside `Min`/`Max` render `disabled`. |
| §7.30 | `IsDateDisabled` disables individual days. |
| §7.31 | Clicking a disabled day does not commit. |
| §7.32 | A shortcut moves the pending selection and fires `OnShortcut`. |
| §7.33 | A shortcut resolving to a blocked date does nothing. |

### Typed input (mirrors §5.4)

| Clause | Test asserts |
| --- | --- |
| §7.34 | Typing an ISO date and blurring commits it. |
| §7.35 | Typing a locale-ordered numeric date commits the right day. |
| §7.36 | Unparseable text sets `aria-invalid` and fires `OnInvalidInput` without changing `Value`. |
| §7.37 | Text parsing to an out-of-range date is rejected the same way. |
| §7.38 | Clearing the field commits `""`. |
| §7.39 | A `ParseInput` parameter overrides the built-in parser. |

### Time and datetime (mirrors §5.1)

| Clause | Test asserts |
| --- | --- |
| §7.40 | `Time` mode renders hour and minute selects and no grid. |
| §7.41 | `MinuteStep` controls the minute options. |
| §7.42 | `DateTime` mode renders both the grid and the time selects. |
| §7.43 | `DateTime` does not commit a date with no time. |
| §7.44 | `Hour12` renders a meridiem select whose labels come from the locale. |

### Locale (mirrors §5.6)

| Clause | Test asserts |
| --- | --- |
| §7.45 | Weekday headings start on Monday for en-GB and Sunday for en-US. |
| §7.46 | `FirstDayOfWeek` overrides the locale. |
| §7.47 | Month names and day `aria-label`s follow `Locale`. |
| §7.48 | `ShowWeekNumbers` renders a week column with ISO week numbers. |

## 8. DHCW feature parity

Identical to the canonical Svelte spec §8 — this port carries the same
feature set forward unchanged.

## 9. Blazor deviations from the canonical Svelte implementation

Each of these is forced by the framework or by .NET, not chosen.

- **The Tab focus trap is genuine JS, not a Razor handler.** Whether Tab's
  default action should be prevented depends on `document.activeElement`
  at the instant of the keypress — knowable only synchronously in the
  browser, and Blazor's `@onkeydown:preventDefault` is a static, per-render
  declaration that cannot vary per key or per condition. `DateTimePicker`
  installs one small keydown listener directly on the dialog element (via
  `IJSRuntime` `eval`, idempotent, guarded by a marker property) that
  redirects focus only at the two edges — exactly the canonical Svelte
  `onDialogKeydown` Tab branch — and needs no callback into .NET, because
  it only ever moves focus, never application state. Every other Tab keeps
  its native action. This is the one non-negotiable piece of real
  browser-side behaviour this port could not get from Razor alone.
- **Grid-navigation keys are not `preventDefault`ed**, for the reason in
  §6.2: Blazor cannot conditionally prevent default per key. Arrow keys
  may also scroll the page behind the grid. Already-precedented by
  `SharePicker`'s identical, documented tradeoff.
- **Outside-dismissal is a root `focusout`, not a document click** — the
  same deviation `SharePicker` and `TextSizePicker` document, for the same
  reason (no document-level click listener ships with this package).
  Clause 20/21's "Cancel closes" and "Escape closes" tests exercise the
  explicit paths; a real browser's pointer-outside-dismissal still works
  because clicking away moves focus away.
- **Mousedown's default is suppressed on the grid, header, shortcuts, and
  footer** (`@onmousedown:preventDefault="true"`, the same idiom
  `SharePicker`'s list uses) so that clicking one control while a
  *different* control already has focus does not fire a root `focusout` —
  and this package's outside-dismissal *is* a root `focusout` — before the
  click's own handler runs. It is deliberately **not** applied to the time
  `<select>`s: suppressing a `<select>`'s own mousedown default prevents it
  opening by click in most browsers. Clicking directly into an hour/minute/
  meridiem `<select>` while a day button still holds focus can, on some
  browsers, therefore trigger the dismissal heuristic before the select
  opens; tabbing to the select, or a second click, works normally. Stated
  in `docs/accessibility.md`.
- **Civil dates are `DateOnly` / `TimeOnly`**, not a hand-rolled
  UTC-epoch-day type. The epoch-day helpers (`ToEpochDay` / `FromEpochDay`)
  are kept as pure functions for API-surface parity (§4.4) but are thin
  wrappers over `DateOnly.DayNumber`.
- **Locale resolution uses `CultureInfo` / `DateTimeFormatInfo` / `ISOWeek`**
  in place of `Intl`. Concretely: `AddMonths`'s clamping behaviour is
  `DateOnly.AddMonths`'s own documented behaviour, not hand-rolled;
  `IsoWeek` is `System.Globalization.ISOWeek.GetWeekOfYear`; first day of
  week is `DateTimeFormatInfo.FirstDayOfWeek` (whose enum values already
  agree with the 0=Sunday…6=Saturday encoding, so no remapping is needed);
  numeric field order is read from the letter order in
  `ShortDatePattern`; 12-hour-clock detection is the presence of `h` in
  `ShortTimePattern`.
- **`NowProvider` replaces `vi.useFakeTimers()`.** An `internal static
  Func<DateTime>` seam, swapped by the test project via
  `InternalsVisibleTo`, gives deterministic "today" without a DI-scoped
  clock abstraction.
- **`value` is `Value` + `ValueChanged`** (the two-way-binding convention,
  enabling `@bind-Value`) **and `OnChange`** fires in addition, matching
  the task contract's explicit port of the Svelte `onChange` callback.
  Both fire together whenever the committed value actually changes.
- **`onShortcut(id, isoDate)` becomes `OnShortcut` of
  `EventCallback<(string Id, string IsoDate)>`**, because `EventCallback<T>`
  is single-argument; a value tuple is the idiomatic C# equivalent of two
  positional arguments.
- **`children` is `ChildContent`**, typed
  `RenderFragment<DateTimePickerContext>`.
- **`class` is `CssClass`** (C# keyword), **`readonly` is `ReadOnly`**
  (also reads as a keyword to a human, though not reserved as a property
  name) — PascalCase throughout, per catalog convention.
- **Root gets an extra `id`** not present in the Svelte DOM contract,
  needed only to scope the Tab-trap's `document.getElementById` lookup.
  Not a class-hook consumers style against.

## 10. Tracking

- Package directory: `lily-design-system-blazor-helpers/lily-design-system-blazor-date-time-picker/`
- Assembly / NuGet id: `LilyDesignSystem.Blazor.DateTimePicker`
- Spec version: 0.1.0
- Created: 2026-07-28
- License: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
  (or contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
