# Date Time Picker

Label: '📅︎' U+1F4C5 Calendar + U+FE0E Variation Selector-15 (text presentation)

The one picker that is a **form control**, not a page-header preference:
a typeable text field paired with an icon button that opens a WAI-ARIA
APG Date Picker **dialog** — not a listbox. It applies nothing to the
document and persists nothing; a date in a form is data, not a
preference. Only the trigger follows the "one glyph" rule; a date field
that cannot be typed into is hostile to anyone who already knows the date.

Field and button:

```html
<input
  class="date-time-picker-input"
  id="date-time-picker-input"
  type="text"
  inputmode="numeric"
  autocomplete="off"
  aria-describedby="date-time-picker-status"
/>
<button
  type="button"
  class="date-time-picker-button"
  aria-label="Date Time Picker"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="date-time-picker-dialog"
>
  <span
    class="date-time-picker-icon"
    aria-hidden="true"
    >📅︎</span
  >
</button>
```

Dialog:

```html
<div
  class="date-time-picker-dialog"
  id="date-time-picker-dialog"
  role="dialog"
  aria-modal="true"
  aria-label="Date Time Picker"
  hidden=""
></div>
```

Inside the dialog, in order: the navigation header, the time-zone
select, the day grid, the time controls, shortcuts, and the footer.

Navigation header — four **pairs** of step buttons, coarse to fine, with
the live period label in the middle. Year and month are shipped; week
and day are new contract (see the status note at the end):

```html
<div class="date-time-picker-header">
  <button
    type="button"
    class="date-time-picker-previous-year"
    aria-label="Previous year"
  >
    «
  </button>
  <button
    type="button"
    class="date-time-picker-previous-month"
    aria-label="Previous month"
  >
    ‹
  </button>
  <button
    type="button"
    class="date-time-picker-previous-week"
    aria-label="Previous week"
  >
    ‹‹
  </button>
  <button
    type="button"
    class="date-time-picker-previous-day"
    aria-label="Previous day"
  >
    ‹
  </button>
  <span
    class="date-time-picker-period"
    id="date-time-picker-period"
    aria-live="polite"
    >March 2026</span
  >
  <button
    type="button"
    class="date-time-picker-next-day"
    aria-label="Next day"
  >
    ›
  </button>
  <button
    type="button"
    class="date-time-picker-next-week"
    aria-label="Next week"
  >
    ››
  </button>
  <button
    type="button"
    class="date-time-picker-next-month"
    aria-label="Next month"
  >
    ›
  </button>
  <button
    type="button"
    class="date-time-picker-next-year"
    aria-label="Next year"
  >
    »
  </button>
</div>
```

- Every button's visible content is decorative; its accessible name is
  the `aria-label`, supplied by the consumer through `labels`
  (`previousYear`, `previousMonth`, `previousWeek`, `previousDay`,
  `nextDay`, `nextWeek`, `nextMonth`, `nextYear`) — no English default.
- Year and month steps move the **grid** (which month is shown) and keep
  the pending day clamped to that month's length (31 January + 1 month is
  28 or 29 February, never 3 March). Week and day steps move the
  **pending day** itself by ±7 or ±1 civil days, paging the grid only when
  the new day falls outside the shown month. All arithmetic is civil
  (epoch-day), never local-midnight `Date`.
- The period label is `aria-live="polite"` and is what the grid is
  labelled by (`aria-labelledby`), so a step announces the new month
  once, not once per button.

Time zone — a native `<select>` of every IANA zone the runtime knows,
placed before the grid so the zone is chosen before the instant:

```html
<div class="date-time-picker-time-zone">
  <label
    class="date-time-picker-time-zone-label"
    for="date-time-picker-time-zone"
    >Time zone</label
  >
  <select
    class="date-time-picker-time-zone-select"
    id="date-time-picker-time-zone"
  >
    <option value=""></option>
    <option value="Africa/Abidjan">Africa/Abidjan</option>
    <!-- … one option per zone from Intl.supportedValuesOf("timeZone") … -->
    <option
      value="Europe/London"
      selected
    >
      Europe/London
    </option>
    <!-- … -->
  </select>
</div>
```

- The list comes from `Intl.supportedValuesOf("timeZone")` at render
  time — **never a bundled table**, the same rule the picker already
  applies to month and weekday names. On Node 26 that is 418 zones; the
  consumer may pass a subset (`timeZones`) to narrow it, and may pass
  `timeZoneLabels` to display something other than the raw IANA id.
- The select renders only when the consumer supplies `labels.timeZone`
  (the same opt-in gate as `labels.clear`), and its first option is the
  empty "no zone" state. The selected zone rides its own hidden input
  (`{name}-time-zone`, not a `name` on the select) and is reflected as
  `data-time-zone` on the root. The picker's value
  contract is unchanged — a civil `YYYY-MM-DD` / `HH:MM` /
  `YYYY-MM-DDTHH:MM` — because a zone is metadata about _where_ the
  civil time applies, not part of the civil time. Converting to an
  instant is the consumer's job.
