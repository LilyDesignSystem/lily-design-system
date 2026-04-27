# ValidationListItem

One validation rule in a `ValidationList` with a status of pending, passed, or failed. The status is exposed as `data-status` on the `<li>` for consumer styling.

## Implementation Notes

- Headless: no CSS, no styles
- `status` defaults to `"pending"`
- `data-status` is for styling — consumers may add screen-reader-only text to convey the status to assistive technology

## Props

- `status`: `"pending" | "passed" | "failed"` (default `"pending"`)
- `label`: string (optional) — aria-label override
- default slot — rule text

## Usage

```vue
<ValidationListItem :status="hasLength ? 'passed' : 'pending'">
    At least 8 characters
</ValidationListItem>
```

## ARIA

- `data-status` carries the rule state for CSS
- `aria-label` (optional) override
- Surrounding `ValidationList` provides `aria-live="polite"`

## Headless

The consumer styles each status with CSS attribute selectors such as `.validation-list-item[data-status="passed"]`.

## Testing

- Verify root `validation-list-item` class
- Verify `data-status` defaults to `"pending"` and reflects the prop
- Verify slot content renders
- Verify `aria-label` is applied when provided

## References

- [USWDS Validation](https://designsystem.digital.gov/components/validation/)
