# StepListItem

One step in a `StepList` with status of waiting, in progress, finished, or error.

## Implementation Notes

- Headless: no CSS, no styles
- Renders a native `<li>` (intended as a child of `StepList`'s `<ol>`)
- Status is exposed as `data-status` for consumer styling
- When `current` is `true`, sets `aria-current="step"`

## Props

- `status`: `"waiting" | "in-progress" | "finished" | "error"` (default `"waiting"`)
- `current`: boolean (default `false`) — sets `aria-current="step"` when `true`
- `label`: string — aria-label override
- default slot — content (typically a title and optional description)
- `...$attrs` — additional HTML attributes

## Usage

```vue
<StepList label="Checkout" :current="1">
    <StepListItem status="finished">Cart</StepListItem>
    <StepListItem status="in-progress" :current="true">Address</StepListItem>
    <StepListItem status="waiting">Payment</StepListItem>
    <StepListItem status="error">Review</StepListItem>
</StepList>
```

## ARIA

- `aria-current="step"` when `current` is `true`
- `aria-label` optional override

## When to Use

- Inside a `StepList` to represent each step

## When Not to Use

- Free-form list items — use `<li>` directly

## Headless

The component renders a list item with semantic state attributes. Consumers supply visual styling per `data-status`.

## Testing

- Verify the root `step-list-item` class and `<li>` tag
- Verify default `status="waiting"`
- Verify `data-status` reflects the status prop
- Verify `aria-current="step"` when `current` is `true`
- Verify `aria-label` pass-through

## References

- [WAI-ARIA aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current)
- [Ant Design Steps](https://ant.design/components/steps)