- Default: no zone selected unless the consumer sets one; the picker
  never guesses from `Intl.DateTimeFormat().resolvedOptions().timeZone`
  on its own, for the same reason `locale-picker` never picks a locale.

Day grid — `role="grid"` of days (one `role="gridcell"` per day, roving
`tabindex`, `aria-selected` on the chosen day, `aria-disabled` +
`data-disabled` — never plain `disabled` — on vetoed days), then the
time controls, then an optional `role="status"` region for
`labels.invalid` / `labels.instructions`. Month and weekday names come
from `Intl`, never a bundled table. Its structural labels are
**required** with no English default. Escape in the field reverts a
pending edit; closing the dialog returns focus to its opener.

**Status (2026-09-04).** All eight buttons in the navigation header
(previous/next year, month, week, day) and the time-zone select are
shipped in every catalog's `date-time-picker` — the full canonical DOM
contract above (§4.3, plus the week/day buttons and time-zone select
added in this revision) is implemented, not aspirational. Landed
Svelte canonical first (`@lilydesignsystem/svelte-date-time-picker`
0.2.0), then ported to React, Vue, Angular, HTML, Nunjucks, Blazor, and
Web Components (each catalog's own `date-time-picker` package at
0.2.0/0.3.0; the Angular port also fixed a real defect it found along
the way — a `<select>`'s own `[value]` binding racing its `@for`-
generated `<option>` children, switched to per-`<option>` `[selected]`).
`bin/smoke-packages` and the 45 reference themes were extended to
match; see `tasks.md` P8-T12 and `CHANGELOG.md` for the full record.

## Time controls stay native selects

(2026-11-10, tasks.md P26-T6.) The hour, minute and AM/PM controls stay native `<select>` elements; they do not become
`wheel-picker`s. A `<select>` is already a wheel on mobile, needs no script, is announced and operated the same way everywhere,
and resets and submits with its form. A `wheel-picker` would add an always-open listbox to a dialog that already holds a grid,
and every catalog's helper would have to depend on its headless library's wheel. An app that wants wheels for a time builds
them with the several-wheels pattern in [AGENTS/components.md](../../AGENTS/components.md).

## Calendar systems

(2026-11-03, P23-T6.) `calendar` takes a CLDR id, such as `persian`, `islamic-umalqura`, `buddhist` or `hebrew`, and sets the day grid, the
heading and each day's accessible name. The default is `gregory`. The value stays ISO Gregorian, so a form and a server see no difference.

`@internationalized/date` was rejected: Apache-2.0 conflicts with the GPL-2.0-only option in Lily's licence expression. Instead
`shared/calendar-system.ts`, with no dependency, asks `Intl.DateTimeFormat` which day of its month a date is. A month is the run of days from
one day 1 to the next, so Lily writes no calendar arithmetic, and lunar months, leap months and the short Ethiopic thirteenth month need no
special case. The answers are the browser's ICU data.

- **Blazor** has no `Intl`, so `CalendarSystem.cs` uses .NET's calendars: `gregory`, `persian`, `islamic`, `islamic-civil`, `islamic-umalqura`,
  `buddhist` and `hebrew`. An unknown id throws. The parameter is `CalendarId`, because `Calendar` is the glyph constant. Its heading uses month
  names only where .NET offers that calendar for the culture (Persian for `fa-IR`); otherwise it is numeric, such as `2569-02`.
- **The typed field stays Gregorian,** in text and parsing, so a Persian grid can sit above a Gregorian field. Open.
- **Year paging moves twelve months,** which is not a year in a lunisolar calendar such as `hebrew` or `chinese`, or in `ethiopic`. Open.
- **The `calendar` helper** (the five-view `CalendarView`) has no `calendar` prop yet. Open.
- Week numbers stay ISO weeks.

## Acceptance criteria

- [x] Shipped as its own package in all eight frameworks (`bin/list-helper-packages <framework>`, checked 2026-10-30).
- [x] The field is a real, typeable text input that carries the form value and `required`; the trigger opens an APG date picker
      dialog, not a listbox.
- [x] Dates are formatted with the Gregorian calendar forced, so the heading and grid agree (P17-T1); typed dates accept any Unicode
      decimal digits and the locale's day-period words (P17-T2); the grid swaps ArrowLeft and ArrowRight in right-to-left (P17-T3).
- [x] A form reset restores the initial value in the seven ports that can hear it; Blazor documents why it cannot (§5.10).
- [x] A `calendar` prop (a CLDR calendar id) in all eight catalogs (P23-T6, 2026-11-03); see Calendar systems.
- [ ] The typed field in the chosen calendar; today it stays Gregorian.
- [ ] Week numbering other than ISO 8601 (`weekNumbering`), today documented as a limitation (P17-T4).

## Related topics

[helpers](../helpers/index.md) · [internationalization](../internationalization/index.md) ·
[zone-names](../zone-names/index.md) · [accessibility](../accessibility/index.md)
