# FiveStarRatingPickerButton

A button representing one star in a five-star rating picker. Renders a `<button>` with `aria-pressed` to indicate the selected state and `data-value` for consumer CSS targeting.

Compound component: use with FiveStarRatingPicker.

## Props

- `value`: number (required) -- the rating value (1-5)
- `label`: string (required) -- accessible name for the button (e.g. "1 star", "3 stars")
- `selected`: boolean (default false) -- whether this star is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onclick`: function (optional) -- click handler
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```svelte
<FiveStarRatingPickerButton value={1} label="1 star" selected={rating === 1} onclick={() => rating = 1} />
<FiveStarRatingPickerButton value={2} label="2 stars" selected={rating === 2} onclick={() => rating = 2} />
<FiveStarRatingPickerButton value={3} label="3 stars" selected={rating === 3} onclick={() => rating = 3} />
<FiveStarRatingPickerButton value={4} label="4 stars" selected={rating === 4} onclick={() => rating = 4} />
<FiveStarRatingPickerButton value={5} label="5 stars" selected={rating === 5} onclick={() => rating = 5} />
```

## ARIA

- `aria-label` -- accessible name for the button
- `aria-pressed` -- indicates whether the star is currently selected
- `data-value` -- exposes the rating value for consumer CSS selectors

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
