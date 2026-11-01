# ColorPicker

A two-dimensional board for picking colors by hue and saturation.

See `components/color-picker/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `X`, `Y`: double, 0 to 100 (bindable with `@bind-X`, `@bind-Y`) — `aria-valuenow` is X; `data-x` and `data-y` carry both
- `Disabled`: bool — `aria-disabled`, out of the tab order, keys ignored
- `CssClass`: string — extra CSS classes appended to `color-picker`
- `ChildContent`: RenderFragment — what the consumer draws inside the area
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColorPicker Label="Saturation and lightness" @bind-X="saturation" @bind-Y="lightness" />
```

## Keyboard

ArrowRight / ArrowLeft move X and ArrowDown / ArrowUp move Y (Up lowers it), by 1 or by 10 with Shift, inside 0 to
100; Home and End set X to 0 and 100. Blazor here uses no JavaScript interop, and an event handler cannot cancel only some keys, so the keys may also scroll the page.
