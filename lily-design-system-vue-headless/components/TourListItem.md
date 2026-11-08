# TourListItem

A tour guide list item is a single step within a TourList guided tour. Each step represents one screen or instruction in the tour sequence. The step conditionally shows or hides based on the `current` prop, using the `hidden` attribute and `aria-hidden` for proper accessibility. Step progress information is communicated to screen readers through the accessible label.

This component is designed to be placed inside a TourList container. The consumer controls which step is current via the `current` prop, enabling flexible navigation patterns (next/previous buttons, step indicators, etc.).

## Implementation Notes

- Renders as an `<li>`, a list item of its tour list: no group role, which would take it out of the list (tasks.md P25-T7)
- Sets `data-current` on the active step for assistive technology
- Inactive steps use `hidden` attribute and `aria-hidden="true"` to be fully hidden
- With `stepTemplate` and both numbers, the name is the template with `{label}`, `{step}` and `{total}` filled in; otherwise `label`. No English default
- Compound component: must be used inside a TourList container
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible name for this step via `aria-label`
- `current`: boolean (default: `false`) -- whether this step is the currently visible step
- `stepNumber`: number (optional) -- 1-based step number (e.g. 1, 2, 3)
- `totalSteps`: number (optional) -- total number of steps in the tour
- `stepTemplate`: string (optional) -- the step's whole name, e.g. `"{label} (Step {step} of {total})"`
- `children`: Snippet (required) -- step content
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

```svelte
<TourList
  label="Getting started"
  bind:active
>
  <TourListItem
    label="Welcome"
    current={step === 0}
    stepNumber={1}
    totalSteps={3}
  >
    <p>Welcome to the app!</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem
    label="Features"
    current={step === 1}
    stepNumber={2}
    totalSteps={3}
  >
    <p>Here are the features.</p>
    <button onclick={() => step--}>Back</button>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem
    label="Finish"
    current={step === 2}
    stepNumber={3}
    totalSteps={3}
  >
    <p>You're all set!</p>
    <button onclick={() => (active = false)}>Done</button>
  </TourListItem>
</TourList>
```

## ARIA

- The `<li>` keeps its listitem role, so the tour list counts its steps
- `aria-label` -- `label`, or the consumer's `stepTemplate` filled in
- `data-current` -- indicates the currently active step
- `aria-hidden="true"` -- hides inactive steps from assistive technology
- `hidden` -- hides inactive steps from visual rendering

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
