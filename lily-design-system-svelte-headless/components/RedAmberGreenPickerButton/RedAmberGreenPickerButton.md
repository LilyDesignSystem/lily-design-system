# RedAmberGreenPickerButton

A button representing one Red/Amber/Green status choice within a RAG status picker. Renders a `<button>` with `aria-pressed` to indicate the selected state and `data-value` for consumer CSS targeting.

Compound component: use with RedAmberGreenPicker.

## Props

- `value`: string (required) -- the status value (e.g. "red", "amber", "green")
- `label`: string (required) -- accessible name for the button via `aria-label`
- `selected`: boolean (default false) -- whether this status is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onclick`: function (optional) -- click handler
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```svelte
<RedAmberGreenPickerButton value="red" label="Red" selected={status === "red"} onclick={() => status = "red"} />
<RedAmberGreenPickerButton value="amber" label="Amber" selected={status === "amber"} onclick={() => status = "amber"} />
<RedAmberGreenPickerButton value="green" label="Green" selected={status === "green"} onclick={() => status = "green"} />
```

## ARIA

- `aria-label` -- accessible name for the button
- `aria-pressed` -- indicates whether the status is currently selected
- `data-value` -- exposes the status value for consumer CSS selectors

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system
