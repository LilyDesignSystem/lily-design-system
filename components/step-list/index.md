# Step List

A step list is an ordered list of step items showing progress through a
multi-step process. It uses a semantic `<ol>` element so screen readers
announce the count and order of steps.

Use it for wizards, checkout flows, onboarding tours, or any sequence
of stages where the user can see their position relative to the whole.

## Composition

Step List is the parent of Step List Items in the `*List`/`*ListItem`
pattern.

```html
<StepList label="Checkout" current={1}>
  <StepListItem status="finished">Cart</StepListItem>
  <StepListItem status="in-progress" current>Address</StepListItem>
  <StepListItem status="waiting">Payment</StepListItem>
</StepList>
```

## Implementation Notes

- Renders a semantic `<ol class="step-list">` element
- `aria-label` is set when the optional `label` prop is provided
- `data-current` is set when the optional `current` prop is provided
- Children are typically `step-list-item` components
- The `<ol>` provides list semantics; no extra ARIA role required

## Props

- `label`: string (optional) -- aria-label
- `current`: number (optional) -- 0-based index of the current step (data-current hook)
- `children`: slot -- step-list-item children
- `...restProps`: any additional HTML attributes

## Usage

```html
<StepList label="Onboarding" current={2}>
  <StepListItem status="finished">Sign up</StepListItem>
  <StepListItem status="finished">Verify email</StepListItem>
  <StepListItem status="in-progress" current>Set preferences</StepListItem>
  <StepListItem status="waiting">Done</StepListItem>
</StepList>
```

## Keyboard Interactions

- None at this level — keyboard behavior lives on any interactive children.

## ARIA

- The `<ol>` element provides list semantics
- `aria-label` provides the accessible name when `label` is set
- `data-current` is a CSS hook; the active item should also receive `aria-current="step"` via StepListItem

## When to Use

- Use to show progress through a sequence of stages (checkout, wizard, onboarding).
- Use when users benefit from seeing where they are in the flow.

## When Not to Use

- Do not use for arbitrary unordered content — use a regular list.
- Do not use for navigation menus — use a navigation list or breadcrumb.

## Headless

Renders an `<ol>` with no styling. The orientation, connector lines,
status colors, and visual indicators are entirely the consumer's
responsibility.

## Styles

Consumer CSS targets the `step-list` class. Use `data-current` to drive
position-based styling. Provide horizontal or vertical orientation as
needed.

## Testing

- Verify the component renders an `<ol>` element with class `step-list`
- Verify `aria-label` is set when `label` is provided
- Verify `data-current` reflects the `current` prop when provided
- Verify children render in document order

## Advice

- **Designers**: Decide whether to show the user's position via `data-current` styling or a separate visual indicator. Keep step labels short.
- **Developers**: Pass the 0-based index via the `current` prop so consumer CSS can target the active step. Use StepListItem `current` to apply `aria-current="step"`.

## Related components

- `step-list-item` — one step in a step list with status of waiting, in progress, finished, or error

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- Ant Design Steps: https://ant.design/components/steps
