# ButtonGroup

A wrapper that groups related buttons together as a single accessible group. Inspired by the USWDS Button Group pattern. The container exposes `role="group"` so assistive technology announces it as a unit.

## Implementation Notes

- Root element is a `<div>` with `role="group"`
- `label` is non-optional — every group MUST have an accessible name
- The component is purely structural — no visual styling

## Props

- `label`: string (**required**) — `aria-label` for the group
- `children`: ReactNode (required) — the related buttons
- `className`: string (optional) — appended after the root `button-group` class
- `...restProps`: any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<ButtonGroup label="Document actions">
  <button type="button">Save</button>
  <button type="button">Cancel</button>
</ButtonGroup>
```

```tsx
<ButtonGroup label="Pagination">
  <button type="button">Previous</button>
  <button type="button">Next</button>
</ButtonGroup>
```

## ARIA

- `role="group"` identifies the container
- `aria-label` provides the accessible name for the group

## References

- [WAI-ARIA Group Role](https://www.w3.org/TR/wai-aria-1.2/#group)
- [USWDS Button group](https://designsystem.digital.gov/components/button-group/)
