# AGENTS — DateTimePicker (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

A Blazor 10 headless date/time-picking form control: a text field plus an
icon button (📅, U+1F4C5) that opens a WAI-ARIA APG **Date Picker Dialog** —
a month grid with a full keyboard contract. Collects a date, a time, or
both, and is locale-correct by construction: month names, weekday names,
first day of week, numeric field order, and the 12/24-hour clock all come
from .NET's `CultureInfo` / `DateTimeFormatInfo`, never a baked-in table.

The canonical implementation is the Svelte helper
[`lily-design-system-svelte-date-time-picker`](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/);
this is a direct port with Blazor idioms swapped. When the two disagree,
Svelte wins — see
[spec/index.md §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation)
for the deviations that could not be avoided.

`date-time-picker` is a **fifth helper**, alongside the four
preference/action helpers already in this catalog (`theme-picker`,
`locale-picker`, `text-size-picker`, `share-picker`). It owns a **form
value**, not a preference or an action: it applies nothing to the document
and persists nothing.

## Files

| File | Purpose |
| --- | --- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `DateTimePicker.razor` | Razor markup. |
| `DateTimePicker.razor.cs` | C# code-behind (partial class), including the civil-date arithmetic. |
| `DateTimePickerTests.cs` | bUnit + xUnit spec, mapped to the §7 clauses. |
| `index.md` | User guide. |
| `docs/accessibility.md` | Tradeoffs, stated plainly. |
| `examples/` | Copy-pasteable Razor snippets. |

## Public surface

- Component: `DateTimePicker` in namespace `LilyDesignSystem.Blazor.Helpers`.
- Types: `DateTimeMode`, `CivilDate`, `CivilTime`, `DateTimeShortcut`,
  `DateTimePickerLabels`, `DateTimePickerContext`.
- Constant: `DateTimePicker.Calendar` — the default glyph, `"📅︎"`
  (U+1F4C5 CALENDAR + U+FE0E text-presentation selector), written as an
  escape, never a bare character.
- Civil-date/time arithmetic, all `public static` on `DateTimePicker`:
  `DaysInMonth`, `FormatIsoDate`, `ParseIsoDate`, `ToEpochDay`,
  `FromEpochDay`, `AddDays`, `AddMonths`, `WeekdayOf`, `IsoWeek`,
  `ParseIsoTime`, `FormatIsoTime`, `SplitValue`, `JoinValue`, `WithinRange`,
  `MonthMatrix`, `FirstDayOfWeekFor`, `MonthNames`, `NumericFieldOrder`,
  `ParseDateInput`, `ParseTimeInput`, `NextDateTimePickerId`. Backed by
  `DateOnly` / `TimeOnly` internally — see spec §3.
