# Error Summary

An error summary displays a consolidated list of form validation errors at the top of a form. It alerts users to problems that need correction and provides links to the specific fields with errors, following the pattern used by GOV.UK and NHS England design systems.

This component uses `role="alert"` to ensure screen readers announce the error summary immediately when it appears. The `tabindex="-1"` attribute allows programmatic focus (e.g., via JavaScript `focus()`) so the user's attention is directed to the error list after form submission. A heading identifies the summary, and children typically contain a list of linked error messages.

## Implementation Notes

- Renders a `<div>` with `role="alert"` for live-region announcement
- Uses `aria-labelledby` to associate the container with its heading
- Contains an `<h2>` element with a randomly generated ID for the `aria-labelledby` reference
- `tabindex="-1"` allows programmatic focus but does not place the element in the tab order
- Children slot is rendered after the heading for the error list content
- Spreads `restProps` on the outer `<div>` element
- Heading ID is generated with `Math.random().toString(36).slice(2, 9)` to avoid collisions

## Props

- `title`: string (required) -- heading text for the error summary (e.g., "There is a problem")
- `children`: slot (required) -- error list content, typically a `<ul>` with `<li>` items containing anchor links to error fields
- `...restProps`: any additional HTML attributes spread onto the outer `<div>`

## Usage

```html
<ErrorSummary heading="There is a problem">
  <ul>
    <li><a href="#date-of-birth">Enter your date of birth</a></li>
    <li><a href="#email">Enter an email address in the correct format, like name@example.com</a></li>
  </ul>
</ErrorSummary>
```

```html
<ErrorSummary heading="There is a problem">
  <ul>
    <li><a href="#full-name">Enter your full name</a></li>
    <li><a href="#nhs-number">Enter your NHS number</a></li>
    <li><a href="#password">Password must be at least 8 characters</a></li>
  </ul>
</ErrorSummary>
```

## Keyboard Interactions

- **Tab**: Moves focus through the error links within the summary
- The container itself can receive programmatic focus via `element.focus()` due to `tabindex="-1"`

## ARIA

- `role="alert"` -- creates a live region that announces content to screen readers when the summary appears
- `aria-labelledby={titleId}` -- associates the alert region with its heading for context
- `tabindex="-1"` -- allows the error summary to receive programmatic focus without being in the natural tab order

## When to Use

- Use at the top of a page when a form submission has validation errors, to summarise all errors in one place.
- Use even when there is only a single error -- users need the summary to understand what went wrong.
- Use with linked error descriptions that take users directly to the field with the problem.
- Use alongside individual ErrorMessage components next to each field -- the summary supplements, not replaces, field-level errors.
- Use the heading "There is a problem" as the default heading text.

## When Not to Use

- Do not use for warnings or informational messages -- use Alert or Banner instead.
- Do not use before the user has attempted to submit the form -- errors should appear on submission, not while typing.
- Do not use without individual ErrorMessage components next to each field -- the summary and field-level errors work together.

## Headless

This headless component provides a `<div>` with `role="alert"`, an `<h2>` heading linked via `aria-labelledby`, and `tabindex="-1"` for programmatic focus. It announces the error summary immediately when rendered. The consumer provides all visual styling, error list content, and anchor links to error fields.


## Styles

The consumer provides all CSS styling. The component renders with a `.error-summary` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `error-summary`
- Verify role="alert"` -- creates a live region that announces content to screen readers when the summary appears
- Verify aria-labelledby={titleId}` -- associates the alert region with its heading for context
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the error summary prominently at the top of the form with a distinct visual treatment (e.g., red border, error icon). Each error should be a clickable link that scrolls to the relevant field.
- **Developers**: Call `element.focus()` on the error summary after form submission fails to direct the user's attention. Populate each list item with an anchor link targeting the input's ID.

## References

- GOV.UK Error Summary: https://design-system.service.gov.uk/components/error-summary/
- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
