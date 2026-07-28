# Lily Design System — Nunjucks DateTimePicker

A headless date/time-picking form control for Nunjucks 3: a text field
plus an icon button (📅) that opens a WAI-ARIA APG **Date Picker
Dialog** — a month grid with a full keyboard contract, optional
hour/minute/meridiem selects, and optional shortcut buttons.

Ships zero CSS and zero JavaScript dependencies beyond `Intl` and the
DOM. Locale-correct by construction: month names, weekday names, first
day of week, numeric field order, and the 12- vs 24-hour clock all come
from `Intl`, never from a baked-in table.

- Specification: [spec/index.md](./spec/index.md)
- Accessibility tradeoffs: [docs/accessibility.md](./docs/accessibility.md)
- Examples: [examples/](./examples/)

## The hardest port in the catalog

Every other Nunjucks helper's macro renders complete (or nearly
complete) markup, and its `client.js` wires interaction onto it. This
control cannot work that way: its calendar grid, weekday headers,
period heading ("March 2026"), and hour/minute option lists all depend
on `Intl.DateTimeFormat` and civil-date arithmetic that a Nunjucks
template has no access to. So `date-time-picker.njk` renders only the
fixed chrome — the trigger, the header's navigation buttons, the
hour/minute `<label>`s, any shortcut buttons, and the footer — and
`date-time-picker.client.js` builds everything Intl-dependent, every
time the view changes. See [spec/index.md §3.2](./spec/index.md) for
the full account.

One consequence worth knowing up front: **unlike `share-picker`, this
control has no usable no-JS path.** Its calendar interior does not
exist in the server-rendered markup at all. See
[docs/accessibility.md](./docs/accessibility.md).

## Install

```sh
npm install lily-design-system-nunjucks-date-time-picker
```

## Use

```njk
{% from "date-time-picker.njk" import dateTimePicker %}

{{ dateTimePicker({
    label: "Appointment date",
    labels: {
        previousYear: "Previous year",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        nextYear: "Next year",
        confirm: "Confirm",
        cancel: "Cancel",
        clear: "Clear"
    },
    mode: "date",
    value: appointment.date,
    min: "2026-01-01"
}) }}
```

```html
<script type="module">
  import { autoInit } from "/js/date-time-picker.client.js";
  autoInit();
</script>
```

`autoInit()` wires every `date-time-picker` on the page. Every root
built by the macro works with `autoInit()` alone — you only reach for
`initDateTimePicker(root, opts)` directly when you need callbacks
(`onChange`, `onShortcut`, `onInvalidInput`), a real `isDateDisabled`
predicate, or a `formatValue` / `parseInput` override.

## The deviations from the canonical Svelte helper

The canonical helper — `lily-design-system-svelte-date-time-picker` —
types four props as functions, plus one prop (`hour12`) whose rendering
depends on a runtime computation. A Nunjucks macro cannot call an
arbitrary JavaScript function, and cannot call `Intl` at all, so:

- **`isDateDisabled(isoDate) => boolean`** becomes `disabledDates`, an
  array of ISO date strings, in the macro. `initDateTimePicker`'s
  `isDateDisabled` option, if you supply one, **replaces** that list
  rather than combining with it — for a rule a finite list cannot
  express, like "no weekends".
- **`formatValue` / `parseInput`** have no macro-side equivalent at
  all — they are client-only concerns and pass straight through as
  `initDateTimePicker` options.
- **`hour12`**, resolved from `locale` via `Intl` when unset in the
  canonical helper, is resolved by `date-time-picker.client.js`
  instead: the macro never renders the meridiem select, and the client
  builds it only when the resolved clock turns out to be 12-hour.
- **`onChange` / `onShortcut` / `onInvalidInput`** pass straight
  through with no deviation.

`shortcuts` is **not** a deviation — it is plain data, so the macro
renders every shortcut as a real button up front.

Full rationale: [spec/index.md §3.4](./spec/index.md).

## API

### Macro parameters

| Key | Type | Required | Default | Purpose |
| --- | ---- | -------- | ------- | ------- |
| `label` | string | yes | — | Names both the trigger and the dialog. |
| `labels` | object | yes | — | Every other user-facing string — see below. |
| `mode` | `"date"｜"time"｜"datetime"` | no | `"date"` | What to collect. |
| `value` | string | no | `""` | Initial ISO value, rendered raw (unformatted) until hydration. |
| `locale` | string | no | — | BCP 47 tag. |
| `min` / `max` | string | no | — | Inclusive ISO date bounds. |
| `disabledDates` | array | no | `[]` | ISO date strings. See the deviations above. |
| `firstDayOfWeek` | number | no | from `locale` | 0 = Sunday … 6 = Saturday. |
| `minuteStep` | number | no | `1` | Granularity of the minute select. |
| `hour12` | boolean | no | resolved from `locale` (client) | 12-hour clock. |
| `showWeekNumbers` | boolean | no | `false` | ISO-8601 week column. |
| `shortcuts` | array | no | `[]` | `{id, label, days?, months?, date?}`. |
| `confirmOnSelect` | boolean | no | `mode === "date"` | Commit and close on day click. |
| `name` | string | no | `"date-time"` | `name` of the hidden input; also drives ids. |
| `id` | string | no | `date-time-picker-{name}` | Id prefix. |
| `inputId` | string | no | `{id}-input` | Field id, for a consumer `<label for>`. |
| `describedBy` | string | no | — | Forwarded as `aria-describedby`. |
| `placeholder` | string | no | — | |
| `disabled` / `readonly` / `required` | boolean | no | `false` | |
| `classes` | string | no | — | Extra CSS classes on the root. |
| `attributes` | object | no | — | Extra HTML attributes spread onto the root. |

`labels`:

```
{
  previousYear:  string  // required
  previousMonth: string  // required
  nextMonth:     string  // required
  nextYear:      string  // required
  confirm:       string  // required
  cancel:        string  // required
  hour:          string  // required when mode includes a time
  minute:        string  // required when mode includes a time
  meridiem:      string  // required when the resolved clock is 12-hour
  week:          string  // required when showWeekNumbers
  clear:         string  // optional -- gates the clear button
}
```

### `initDateTimePicker(root, opts?)`

```js
import { initDateTimePicker } from "lily-design-system-nunjucks-date-time-picker";

initDateTimePicker(document.querySelector(".date-time-picker"), {
  locale: "en-GB",
  min: "2026-01-01",
  isDateDisabled(isoDate) {
    const day = new Date(isoDate + "T00:00:00Z").getUTCDay();
    return day === 0 || day === 6; // no weekends
  },
  onChange(value) {
    console.log("committed", value);
  },
});
```

Returns `{open, close, commit, clear, getValue, destroy}`.

### Custom glyph

```njk
{% call dateTimePicker({label: "Appointment date", labels: labels}) %}
  <svg aria-hidden="true">…</svg>
{% endcall %}
```

Full API: [spec/index.md §4](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
