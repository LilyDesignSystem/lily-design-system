# FiveFaceRatingPicker

A five-face rating picker allows users to select a satisfaction level from 1 to 5 using labeled radio buttons representing faces from "Very bad" to "Very good". This pattern is commonly used in satisfaction surveys, feedback forms, and experience ratings where face-based labels are more intuitive than numeric scales. The component uses radio buttons grouped in a fieldset for proper accessibility and keyboard navigation.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` containing 5 `<label>`/`<input type="radio">` pairs
- Uses `$bindable()` for the selected rating value (1-5, with 0 meaning no selection)
- Default face labels are "Very bad", "Bad", "Okay", "Good", "Very good" -- customizable via the `labels` prop
- Each radio button displays the corresponding label text for both screen readers and visual users
- The `name` prop groups the radio buttons for form submission
- Supports `disabled` state on the fieldset level
- Additional attributes spread onto the `<fieldset>` via `...restProps`

## Props

- `label`: string (required) -- accessible name for the rating group via `aria-label`
- `value`: number (default: `0`) -- current rating (1-5, 0 = none), bindable via `bind:value`
- `name`: string (default: `"face-rating"`) -- radio group name for form submission
- `labels`: string[] (default: `["Very bad", "Bad", "Okay", "Good", "Very good"]`) -- labels for each of the 5 faces
- `disabled`: boolean (default: `false`) -- whether the entire group is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Usage

```svelte
<!-- Basic face rating with two-way binding -->
<FiveFaceRatingPicker label="How was your experience?" bind:value />

<!-- Custom face labels for localization or different scales -->
<FiveFaceRatingPicker label="Rate service" bind:value labels={["Terrible", "Poor", "Fair", "Great", "Excellent"]} />

<!-- Disabled face rating -->
<FiveFaceRatingPicker label="Previous rating" value={4} disabled />

<!-- Custom name for form submission -->
<FiveFaceRatingPicker label="Satisfaction" bind:value name="satisfaction" />
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

## Internationalization

- All face labels come through the `labels` prop -- no hardcoded user-facing strings
- The `label` prop allows localized accessible names
- The `name` prop allows localized form field names

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
