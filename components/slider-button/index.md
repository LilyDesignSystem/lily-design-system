# SliderButton

A slider button is a button with a slider mechanism that the user needs to slide to confirm an action. This pattern prevents accidental activation and is used for destructive or irreversible actions that require deliberate confirmation.

This headless component uses a `<button>` element with an internal slider track, requiring the user to drag a thumb across the full track to activate the button.

## Implementation Notes

- Uses `<button>` element for semantic button behavior
- Internal slider track requires drag-to-confirm interaction
- `aria-label` describes the action to confirm
- `aria-valuenow` tracks the slider position (0 to 100)
- Activates the button action only when slider reaches 100%
- Resets slider position if released before completion

## Props

- `label`: string (required) -- accessible label describing the confirmation action
- `disabled`: boolean (default: false) -- whether the slider button is disabled
- `onconfirm`: callback (optional) -- handler called when slider completes
- `children`: slot -- button label content
- `...restProps`: Any additional HTML attributes

## Usage

Slide to confirm account deletion:

```html
<SliderButton label="Slide to delete account" onconfirm={handleDeleteAccount}>
  Slide to delete account
</SliderButton>
```

Slide to confirm payment:

```html
<SliderButton label="Slide to send payment" onconfirm={handleSendPayment}>
  Slide to send $500.00
</SliderButton>
```

Disabled slider button while processing:

```html
<SliderButton label="Slide to confirm" onconfirm={handleConfirm} disabled={isProcessing}>
  Slide to confirm
</SliderButton>
```

## Keyboard Interactions

- Tab: Focus the slider button
- Arrow Right: Move slider toward completion
- Arrow Left: Move slider toward start
- Enter: Activate immediately (accessibility fallback)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` -- describes the confirmation action
- `aria-valuenow` -- current slider position percentage

## When to Use

- Use for a slide-to-confirm interaction where users must drag to confirm an irreversible action.
- Use for destructive actions such as deleting an account, sending a payment, or initiating a transfer.
- Use when accidental clicks need to be prevented and a standard confirmation dialog is not sufficient.

## When Not to Use

- Do not use for value selection -- use Slider or RangeInput instead.
- Do not use for simple confirmations -- use AlertDialog instead.
- Do not use for routine, easily reversible actions -- use a standard Button instead.

## Headless

This component provides a `<button>` element with slider mechanics and ARIA value tracking, with zero visual styling. The consumer is responsible for all CSS including track appearance, thumb styling, progress fill, and completion animation.

## Styles

The consumer provides all CSS styling. The component renders with a `.slider-button` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<button>` element with class `slider-button`
- Verify `aria-label` is applied
- Verify slider interaction triggers onconfirm at completion
- Verify slider resets when released before completion
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the slider track and thumb clearly visible. Provide visual feedback as the slider progresses. Show a completion animation on success.
- **Developers**: Always provide a keyboard fallback (Enter key) for accessibility. Reset the slider state after confirmation or cancellation.
