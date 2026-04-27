# ValidationList

A live-feedback list of input validation rules with pending, passed, and failed states. Inspired by the USWDS Validation component. The list uses `aria-live="polite"` so screen readers announce status changes as the user types.

## Implementation Notes

- Root element is `<ul>`
- `label` is non-optional
- `aria-live="polite"` is the headless contract that makes status changes announced
- Each child should typically be a [`ValidationListItem`](ValidationListItem.md)

## Props

- `label`: string (**required**) — `aria-label` for the list
- `children`: ReactNode (required) — `ValidationListItem` children
- `className`: string (optional) — appended after the root `validation-list` class
- `...restProps`: any additional HTML attributes passed to the `<ul>`

## Usage

```tsx
<ValidationList label="Password requirements">
  <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
  <ValidationListItem status="pending">Contains a number</ValidationListItem>
  <ValidationListItem status="failed">Contains a symbol</ValidationListItem>
</ValidationList>
```

## ARIA

- The native `<ul>` provides list semantics
- `aria-label` provides the accessible name
- `aria-live="polite"` ensures screen readers announce text updates as item statuses change

## References

- [USWDS Validation](https://designsystem.digital.gov/components/validation/)
- [WAI-ARIA aria-live](https://www.w3.org/TR/wai-aria-1.2/#aria-live)
