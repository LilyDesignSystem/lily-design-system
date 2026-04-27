# SummaryBox

A boxed callout highlighting key takeaways or next steps from a longer page. Renders `<aside class="summary-box">` with a `<h3>` heading and a body `<div>`.

## Implementation Notes

- Headless: no CSS, no styles
- `heading` is required
- `aria-label` defaults to the heading text; consumers may override with `label`

## Props

- `heading`: string (required) — box heading
- `label`: string (optional) — aria-label override
- default slot — body content

## Usage

```vue
<SummaryBox heading="Key takeaways">
    <ul>
        <li>Submit by Friday.</li>
        <li>Bring two forms of ID.</li>
    </ul>
</SummaryBox>
```

## ARIA

- `<aside>` provides a complementary landmark
- `aria-label` describes the box (defaults to heading)

## Headless

The consumer styles the box, heading typography, and body spacing.

## Testing

- Verify root `summary-box` class
- Verify aria-label defaults to heading and can be overridden
- Verify the heading renders as `<h3>`
- Verify slot content renders inside `.summary-box-body`

## References

- [USWDS Summary box](https://designsystem.digital.gov/components/summary-box/)
