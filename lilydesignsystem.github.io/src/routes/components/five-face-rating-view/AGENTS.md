# FiveFaceRatingView

## Metadata

- Component: five-face-rating-view
- PascalCase: FiveFaceRatingView
- Description: a read-only display of a five-face satisfaction rating
- HTML tag: <div>
- CSS class: .five-face-rating-view
- Interactive: no

## Companion

- five-face-rating-picker

## Key Behaviors

- Renders a `<span>` with `role="img"` to indicate it represents a visual rating
- Uses derived value to look up the face label from the `labels` array based on the `value`
- Exposes `data-value` attribute for consumer CSS or testing
- Default labels are "Very bad", "Bad", "Okay", "Good", "Very good" -- customizable via the `labels` prop
- Spreads `restProps` for consumer customization

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element (the face rating)
- `aria-label="..."` -- provides an accessible description of the rating for screen readers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: number (required) -- rating value (1-5) to display
- `label`: string (required) -- accessible description via `aria-label`
- `labels`: string[] (default: `["Very bad", "Bad", "Okay", "Good", "Very good"]`) -- text labels for each face
- `...restProps`: unknown -- additional attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <div> element with class="five-face-rating-view"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .five-face-rating-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-face-rating-view.html
- WAI-ARIA `img` role: https://www.w3.org/WAI/ARIA/apd/roles/img/
