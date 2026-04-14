# Progress Spinner

A progress spinner indicates an ongoing loading or processing state where the completion time is unknown. Unlike ProgressCircle which shows a specific percentage, a spinner indicates indeterminate loading. It uses `role="status"` and `aria-live="polite"` to announce the loading state to screen readers without interrupting the user. The component is headless, allowing consumers to apply their own spinning animation via CSS.

## Implementation Notes

- Renders a `<div>` with `role="status"` for implicit live region semantics
- Uses `aria-live="polite"` to ensure screen readers announce the loading state without interruption
- Provides `aria-label` for accessible naming of the loading state
- Accepts an optional `children` slot for content inside (e.g., loading text)
- Spreads `restProps` for consumer customization

## Props

- `label`: string (required) -- accessible name describing the loading state via `aria-label`
- `children`: slot (default: `undefined`) -- optional content rendered inside (e.g., "Loading...")
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

Inline spinner while fetching search results:

```html
<ProgressSpinner label="Searching patients" />
```

Spinner with visible loading text:

```html
<ProgressSpinner label="Saving changes">
  <span>Saving...</span>
</ProgressSpinner>
```

Spinner inside a button area during form submission:

```html
<ProgressSpinner label="Submitting form" />
```

## Keyboard Interactions

None -- this component is a passive, read-only status indicator.

## ARIA

- `role="status"` -- identifies the element as a status region that receives non-urgent updates
- `aria-label="..."` -- provides an accessible name describing what is loading
- `aria-live="polite"` -- ensures content changes are announced by screen readers at the next opportunity without interrupting

## When to Use

- Use ProgressSpinner for indeterminate loading states where the completion time is unknown, such as data fetching or background processing.
- Use ProgressSpinner as a compact, inline loading indicator next to a button or field while an async action completes.
- Use ProgressSpinner when submitting a form and waiting for a server response.
- Use ProgressSpinner inside a table cell or card to indicate that a single item is refreshing.

## When Not to Use

- Do not use ProgressSpinner when the completion percentage is known -- use Progress or ProgressCircle instead.
- Do not use ProgressSpinner for page-level or section-level loading overlays -- use Loading instead.
- Do not use ProgressSpinner for content placeholders that should match the layout shape -- use Skeleton instead.

## Headless

The ProgressSpinner headless component provides a `<div>` with `role="status"`, `aria-live="polite"`, and `aria-label` for accessible naming. It announces loading state changes to screen readers without interrupting. The consumer provides all visual styling, including the spinning animation via CSS.


## Styles

The consumer provides all CSS styling. The component renders with a `.progress-spinner` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `progress-spinner`
- Verify role="status"` -- identifies the element as a status region that receives non-urgent updates
- Verify aria-label="..."` -- provides an accessible name describing what is loading
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep the spinner visually simple and use smooth animation; pair with a visible "Loading..." label for clarity in larger content areas.
- **Developers**: Place the spinner near the content it represents, and remove or hide it promptly when loading completes to avoid stale status announcements.

## References

- WAI-ARIA `status` role: https://www.w3.org/WAI/ARIA/apd/roles/status/
- MDN `aria-live`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
