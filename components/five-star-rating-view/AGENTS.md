# FiveStarRatingView

## Metadata

- Component: five-star-rating-view
- PascalCase: FiveStarRatingView
- Description: a read-only display of a five-star rating
- HTML tag: <div>
- CSS class: .five-star-rating-view
- Interactive: no

## Companion

- five-star-rating-picker

## Key Behaviors

- Renders a `<span>` with `role="img"` as the outer container for the star display
- Contains 5 inner `<span>` elements, each displaying a filled star (filled: data-filled true) or empty star (unfilled: data-filled false)
- Inner star spans use `aria-hidden="true"` so screen readers skip individual characters
- Exposes `data-value` on the outer span and `data-filled` on each star span for consumer CSS
- Displays Unicode star characters: filled star and empty star

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element (the star rating)
- `aria-label="..."` -- provides the full rating description for screen readers
- `aria-hidden="true"` -- on each inner star span, prevents screen readers from reading individual star characters

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: number (required) -- rating value (0-5) to display
- `label`: string (required) -- accessible description via `aria-label` (e.g., "4 out of 5 stars")
- `...restProps`: unknown -- additional attributes spread onto the outer `<span>`

## Acceptance Criteria

- [ ] Renders <div> element with class="five-star-rating-view"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .five-star-rating-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-star-rating-view.html
- WAI-ARIA `img` role: https://www.w3.org/WAI/ARIA/apd/roles/img/
