# DateField

## Metadata

- Component: date-field
- PascalCase: DateField
- Description: a structured field for entering date components
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <fieldset>
- CSS class: .date-field
- Interactive: no

## Key Behaviors

- Renders a `<fieldset>` named by a `<legend>` (`label`), holding three labelled text fields for the day, month and year parts (`inputmode="numeric"`), an optional description `<p>`, and an optional error `<p role="alert">`
- `order` sets the order of the parts: `"ymd"` (ISO 8601, the default), `"dmy"` or `"mdy"`; the component picks no regional order of its own
- The three part labels (`dayLabel`, `monthLabel`, `yearLabel`) are required and have no default: the words are the consumer's, in their language
- `value` is two-way: an ISO 8601 date (`YYYY-MM-DD`) when all three parts are filled, or `""` while any is empty; a new `value` fills the parts
- Each part is named `{name}-day`, `{name}-month` and `{name}-year`, so a server-rendered form submits without script
- Auto-generates a unique base id when none is given; the parts are `{id}-day`, `{id}-month`, `{id}-year`, and the description and error `{id}-desc` and `{id}-error`

## ARIA

- `<fieldset>` + `<legend>` -- the group's name, which a screen reader announces with each part
- `<label for>` -- names each part
- `aria-describedby` -- on the `<fieldset>`, the description and the error when present
- `aria-invalid="true"` -- on each part while an `error` is shown
- `role="alert"` -- on the error paragraph, announces the error message to screen readers

## Keyboard

- Tab moves between the parts; each part is a native text field

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

## Acceptance Criteria

- [ ] Renders <fieldset> element with class="date-field"
- [ ] Has role="alert"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .date-field in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/date-field.html
- ARIA Error Handling: https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
