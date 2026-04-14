# Week Input

A week input is a UI/UX component that provides a field for selecting a specific week of the year using the native HTML `<input type="week">` element. It renders a week picker control that allows users to select a year and week number, with values in YYYY-Www format (e.g., "2024-W01"). The component includes aria-label for accessibility and supports bindable value for two-way data binding, along with standard form attributes like required and disabled.

Week inputs are useful for scheduling applications, time tracking systems, reporting tools, and any scenario where data is organized by week rather than by specific date.

## Implementation Notes

- Renders a single `<input type="week">` element for native week picker behavior
- Supports two-way binding for the `value` prop enabling two-way data binding with two-way `value` binding
- Values follow the ISO 8601 week format: YYYY-Www (e.g., "2024-W01" for the first week of 2024)
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `min`, `max`, `class`)
- Browser support varies; some browsers render a native week picker while others fall back to a text input

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current week value in YYYY-Www format, bindable with two-way `value` binding
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

Sprint planning week selection:

```html
<WeekInput label="Sprint week" value={sprintWeek} required />
```

Payroll period with constrained range:

```html
<WeekInput label="Payroll week" value={payrollWeek} min="2026-W01" max="2026-W52" required />
```

Weekly report filter:

```html
<WeekInput label="Report week" value={reportWeek} />
```

## Keyboard Interactions

When the browser renders a native week picker:

- Up Arrow / Down Arrow: adjust the focused segment (year or week number)
- Left Arrow / Right Arrow: move focus between year and week segments
- Enter: confirm selection / submit form

Note: keyboard interactions depend on the browser's native week picker implementation.

## ARIA

- `aria-label={label}` -- provides the accessible name for the week input since no visible label element is associated

## When to Use

- Use for selecting a specific week and year, such as weekly schedules or reporting.
- Use when data is organized by week rather than by specific date.
- Use for time tracking, sprint planning, or payroll period selection.

## When Not to Use

- Do not use when a full date is needed -- use DateInput instead.
- Do not use when a month is needed -- use MonthInput instead.
- Do not use when consistent cross-browser behavior is critical without a fallback, since native `<input type="week">` support varies.

## Headless

This headless component provides a native `<input type="week">` element with `aria-label`, two-way value binding in ISO 8601 YYYY-Www format, and support for `required` and `disabled` states. The consumer provides all visual styling and any surrounding labels or hints.


## Styles

The consumer provides all CSS styling. The component renders with a `.week-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `week-input`
- Verify aria-label={label}` -- provides the accessible name for the week input since no visible label element is associated
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display a hint showing the expected format (e.g., "2024-W01") since the native week picker appearance varies significantly across browsers. Provide a fallback UI for unsupported browsers.
- **Developers**: Values follow ISO 8601 week format (YYYY-Www). Use `min` and `max` via restProps to constrain the selectable range. Test across browsers, as some fall back to a plain text input.

## References

- MDN input type="week": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
