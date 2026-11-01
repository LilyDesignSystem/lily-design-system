# Tour

A tour guide is an outer container for a guided walkthrough experience, such as for sightseeing, or pathways, or demonstrations, or onboarding. It wraps a TourList and its TourListItem children, providing the dialog overlay and keyboard dismissal behavior. When active, it renders as a modal dialog that can be closed with the Escape key.

## Implementation Notes

- Conditionally renders a `<div>` with `role="dialog"` when `active` is true. It is non-modal: no `aria-modal` and no focus trap, because a tour points at parts of the live page and often asks the user to try them, so the page must stay usable
- Uses `aria-label` for an accessible name describing the tour
- Sets `tabindex="-1"` on the dialog to enable keyboard event capture
- Handles Escape key via an `onKeyDown` handler that sets `active` to false
- Supports controlled component usage for the `active` prop
- Compound component: wraps TourList which contains TourListItem children
- Spreads `restProps` onto the dialog container for consumer customization

## Props

- `label`: string (required) -- accessible name for the tour dialog via `aria-label`
- `active`: boolean (default: `false`) -- whether the tour is currently visible; controlled
- `children`: ReactNode (required) -- TourList and TourListItem elements
- `...restProps`: unknown -- additional attributes spread onto the dialog `<div>`

## Usage

```tsx
<Tour
  label="Onboarding tour"
  active={isActive}
  onChange={setIsActive}
>
  <TourList label="Tour steps">
    <TourListItem
      label="Welcome"
      current={step === 0}
      stepNumber={1}
      totalSteps={3}
    >
      <p>Welcome to the app!</p>
      <button onClick={() => setStep(step + 1)}>Next</button>
    </TourListItem>
    <TourListItem
      label="Features"
      current={step === 1}
      stepNumber={2}
      totalSteps={3}
    >
      <p>Here are the features.</p>
      <button onClick={() => setStep(step - 1)}>Back</button>
      <button onClick={() => setStep(step + 1)}>Next</button>
    </TourListItem>
    <TourListItem
      label="Finish"
      current={step === 2}
      stepNumber={3}
      totalSteps={3}
    >
      <p>You're all set!</p>
      <button onClick={() => setIsActive(false)}>Done</button>
    </TourListItem>
  </TourList>
</Tour>
```

## Keyboard Interactions

- Escape: closes the tour by setting `active` to false

## ARIA

- `role="dialog"` -- identifies the tour overlay as a dialog window
- no `aria-modal` -- the tour is non-modal; the page behind it stays usable
- `aria-label={label}` -- provides an accessible name describing the tour
- `tabindex="-1"` -- allows the dialog element to receive focus for keyboard event handling

## Internationalization

- The `label` prop accepts any translated string
- All step content comes through TourList and TourListItem children

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
