# Red Amber Green Picker Button

A RAG (Red/Amber/Green) picker button is an individual button within a RedAmberGreenPicker that represents one traffic-light status level. When clicked, it selects that RAG status value. The component uses `aria-pressed` to indicate the currently selected state and `data-value` to carry the status value, making it accessible to screen readers and enabling CSS-based styling by status color.

Red indicates a critical problem needing immediate attention, amber signals caution or minor issues, and green means everything is on track.

## Implementation Notes

- Renders as a `<button>` element with `aria-pressed` for toggle state
- Designed to be used inside a RedAmberGreenPicker component
- Each button represents one of three RAG status levels (red, amber, green)
- The `selected` prop controls `aria-pressed` to indicate the active selection
- The `data-value` attribute carries the status value for CSS targeting
- The `label` prop provides the accessible name via `aria-label`
- Spreads `...restProps` onto the `<button>` element for consumer customization

## Props

- `value`: string (required) -- the RAG status value this button represents (e.g., "red", "amber", "green")
- `selected`: boolean (default: false) -- whether this button is currently selected
- `label`: string (required) -- accessible label for the button (e.g., "Red - Critical", "Amber - Caution", "Green - On track")
- `onclick`: callback -- handler called when the button is clicked
- `...restProps`: any -- additional HTML attributes spread onto the `<button>` element

## Usage

Basic RAG picker with one button selected:

```html
<RedAmberGreenPicker label="Project status">
  <RedAmberGreenPickerButton value="red" label="Red - Critical" onclick={handleSelect} />
  <RedAmberGreenPickerButton value="amber" label="Amber - Caution" selected onclick={handleSelect} />
  <RedAmberGreenPickerButton value="green" label="Green - On track" onclick={handleSelect} />
</RedAmberGreenPicker>
```

With custom data attributes for CSS targeting:

```html
<RedAmberGreenPickerButton
  value="red"
  label="Red - Immediate action required"
  selected
  data-severity="high"
  onclick={handleSelect}
/>
```

Inside a form field for risk assessment:

```html
<Field label="Delivery risk" required>
  <RedAmberGreenPicker label="Delivery risk level">
    <RedAmberGreenPickerButton value="red" label="Red - Blocked" onclick={handleSelect} />
    <RedAmberGreenPickerButton value="amber" label="Amber - At risk" onclick={handleSelect} />
    <RedAmberGreenPickerButton value="green" label="Green - On track" selected onclick={handleSelect} />
  </RedAmberGreenPicker>
</Field>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter / Space: Activate the button to select this status

## ARIA

- `aria-pressed` -- indicates whether this button is the currently selected status (`true` when selected, `false` otherwise)
- `aria-label` -- provides the accessible name for the button (e.g., "Amber - Caution")
- `data-value` -- carries the status value for CSS-based styling (e.g., `data-value="red"`)

## When to Use

- Use inside a RedAmberGreenPicker to represent one selectable traffic-light status option.
- Use when you need a button-based RAG picker instead of a select dropdown.
- Use to provide a visually distinct, individually styled button for each RAG level.

## When Not to Use

- Do not use outside of a RedAmberGreenPicker container -- the button relies on the picker for grouping and context.
- Do not use for standalone toggle actions -- use [ToggleButton](../toggle-button/) instead.
- Do not use for standalone option selection -- use [RadioInput](../radio-input/) instead.

## Headless

The RedAmberGreenPickerButton headless component provides a `<button>` with `aria-pressed` for toggle state, `aria-label` for accessible naming, and `data-value` for CSS targeting. The consumer provides all visual styling, including color indicators and selected-state appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.red-amber-green-picker-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `red-amber-green-picker-button`
- Verify aria-label` -- provides the accessible name for the button (e.g., "Amber - Caution")
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the selected state visually prominent with a border, background fill, or scale change, and ensure each button has a text label alongside any color indicator.
- **Developers**: Use the `data-value` attribute for CSS selectors to apply status-specific colors (e.g., `[data-value="red"] { background: red; }`).

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
