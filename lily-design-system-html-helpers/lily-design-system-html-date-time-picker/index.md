# `<date-time-picker>` — Lily Design System HTML helper

A headless control for collecting a **date**, a **time**, or **both**,
packaged as a vanilla custom element. A typeable text field plus an icon
button (📅) that opens a WAI-ARIA APG **Date Picker Dialog**: a month
grid with a full keyboard contract, optional time selects, optional
quick-pick shortcuts, and a Confirm/Cancel/Clear footer.

Ships zero CSS, zero icons beyond the one glyph, and zero hardcoded
strings. Locale-correct by construction: month names, weekday names,
first day of week, numeric field order, 12- vs 24-hour clock, and AM/PM
names all come from `Intl`.

Canonical contract: [spec/index.md](./spec/index.md).

## Install

```sh
npm install lily-design-system-html-date-time-picker
```

## Quick start

```html
<label for="appointment">Appointment date</label>
<div id="appointment-hint">For example, 27 Jun 2026</div>

<date-time-picker
  id="picker"
  input-id="appointment"
  described-by="appointment-hint"
  name="appointment"
  label="Choose an appointment date"
  locale="en-GB"
  placeholder="DD MMM YYYY"
></date-time-picker>

<script type="module">
  import "lily-design-system-html-date-time-picker";

  // `labels` is a JS property, not an attribute — see "Property-only
  // members" below.
  document.getElementById("picker").labels = {
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
    confirm: "OK",
    cancel: "Cancel",
  };

  document.getElementById("picker").addEventListener("datetimechange", (e) => {
    console.log("value:", e.detail.value); // "2026-06-27"
  });
</script>
```

Importing the module registers `<date-time-picker>`. Registration is
idempotent. To control the tag name yourself, import the class from
`lily-design-system-html-date-time-picker/date-time-picker` instead and
call `customElements.define(...)`.

## The value is always ISO

| `mode` | `value` |
| ------ | ------- |
| `"date"` (default) | `"2026-03-15"` |
| `"time"` | `"09:30"` |
| `"datetime"` | `"2026-03-15T09:30"` |

Sortable as a string, unambiguous in every locale, and identical to what
`<input type="date">` posts — so you can swap the native control in or
out without touching your backend.

**No time zone is attached.** A date here is a civil date and a time is
a wall-clock time. If you need an instant, combine the value with a zone
in your own code, deliberately.

## Attributes

| Attribute | Default | Purpose |
| --------- | ------- | ------- |
| `label` | `""` | **Required.** Accessible name for the trigger and the dialog. |
| `mode` | `"date"` | `"date"` \| `"time"` \| `"datetime"`. |
| `value` | `""` | ISO value. |
| `locale` | runtime default | BCP 47 tag driving all formatting. |
| `min` / `max` | — | Inclusive ISO date bounds. |
| `first-day-of-week` | from `locale` | `0`–`6`, 0 = Sunday. |
| `minute-step` | `1` | Granularity of the minute select. |
| `hour12` | from `locale` | `"true"` \| `"false"`. Absent = auto (tri-state, see below). |
| `show-week-numbers` | `false` | Presence-based boolean. |
| `confirm-on-select` | `mode === "date"` | `"true"` \| `"false"`. Absent = auto (tri-state, see below). |
| `name` | `"date-time"` | `name` of the hidden input. |
| `input-id` | generated | `id` of the text field, for a `<label for>`. |
| `described-by` | — | Forwarded as `aria-describedby`. |
| `placeholder` | — | Placeholder for the text field. |
| `disabled` / `readonly` / `required` | `false` | Presence-based booleans. |
| `class` | `""` | Extra class on the rendered root `<div>`. |

### Tri-state booleans: `hour12` and `confirm-on-select`

Most boolean attributes in this catalog are presence-based: absent means
`false`. These two are different, because their *default* depends on
`locale` or `mode` — so absence means "let the component decide", not
"false". Set the attribute to the literal string `"true"` or `"false"`
to override; anything else (including leaving it off) falls back to the
locale/mode-derived default.

## Properties and events

Every attribute above has a mirrored camelCase property. Read-only:
`open`, `dialogId`, `fieldId`.

