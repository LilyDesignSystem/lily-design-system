# ButtonGroup

A wrapper that groups related buttons together. Renders `<div role="group">` with a required accessible label.

## Implementation Notes

- Headless: no CSS, no built-in spacing
- `label` is **required** and non-optional in the TypeScript interface
- The `<div>` carries `role="group"` and `aria-label`

## Props

- `label`: string (**required**) — accessible name (aria-label)
- default slot — the related buttons
- `...$attrs` — additional HTML attributes

## Usage

```vue
<ButtonGroup label="Document actions">
    <button type="button">Save</button>
    <button type="button">Cancel</button>
</ButtonGroup>
```

## ARIA

- `role="group"`
- `aria-label` describes the group's purpose

## When to Use

- Grouping a small set of related buttons such as Save/Cancel or pagination controls.

## When Not to Use

- For a list of toggle options, prefer `ToggleGroup` or `SegmentGroup`.

## Headless

The component renders a `<div>` and does not apply any spacing, layout, or visual treatment. The consumer styles the group.

## Testing

- Verify root `button-group` class
- Verify `role="group"` and `aria-label`
- Verify slot content is rendered
- Verify pass-through attributes

## References

- [USWDS Button group](https://designsystem.digital.gov/components/button-group/)
