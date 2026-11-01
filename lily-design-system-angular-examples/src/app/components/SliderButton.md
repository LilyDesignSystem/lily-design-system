# SliderButton

a button with a slider that the user needs to slide to confirm

This is the Angular headless implementation. See `components/slider-button/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-slider-button
  label="Slide to confirm your order"
  [step]="10"
  (confirm)="placeOrder()"
></lily-slider-button>
```

## Inputs and outputs

- `label` — accessible label on the button
- `step` (default 10) — how far one arrow press moves the slider, in percent
- `disabled` — disables the button; the keys are ignored
- `className` — extra classes after `slider-button`
- `confirm` (output) — emitted when the slider reaches 100%

## Keyboard

ArrowRight and ArrowLeft move the slider by `step`; Home returns it to 0; End, Enter or Space complete it, which emits
`confirm` and resets the slider. The position is `aria-valuenow` on the `<button role="slider">`.

## Files

- `SliderButton.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `SliderButton.spec.ts` — vitest + TestBed render and keyboard tests