### Property-only members

Eight parts of the API cannot be attributes:

| Property | Type | Paired event |
| -------- | ---- | ------------ |
| `labels` | `DateTimePickerLabels` (required) | — |
| `shortcuts` | `DateTimeShortcut[]` | — |
| `isDateDisabled` | `(isoDate: string) => boolean` | — |
| `formatValue` | `(value: string) => string` | — |
| `parseInput` | `(text: string) => string \| null` | — |
| `onChange` | `(value: string) => void` | `datetimechange` |
| `onShortcut` | `(id: string, isoDate: string) => void` | `shortcut` |
| `onInvalidInput` | `(text: string) => void` | `invalidinput` |

`labels` and `shortcuts` carry plain data and could, in principle, be
JSON-attribute-encoded the way this catalog does elsewhere — they are
property-only instead, grouped with the function-valued members,
because they arrive together as one setup step and a JSON round-trip
risks silently dropping an optional label key. See
[`spec/index.md` §4.3](./spec/index.md#43-property-only-members).

```ts
type DateTimePickerLabels = {
  previousYear: string; // required
  previousMonth: string; // required
  nextMonth: string; // required
  nextYear: string; // required
  confirm: string; // required
  cancel: string; // required
  hour?: string; // required when mode includes a time
  minute?: string; // required when mode includes a time
  meridiem?: string; // required when hour12 resolves true
  week?: string; // required when showWeekNumbers
  clear?: string; // the clear button renders only when supplied
  invalid?: string; // the invalid-input live region renders only when supplied
  instructions?: string; // dialog keyboard help, described-by the dialog when supplied
};

type DateTimeShortcut = {
  id: string;
  label: string;
  days?: number; // relative to today
  months?: number; // calendar months, relative to today
  date?: string; // an absolute ISO date
};
```

The events are the primary contract; the callbacks are a convenience.
Both fire, callback first.

```js
document.addEventListener("datetimechange", (e) => {
  console.log(e.detail.value); // "2026-06-27"
});
document.addEventListener("shortcut", (e) => {
  console.log(e.detail.id, e.detail.isoDate);
});
document.addEventListener("invalidinput", (e) => {
  console.log("could not parse:", e.detail.text);
});
```

## Constrain what can be picked

```js
el.min = "2026-03-01";
el.max = "2026-09-30";
el.isDateDisabled = (iso) => weekdayOf(iso) === 0 || weekdayOf(iso) === 6;
```

`min` / `max` are inclusive. `isDateDisabled` vetoes anything else —
closed days, fully-booked slots, bank holidays. Blocked days render
`aria-disabled="true"` plus a `data-disabled` hook for your CSS — never
the `disabled` attribute, so they stay focusable: the keyboard cursor
can land on them and a screen reader announces them as unavailable,
while activation is refused. Style them with
`.date-time-picker-day[data-disabled]` (a `:disabled` selector will not
match).

## Announce refusals, and explain the keyboard

Two optional labels light up two extra pieces of markup — without them,
nothing renders, because the component never invents English:

```js
picker.labels = {
  ...labels,
  invalid: "Enter a valid date, for example 21 3 2026",
  instructions: "Use the arrow keys to choose a day, and Enter to confirm",
};
```

- `invalid` renders a `<span class="date-time-picker-status"
  role="status">` live region straight after the field — present in the
  DOM whenever the label is supplied, *empty* while the field is valid,
  filled with the message when typed text is refused. The field points
  at it via `aria-errormessage` and appends its id to
  `aria-describedby` (after your own `described-by`). Without it,
  `aria-invalid` flips silently and a screen-reader user who has already
  left the field never hears that their date was rejected.
- `instructions` renders a `<p class="date-time-picker-instructions">`
  as the first child of the dialog and becomes the dialog's
  `aria-describedby`, so a screen reader speaks it once on open. Visible
  by default; hide it visually with your own CSS if you prefer.

## Quick picks

```js
el.shortcuts = [
  { id: "today", label: "Today", days: 0 },
  { id: "week", label: "In 1 week", days: 7 },
  { id: "month", label: "In 1 month", months: 1 },
  { id: "review", label: "Review date", date: "2026-09-01" },
];
```

`months` uses calendar months, not 30 days. A shortcut that resolves to
a blocked date does nothing rather than landing near it.

## Time, and date-and-time

```html
<date-time-picker mode="time" ...></date-time-picker>
<date-time-picker mode="datetime" ...></date-time-picker>
```

```js
el.minuteStep = 15;
el.hour12 = true; // or leave unset to follow the locale
```

## Rendered markup

Full contract: [`spec/index.md` §4.4](./spec/index.md#44-dom-contract).

```html
<date-time-picker label="Choose a date">
  <div class="date-time-picker" data-mode="date">
    <input type="hidden" name="date-time" value="2026-03-15" />
    <div class="date-time-picker-field">
      <input class="date-time-picker-input" type="text" autocomplete="off" />
      <button
        type="button"
        class="date-time-picker-button"
        aria-label="Choose a date"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        <span class="date-time-picker-icon" aria-hidden="true">&#128197;&#65038;</span>
      </button>
    </div>
    <div class="date-time-picker-dialog" role="dialog" aria-modal="true" hidden>
      <!-- header, grid, time selects, shortcuts, footer -->
    </div>
  </div>
</date-time-picker>
```

## Styling

The package ships no CSS, including dialog positioning:

```css
.date-time-picker {
  position: relative;
  display: inline-block;
}
.date-time-picker-dialog {
  position: absolute;
  z-index: 10;
  inset-inline-start: 0;
  background: Canvas;
  border: 1px solid;
  padding: 0.5rem;
}
.date-time-picker-dialog[hidden] {
  display: none;
}
.date-time-picker-day[data-outside] {
  opacity: 0.5;
}
.date-time-picker-day[data-selected] {
  outline: 2px solid;
}
.date-time-picker-day[data-disabled] {
  opacity: 0.3;
  cursor: not-allowed;
}
```

## Custom glyph

Light DOM has no `<slot>`, so subclassing is the customisation surface —
the same pattern as `share-picker`'s `renderButtonContent()`.

```js
import { DateTimePicker } from "lily-design-system-html-date-time-picker/date-time-picker";

class LabelledDateTimePicker extends DateTimePicker {
  renderButtonContent() {
    const span = document.createElement("span");
    span.textContent = this.open ? "Close" : "Pick a date";
    return span;
  }
}
customElements.define("labelled-date-time-picker", LabelledDateTimePicker);
```

## Keyboard

On the **text field**: `Enter` resolves typed text; `Alt`+`↓` opens the
dialog (matching `<input type="date">`); `Escape` discards a pending
typed edit — the committed value comes back on display and the invalid
state clears — and is left alone when nothing is pending.

On the **grid**: arrows move by a day / a week; `Home`/`End` reach the
week's ends; `Page Up`/`Page Down` page the month, `Shift` pages the
year; `Enter`/`Space` selects the cursor's day. Paging from the header's
prev/next buttons leaves focus on the button, so it can be activated
repeatedly.

Anywhere in the **dialog**: `Escape` closes without committing; `Tab` /
`Shift+Tab` cycle within the dialog (a real focus trap). Closing returns
focus to whichever element opened the dialog — the trigger button after
a click, the text field after `Alt`+`↓`.

## Accessibility

WAI-ARIA APG Date Picker Dialog pattern; WCAG 2.2 AAA target. The real
costs are stated plainly in
[docs/accessibility.md](./docs/accessibility.md) — read it before
shipping an icon-only trigger, and note that `<input type="date">` is
the better default for many services.

## Examples

Runnable pages in [examples/](./examples/).

## Related

- [`lily-design-system-html-share-picker`](../lily-design-system-html-share-picker/)
- [`lily-design-system-html-theme-picker`](../lily-design-system-html-theme-picker/)
- [`lily-design-system-html-locale-picker`](../lily-design-system-html-locale-picker/)
- [Svelte original](../../lily-design-system-svelte-helpers/lily-design-system-svelte-date-time-picker/)

---

Lily™ and Lily Design System™ are trademarks.
