# Red Orange Yellow Green Blue Picker Button

A five-level color status picker button is an individual button within a RedOrangeYellowGreenBluePicker that represents one of five status levels. When clicked, it selects that status value. The component uses `aria-pressed` to indicate the currently selected state and `data-value` to carry the status value, making it accessible to screen readers and enabling CSS-based styling by status color.

The five levels provide a more granular status scale than the traditional three-level RAG: red indicates critical, orange indicates serious, yellow indicates caution, green indicates good, and blue indicates excellent or informational.

## Implementation Notes

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a RedOrangeYellowGreenBluePicker component
- Each button represents one of five status levels (red, orange, yellow, green, blue)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `data-value` attribute carries the status value for CSS targeting
- The `label` prop provides the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## Props

- `value`: string (required) -- the status value this button represents (e.g., "red", "orange", "yellow", "green", "blue")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Red - Critical", "Green - Good")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Usage

Five-level risk assessment picker:

```html
<RedOrangeYellowGreenBluePicker label="Risk assessment">
  <RedOrangeYellowGreenBluePickerButton value="red" label="Red - Critical" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="orange" label="Orange - Serious" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow - Caution" selected onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="green" label="Green - Good" onclick={handleSelect} />
  <RedOrangeYellowGreenBluePickerButton value="blue" label="Blue - Excellent" onclick={handleSelect} />
</RedOrangeYellowGreenBluePicker>
```

Individual button with custom data attribute:

```html
<RedOrangeYellowGreenBluePickerButton
  value="orange"
  label="Orange - Significant risk"
  selected
  data-severity="high"
  onclick={handleSelect}
/>
```

Inside a form field for patient triage:

```html
<Field label="Triage level" required>
  <RedOrangeYellowGreenBluePicker label="Patient triage level">
    <RedOrangeYellowGreenBluePickerButton value="red" label="Red - Emergency" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="orange" label="Orange - Urgent" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="yellow" label="Yellow - Standard" selected onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="green" label="Green - Minor" onclick={handleSelect} />
    <RedOrangeYellowGreenBluePickerButton value="blue" label="Blue - Routine" onclick={handleSelect} />
  </RedOrangeYellowGreenBluePicker>
</Field>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter / Space: Activate the button to select this status

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected status (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Yellow - Caution")
- `data-value` -- carries the status value for CSS-based styling (e.g., `data-value="yellow"`)

## When to Use

- Use inside a RedOrangeYellowGreenBluePicker to represent one selectable five-level status option.
- Use when you need a button-based five-level status picker instead of a select dropdown.
- Use to provide individually styled buttons for each of the five colour-coded levels.

## When Not to Use

- Do not use outside of a RedOrangeYellowGreenBluePicker container -- the button relies on the picker for grouping and context.
- Do not use for standalone toggle actions -- use [ToggleButton](../toggle-button/) instead.
- Do not use for standalone option selection -- use [RadioInput](../radio-input/) instead.

## Headless

The RedOrangeYellowGreenBluePickerButton headless component provides a `<button>` with `aria-pressed` for toggle state, `aria-label` for accessible naming, and `data-value` for CSS targeting. The consumer provides all visual styling, including color indicators and selected-state appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.red-orange-yellow-green-blue-picker-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `red-orange-yellow-green-blue-picker-button`
- Verify aria-label` -- provides the accessible name for the button (e.g., "Yellow - Caution")
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure each of the five buttons is visually distinct with both color and text, and make the selected state clearly prominent.
- **Developers**: Use `data-value` for CSS selectors to apply status-specific colors, and ensure only one button has `aria-pressed="true"` at a time.

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
