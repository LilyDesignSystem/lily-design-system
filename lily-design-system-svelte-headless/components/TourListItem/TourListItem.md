# TourListItem

A tour guide list item is a single step within a TourList guided tour. Each step represents one screen or instruction in the tour sequence. The step conditionally shows or hides based on the `current` prop, using the `hidden` attribute and `aria-hidden` for proper accessibility. Step progress information is communicated to screen readers through the accessible label.

This component is designed to be placed inside a TourList container. The consumer controls which step is current via the `current` prop, enabling flexible navigation patterns (next/previous buttons, step indicators, etc.).

## Implementation Notes

- Renders as a `<div>` with `role="group"` to semantically group step content
- Uses `aria-roledescription="step"` to identify the element as a step to screen readers
- Sets `aria-current="step"` on the active step for assistive technology
- Inactive steps use `hidden` attribute and `aria-hidden="true"` to be fully hidden
- When `stepNumber` and `totalSteps` are provided, the label includes "Step N of M" progress info
- Compound component: must be used inside a TourList container
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible name for this step via `aria-label`
- `current`: boolean (default: `false`) -- whether this step is the currently visible step
- `stepNumber`: number (optional) -- 1-based step number (e.g. 1, 2, 3)
- `totalSteps`: number (optional) -- total number of steps in the tour
- `children`: Snippet (required) -- step content
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Usage

```svelte
<TourList label="Getting started" bind:active>
  <TourListItem label="Welcome" current={step === 0} stepNumber={1} totalSteps={3}>
    <p>Welcome to the app!</p>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Features" current={step === 1} stepNumber={2} totalSteps={3}>
    <p>Here are the features.</p>
    <button onclick={() => step--}>Back</button>
    <button onclick={() => step++}>Next</button>
  </TourListItem>
  <TourListItem label="Finish" current={step === 2} stepNumber={3} totalSteps={3}>
    <p>You're all set!</p>
    <button onclick={() => active = false}>Done</button>
  </TourListItem>
</TourList>
```

## ARIA

- `role="group"` -- groups the step content semantically
- `aria-roledescription="step"` -- identifies the element as a tour step
- `aria-label` -- provides an accessible name, optionally including "Step N of M"
- `aria-current="step"` -- indicates the currently active step
- `aria-hidden="true"` -- hides inactive steps from assistive technology
- `hidden` -- hides inactive steps from visual rendering

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA aria-roledescription: https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
