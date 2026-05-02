# SliderButton

A "slide to confirm" button. Keyboard users adjust the slider with Arrow Right / Arrow Left, jump to ends with Home / End, or activate immediately with Enter or Space (accessibility fallback). Pointer-drag styling and gesture handling are left to the consumer; this component models the keyboard fallback and the slider state.

## Props

- `className`: string (optional) -- CSS class appended to `slider-button`
- `label`: string (required) -- accessible label describing the confirmation action
- `step`: number (default `10`) -- percent step per Arrow Right / Arrow Left press
- `disabled`: boolean (default false) -- when true, the button does not respond to keyboard input
- `onConfirm`: () => void (optional) -- called when the slider reaches 100% (or End / Enter / Space)
- `children`: ReactNode (optional) -- visible label content
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Accessibility

- `role="slider"` so assistive tech announces the position
- `aria-valuenow` / `aria-valuemin` / `aria-valuemax` expose the percent
- `aria-label` provides the accessible name

## Usage

```tsx
<SliderButton
  label="Slide to confirm payment"
  onConfirm={submitPayment}
>
  Slide to confirm
</SliderButton>
```

## References

- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
