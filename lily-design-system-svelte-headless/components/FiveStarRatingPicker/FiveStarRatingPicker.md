# FiveStarRatingPicker

A five-star rating input allows users to select a rating from 1 to 5 stars using radio buttons. This is one of the most common rating patterns on the web, used for product reviews, content ratings, and feedback forms. Each radio button is labeled with "N star" or "N stars" for clear screen reader communication. The component uses radio buttons grouped in a fieldset for proper accessibility and keyboard navigation.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` containing 5 `<label>`/`<input type="radio">` pairs
- Uses `$bindable()` for the selected rating value (1-5, with 0 meaning no selection)
- Each radio label reads "1 star", "2 stars", "3 stars", etc. for screen reader clarity
- The `name` prop groups the radio buttons for form submission
- Supports `disabled` state on the fieldset level

## Props

- `label`: string (required) -- accessible name for the rating group via `aria-label`
- `value`: number (default: `0`) -- current rating (1-5, 0 = none), bindable via `bind:value`
- `name`: string (default: `"rating"`) -- radio group name for form submission
- `disabled`: boolean (default: `false`) -- whether the entire group is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Usage

```svelte
<FiveStarRatingPicker label="Rate this" bind:value />
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

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
