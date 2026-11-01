# SliderButton

A button with a slider that the user needs to slide to confirm.

See `components/slider-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `Step`: int (default 10) — how far one arrow press moves the slider, in percent
- `Disabled`: bool — disables the button; the keys are ignored
- `OnConfirm`: EventCallback — raised when the slider reaches 100%
- `CssClass`: string — extra CSS classes appended to `slider-button`
- `ChildContent`: RenderFragment — the track and thumb the consumer draws from `aria-valuenow`
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SliderButton Label="Slide to confirm your order" OnConfirm="PlaceOrder" />
```

## Keyboard

ArrowRight and ArrowLeft move the slider by `Step`; Home returns it to 0; End, Enter or Space complete it, which raises
`OnConfirm` and resets the slider. Blazor here uses no JavaScript interop, and an event handler cannot cancel only some
keys, so the arrow keys may also scroll the page.
