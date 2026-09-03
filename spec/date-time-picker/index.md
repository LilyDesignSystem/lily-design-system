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
><span class="date-time-picker-icon" aria-hidden="true">📅︎</span></button>
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
>
```

Inside the dialog, in order: the navigation header, the time-zone
select, the day grid, the time controls, shortcuts, and the footer.

Navigation header — four **pairs** of step buttons, coarse to fine, with
the live period label in the middle. Year and month are shipped; week
and day are new contract (see the status note at the end):

```html
<div class="date-time-picker-header">
	<button type="button" class="date-time-picker-previous-year"  aria-label="Previous year">«</button>
	<button type="button" class="date-time-picker-previous-month" aria-label="Previous month">‹</button>
	<button type="button" class="date-time-picker-previous-week"  aria-label="Previous week">‹‹</button>
	<button type="button" class="date-time-picker-previous-day"   aria-label="Previous day">‹</button>
	<span class="date-time-picker-period" id="date-time-picker-period" aria-live="polite">March 2026</span>
	<button type="button" class="date-time-picker-next-day"       aria-label="Next day">›</button>
	<button type="button" class="date-time-picker-next-week"      aria-label="Next week">››</button>
	<button type="button" class="date-time-picker-next-month"     aria-label="Next month">›</button>
	<button type="button" class="date-time-picker-next-year"      aria-label="Next year">»</button>
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
	<label class="date-time-picker-time-zone-label" for="date-time-picker-time-zone">Time zone</label>
	<select class="date-time-picker-time-zone-select" id="date-time-picker-time-zone" name="date-time-zone">
		<option value="Africa/Abidjan">Africa/Abidjan</option>
		<!-- … one option per zone from Intl.supportedValuesOf("timeZone") … -->
		<option value="Europe/London" selected>Europe/London</option>
		<!-- … -->
	</select>
</div>
```

- The list comes from `Intl.supportedValuesOf("timeZone")` at render
  time — **never a bundled table**, the same rule the picker already
  applies to month and weekday names. On Node 26 that is 418 zones; the
  consumer may pass a subset (`timeZones`) to narrow it, and may pass
  `timeZoneLabels` to display something other than the raw IANA id.
- The selected zone rides its own hidden input (`{name}-time-zone`) and
  is reflected as `data-time-zone` on the root. The picker's value
  contract is unchanged — a civil `YYYY-MM-DD` / `HH:MM` /
  `YYYY-MM-DDTHH:MM` — because a zone is metadata about *where* the
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

**Status (2026-09-03).** Previous/next **year** and **month** buttons are
shipped in every catalog's `date-time-picker` (canonical DOM contract
§4.3). Previous/next **week** and **day** buttons and the **time-zone
select** are new contract added here first and implemented nowhere yet —
tracked as `tasks.md` P8-T12, Svelte canonical first, then the seven
ports. Until that lands, this page describes the intended contract, not
current behaviour, for those three.
