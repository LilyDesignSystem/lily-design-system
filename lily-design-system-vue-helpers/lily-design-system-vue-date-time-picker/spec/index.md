# DateTimePicker — Specification

Single source of truth for the `lily-design-system-vue-date-time-picker`
Vue 3 helper. This file drives implementation, testing, and documentation
in the spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

A direct port of the canonical
[`lily-design-system-svelte-date-time-picker`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/spec/index.md).
Where the two disagree, the Svelte side wins. The §7 clause numbers are
kept identical across catalogs so the suites cross-reference.

Sibling files in this directory's parent:

- `DateTimePicker.vue` — the implementation
- `DateTimePicker.test.ts` — vitest spec exercising every clause in §7
- `index.ts` — re-export barrel
- `index.md` — user-facing readme

---

## 1. Goal

Give a Vue 3 application a drop-in, headless control for collecting a
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
the same prior art the Svelte canonical is built against. Feature parity
is in §8; the deliberate departures, each of which fixes a defect rather
than adding taste, are in §9.

## 2. Non-goals

- **Time zones.** The value is a civil date and/or wall-clock time with no
  zone attached. A zone-aware control needs a zone picker, a DST-gap
  policy, and an instant type; that is a different component, and pretending
  otherwise produces values that are wrong by an hour twice a year.
- **Seconds, or sub-minute precision.** No user has ever wanted to pick a
  second from a dropdown. Consumers needing it should use `parseInput` /
  `formatValue` and a text field.
- **Ranges.** A start/end pair is two of these bound together plus a
  cross-field validity rule, and the catalog already has
  `calendar-range-picker` as the headless container for that shape.
- **Recurrence.** "Every second Tuesday" is a different problem entirely.
- **Persistence.** Unlike the three preference helpers in this catalog,
  this does not write to `localStorage`: a date in a form is *data*, not a
  preference, and restoring a stale appointment date on a later visit
  would be a defect.
- **Relative-date parsing** ("tomorrow", "next Friday"). Locale-dependent,
  ambiguous, and better served by `shortcuts`.
- **Shipped positioning CSS** for the dialog. The package stays headless.

## 3. Architectural decisions

- **A helper that owns a form value, not a preference or an action.**
  `AGENTS/helpers.md` lists three shapes in this catalog family: a
  preference lifecycle (`theme-picker`, `locale-picker`,
  `text-size-picker`), an action (`share-picker`), and now a form value
  (`date-time-picker`). None of it is applied to the document and none of
  it is persisted; the "helper" label comes from owning one complete
  interaction end to end and shipping the same headless contract, not
  from sharing a lifecycle with the other three.
- **Civil dates, never local-midnight `Date`.** `new Date(2026, 2, 1)` is
  an *instant* at local midnight; in a zone whose DST transition falls at
  midnight it can resolve to the previous day. All arithmetic goes through
  UTC epoch days. This is the single most important decision in the file
  and the one most likely to be undone by a well-meaning refactor.
- **ISO 8601 is the value contract.** `YYYY-MM-DD`, `HH:MM`, or
  `YYYY-MM-DDTHH:MM`. Sortable as a string, unambiguous across locales, and
  identical to what `<input type="date">` posts — so a consumer can swap
  the native control in or out without touching their backend.
- **Pending state is separate from `value`.** Selection inside the dialog
  writes to internal pending refs; only Confirm (or a day click in
  `confirmOnSelect` mode) writes to the committed value. Without this
  split, Cancel and Escape have nothing to revert to.
- **A real focus trap, because `aria-modal="true"` is a promise.** The
  browser does not enforce it. An untrapped `aria-modal` dialog tells a
  screen reader the rest of the page is inert while Tab walks into it.
- **Labels arrive as one object.** Ten user-facing strings as ten flat
  props is a call site nobody can read, and one object maps directly onto a
  translation bundle. This is a deliberate divergence from the three
  preference helpers, which need two or three strings each.
- **Fixed six-row grid.** A grid sized to its month is four to six rows, so
  the footer moves as the user pages. Constant height costs at most one
  trailing week and keeps the confirm button where the pointer left it.
- **No dependencies beyond `vue`.** No date library. `Intl` and epoch-day
  arithmetic cover everything in scope.
