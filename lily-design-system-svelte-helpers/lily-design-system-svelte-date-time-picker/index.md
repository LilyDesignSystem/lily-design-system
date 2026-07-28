# Lily Design System™ — Svelte DateTimePicker

A headless Svelte 5 control for collecting a **date**, a **time**, or
**both**. A text field you can type into, plus an icon button that opens a
WAI-ARIA APG date-picker dialog with a full keyboard contract.

Ships zero CSS, zero icons, and zero hardcoded strings. Locale-correct by
construction: month names, weekday names, first day of week, numeric field
order, 12- vs 24-hour clock and AM/PM names all come from `Intl`.

Canonical contract: [spec/index.md](./spec/index.md).

## Install

```sh
npm install lily-design-system-svelte-date-time-picker
```

## Use it

```svelte
<script lang="ts">
  import DateTimePicker from "lily-design-system-svelte-date-time-picker";

  let appointment = $state("");
</script>

<label for="appointment">Appointment date</label>
<DateTimePicker
  inputId="appointment"
  name="appointment"
  label="Choose an appointment date"
  locale="en-GB"
  bind:value={appointment}
  labels={{
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
    confirm: "OK",
    cancel: "Cancel",
  }}
/>
```

`appointment` is now an ISO string: `"2026-03-15"`.

## The value is always ISO

| `mode` | `value` |
| ------ | ------- |
| `"date"` (default) | `"2026-03-15"` |
| `"time"` | `"09:30"` |
| `"datetime"` | `"2026-03-15T09:30"` |

Sortable as a string, unambiguous in every locale, and identical to what
`<input type="date">` posts — so you can swap the native control in or out
without touching your backend.

**No time zone is attached.** A date here is a civil date and a time is a
wall-clock time. If you need an instant, combine the value with a zone in
your own code, deliberately.

## Everything it does

### Constrain what can be picked

```svelte
<DateTimePicker
  {label} {labels}
  min="2026-03-01"
  max="2026-09-30"
  isDateDisabled={(iso) => weekdayOf(iso) === 0 || weekdayOf(iso) === 6}
/>
```

`min` / `max` are inclusive. `isDateDisabled` vetoes anything else — closed
days, fully-booked slots, bank holidays. Blocked days render `disabled`;
the keyboard cursor can still cross them, so arrowing over a blocked week
works.

### Quick picks

```svelte
<DateTimePicker
  {label} {labels}
  shortcuts={[
    { id: "today", label: "Today", days: 0 },
    { id: "week", label: "In 1 week", days: 7 },
    { id: "month", label: "In 1 month", months: 1 },
    { id: "review", label: "Review date", date: "2026-09-01" },
  ]}
/>
```

`months` uses calendar months, not 30 days — "+1 month" from 31 January is
28 February, not 2 March. A shortcut that resolves to a blocked date does
nothing rather than landing near it.

### Time, and date-and-time

```svelte
<DateTimePicker
  mode="datetime"
  minuteStep={15}
  {label}
  labels={{ ...labels, hour: "Hour", minute: "Minute" }}
/>
```

In `"datetime"` mode a day click sets the pending date only — the user
still has a time to choose — so the dialog waits for Confirm. An
incomplete datetime is never committed.

### Week numbers

```svelte
<DateTimePicker {label} labels={{ ...labels, week: "Wk" }} showWeekNumbers />
```

Real ISO-8601 week numbers, with the Thursday rule — so the week
containing 1 January 2021 is week 53, not week 1.

### Typing

The field accepts, in this order: ISO `2026-03-15`; a numeric form in the
locale's own field order (`03/04/2026` is 3 April in `en-GB`, 4 March in
`en-US`); and a written month (`27-Jun-2025`, `27 June 2025`, `Sept 5
2025`) matched against the locale's month names.

Text that will not parse — or that parses outside `min`/`max` — stays in
the field, sets `aria-invalid="true"`, and fires `onInvalidInput`. It is
never silently snapped to a nearby legal date. Supply `parseInput` to plug
in your own parser.

### Replace the glyph

```svelte
<DateTimePicker {label} {labels}>
  {#snippet children({ open, display })}
    <MyCalendarIcon expanded={open} />
    <span class="visually-hidden">{display}</span>
  {/snippet}
</DateTimePicker>
```

`children` replaces the glyph inside the button, not the dialog.

## Keyboard

**Field**: `Enter` resolves typed text. `Alt` + `↓` opens the dialog — the
same shortcut the native `<input type="date">` uses.

**Grid**: `←` `→` move a day; `↑` `↓` move a week; `Home` / `End` jump to
the ends of the week (respecting the locale's first weekday); `Page Up` /
`Page Down` page the month; add `Shift` to page the year; `Enter` / `Space`
select.

**Anywhere in the dialog**: `Escape` closes without committing; `Tab` and
`Shift+Tab` cycle inside the dialog.

## You must supply the CSS

The package is headless. Nothing positions the dialog for you — without
your CSS it renders in normal flow rather than as an overlay:

```css
.date-time-picker { position: relative; }
.date-time-picker-dialog {
  position: absolute;
  z-index: 10;
  inset-inline-start: 0;
}
.date-time-picker-dialog[hidden] { display: none; }
```

Class hooks: `date-time-picker`, `-field`, `-input`, `-button`, `-icon`,
`-dialog`, `-header`, `-previous-year`, `-previous-month`, `-period`,
`-next-month`, `-next-year`, `-calendar`, `-weekday`, `-week-heading`,
`-week`, `-day`, `-time`, `-time-label`, `-hour`, `-minute`, `-meridiem`,
`-shortcuts`, `-shortcut`, `-footer`, `-clear`, `-cancel`, `-confirm`.

Day cells carry `data-today`, `data-outside`, `data-selected`, and the root
carries `data-mode`, so variants need no extra classes.

## Should you use this at all?

Often, no. `<input type="date">` is smaller, better supported by assistive
technology, and gets the platform's own picker for free. Reach for this one
when you need what the native control cannot do: `isDateDisabled`,
shortcuts, week numbers, a consistent look across browsers, or a locale
that differs from the user's OS setting.

For a date the user knows by heart — a date of birth — use three separate
number fields instead. That is the NHS and GOV.UK guidance and it is right:
nobody wants to page a calendar back forty years.

## Related

- [`lily-design-system-svelte-theme-picker`](../lily-design-system-svelte-theme-picker/)
- [`lily-design-system-svelte-locale-picker`](../lily-design-system-svelte-locale-picker/)
- [`lily-design-system-svelte-text-size-picker`](../lily-design-system-svelte-text-size-picker/)
- [`lily-design-system-svelte-share-picker`](../lily-design-system-svelte-share-picker/)

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
