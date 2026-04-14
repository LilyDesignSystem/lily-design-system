# Five Face Rating Picker

A five-face rating input allows users to select a rating from 1 to 5 using labeled radio buttons representing faces from "Very bad" to "Very good". This pattern is commonly used in satisfaction surveys, feedback forms, and experience ratings where face-based labels are more intuitive than numeric scales. The component uses radio buttons grouped in a fieldset for proper accessibility and keyboard navigation.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` containing 5 `<label>`/`<input type="radio">` pairs
- Supports two-way binding for the selected rating value (1-5, with 0 meaning no selection)
- Default face labels are "Very bad", "Bad", "Okay", "Good", "Very good" -- customizable via the `labels` prop
- Each radio button displays the corresponding label text for screen readers and visual users
- The `name` prop groups the radio buttons for form submission
- Supports `disabled` state on the fieldset level

## Props

- `label`: string (required) -- accessible name for the rating group via `aria-label`
- `value`: number (default: `0`) -- current rating (1-5, 0 = none), two-way bindable via `value`
- `name`: string (default: `"face-rating"`) -- radio group name for form submission
- `labels`: string[] (default: `["Very bad", "Bad", "Okay", "Good", "Very good"]`) -- accessible labels for each face
- `disabled`: boolean (default: `false`) -- whether the entire group is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Usage

```html
<FiveFaceRatingPicker label="How was your experience?" value={rating}>
    <FiveFaceRatingPickerButton value="1" label="Very bad" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="2" label="Bad" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="3" label="Okay" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="4" label="Good" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="5" label="Very good" onclick={handleClick} />
</FiveFaceRatingPicker>
```

With custom labels for internationalization:

```html
<FiveFaceRatingPicker label="Wie war Ihre Erfahrung?" value={rating} labels={["Sehr schlecht", "Schlecht", "Okay", "Gut", "Sehr gut"]} />
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

- Use in satisfaction surveys to collect feedback using face-based labels that are more intuitive than numeric scales.
- Use in patient experience questionnaires where expressive face icons communicate sentiment clearly.
- Use when you need a 1-5 rating with descriptive labels like "Very bad" through "Very good".
- Use in post-interaction feedback forms such as support ticket follow-ups or appointment reviews.
- Use when the audience includes users who may find faces more accessible than stars or numbers.

## When Not to Use

- Do not use for display-only ratings -- use FiveFaceRatingView instead.
- Do not use for generic product or service reviews where stars are the expected convention -- use FiveStarRatingPicker.
- Do not use for 0-10 scale survey questions -- use NetPromoterScorePicker.
- Do not use for traffic-light status indicators -- use RedAmberGreenPicker.

## Headless

This headless component provides a `<fieldset>` with `role="radiogroup"`, five `<label>`/`<input type="radio">` pairs with customizable face labels, two-way value binding, and `disabled` support. The consumer provides all visual styling, face icons or illustrations, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.five-face-rating-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `five-face-rating-picker`
- Verify role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- Verify aria-label="..."` -- provides an accessible name for the entire rating group
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use distinct face illustrations or emoji for each level to make the scale visually intuitive. Ensure the faces are large enough to be easily tapped on touch devices.
- **Developers**: Customize the `labels` prop for internationalization. The `name` prop groups the radio buttons for form submission. Use the `value` binding to track the selected rating.

## Composition

FiveFaceRatingPicker composes with FiveFaceRatingPickerButton using the Picker/PickerButton pattern. The picker provides the group container with `role="radiogroup"`, and each picker button represents one selectable face rating level.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