- **`v-model:value` for the committed value.** The Svelte canonical's
  bindable `value` maps onto Vue's standard two-way-binding convention:
  the prop is `value`, the update event is `update:value`, matching
  `theme-picker` and `locale-picker`. An internal `current` ref is the
  source of truth so the control works both controlled (the consumer
  drives `v-model:value`) and uncontrolled (no binding at all).
- **`await nextTick()` before every focus call that follows a visibility
  or mount change** — opening the dialog, paging the grid, applying a
  shortcut. A `hidden` element cannot take focus until the DOM has
  flushed. jsdom does not enforce this, so no test can catch its removal;
  it matters in a real browser only.
- **Explicit `'true'`/`'false'` string ternaries for ARIA booleans**
  (`aria-expanded`, `aria-selected`) and `:hidden="open ? undefined : true"`
  for the dialog's `hidden` attribute, matching every sibling helper in
  this catalog. Vue 3.5 normalises raw booleans correctly for both, but
  the explicit form states the intent and survives a change of binding
  target.

## 4. Public API

### 4.1 Props

| Prop | Type | Required | Default | Purpose |
| ---- | ---- | -------- | ------- | ------- |
| `label` | `string` | yes | — | Accessible name for **both** the trigger button and the dialog. |
| `labels` | `DateTimePickerLabels` | yes | — | Every other user-facing string. See §4.2. |
| `mode` | `"date" \| "time" \| "datetime"` | no | `"date"` | What to collect. |
| `value` | `string` | no | `""` | ISO value. Two-way bindable via `v-model:value`. |
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
| `inputId` | `string` | no | generated | `id` of the text field, for a consumer `<label for>`. |
| `describedBy` | `string` | no | — | Forwarded as `aria-describedby`. |
| `placeholder` | `string` | no | — | Placeholder for the text field. |
| `disabled` | `boolean` | no | `false` | Disable the whole control. |
| `readonly` | `boolean` | no | `false` | Show the value, refuse edits. |
| `required` | `boolean` | no | `false` | Mark the field required. |
| `formatValue` | `(value: string) => string` | no | Intl | Override field rendering. |
| `parseInput` | `(text: string) => string \| null` | no | §5.4 | Override typed-text parsing. |
| `class` | `string` | no | `""` | Extra CSS class on the root `<div>`. |
| `$attrs` | any HTML attributes | no | — | Fall through to the root `<div>`. |

The default scoped slot **replaces the glyph inside the button**, not the
dialog — see §4.3.

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

### 4.3 Events

The Svelte canonical takes `onChange` / `onShortcut` / `onInvalidInput`
callback props; the Vue idiom for the same contract is emitted events,
matching how `onShare` maps to `@share` on `share-picker`.

| Event | Payload | Fires when |
| ----- | ------- | ---------- |
| `update:value` | `(value: string)` | The committed value changes — the `v-model:value` half. |
| `change` | `(value: string)` | After a value is committed. |
| `shortcut` | `(id: string, isoDate: string)` | A shortcut is used, before the value settles. |
| `invalidInput` | `(text: string)` | Typed text will not parse. Template: `@invalid-input`. |

### 4.4 Slot

The default scoped slot replaces the glyph inside the trigger button and
receives `SlotArgs`:

```ts
type SlotArgs = {
  value: string;   // the committed value, in ISO form
  open: boolean;   // is the dialog open?
  display: string; // the value as the user sees it in the field
};
```

`ChildArgs` is exported as an alias of `SlotArgs`, matching the Svelte
canonical's type name and the convention `theme-picker` and
`text-size-picker` already use in this catalog.

### 4.5 DOM contract

