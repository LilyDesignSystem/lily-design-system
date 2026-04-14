# Five Face Rating Picker Button

A five-face rating picker button is an individual button within a FiveFaceRatingPicker that represents one satisfaction level on a 1-5 scale. Each button corresponds to a face label such as "Very bad", "Bad", "Okay", "Good", or "Very good". When clicked, it selects that rating value. The component uses `aria-pressed` to indicate the currently selected state, making it accessible to screen readers and keyboard users.

## Implementation Notes

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a FiveFaceRatingPicker component
- Each button represents one of five satisfaction levels (1-5)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `label` prop provides both the visible text and the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## Props

- `value`: string (required) -- the rating value this button represents (e.g., "1", "2", "3", "4", "5")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Very bad", "Bad", "Okay", "Good", "Very good")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Usage

```html
<FiveFaceRatingPicker label="How was your experience?">
    <FiveFaceRatingPickerButton value="1" label="Very bad" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="2" label="Bad" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="3" label="Okay" onclick={handleClick} />
    <FiveFaceRatingPickerButton value="4" label="Good" selected onclick={handleClick} />
    <FiveFaceRatingPickerButton value="5" label="Very good" onclick={handleClick} />
</FiveFaceRatingPicker>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter / Space: Activate the button to select this rating

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected rating (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Very good")

## When to Use

- Use inside FiveFaceRatingPicker to represent one satisfaction level in a 1-5 face rating scale.
- Use when each face rating option needs individual styling, icons, or interactive behavior.
- Use to provide custom face illustrations or emoji for each satisfaction level.

## When Not to Use

- Do not use outside of a FiveFaceRatingPicker -- it requires the parent picker for group semantics.
- Do not use as a standalone toggle button -- use ToggleButton instead.

## Headless

This headless component provides a `<button>` with `aria-pressed` to indicate the selected state, `aria-label` for the face description, and click handling for selection. The consumer provides all visual styling, face icons or emoji, and hover/focus effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.five-face-rating-picker-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `five-face-rating-picker-button`
- Verify aria-label` -- provides the accessible name for the button (e.g., "Very good")
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the selected state visually distinct (e.g., highlighted border, increased size, or color change). Ensure each face button has enough tap target size for touch devices.
- **Developers**: Pass the `selected` prop to control `aria-pressed`. Use the `onclick` handler to update the parent picker's value. The `value` prop carries the numeric rating for form submission.

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
