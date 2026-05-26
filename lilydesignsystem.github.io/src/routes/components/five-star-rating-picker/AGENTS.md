# FiveStarRatingPicker

## Metadata

- Component: five-star-rating-picker
- PascalCase: FiveStarRatingPicker
- Description: a picker for selecting a 1-5 star rating using radio buttons
- HTML tag: <div>
- CSS class: .five-star-rating-picker
- Interactive: no

## Composition

- Pattern: Picker/PickerButton
- Children: five-star-rating-picker-button

## Companion

- five-star-rating-view

## Key Behaviors

- Renders a `<fieldset>` with `role="radiogroup"` containing 5 `<label>`/`<input type="radio">` pairs
- Supports two-way binding for the selected rating value (1-5, with 0 meaning no selection)
- Each radio label reads "1 star", "2 stars", "3 stars", etc. for screen reader clarity
- The `name` prop groups the radio buttons for form submission
- Supports `disabled` state on the fieldset level

## ARIA

- `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- `aria-label="..."` -- provides an accessible name for the entire rating group

## Keyboard

- Tab: focus the selected radio (or first if none selected)
- ArrowDown / ArrowRight: move to next radio button
- ArrowUp / ArrowLeft: move to previous radio button
- Space: select the focused radio button

## Props

- `label`: string (required) -- accessible name for the rating group via `aria-label`
- `value`: number (default: `0`) -- current rating (1-5, 0 = none), two-way bindable via `value`
- `name`: string (default: `"rating"`) -- radio group name for form submission
- `disabled`: boolean (default: `false`) -- whether the entire group is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Acceptance Criteria

- [ ] Renders <div> element with class="five-star-rating-picker"
- [ ] Has aria-label attribute
- [ ] Has role="radiogroup"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .five-star-rating-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-star-rating-picker.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