```html
<div class="date-time-picker {class}" data-mode="date" ...$attrs>
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

- **Root** is a `<div>` carrying `date-time-picker` plus the consumer's
  `class` prop, and `data-mode` so CSS can branch without a second hook.
  `$attrs` fall through onto it automatically — Vue's single-root
  attribute inheritance, no explicit spread needed.
- **Hidden input** preserves form participation and carries `name`. The
  visible text field deliberately has no `name`: posting a localised
  display string alongside the ISO value is how a backend ends up parsing
  `"01/03/2026"` and guessing.
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
- **`abbr` on weekday headers** carries the full weekday name, so a screen
  reader announcing a column says "Monday" where the eye reads "Mo".
- **The glyph** is U+1F4C5 CALENDAR + U+FE0E, exported as `CALENDAR`, and
  is `aria-hidden`. The default slot replaces the glyph, not the dialog.
- The package ships zero CSS. **The dialog needs positioning CSS from the
  consumer** — without it, it renders in normal flow rather than as an
  overlay.

### 4.6 Re-exports

`index.ts` re-exports the component, all civil-date helpers
(`addDays`, `addMonths`, `parseIsoDate`, `formatIsoDate`, `toEpochDay`,
`fromEpochDay`, `weekdayOf`, `isoWeek`, `daysInMonth`, `parseIsoTime`,
`formatIsoTime`, `splitValue`, `joinValue`, `withinRange`, `monthMatrix`,
`firstDayOfWeekFor`, `monthNames`, `numericFieldOrder`, `parseDateInput`,
`parseTimeInput`, `nextDateTimePickerId`), the `CALENDAR` constant, and
every public type (`Props`, `SlotArgs`, `ChildArgs`, `CivilDate`,
`CivilTime`, `DateTimeMode`, `DateTimeShortcut`, `DateTimePickerLabels`).

The arithmetic is exported deliberately: a consumer wiring `min`, `max`,
`shortcuts` or `isDateDisabled` is doing date maths too, and the
alternative is that they reach for a `Date` and reintroduce the
local-midnight bug §3 exists to prevent.

## 5. Behaviour

Framework-agnostic; identical to the Svelte canonical.

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
| Clear button (when `labels.clear` is set) | Set `value` to `""`, emit `change("")` and `update:value("")`, close. |
| Click outside the dialog | Close without committing. This includes the component's own text field: the dialog claims `aria-modal="true"`, and a modal that stays open while the user edits the field behind it is telling assistive technology one thing and doing another. |

Closing returns focus to whichever element opened the dialog — the
trigger button after a click, the **text field** after `Alt` + `Arrow
Down` — per the APG dialog pattern. Click-outside closes without moving
focus, since the user has already put it somewhere.

`change` (and `update:value`) fire only when the committed value actually
differs from the previous one.

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
   names, with a three-character prefix match. This is what lets DHCW's
   `27-Jun-2025` round-trip.

Two-digit years pivot at 70 (`69` → 2069, `70` → 1970).

Text that will not parse, **or that parses to a date outside `min`/`max`
or vetoed by `isDateDisabled`**, leaves the text in place, sets
`aria-invalid="true"`, and emits `invalidInput`. It is never silently
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
§4.5. The keyboard cursor may still land on a vetoed day inside the
range, with real focus and a screen-reader announcement — so arrowing
across a blocked week works — but may not leave the `min`/`max` window at
all, because there is nothing out there to navigate to.

A shortcut resolving to a blocked date does nothing, rather than landing
near it: a "+4 weeks" that quietly means "+27 days" is a booking error.

### 5.6 Locale resolution

| Thing | Source |
| ----- | ------ |
| Month and weekday names | `Intl.DateTimeFormat` |
| First day of week | `Intl.Locale.prototype.getWeekInfo`, else a region table, else Monday |
| Numeric field order | `Intl.DateTimeFormat.formatToParts` |
| 12- vs 24-hour clock | presence of a `dayPeriod` part |
| AM / PM names | the `dayPeriod` part's value |

Every one of these is overridable by prop. The region-table fallback
exists because `getWeekInfo` is recent enough to be missing from some SSR
runtimes; it defaults to Monday, which is both the ISO-8601 rule and the
majority convention.

### 5.7 SSR

No DOM writes happen outside `onMounted`. The markup renders with the
consumer-supplied `value`, the dialog `hidden`. `Intl` is used during
setup and render and is present in every supported server runtime.

Instance ids come from an incrementing module counter — never
`Math.random()` or `Date.now()`, which would differ between the server and
client renders and break hydration.

### 5.8 Vue-specific implementation notes

- `openDialog`, `closeDialog`, `shiftMonth`, `shiftYear` and
  `applyShortcut` `await nextTick()` before calling `.focus()`. A `hidden`
  element cannot take focus in a real browser, so the DOM must flush
  first.
- The outside-click listener is registered in `onMounted` and removed in
  `onBeforeUnmount`, matching `theme-picker` / `locale-picker` /
  `share-picker`. It closes on any click outside the **dialog and the
  trigger button** — not merely outside the root — so the component's own
  text field counts as outside, per §5.3.
- The opener element (`openerEl`) is a plain variable, not a `ref` —
  nothing renders from it; it only steers where `closeDialog` returns
  focus.
- An internal `current` ref mirrors the `value` prop; a `watch` on
  `props.value` keeps it in sync when the consumer drives
  `v-model:value`, and every commit path writes `current.value` and emits
  both `update:value` and `change`.

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
grid.

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

`DateTimePicker.test.ts` asserts every clause below; each `test(...)`
title carries its clause number, kept identical to the Svelte suite so
the two cross-reference.

### Pure arithmetic (mirrors §3, §4.6)

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

### Markup contract (mirrors §4.5)

| Clause | Test asserts |
| ------ | ------------ |
| §7.10 | Renders the trigger with `aria-haspopup="dialog"`, `aria-expanded="false"`, and `aria-controls` pointing at the `role="dialog"` element. |
| §7.10 | The glyph renders inside `.date-time-picker-icon` with `aria-hidden="true"`. |
| §7.11 | `aria-label` names **both** the trigger and the dialog. |
| §7.12 | The hidden input carries `name` and the ISO value; the visible field carries the formatted display. |
| §7.13 | The dialog is `hidden` until the trigger is activated. |
| §7.14 | The grid renders 6 rows × 7 day cells, with `data-outside` on adjacent-month days. |
| §7.15 | Exactly one day carries `tabindex="0"`. |
| §7.16 | `$attrs` fall through onto the root; `data-mode` reflects `mode`. |
| §7.17 | Today carries `data-today` and `aria-current="date"`. |

### Selection and commit (mirrors §5.3)

| Clause | Test asserts |
| ------ | ------------ |
| §7.18 | Clicking a day in `"date"` mode commits, emits `change` / `update:value`, and closes. |
| §7.19 | With `confirmOnSelect={false}`, clicking a day does **not** commit; Confirm does. |
| §7.20 | Cancel closes without changing `value`. |
| §7.21 | `Escape` closes without changing `value`. |
| §7.22 | The clear button renders only when `labels.clear` is set, and commits `""`. |
| §7.23 | `change` does not fire when the committed value is unchanged. |

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
| §7.32 | A shortcut moves the pending selection and emits `shortcut`. |
| §7.33 | A shortcut resolving to a blocked date does nothing. |

### Typed input (mirrors §5.4)

| Clause | Test asserts |
| ------ | ------------ |
| §7.34 | Typing an ISO date and blurring commits it. |
| §7.35 | Typing a locale-ordered numeric date commits the right day. |
| §7.36 | Unparseable text sets `aria-invalid` and emits `invalidInput` without changing `value`. |
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

### Assistive technology (mirrors §4.5, §5.3, §5.4, §6.2)

| Clause | Test asserts |
| ------ | ------------ |
| §7.49 | The cursor lands on a vetoed day with real focus; the day is `aria-disabled`, still tabbable, refuses `Enter`, and the cursor can continue past it. |
| §7.50 | `Escape` in the field discards the pending edit, restores the committed display, clears `aria-invalid`, and commits nothing. |
| §7.51 | `labels.invalid` renders an empty `role="status"` region that fills on refusal, wired via `aria-errormessage` and appended to `aria-describedby`; absent without the label. |
| §7.52 | Closing returns focus to the field when opened by `Alt`+`Arrow Down`, and to the button when opened by click. |
| §7.53 | Paging from a header button keeps focus on that button while the cursor carries; paging from the grid moves focus with the cursor. |
| §7.54 | `labels.instructions` renders keyboard help referenced by the dialog's `aria-describedby`; absent without the label. |
| §7.55 | Clicking the text field while the dialog is open closes it without committing. |

In addition, two Vue-idiom-specific cases are asserted directly (no
Svelte-side clause number, since they exercise `v-model` and the scoped
slot mechanics rather than the framework-agnostic contract): an external
`value` prop update is reflected after a commit round-trips through
`update:value`, and the default scoped slot replaces the glyph and
receives `SlotArgs`.

## 8. DHCW feature parity

Everything the `nhsw-date-picker` does, and where it lives here.

| DHCW behaviour | Here |
| -------------- | ---- |
| Text input + calendar toggle button | §4.5 |
| Modal dialog with month grid | §4.5 |
| Previous/next month, previous/next year | §4.5 header |
| `aria-live` month/year heading | §4.5, `aria-live="polite"` |
| Weekday headers with `abbr` full names | §4.5 |
| Day cells with full-date `aria-label` and `aria-selected` | §4.5 |
| Roving `tabindex` on days | §6.2 |
| Today / other-month / pending day states | `data-today` / `data-outside` / `data-selected` |
| Arrow, Home/End, PageUp/Down, Shift+PageUp/Down, Enter, Escape | §6.2 |
| Shortcut buttons with day and month offsets | `shortcuts`, §5.5 |
| Cancel / OK footer | `labels.cancel` / `labels.confirm` |
| Parse the input value on open | §5.2 |
| Emit a change event on confirm | `change` / `update:value` |
| Pre-populated value | `value` / `v-model:value` |
| Disabled state | `disabled` |
| `aria-describedby` passthrough | `describedBy` |
| Click-outside closes | §5.3 |

## 9. Deliberate departures from DHCW

Each fixes a defect. None is a matter of taste. Identical to the Svelte
canonical, since these are all behavioural rather than framework-specific.

1. **No hardcoded English.** DHCW bakes in `MONTHS`, `SHORT_MONTHS`,
   `"Today"`, `"+1 week"`, `"Cancel"`, `"OK"`, `"Previous year"`, and
   `"Open calendar for …"`. Month and weekday names come from `Intl` here;
   everything else is a prop. This is the Lily i18n rule, and for a Welsh
   design system specifically it is the difference between a bilingual
   service and an English one with a Welsh veneer.
2. **Monday is not assumed.** DHCW hardcodes a Monday-first grid. First
   day of week comes from the locale here, overridable by prop.
3. **The focus trap exists.** DHCW declares `aria-modal="true"` and traps
   nothing.
4. **Civil dates, not local-midnight `Date`.** See §3.
5. **`min` / `max` / `isDateDisabled`.** DHCW has no way to constrain
   selection at all, so a booking picker will happily offer last Tuesday.
6. **Fixed-height grid.** DHCW's `Math.ceil((firstDay + days) / 7)` gives
   a dialog that changes height as you page.
7. **No `innerHTML` string building.** DHCW interpolates `data-value` and
   the page's label text into an HTML string; a label containing a quote
   breaks the markup, and the pattern is one refactor away from an
   injection. This is a Vue template.
8. **SSR-safe ids.** DHCW uses `Math.random()`.
9. **Typed input round-trips.** DHCW parses only its own `DD-MMM-YYYY`
   output; anything else is silently ignored, leaving the field showing
   text that does not match the value. Here, unparseable text is *marked*
   invalid rather than ignored.
10. **Escape genuinely discards.** DHCW's Escape closes the dialog but the
    pending date it leaves behind is whatever was last arrowed to.
11. **Time.** DHCW is date-only.
12. **Week numbers.** Optional here; absent there.

## 10. Out-of-scope (future, not implemented here)

- A month/year quick-jump (clicking the period heading to get a month
  grid, then a year grid). Worth adding; needs its own labels and keyboard
  contract.
- An inline (non-dialog) variant for pages where the calendar is the
  primary content.
- Multi-month display for range selection, once a range helper exists.
- Ports to the remaining catalogs (React, Angular, Blazor, Nunjucks).
  Svelte is canonical per `AGENTS/helpers.md`; this Vue port is the second
  of the six.

## 11. Tracking

- Package directory: `lily-design-system-vue-helpers/lily-design-system-vue-date-time-picker/`
- Spec version: 0.1.0
- Created: 2026-07-28
- Ported from: `lily-design-system-svelte-date-time-picker` 0.1.0
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
