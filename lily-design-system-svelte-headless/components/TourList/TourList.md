# TourList

A tour guide list is a headless guided walkthrough overlay that presents step-by-step instructions to users. It renders as a modal dialog when active and can be dismissed with the Escape key, providing a structured onboarding or feature discovery experience.

This component is useful for onboarding flows, feature tutorials, or contextual help systems. The `active` prop is bindable, allowing the consumer to programmatically start or stop the tour. The consumer provides TourListItem children to define each step of the tour.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` and `aria-modal="true"` when `active` is true
- Uses `aria-label` for an accessible name describing the tour
- Sets `tabindex="-1"` on the dialog to enable keyboard event capture
- Handles Escape key via an `onkeydown` handler that sets `active` to false
- Uses `$bindable(false)` for the `active` prop, enabling two-way binding
- Compound component: pair with TourListItem for each step
- Spreads `restProps` onto the dialog container for consumer customization

## Props

- `label`: string (required) -- accessible name for the tour dialog via `aria-label`
- `active`: boolean (default: `false`) -- whether the tour is currently visible; bindable with `bind:active`
- `children`: Snippet (required) -- TourListItem elements
- `...restProps`: unknown -- additional attributes spread onto the dialog `<div>`

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

## Keyboard Interactions

- Escape: Closes the tour by setting `active` to false

## ARIA

- `role="dialog"` -- identifies the tour overlay as a dialog window
- `aria-modal="true"` -- indicates the dialog is modal and content behind it is inert
- `aria-label={label}` -- provides an accessible name describing the tour
- `tabindex="-1"` -- allows the dialog element to receive focus for keyboard event handling

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
