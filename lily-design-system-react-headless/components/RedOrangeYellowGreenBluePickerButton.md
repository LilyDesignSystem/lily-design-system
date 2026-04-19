# RedOrangeYellowGreenBluePickerButton

A button representing one Red/Orange/Yellow/Green/Blue status choice within a ROYGB status picker. Renders a `<button>` with `aria-pressed` to indicate the selected state and `data-value` for consumer CSS targeting.

Compound component: use with RedOrangeYellowGreenBluePicker.

## Props

- `value`: string (required) -- the status value (e.g. "red", "orange", "yellow", "green", "blue")
- `label`: string (required) -- accessible name for the button via `aria-label`
- `selected`: boolean (default false) -- whether this status is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onClick`: function (optional) -- click handler
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```tsx
<RedOrangeYellowGreenBluePickerButton value="red" label="Red" selected={status === "red"} onClick={() => setStatus("red")} />
<RedOrangeYellowGreenBluePickerButton value="orange" label="Orange" selected={status === "orange"} onClick={() => setStatus("orange")} />
<RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow" selected={status === "yellow"} onClick={() => setStatus("yellow")} />
<RedOrangeYellowGreenBluePickerButton value="green" label="Green" selected={status === "green"} onClick={() => setStatus("green")} />
<RedOrangeYellowGreenBluePickerButton value="blue" label="Blue" selected={status === "blue"} onClick={() => setStatus("blue")} />
```

## ARIA

- `aria-label` -- accessible name for the button
- `aria-pressed` -- indicates whether the status is currently selected
- `data-value` -- exposes the status value for consumer CSS selectors

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
