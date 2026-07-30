# DateTimePicker — Specification

Single source of truth for the `lily-design-system-react-date-time-picker`
React helper. This file drives implementation, testing, and documentation:
anything not in this spec is out of scope; anything in this spec must be
exercised by a test.

The canonical cross-framework contract is the Svelte helper's
[`spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md).
Per `AGENTS/helpers.md`, Svelte wins where the catalogs disagree; this
file mirrors its §-numbering exactly so the two test suites line up
clause for clause. The only differences are §4 (the API, restated in
React's terms) and the React-specifics called out in §5.4 and §9.

Sibling files:

- `DateTimePicker.tsx` — the implementation
- `DateTimePicker.test.tsx` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

## 1. Goal

Give a React 19 application a drop-in, headless control for collecting a
**date**, a **time**, or **both**, that:

1. Renders a text field plus an icon button that opens a WAI-ARIA APG
   **Date Picker Dialog**: a month grid with a full keyboard contract.
2. Is **locale-correct by construction** — month names, weekday names,
   first day of week, numeric field order, 12- vs 24-hour clock and
   day-period names all come from `Intl`, never from a baked-in table.
3. Accepts **typed input** as well as pointer and keyboard selection.
4. Constrains selection with `min`, `max`, and an arbitrary
   `isDateDisabled` predicate.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `date-time-picker` class hooks.

### 1.1 Relationship to the DHCW date picker

This helper implements everything in the Digital Health and Care Wales
`nhsw-date-picker` (see
[the NHSW component library](https://github.com/dhcw-digital-health-and-care-wales/nhsw-component-library)),
which is the closest published prior art in the NHS space and the reason
the canonical Svelte helper exists. Feature parity is in §8, the
deliberate departures in §9 — both inherited unchanged from the Svelte
spec, since this port changes idiom, not behaviour.

## 2. Non-goals

- **Time zones.** The value is a civil date and/or wall-clock time with no
  zone attached.
- **Seconds, or sub-minute precision.** Consumers needing it should use
  `parseInput` / `formatValue` and a text field.
- **Ranges.** A start/end pair is two of these bound together plus a
  cross-field validity rule — a different component.
- **Recurrence.** "Every second Tuesday" is a different problem entirely.
- **Persistence.** Unlike the three preference helpers, this does not
  write to `localStorage`: a date in a form is *data*, not a preference.
- **Relative-date parsing** ("tomorrow", "next Friday"). Locale-dependent
  and ambiguous.
- **Shipped positioning CSS** for the dialog. The package stays headless.

## 3. Architectural decisions

Inherited from the canonical Svelte helper; nothing here is
framework-specific:

- **Civil dates, never local-midnight `Date`.** `new Date(2026, 2, 1)` is
  an *instant* at local midnight; in a zone whose DST transition falls at
  midnight it can resolve to the previous day. All arithmetic goes
  through UTC epoch days.
- **ISO 8601 is the value contract.** `YYYY-MM-DD`, `HH:MM`, or
  `YYYY-MM-DDTHH:MM`.
- **Pending state is separate from `value`.** Selection inside the dialog
  writes to internal pending state; only Confirm (or a day click in
  `confirmOnSelect` mode) writes to the committed value. Without this
  split, Cancel and Escape have nothing to revert to.
- **A real focus trap, because `aria-modal="true"` is a promise.** The
  browser does not enforce it.
- **Labels arrive as one object.** Ten user-facing strings as ten flat
  props is a call site nobody can read.
- **Fixed six-row grid.** A grid sized to its month is four to six rows,
  so the footer moves as the user pages.
- **No dependencies beyond `react`.** No date library. `Intl` and
  epoch-day arithmetic cover everything in scope.

### 3.1 React-specific addition: explicit commit overrides

One genuine logic difference from the Svelte original, forced by React's
state model rather than chosen for style. In Svelte, assigning to a
`$state` variable (`pendingDate = isoDate;`) takes effect immediately, so
a day click can update the pending date and then read it back in the same
function call. In React, `setPendingDate(isoDate)` does not update
`pendingDate` until the next render — a handler that calls it and then
immediately reads `pendingDate` still sees the *previous* render's value.

`commit()` and `applyShortcut()` therefore take explicit `dateOverride` /
target-date parameters for the value about to be committed, rather than
trusting component state that has not re-rendered yet. This is invisible
to a consumer and does not change the public contract; it is called out
here because it is exactly the kind of "helpful simplification" a future
edit might undo, reintroducing a one-render-stale commit.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `label` | `string` | yes | — | Accessible name for **both** the trigger button and the dialog. |
| `labels` | `DateTimePickerLabels` | yes | — | Every other user-facing string. See §4.2. |
| `mode` | `"date" \| "time" \| "datetime"` | no | `"date"` | What to collect. |
| `value` | `string` | no | `""` | ISO value. Supply with `onChange` to control it; omit and the component manages its own copy. |
| `locale` | `string` | no | runtime default | BCP 47 tag driving all formatting. |
| `min` | `string` | no | — | Earliest selectable date, ISO. |
| `max` | `string` | no | — | Latest selectable date, ISO. |
| `isDateDisabled` | `(isoDate: string) => boolean` | no | — | Veto individual dates. |
| `firstDayOfWeek` | `number` | no | from `locale` | 0 = Sunday … 6 = Saturday. |
| `minuteStep` | `number` | no | `1` | Granularity of the minute select. |
| `hour12` | `boolean` | no | from `locale` | 12-hour clock. |
| `showWeekNumbers` | `boolean` | no | `false` | Render an ISO-8601 week column. |
| `shortcuts` | `DateTimeShortcut[]` | no | `[]` | Quick-pick buttons. |
| `confirmOnSelect` | `boolean` | no | `mode === "date"` | Commit and close on day click. |
| `name` | `string` | no | `"date-time"` | `name` of the hidden input. |
| `inputId` | `string` | no | generated | `id` of the text field, for a consumer `<label htmlFor>`. |
| `describedBy` | `string` | no | — | Forwarded as `aria-describedby`. |
| `placeholder` | `string` | no | — | Placeholder for the text field. |
| `disabled` | `boolean` | no | `false` | Disable the whole control. |
| `readonly` | `boolean` | no | `false` | Show the value, refuse edits. |
| `required` | `boolean` | no | `false` | Mark the field required. |
| `formatValue` | `(value: string) => string` | no | Intl | Override field rendering. |
| `parseInput` | `(text: string) => string \| null` | no | §5.4 | Override typed-text parsing. |
| `children` | `(args: ChildArgs) => React.ReactNode` | no | the calendar glyph | **Replaces the glyph inside the button.** |
| `onChange` | `(value: string) => void` | no | — | Fires after a value is committed. |
| `onShortcut` | `(id, isoDate) => void` | no | — | Fires when a shortcut is used. |
| `onInvalidInput` | `(text: string) => void` | no | — | Fires when typed text will not parse. |
| `className` | `string` | no | `""` | Extra CSS class on the root `<div>`. |
| `...restProps` | any HTML attributes | no | — | Spread onto the root `<div>`. |

`Props` extends `Omit<React.HTMLAttributes<HTMLDivElement>, "children" |
"onChange">`. Both are omitted because the helper redefines them:
`children` is a render prop rather than a node, and `onChange` reports a
committed ISO string rather than being the DOM's `ChangeEvent` handler.

**Controlled or uncontrolled**, matching this catalog's `ThemePicker` /
`LocalePicker` convention (the React idiom for the Svelte original's
`value = $bindable("")`): passing `value` makes the component controlled
— the consumer owns it and must supply `onChange` to see it change;
omitting `value` lets the component manage an internal copy, still
reported via `onChange`.

### 4.2 `DateTimePickerLabels`

```ts
type DateTimePickerLabels = {
  previousYear: string;   // required — names an always-rendered button
  previousMonth: string;  // required
  nextMonth: string;      // required
  nextYear: string;       // required
  confirm: string;        // required
  cancel: string;         // required
  hour?: string;          // required when mode includes a time
  minute?: string;        // required when mode includes a time
  meridiem?: string;      // required when hour12 resolves true
  week?: string;          // required when showWeekNumbers
  clear?: string;         // the clear button renders only when supplied
  invalid?: string;       // the invalid-input live region renders only when supplied
  instructions?: string;  // dialog keyboard help, described-by the dialog when supplied
};
```

The optional entries gate optional UI, exactly as `share-picker`'s
`copyLabel` gates its copy item: a control whose accessible name we
invented in English is the defect this package exists to avoid, so the
component would rather not render a control than name it for you.
`invalid` and `instructions` follow the same rule for announcements:
without `invalid`, refusing typed text flips `aria-invalid` but announces
nothing; without `instructions`, the dialog carries no keyboard help.
Supplying both is strongly recommended.

### 4.3 DOM contract

```html
<div class="date-time-picker {className}" data-mode="date" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />

  <div class="date-time-picker-field">
    <input class="date-time-picker-input" id="{fieldId}" type="text"
           autocomplete="off" value="{display}" aria-invalid="true|absent"
           aria-errormessage="{statusId} while invalid, when labels.invalid" />
    <button type="button" class="date-time-picker-button" aria-label="{label}"
            aria-haspopup="dialog" aria-expanded="false"
            aria-controls="{dialogId}">
      <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
    </button>
  </div>

  <!-- Only when labels.invalid: always present, empty while valid. -->
  <span class="date-time-picker-status" id="{statusId}" role="status"></span>

  <div class="date-time-picker-dialog" id="{dialogId}" role="dialog"
       aria-modal="true" aria-label="{label}" tabindex="-1" hidden
       aria-describedby="{instructionsId} when labels.instructions">
    <!-- Only when labels.instructions: keyboard help, spoken on open. -->
    <p class="date-time-picker-instructions" id="{instructionsId}">…</p>

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
                  data-outside data-today data-selected data-disabled
                  tabindex="0|-1" aria-label="Sunday 1 March 2026"
                  aria-current="date" aria-disabled="true|absent">1</button>
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

Identical to the Svelte contract, save for JSX spellings
(`className`/`htmlFor` instead of `class`/`for` in the source, though the
rendered DOM attributes are `class` / `for` either way).

- **Root** is a `<div>` carrying `date-time-picker` plus the consumer's
  `className`, and `data-mode` so CSS can branch without a second hook.
  Rest-props spread onto it.
- **Hidden input** preserves form participation and carries `name`. The
  visible text field deliberately has no `name`.
- **`data-*` on days** (`data-outside`, `data-today`, `data-selected`,
  `data-disabled`) is for consumer CSS; the ARIA equivalent
  (`aria-current`, `aria-selected` on the cell, `aria-disabled`) is what
  assistive technology reads. Both are present because they address
  different audiences — per the Lily headless rule on `data-*` vs ARIA.
- **Vetoed days are `aria-disabled`, never the `disabled` attribute.** A
  `disabled` button refuses focus, so arrowing across a blocked week goes
  silent for a screen reader while the visible focus stays behind — and
  the "exactly one tabbable day" invariant breaks the moment the cursor
  lands on one. `aria-disabled` keeps the day focusable and announced as
  unavailable; activation is refused in the handler. This is the ARIA APG
  guidance for composite-widget items.
- **`abbr` on weekday headers** carries the full weekday name.
- **The glyph** is U+1F4C5 CALENDAR + U+FE0E, exported as `CALENDAR`, and
  is `aria-hidden`. `children` replaces the glyph, not the dialog.
- The package ships zero CSS. **The dialog needs positioning CSS from the
  consumer.**

### 4.4 Re-exports

`index.ts` re-exports the component, all civil-date helpers
(`addDays`, `addMonths`, `parseIsoDate`, `formatIsoDate`, `toEpochDay`,
`fromEpochDay`, `weekdayOf`, `isoWeek`, `daysInMonth`, `parseIsoTime`,
`formatIsoTime`, `splitValue`, `joinValue`, `withinRange`, `monthMatrix`,
`firstDayOfWeekFor`, `monthNames`, `numericFieldOrder`, `parseDateInput`,
`parseTimeInput`, `pad`, `nextDateTimePickerId`), the `CALENDAR` constant,
and every public type.

`nextDateTimePickerId()` ships for parity with the canonical Svelte
helper and for consumers labelling a control from outside the component
tree. The component itself mints ids with React's `useId()`, which is
hydration-safe in a way a module-level counter cannot be.

## 5. Behaviour

### 5.1 Value

`value` is ISO and mode-shaped: `YYYY-MM-DD` for `"date"`, `HH:MM` for
`"time"`, `YYYY-MM-DDTHH:MM` for `"datetime"`. A malformed or
mode-mismatched value is treated as empty rather than repaired.

An incomplete `"datetime"` — a date with no time, or the reverse — is
never committed. Half a timestamp is not a smaller truth; it is a
different one.

### 5.2 Opening

On open the component samples today, seeds the pending date from the
committed value (or the nearest selectable day to today), seeds the
pending time from the committed time (or now, snapped down to
`minuteStep`), points the view at that month, and moves focus to the grid
cursor — or, in `"time"` mode, to the first control in the dialog.

### 5.3 Committing and discarding

| Action | Effect |
| ------ | ------ |
| Click a day, `confirmOnSelect` true | Commit and close. |
| Click a day, `confirmOnSelect` false | Update the pending selection only. |
| Confirm button | Commit the pending selection and close. |
| Cancel button | Close. `value` untouched. |
| `Escape` | Close. `value` untouched. |
| Clear button (when `labels.clear` is set) | Set `value` to `""`, fire `onChange("")`, close. |
| Click outside the dialog | Close without committing. This includes the component's own text field: the dialog claims `aria-modal="true"`, and a modal that stays open while the user edits behind it is telling assistive technology one thing and doing another. |

Closing returns focus to whichever element opened the dialog — the
trigger button after a click, the **text field** after `Alt` + `Arrow
Down` — per the APG dialog pattern. Click-outside closes without moving
focus, since the user has already put it somewhere.

`onChange` fires only when the committed value actually differs from the
previous one.

### 5.4 Typed input

Typed text is held as pending display text and resolved on blur or
`Enter`. Resolution tries, in order:

1. `parseInput(text)` if the consumer supplied one — their parser wins
   outright.
2. ISO `YYYY-MM-DD`.
3. A numeric form whose field order follows the locale, so `03/04/2026` is
   3 April in `en-GB` and 4 March in `en-US` — which is what each user
   means. Separators may be `/`, `.`, `-`, or whitespace.
4. A form containing a written month, matched case- and
   diacritic-insensitively against the locale's own long and short month
   names, with a three-character prefix match.

Two-digit years pivot at 70 (`69` → 2069, `70` → 1970).

Text that will not parse, **or that parses to a date outside `min`/`max`
or vetoed by `isDateDisabled`**, leaves the text in place, sets
`aria-invalid="true"`, and fires `onInvalidInput`. It is never silently
snapped to a nearby legal date the user did not type. When
`labels.invalid` is supplied, the refusal is also *announced*: the
`role="status"` region fills with the message, and the field points at it
via `aria-errormessage` plus `aria-describedby` (appended after the
consumer's `describedBy`). Without an announcement, a screen-reader user
who has already tabbed away never learns their date was refused.

`Escape` in the field discards a pending edit: the committed value
returns to display and the invalid state clears, without committing
anything — the same contract Escape has inside the dialog. The keystroke
does not propagate, so a surrounding dialog stays open. When no edit is
pending the key is untouched.

Clearing the field to empty commits `""`.

`"time"` mode accepts `9:30`, `09:30`, `0930`, `9.30`, and a trailing
`am`/`pm`.

### 5.5 Range and vetoes

`min` / `max` are inclusive. A day outside them, or vetoed by
`isDateDisabled`, renders `aria-disabled="true"` (plus `data-disabled`
for CSS) and refuses activation — never the `disabled` attribute, per
§4.3. The keyboard cursor may still land on a vetoed day inside the
range, with real focus and a screen-reader announcement — so arrowing
across a blocked week works — but may not leave the `min`/`max` window at
all, because there is nothing out there to navigate to.

A shortcut resolving to a blocked date does nothing, rather than landing
near it.

### 5.6 Locale resolution

| Thing | Source |
| ----- | ------ |
| Month and weekday names | `Intl.DateTimeFormat` |
| First day of week | `Intl.Locale.prototype.getWeekInfo`, else a region table, else Monday |
| Numeric field order | `Intl.DateTimeFormat.formatToParts` |
| 12- vs 24-hour clock | presence of a `dayPeriod` part |
| AM / PM names | the `dayPeriod` part's value |

Every one of these is overridable by prop.

### 5.7 SSR

No effects run and no DOM is touched during server rendering. The markup
renders with the consumer-supplied `value`, the dialog `hidden`. `Intl` is
used during render and is present in every supported server runtime.

Instance ids come from React's `useId()`, which is stable across server
and client render — never `Math.random()` or `Date.now()`, which would
differ between the two and break hydration. Under the Next.js App Router,
mark the importing module `"use client"` — the control is interactive.

## 6. Accessibility

### 6.1 Roles and properties

| Element | Role / property | Source |
| ------- | --------------- | ------ |
| trigger `<button>` | `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` | Component |
| glyph `<span>` | `aria-hidden="true"` | Component |
| dialog `<div>` | `role="dialog"`, `aria-modal="true"`, `aria-label`, `aria-describedby` → instructions when `labels.instructions` | Component |
| instructions `<p>` | plain text, id target of the dialog's `aria-describedby` | Consumer via `labels.instructions` |
| period `<span>` | `aria-live="polite"` | Component |
| `<table>` | `role="grid"`, `aria-labelledby` → the period | Component |
| `<th scope="col">` | `abbr` = full weekday name | Intl |
| `<td>` | `role="gridcell"`, `aria-selected` | Component |
| day `<button>` | `aria-label` = full date, `aria-current="date"` on today, `aria-disabled="true"` on vetoed days (focusable, refuses activation) | Component + Intl |
| text `<input>` | `aria-invalid`, `aria-describedby`, `aria-errormessage` → the status region while invalid | Component + consumer |
| status `<span>` | `role="status"` live region, filled with `labels.invalid` while invalid | Consumer via `labels.invalid` |

Follows the **WAI-ARIA APG Date Picker Dialog** pattern.

### 6.2 Keyboard contract

On the **text field**:

| Key | Action |
| --- | ------ |
| `Enter` | Resolve the typed text. |
| `Alt` + `Arrow Down` | Open the dialog — the platform convention, matching `<input type="date">`. |
| `Escape` | Discard a pending typed edit and show the committed value; no-op when nothing is pending. |

On the **grid**:

| Key | Action |
| --- | ------ |
| `Arrow Left` / `Right` | ∓ / ± one day. |
| `Arrow Up` / `Down` | ∓ / ± one week. |
| `Home` / `End` | First / last day of the current week, respecting `firstDayOfWeek`. |
| `Page Up` / `Page Down` | ∓ / ± one month. |
| `Shift` + `Page Up` / `Page Down` | ∓ / ± one year. |
| `Enter` / `Space` | Select the cursor's day. |

Anywhere in the **dialog**:

| Key | Action |
| --- | ------ |
| `Escape` | Close without committing. |
| `Tab` / `Shift+Tab` | Cycle within the dialog — the focus trap. |

The grid uses a roving `tabindex`: exactly one day is tabbable — an
invariant `aria-disabled` preserves and the `disabled` attribute would
break. Paging the view carries the cursor with it, clamped into the new
month; *focus* follows the cursor only when it was already in the grid
(`Page Up` / `Page Down`), because the cell it sat on no longer exists.
Paging from the header buttons leaves focus on the header button, so
"next month" can be activated repeatedly without being yanked into the
grid. The cells are real focusable `<button>` elements — no
`aria-activedescendant` — matching `share-picker` rather than the three
listbox helpers.

Closing the dialog returns focus to the element that opened it — button
or text field — per §5.3.

### 6.3 Internationalisation

`label` and every entry of `labels` pass through verbatim. No user-facing
string is hardcoded — including AM/PM, which comes from the locale's own
`dayPeriod` names. `dir` inherits from the document.

### 6.4 Accessibility tradeoffs

Stated plainly in [`../docs/accessibility.md`](../docs/accessibility.md):

1. A hand-rolled grid has weaker assistive-technology support than
   `<input type="date">`, which is the right default for many services.
2. The trigger is icon-only, so its accessible name rests entirely on
   `aria-label`.
3. The glyph is a font-dependent character that may substitute.
4. Date entry is hard for users with cognitive disabilities regardless of
   implementation; the typed field exists partly so the calendar is never
   the only route.

## 7. Testing acceptance criteria

`DateTimePicker.test.tsx` asserts every clause below; each `test(...)`
title carries its clause number. 65 tests total, using vitest + jsdom +
`@testing-library/react`.

### Pure arithmetic (mirrors §3, §4.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.1 | `parseIsoDate` rejects impossible dates (`2026-02-31`) and accepts real ones. |
| §7.1 | `daysInMonth` handles leap years (2024-02 → 29, 2100-02 → 28). |
| §7.2 | `addDays` crosses month and year boundaries, forwards and backwards. |
| §7.2 | `addMonths` clamps rather than rolling over (2026-01-31 + 1 → 2026-02-28). |
| §7.2 | `addMonths` with a negative delta crosses the year boundary correctly. |
| §7.3 | `weekdayOf` returns 0 for Sunday. |
| §7.3 | `isoWeek` matches the ISO-8601 definition on the known-hard cases (2026-01-01, 2021-01-03). |
| §7.4 | `toEpochDay` / `fromEpochDay` round-trip. |
| §7.5 | `splitValue` / `joinValue` round-trip per mode, and refuse a half datetime. |
| §7.6 | `monthMatrix` always returns 6 × 7 and starts on `firstDayOfWeek`. |
| §7.7 | `firstDayOfWeekFor` gives Monday for en-GB, Sunday for en-US, Monday for an unknown tag. |
| §7.8 | `parseDateInput` reads ISO, locale-ordered numerics (en-GB vs en-US differ), and written months. |
| §7.8 | `parseDateInput` returns null for junk and for impossible dates. |
| §7.9 | `parseTimeInput` reads `9:30`, `0930`, `9.30`, `1:30pm`, and rejects `25:00`. |

### Markup contract (mirrors §4.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.10 | Renders the trigger with `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls` pointing at the `role="dialog"` element. |
| §7.10 | The glyph renders inside `.date-time-picker-icon` with `aria-hidden="true"`. |
| §7.11 | `aria-label` names **both** the trigger and the dialog. |
| §7.12 | The hidden input carries `name` and the ISO value; the visible field carries the formatted display. |
| §7.13 | The dialog is `hidden` until the trigger is activated. |
| §7.14 | The grid renders 6 rows × 7 day cells, with `data-outside` on adjacent-month days. |
| §7.15 | Exactly one day carries `tabindex="0"`. |
| §7.16 | Extra attributes spread onto the root; `data-mode` reflects `mode`. |
| §7.17 | Today carries `data-today` and `aria-current="date"`. |

### Selection and commit (mirrors §5.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | Clicking a day in `"date"` mode commits, fires `onChange`, and closes. |
| §7.19 | With `confirmOnSelect={false}`, clicking a day does **not** commit; Confirm does. |
| §7.20 | Cancel closes without changing `value`. |
| §7.21 | `Escape` closes without changing `value`. |
| §7.22 | The clear button renders only when `labels.clear` is set, and commits `""`. |
| §7.23 | `onChange` does not fire when the committed value is unchanged. |

### Keyboard (mirrors §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.24 | Arrow keys move the cursor by a day and by a week. |
| §7.25 | `Home` / `End` reach the ends of the week, respecting `firstDayOfWeek`. |
| §7.26 | `Page Up` / `Page Down` page the month; `Shift` pages the year. |
| §7.27 | `Enter` on the grid selects the cursor's day. |
| §7.28 | `Alt` + `Arrow Down` on the field opens the dialog. |

### Range, vetoes, shortcuts (mirrors §5.5)

| Clause | Test asserts |
| ------ | ------------ |
| §7.29 | Days outside `min`/`max` render `aria-disabled="true"` + `data-disabled` — never the `disabled` attribute. |
| §7.30 | `isDateDisabled` marks individual days `aria-disabled`. |
| §7.31 | Clicking a vetoed day does not commit. |
| §7.32 | A shortcut moves the pending selection and fires `onShortcut`. |
| §7.33 | A shortcut resolving to a blocked date does nothing. |

### Typed input (mirrors §5.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.34 | Typing an ISO date and blurring commits it. |
| §7.35 | Typing a locale-ordered numeric date commits the right day. |
| §7.36 | Unparseable text sets `aria-invalid` and fires `onInvalidInput` without changing `value`. |
| §7.37 | Text parsing to an out-of-range date is rejected the same way. |
| §7.38 | Clearing the field commits `""`. |
| §7.39 | A `parseInput` prop overrides the built-in parser. |

### Time and datetime (mirrors §5.1)

| Clause | Test asserts |
| ------ | ------------ |
| §7.40 | `"time"` mode renders hour and minute selects and no grid. |
| §7.41 | `minuteStep` controls the minute options. |
| §7.42 | `"datetime"` mode renders both the grid and the time selects. |
| §7.43 | `"datetime"` does not commit a date with no time. |
| §7.44 | `hour12` renders a meridiem select whose labels come from the locale. |

### Locale (mirrors §5.6)

| Clause | Test asserts |
| ------ | ------------ |
| §7.45 | Weekday headings start on Monday for en-GB and Sunday for en-US. |
| §7.46 | `firstDayOfWeek` overrides the locale. |
| §7.47 | Month names and day `aria-label`s follow `locale`. |
| §7.48 | `showWeekNumbers` renders a week column with ISO week numbers. |

### Assistive technology (mirrors §4.3, §5.3, §5.4, §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.49 | The cursor lands on a vetoed day with real focus; the day is `aria-disabled`, still tabbable, refuses `Enter`, and the cursor can continue past it. |
| §7.50 | `Escape` in the field discards the pending edit, restores the committed display, clears `aria-invalid`, and commits nothing. |
| §7.51 | `labels.invalid` renders an empty `role="status"` region that fills on refusal, wired via `aria-errormessage` and appended to `aria-describedby`; absent without the label. |
| §7.52 | Closing returns focus to the field when opened by `Alt`+`Arrow Down`, and to the button when opened by click. |
| §7.53 | Paging from a header button keeps focus on that button while the cursor carries; paging from the grid moves focus with the cursor. |
| §7.54 | `labels.instructions` renders keyboard help referenced by the dialog's `aria-describedby`; absent without the label. |
| §7.55 | Clicking the text field while the dialog is open closes it without committing. |

## 8. DHCW feature parity

Identical to the canonical Svelte spec §8 — behaviour, not idiom, so
nothing changes in the port. See the Svelte
[`spec/index.md` §8](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md#8-dhcw-feature-parity).

## 9. Deliberate departures from DHCW

Identical to the canonical Svelte spec §9, plus one addition specific to
this port:

12. **Explicit commit overrides (React only).** `commit()` and
    `applyShortcut()` take the date/time about to be committed as
    parameters rather than reading `pendingDate` / `pendingTime` state,
    because `setState` does not land until the next render. See §3.1.
    This has no DHCW analogue — it is a consequence of React's state
    model, not a behavioural difference a user could observe.

## 10. Out-of-scope (future, not implemented here)

Identical to the canonical Svelte spec §10:

- A month/year quick-jump.
- An inline (non-dialog) variant.
- Multi-month display for range selection.
- Ports to the remaining catalogs (Vue, Angular, Blazor, Nunjucks, HTML).

## 11. Tracking

- Package directory: `lily-design-system-react-helpers/lily-design-system-react-date-time-picker/`
- Spec version: 0.1.0
- Created: 2026-07-28
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;

---

Lily™ and Lily Design System™ are trademarks.
