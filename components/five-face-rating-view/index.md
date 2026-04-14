# Five Face Rating View

A read-only five-face rating display that shows a text label corresponding to a rating value from 1 to 5. This is the display-only companion to FiveFaceRatingInput, used for showing previously submitted ratings in summaries, review lists, or dashboard displays.

## Implementation Notes

- Renders a `<span>` with `role="img"` to indicate it represents a visual rating
- Uses derived value to look up the face label from the `labels` array based on the `value`
- Exposes `data-value` attribute for consumer CSS or testing
- Default labels are "Very bad", "Bad", "Okay", "Good", "Very good" -- customizable via the `labels` prop
- Spreads `restProps` for consumer customization

## Props

- `value`: number (required) -- rating value (1-5) to display
- `label`: string (required) -- accessible description via `aria-label`
- `labels`: string[] (default: `["Very bad", "Bad", "Okay", "Good", "Very good"]`) -- text labels for each face
- `...restProps`: unknown -- additional attributes spread onto the `<span>`

## Usage

```html
<FiveFaceRatingView value={4} label="Patient satisfaction: Good" />
```

In a feedback summary:

```html
<SummaryList label="Survey results">
    <SummaryListItem>
        <dt>Satisfaction</dt>
        <dd><FiveFaceRatingView value={3} label="Satisfaction rating: Okay" /></dd>
    </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

None -- this component is a passive, read-only display.

## ARIA

- `role="img"` -- indicates the span represents a visual/graphic element (the face rating)
- `aria-label="..."` -- provides an accessible description of the rating for screen readers

## When to Use

- Use to display a previously submitted satisfaction rating as a text label in review summaries, dashboards, or feedback lists.
- Use when the rating should be read-only and not editable by the user.
- Use in patient feedback reports or satisfaction survey results.

## When Not to Use

- Do not use when the user needs to select or change a rating -- use FiveFaceRatingPicker instead.
- Do not use for star-based display -- use FiveStarRatingView instead.

## Headless

This headless component provides semantic HTML with `role="img"` and `aria-label` for accessible read-only rating display. The consumer provides all visual styling, including typography, colors, and any face/emoji iconography.


## Styles

The consumer provides all CSS styling. The component renders with a `.five-face-rating-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `five-face-rating-view`
- Verify role="img"` -- indicates the span represents a visual/graphic element (the face rating)
- Verify aria-label="..."` -- provides an accessible description of the rating for screen readers
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the visual treatment clearly communicates that this is a display-only element, not an interactive control. Use color or iconography that matches the rating sentiment.
- **Developers**: Pair this component with FiveFaceRatingPicker for edit scenarios. Customize the `labels` prop when the default face labels do not match your application's rating scale.

## References

- WAI-ARIA `img` role: https://www.w3.org/WAI/ARIA/apd/roles/img/
