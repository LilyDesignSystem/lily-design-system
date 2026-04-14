# Five Star Rating View

A read-only five-star rating display that renders filled and empty star characters to visually represent a rating value from 0 to 5. This is the display-only companion to FiveStarRatingInput, used for showing ratings in product listings, review summaries, and user profiles. Screen readers receive the full rating description via `aria-label` rather than reading individual star characters.

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

```html
<FiveStarRatingView value={4} label="4 out of 5 stars" />
```

In a product listing:

```html
<Card>
    <h3>Wireless Headphones</h3>
    <FiveStarRatingView value={4} label="Rated 4 out of 5 stars" />
    <p>Based on 128 reviews</p>
</Card>
```

## Keyboard Interactions

None -- this component is a passive, read-only display.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element (the star rating)
- `aria-label="..."` -- provides the full rating description for screen readers
- `aria-hidden="true"` -- on each inner star span, prevents screen readers from reading individual star characters

## When to Use

- Use to display a read-only star rating in product listings, review summaries, or user profiles.
- Use when the rating value should be visible but not editable.
- Use alongside product titles or review headings to show aggregate ratings.

## When Not to Use

- Do not use when the user needs to select or change a rating -- use FiveStarRatingPicker instead.
- Do not use for satisfaction survey results with face labels -- use FiveFaceRatingView instead.

## Headless

This headless component provides semantic HTML with `role="img"`, `aria-label`, and `aria-hidden` inner spans for accessible read-only star display. The consumer provides all visual styling including star characters, colors, and sizing.


## Styles

The consumer provides all CSS styling. The component renders with a `.five-star-rating-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `five-star-rating-view`
- Verify role="img"` -- indicates the span represents a visual/graphic element (the star rating)
- Verify aria-label="..."` -- provides the full rating description for screen readers
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear visual distinction between filled and empty stars. Consider half-star displays for fractional ratings by styling at the consumer level.
- **Developers**: The `data-filled` attribute on each star span enables CSS-only styling of filled vs. empty states without JavaScript.

## References

- WAI-ARIA `img` role: https://www.w3.org/WAI/ARIA/apd/roles/img/