- Required parameters: `Label`, `Labels`. Six `Labels` entries are
  required; the optional ones gate their own UI, including
  `Labels.Invalid` (the `role="status"` invalid-input live region) and
  `Labels.Instructions` (the dialog's keyboard help + `aria-describedby`).
- `Value` + `ValueChanged` (two-way binding, `@bind-Value`) plus `OnChange`
  (fires alongside, matching the Svelte canonical's `onChange`).
- Internal, visible to the test project: `NowProvider` (testable-clock
  seam), `BuildInstallFocusTrapScript` (the Tab-trap script builder), and
  the focus-assertion seams `FieldReferenceId` / `TriggerReferenceId` /
  `DayReferenceId(iso)` (bUnit has no `document.activeElement`; the suite
  compares these against the recorded `FocusAsync` interop targets).
- **No persistence.** Unlike the three `*-select` helpers, this one owns a
  form value, not a preference: nothing is applied to the document and
  nothing is written to `localStorage`.

## Behaviour contract (one paragraph)

The trigger button opens a dialog seeded from the committed `Value` (or
today, snapped to the nearest selectable day). Selection inside the dialog
writes to private pending state; only Confirm, or a day click when
`ConfirmOnSelect` resolves true (the default for `Date` mode), commits it
to `Value` and fires `OnChange`/`ValueChanged`. Cancel, `Escape`, and a
click outside the dialog — including on the component's own text field —
close without committing; closing returns focus to whichever element
opened the dialog (the trigger after a click, the field after
`Alt`+`ArrowDown`). `Min`/`Max`/`IsDateDisabled` constrain which days can
be selected; vetoed days render `aria-disabled="true"` + `data-disabled`
(never the `disabled` attribute, so they stay focusable and announced)
and refuse activation, and the keyboard cursor may cross them but cannot
leave the `Min`/`Max` window. Typed text is parsed on blur or `Enter`
through a cascade (the caller's own `ParseInput`, then ISO, then a
locale-ordered numeric form, then a written month); unparseable or
out-of-range text is marked `aria-invalid` and left in place, never
silently corrected — and announced via the `Labels.Invalid` status
region when that label is supplied. `Escape` in the field discards a
pending typed edit and clears the invalid state, committing nothing.

## HTML

Root `<div class="date-time-picker">` → hidden `<input>` (form
participation) + `.date-time-picker-field` (visible text `<input>` + the
`.date-time-picker-button` trigger) → optional
`.date-time-picker-status` (`role="status"`, only with `Labels.Invalid`;
present-but-empty while valid, wired to the field via `aria-errormessage`
+ appended `aria-describedby` while invalid) → `.date-time-picker-dialog`
(`role="dialog"`, `aria-modal="true"`, `aria-describedby` → the optional
`.date-time-picker-instructions` first child when `Labels.Instructions`)
containing the header nav, the `role="grid"` calendar table (vetoed days:
`aria-disabled="true"` + `data-disabled`, never `disabled`), the time
`<select>`s (mode-dependent), the shortcut buttons, and the footer
(`clear`/`cancel`/`confirm`). Full markup in
[spec/index.md §4.3](./spec/index.md#43-dom-contract).

## Keyboard

Grid: arrow keys move by day/week, `Home`/`End` reach week ends,
`PageUp`/`PageDown` page the month (carrying focus with the cursor —
header-button paging deliberately does not), `Shift` pages the year,
`Enter`/`Space` selects. Field: `Enter` resolves typed text,
`Alt`+`ArrowDown` opens the dialog, `Escape` discards a pending typed
edit (no-op when nothing is pending). Dialog-wide: `Escape` closes
without committing and returns focus to the opener, `Tab` cycles within
the dialog via a **real** focus trap.

**The focus trap is genuine JS, not a Razor handler** — see
[spec/index.md §9](./spec/index.md#9-blazor-deviations-from-the-canonical-svelte-implementation)
for why Blazor's declarative `@onkeydown:preventDefault` cannot do this on
its own. Grid-navigation keys, by contrast, are NOT `preventDefault`ed
(same documented tradeoff as `SharePicker`'s arrow keys).

## Testing notes

`NowProvider` (an `internal static Func<DateTime>`) is the seam for
deterministic "today" — set it in a test's constructor and restore it in
`Dispose`, the same role `vi.useFakeTimers()` plays in the canonical
Svelte suite. Most assertions read rendered markup directly (`tabindex`,
`data-*`, `aria-*`) rather than real DOM focus, mirroring how the Svelte
suite's own `cursorDate()` helper works. Where real focus IS asserted
(§7.49, §7.52, §7.53, §7.55), the tests read
`ElementReference.FocusAsync()`'s `Blazor._internal.domWrapper.focus`
interop invocations — SharePicker's technique — but compare the ids
against the component's internal `FieldReferenceId` /
`TriggerReferenceId` / `DayReferenceId(iso)` seams rather than against
markup GUIDs: this component re-renders immediately (today-seeding in
`OnAfterRenderAsync`), which strips bUnit's first-render
`blazor:elementReference` GUIDs from the markup.

## Conventions this package follows

- Blazor partial class (`.razor` + `.razor.cs`), Blazor 10 / .NET 10.
- `[Parameter, EditorRequired]` for `Label` and `Labels`;
  `[Parameter(CaptureUnmatchedValues = true)]` for spread.
- `EventCallback<T>` for events; `RenderFragment<DateTimePickerContext>`
  for the custom glyph.
- `DateOnly` / `TimeOnly` for all date/time math — never a zoned `DateTime`.
- All browser access through `IJSRuntime` from `OnAfterRenderAsync`
  (Tab-trap install) or `ElementReference.FocusAsync()` (all other focus
  moves), so the component is SSR / prerender safe.
- No runtime dependency beyond `Microsoft.AspNetCore.Components.Web`.
- No bundled CSS, fonts, icons, images, or third-party URLs.
- All user-facing strings come from parameters.
