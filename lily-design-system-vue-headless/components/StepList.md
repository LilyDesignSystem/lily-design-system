# StepList

An ordered list of step items showing progress through a multi-step process.

## Implementation Notes

- Headless: no CSS, no styles
- Renders a native `<ol>` for list semantics
- The current step index is exposed as `data-current`

## Props

- `label`: string — aria-label for the ordered list
- `current`: number — index of current step (0-based), exposed as `data-current`
- default slot — `StepListItem` children
- `...$attrs` — additional HTML attributes

## Usage

```vue
<StepList label="Checkout" :current="1">
    <StepListItem status="finished">Cart</StepListItem>
    <StepListItem status="in-progress" :current="true">Address</StepListItem>
    <StepListItem status="waiting">Payment</StepListItem>
</StepList>
```

## ARIA

- Native `<ol>` provides list semantics
- `aria-label` is optional but recommended

## When to Use

- Wizard, checkout, multi-step forms
- Showing progress through a known sequence

## When Not to Use

- Free-form navigation — use `BreadcrumbNav` or `NavigationMenu`
- Vertical timelines of past events — use `TimelineList`

## Headless

The component renders an ordered list and exposes the current index. Consumers supply each step via `StepListItem` and apply all visual styling.

## Testing

- Verify the root `step-list` class and `<ol>` tag
- Verify `aria-label` when provided
- Verify `data-current` when provided
- Verify default slot rendering

## References

- [Ant Design Steps](https://ant.design/components/steps)
