# ValidationList

A live-feedback list of input validation rules with pending, passed, and failed states. Renders `<ul class="validation-list" aria-live="polite">`.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is **required**
- `aria-live="polite"` is always present — this is the headless contract that announces status changes
- Children are typically `ValidationListItem` components

## Props

- `label`: string (**required**) — aria-label naming the rule list
- default slot — `ValidationListItem` children
- `...$attrs` — additional HTML attributes

## Usage

```vue
<ValidationList label="Password requirements">
    <ValidationListItem :status="hasLength ? 'passed' : 'failed'">
        At least 8 characters
    </ValidationListItem>
    <ValidationListItem :status="hasNumber ? 'passed' : 'pending'">
        At least one number
    </ValidationListItem>
</ValidationList>
```

## ARIA

- `aria-label` names the rule list
- `aria-live="polite"` announces changes to the list contents

## Headless

The consumer styles list spacing, item icons, and per-status colors via the `data-status` attribute on each item.

## Testing

- Verify root `validation-list` class
- Verify aria-label is applied
- Verify aria-live is "polite"
- Verify slot children render

## References

- [USWDS Validation](https://designsystem.digital.gov/components/validation/)
