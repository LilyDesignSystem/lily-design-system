# ValidationListItem

One validation rule in a [`ValidationList`](ValidationList.md), with a status of `"pending"`, `"passed"`, or `"failed"`. The status is exposed via a `data-status` attribute for consumer styling.

## Implementation Notes

- Root element is `<li>`
- `status` is rendered as `data-status` (defaults to `"pending"`)
- `aria-label` is set only when the optional `label` prop is provided

## Props

- `status`: `"pending" | "passed" | "failed"` (default `"pending"`)
- `label`: string (optional) — `aria-label` override
- `children`: ReactNode (required) — rule text
- `className`: string (optional) — appended after the root `validation-list-item` class
- `...restProps`: any additional HTML attributes passed to the `<li>`

## Usage

```tsx
<ValidationList label="Password requirements">
  <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
  <ValidationListItem status="pending">Contains a number</ValidationListItem>
  <ValidationListItem status="failed">Contains a symbol</ValidationListItem>
</ValidationList>
```

## ARIA

- Native `<li>` semantics
- `data-status` for consumer styling
- Optional `aria-label` override

## References

- [USWDS Validation](https://designsystem.digital.gov/components/validation/)
