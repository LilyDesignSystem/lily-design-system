# FiveFaceRatingPickerButton

A button representing one face in a five-face rating picker. Renders a `<button>` with `aria-pressed` to indicate the selected state and `data-value` for consumer CSS targeting.

Compound component: use with FiveFaceRatingPicker.

## Props

- `value`: number (required) -- the rating value (1-5)
- `label`: string (required) -- accessible name for the button (e.g. "Very bad", "Good")
- `selected`: boolean (default false) -- whether this face is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onclick`: function (optional) -- click handler
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```svelte
<FiveFaceRatingPickerButton value={1} label="Very bad" selected={rating === 1} onclick={() => rating = 1} />
<FiveFaceRatingPickerButton value={2} label="Bad" selected={rating === 2} onclick={() => rating = 2} />
<FiveFaceRatingPickerButton value={3} label="Okay" selected={rating === 3} onclick={() => rating = 3} />
<FiveFaceRatingPickerButton value={4} label="Good" selected={rating === 4} onclick={() => rating = 4} />
<FiveFaceRatingPickerButton value={5} label="Very good" selected={rating === 5} onclick={() => rating = 5} />
```

## ARIA

- `aria-label` -- accessible name for the button
- `aria-pressed` -- indicates whether the face is currently selected
- `data-value` -- exposes the rating value for consumer CSS selectors

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
