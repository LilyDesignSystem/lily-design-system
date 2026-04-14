# Five Star Rating Picker

A five-star rating input allows users to select a rating from 1 to 5 stars using radio buttons. This is one of the most common rating patterns on the web, used for product reviews, content ratings, and feedback forms. Each radio button is labeled with "N star" or "N stars" for clear screen reader communication. The component uses radio buttons grouped in a fieldset for proper accessibility and keyboard navigation.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` containing 5 `<label>`/`<input type="radio">` pairs
- Supports two-way binding for the selected rating value (1-5, with 0 meaning no selection)
- Each radio label reads "1 star", "2 stars", "3 stars", etc. for screen reader clarity
- The `name` prop groups the radio buttons for form submission
- Supports `disabled` state on the fieldset level

## Props

- `label`: string (required) -- accessible name for the rating group via `aria-label`
- `value`: number (default: `0`) -- current rating (1-5, 0 = none), two-way bindable via `value`
- `name`: string (default: `"rating"`) -- radio group name for form submission
- `disabled`: boolean (default: `false`) -- whether the entire group is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Usage

```html
<FiveStarRatingPicker label="Rate this product" value={rating}>
    <FiveStarRatingPickerButton value="1" label="1 star" onclick={handleClick} />
    <FiveStarRatingPickerButton value="2" label="2 stars" onclick={handleClick} />
    <FiveStarRatingPickerButton value="3" label="3 stars" selected onclick={handleClick} />
    <FiveStarRatingPickerButton value="4" label="4 stars" onclick={handleClick} />
    <FiveStarRatingPickerButton value="5" label="5 stars" onclick={handleClick} />
</FiveStarRatingPicker>
```

In a review form:

```html
<Form label="Write a review" onSubmit={handleSubmit}>
    <Field label="Your rating" required>
        <FiveStarRatingPicker label="Your rating" value={rating} name="rating" />
    </Field>
    <Button type="submit">Submit Review</Button>
</Form>
```

## Keyboard Interactions

Standard radio group keyboard behavior provided by the browser:

- Tab: focus the selected radio (or first if none selected)
- ArrowDown / ArrowRight: move to next radio button
- ArrowUp / ArrowLeft: move to previous radio button
- Space: select the focused radio button

## ARIA

- `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- `aria-label="..."` -- provides an accessible name for the entire rating group

## When to Use

- Use for product reviews, content ratings, or feedback forms where users select a 1-5 star rating.
- Use when you need a familiar, universally understood rating input pattern.
- Use in e-commerce product pages, app store listings, or restaurant review forms.
- Use when the rating will be aggregated and displayed as an average star score.

## When Not to Use

- Do not use for display-only star ratings -- use FiveStarRatingView instead.
- Do not use for satisfaction surveys where face-based labels are more expressive -- use FiveFaceRatingPicker.
- Do not use for 0-10 scale surveys -- use NetPromoterScorePicker.
- Do not use for status indicators -- use RedAmberGreenPicker or RedOrangeYellowGreenBluePicker.

## Headless

This headless component provides a `<fieldset>` with `role="radiogroup"`, individual radio buttons with proper labels, and keyboard navigation. The consumer provides all visual styling including star shapes, colors, hover effects, and sizing.


## Styles

The consumer provides all CSS styling. The component renders with a `.five-star-rating-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `five-star-rating-picker`
- Verify role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- Verify aria-label="..."` -- provides an accessible name for the entire rating group
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual distinction between filled and unfilled stars, and include a hover/focus state so users know which rating they are about to select.
- **Developers**: Use two-way binding on `value` to track the selected rating. The `name` prop is important for form submission.

## Composition

FiveStarRatingPicker uses the Picker/PickerButton pattern. It contains FiveStarRatingPickerButton children, where each button represents one star level. The picker manages the group semantics while each button handles individual selection state via `aria-pressed`.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
