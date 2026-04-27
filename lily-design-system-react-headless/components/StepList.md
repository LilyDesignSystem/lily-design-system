# StepList

An ordered list of step items showing progress through a multi-step process. Renders an `<ol>` with optional `aria-label` and `data-current` hooks. Children are typically `StepListItem` components.

## Implementation Notes

- Root element is `<ol>`
- `aria-label` is optional; the `<ol>` provides list semantics
- `data-current` is set only when `current` is a number

## Props

- `label`: string (optional) -- aria-label
- `current`: number (optional) -- 0-based index of the current step, exposed as `data-current`
- `children`: ReactNode (required) -- typically `StepListItem` children
- `...restProps`: Any additional HTML attributes passed to the `<ol>`

## Usage

```tsx
<StepList label="Sign up" current={1}>
  <StepListItem status="finished">Account</StepListItem>
  <StepListItem status="in-progress" current>Profile</StepListItem>
  <StepListItem status="waiting">Confirm</StepListItem>
</StepList>
```

## Keyboard Interactions

None at the list level. Interactive children handle their own keyboard.

## ARIA

- `<ol>` provides list semantics
- `aria-label` from the optional `label` prop
