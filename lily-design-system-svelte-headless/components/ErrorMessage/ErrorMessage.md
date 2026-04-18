# ErrorMessage

An error message component informs users when something has gone wrong, such as incorrect input, failed actions, or system issues. It uses `role="alert"` to ensure screen readers announce the error immediately when it appears, without requiring user focus.

The component renders a `<p>` element with `role="alert"`, making it an assertive live region. This means the error text is announced to assistive technology users as soon as it enters the DOM, which is critical for form validation feedback and system error notifications.

## Implementation Notes

- Renders a `<p>` element with `role="alert"` for immediate screen reader announcement
- The alert role creates an implicit `aria-live="assertive"` region
- Children provide the error text content via a Snippet
- Spreads `restProps` onto the `<p>` element for consumer customization

## Props

- `children`: Snippet (required) -- error message text content

## Usage

```svelte
<ErrorMessage>Password is required</ErrorMessage>
```

```svelte
{#if error}
  <ErrorMessage>{error}</ErrorMessage>
{/if}
```

## Keyboard Interactions

None -- this component is a passive container for displaying error text.

## ARIA

- `role="alert"` -- creates an assertive live region so the error message is announced immediately by screen readers when it appears

## References

- WAI-ARIA Alert Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/alert/
