# SummaryBox

A boxed callout that highlights key takeaways or next steps from a longer page. Inspired by the USWDS Summary box component.

## Implementation Notes

- Root element is `<aside>` (complementary landmark)
- `heading` is non-optional and rendered as an `<h3>`
- `aria-label` defaults to the `heading` text; `label` can override it

## Props

- `heading`: string (**required**) — the box heading
- `label`: string (optional) — `aria-label` override (defaults to `heading`)
- `children`: ReactNode (required) — body content
- `className`: string (optional) — appended after the root `summary-box` class
- `...restProps`: any additional HTML attributes passed to the `<aside>`

## Usage

```tsx
<SummaryBox heading="Key takeaways">
  <ul>
    <li>Use plain language</li>
    <li>Test with real users</li>
    <li>Follow accessibility standards</li>
  </ul>
</SummaryBox>
```

## ARIA

- `<aside>` complementary landmark
- `aria-label` provides the accessible name (heading text by default)

## References

- [USWDS Summary box](https://designsystem.digital.gov/components/summary-box/)
