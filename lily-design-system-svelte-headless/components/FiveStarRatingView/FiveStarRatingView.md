# FiveStarRatingView

A read-only five-star rating display that renders filled and empty star characters to visually represent a rating value from 0 to 5. This is the display-only companion to FiveStarRatingPicker, used for showing ratings in product listings, review summaries, and user profiles. Screen readers receive the full rating description via `aria-label` rather than reading individual star characters.

## Implementation Notes

- Renders a `<span>` with `role="img"` as the outer container for the star display
- Contains 5 inner `<span>` elements, each displaying a filled star (filled: data-filled true) or empty star (unfilled: data-filled false)
- Inner star spans use `aria-hidden="true"` so screen readers skip individual characters
- Exposes `data-value` on the outer span and `data-filled` on each star span for consumer CSS
- Displays Unicode star characters: filled star and empty star

## Props

- `value`: number (required) -- rating value (0-5) to display
- `label`: string (required) -- accessible description via `aria-label` (e.g., "4 out of 5 stars")
- `...restProps`: unknown -- additional attributes spread onto the outer `<span>`

## Usage

```svelte
<FiveStarRatingView value={4} label="4 out of 5 stars" />
```

## Keyboard Interactions

None -- this component is a passive, read-only display.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element (the star rating)
- `aria-label="..."` -- provides the full rating description for screen readers
- `aria-hidden="true"` -- on each inner star span, prevents screen readers from reading individual star characters

## References

- WAI-ARIA `img` role: https://www.w3.org/WAI/ARIA/apd/roles/img/
