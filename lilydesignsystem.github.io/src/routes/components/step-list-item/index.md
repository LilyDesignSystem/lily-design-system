# Step List Item

A step list item is one step in a step list with a status of waiting,
in-progress, finished, or error. It uses a semantic `<li>` element and
emits `data-status` so consumer CSS can render the visual indicator.

## Composition

Step List Item is the child of Step List in the `*List`/`*ListItem`
pattern. See StepList for full usage.

## Implementation Notes

- Renders a semantic `<li class="step-list-item">` element
- `data-status` reflects the `status` prop (default `"waiting"`)
- `aria-current="step"` is set when `current` is true
- `aria-label` is set when the optional `label` prop is provided
- Children render the step's title and optional description

## Props

- `status`: "waiting" | "in-progress" | "finished" | "error" (default: "waiting") -- emitted as data-status
- `current`: boolean (default: false) -- when true, renders aria-current="step"
- `label`: string (optional) -- aria-label override
- `children`: slot -- step content (typically title and description)
- `...restProps`: any additional HTML attributes

## Usage

```html
<StepListItem status="in-progress" current>Address</StepListItem>
```

```html
<StepListItem status="error" label="Payment failed">
  <strong>Payment</strong>
  <span>Card declined</span>
</StepListItem>
```

## Keyboard Interactions

- None at this level — keyboard behavior lives on any interactive children.

## ARIA

- The `<li>` element provides list-item semantics
- `aria-current="step"` is set when `current` is true
- `aria-label` is set when `label` is provided
- `data-status` is a CSS hook for status-driven styling

## When to Use

- Use as a child of StepList to mark a single stage.
- Use the `error` status to flag a step that requires correction.
- Use `current` for the user's active step.

## When Not to Use

- Do not use outside of a StepList — the `<ol>` parent provides correct list semantics.

## Headless

Renders a `<li>` with no styling. The status indicator (icon, color,
connector line) and any visual layout are the consumer's responsibility.

## Styles

Consumer CSS targets the `step-list-item` class. Use `data-status` to
distinguish waiting/in-progress/finished/error visual states.

## Testing

- Verify the component renders an `<li>` element with class `step-list-item`
- Verify `data-status` reflects the `status` prop (default `"waiting"`)
- Verify `aria-current="step"` is set when `current` is true and absent when false
- Verify `aria-label` equals the `label` prop when provided
- Verify children render inside the list item

## Advice

- **Designers**: Choose distinct visual treatments per status. Keep step labels short and the optional description specific.
- **Developers**: Use the `error` status to signal a failed step. Pair `current` with the parent's `current` index for consistent ARIA and CSS state.

## Related components

- `step-list` — an ordered list of step items showing progress through a multi-step process

## References

- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
- Ant Design Steps: https://ant.design/components/steps

---

Lily™ and Lily Design System™ are trademarks.
