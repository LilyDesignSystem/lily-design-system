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

Inside the dialog: a month/year header with previous / next buttons, a
`role="grid"` of days (one `role="gridcell"` per day, roving `tabindex`,
`aria-selected` on the chosen day, `aria-disabled` + `data-disabled` —
never plain `disabled` — on vetoed days), and an optional
`role="status"` region for `labels.invalid` / `labels.instructions`.
Month and weekday names come from `Intl`, never a bundled table. Its six
structural labels are **required** with no English default. Escape in
the field reverts a pending edit; closing the dialog returns focus to
its opener.
