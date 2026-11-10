# Date Field

A date field asks for a date as three parts, day, month and year, in a `<fieldset>` named by its `<legend>`, with optional helper text and an error message, all linked by generated ids. It suits dates people know by heart, such as a date of birth, where a calendar picker is slower than typing.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

The `value` prop is bindable and is an ISO 8601 date once all three parts are filled. The order of the parts is the consumer's (`order`), and so are the part labels: there is no English or regional default. Error messages are announced to screen readers via `role="alert"`, and each part carries `aria-invalid` while an error is shown.

## Implementation Notes

- Renders a `<fieldset>` named by a `<legend>` (`label`), holding three labelled text fields for the day, month and year parts (`inputmode="numeric"`), an optional description `<p>`, and an optional error `<p role="alert">`
- `order` sets the order of the parts: `"ymd"` (ISO 8601, the default), `"dmy"` or `"mdy"`; the component picks no regional order of its own
- The three part labels (`dayLabel`, `monthLabel`, `yearLabel`) are required and have no default: the words are the consumer's, in their language
- `value` is two-way: an ISO 8601 date (`YYYY-MM-DD`) when all three parts are filled, or `""` while any is empty; a new `value` fills the parts
- Each part is named `{name}-day`, `{name}-month` and `{name}-year`, so a server-rendered form submits without script
- Auto-generates a unique base id when none is given; the parts are `{id}-day`, `{id}-month`, `{id}-year`, and the description and error `{id}-desc` and `{id}-error`

## Props

- `label`: string (required) -- the legend, naming the whole date
- `dayLabel`: string (required) -- the day part's label
- `monthLabel`: string (required) -- the month part's label
- `yearLabel`: string (required) -- the year part's label
- `order`: "ymd" | "dmy" | "mdy" (default: "ymd") -- the order of the parts
- `value`: string (default: "") -- the date as `YYYY-MM-DD`, or "" while a part is empty; two-way bindable
- `name`: string (default: undefined) -- base name; the parts are `{name}-day`, `{name}-month`, `{name}-year`
- `autocomplete`: "bday" (default: undefined) -- a date of birth: the parts autocomplete as `bday-day`, `bday-month`, `bday-year` (WCAG 1.3.5)
- `description`: string (default: undefined) -- helper text, linked from the fieldset
- `error`: string (default: undefined) -- error message, linked from the fieldset and announced
- `required`: boolean (default: false) -- every part is required
- `disabled`: boolean (default: false) -- the fieldset and its parts are disabled
- `id`: string (default: undefined) -- base id for the parts; auto-generated if omitted

## Usage

Date of birth, day first:

```html
<DateField
  label="Date of birth"
  dayLabel="Day"
  monthLabel="Month"
  yearLabel="Year"
  order="dmy"
  name="dob"
  autocomplete="bday"
  value="{dateOfBirth}"
  description="For example, 27 3 2007"
  required
/>
```

With a validation error, year first:

```html
<DateField
  label="Appointment date"
  dayLabel="Day"
  monthLabel="Month"
  yearLabel="Year"
  value="{appointmentDate}"
  error="The date must be in the future"
  required
/>
```

## Keyboard Interactions

Tab moves between the three parts; each is a native text field.

## ARIA

- `<fieldset>` + `<legend>` -- the group's name, which a screen reader announces with each part
- `<label for>` -- names each part
- `aria-describedby` -- on the `<fieldset>`, the description and the error when present
- `aria-invalid="true"` -- on each part while an `error` is shown
- `role="alert"` -- on the error paragraph, announces the error message to screen readers

## When to Use

- Use for structured date entry with separate fields for day, month, and year.
- Use when more control over individual date parts is needed than a plain DateInput provides.
- Use when you want built-in ARIA linking between the label, input, description, and error message without manual ID management.
- Use for forms that require date input with validation feedback, description text, and error display in a single integrated component.
- Use when accessibility-compliant date entry is essential, such as in healthcare or government forms.

## When Not to Use

- Do not use for known exact dates where a simple DateInput is sufficient.
- Do not use for calendar-based date selection -- use CalendarTable or CalendarRangePicker instead.
- Do not use when you need a bare date input with custom label placement; use DateInput instead.

## Headless

This headless DateField component provides a `<fieldset>` and `<legend>`, three labelled part fields, an optional description `<p>`, and an optional error `<p>` with `role="alert"`, linked from the fieldset by `aria-describedby`. The consumer provides all visual styling including label typography, input appearance, description and error text colors, and layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.date-field` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `date-field`, a `<legend>`, and the three parts in `order`
- Verify role="alert"` -- on the error paragraph, announces the error message to screen readers
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the description text below the label and above the input to set expectations before users interact. Display error messages in a contrasting color near the input.
- **Developers**: Use the bindable `value` prop for two-way date state; it stays "" until all three parts are filled, so validate the parts on submit. Pick `order` for your users' convention (ISO 8601 `ymd` by default). The auto-generated ids handle the ARIA linking.

## Related components

- `date-input` — an input for entering a date value <input type="date">
- `date-range` — paired start and end date inputs
- `calendar-range-picker` — a picker for selecting a date range on a calendar

## References

- ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

---

Lily™ and Lily Design System™ are trademarks.
