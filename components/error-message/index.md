# Error Message

An error message component informs users when something has gone wrong, such as incorrect input, failed actions, or system issues. It uses `role="alert"` to ensure screen readers announce the error immediately when it appears, without requiring user focus.

The component renders a `<p>` element with `role="alert"`, making it an assertive live region. This means the error text is announced to assistive technology users as soon as it enters the DOM, which is critical for form validation feedback and system error notifications.

## Implementation Notes

- Renders a `<p>` element with `role="alert"` for immediate screen reader announcement
- The alert role creates an implicit `aria-live="assertive"` region
- Children provide the error text content via a slot
- Spreads `restProps` onto the `<p>` element for consumer customization

## Props

- `children`: slot (required) -- error message text content

## Usage

```html
<Field label="Date of birth" error="true">
  <Hint>For example, 15 3 1984</Hint>
  <ErrorMessage>Enter your date of birth</ErrorMessage>
  <DateInput label="Date of birth" aria-invalid="true" />
</Field>
```

```html
<Field label="Email address" error="true">
  <ErrorMessage>Enter an email address in the correct format, like name@example.com</ErrorMessage>
  <EmailInput label="Email address" aria-invalid="true" value={email} />
</Field>
```

## Keyboard Interactions

None -- this component is a passive container for displaying error text.

## ARIA

- `role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears

## When to Use

- Use when a form field has a validation error and the user needs to correct their input
- Use to explain clearly what went wrong and how to fix it, in plain language
- Use after the user submits the form — not while they are still typing or navigating fields
- Use alongside ErrorSummary at the top of the page to link users to each error

## When Not to Use

- Do not show error messages when the user focuses a field, while they are typing, or when they leave a field — wait for form submission
- Do not use for eligibility or permission errors — take the user to a separate page explaining why and what to do next
- Do not use in place of Hint — preventive guidance should appear before errors occur
- Do not clear the user's input when showing the error — preserve what they entered (WCAG 2.2)

## Headless

This headless component provides a `<p>` element with `role="alert"`, creating an assertive live region that is announced immediately by screen readers when it appears in the DOM. The consumer provides all visual styling such as color, typography, spacing, and error icons.


## Styles

The consumer provides all CSS styling. The component renders with a `.error-message` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `error-message`
- Verify role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a distinct error color (typically red) and consider an error icon to make the message visually prominent. Position the error message directly below the associated input field.
- **Developers**: Conditionally render the ErrorMessage so it only appears when an error exists. The `role="alert"` ensures it is announced on insertion without extra ARIA live-region setup.

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
