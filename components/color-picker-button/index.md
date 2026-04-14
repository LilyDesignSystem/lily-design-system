# Color Picker Button

A color picker swatch is a button representing a single predefined color choice within a color picker interface. It allows users to select a color from a set of predefined options by clicking on a visually representative swatch. The component communicates selected state through `aria-pressed` and exposes `data-color` for consumer CSS targeting.

This component is useful in color palette UIs, theme builders, product customization forms, and any interface where users choose from a fixed set of color options. Each swatch is a fully accessible button that screen readers can announce by its label and selection state.

## Implementation Notes

- Renders a `<button>` element with `type="button"` to prevent form submission
- Uses inline `style:background-color` to display the color visually
- Exposes `data-color` attribute for consumer CSS selectors (e.g., styling based on selected color)
- Uses `aria-pressed` to communicate toggle/selected state to assistive technology
- Supports `disabled` state for unavailable color options
- Spreads `restProps` for consumer customization

## Props

- `color`: string (required) -- CSS color value applied as background-color and exposed via `data-color`
- `label`: string (required) -- accessible name announced by screen readers (e.g., "Red", "Ocean Blue")
- `selected`: boolean (default: `false`) -- whether the swatch is currently selected, reflected in `aria-pressed`
- `disabled`: boolean (default: `false`) -- whether the swatch is disabled
- `onclick`: `(event: MouseEvent) => void` (default: `undefined`) -- click handler for selection
- `...restProps`: any additional HTML attributes spread onto the button

## Usage

```html
<ColorPicker color="#ff0000" label="Red" onclick={handleSelect} />
```

```html
<ColorPicker color="#0066cc" label="Blue" selected={true} onclick={handleSelect} />
```

```html
<ColorPicker color="#cccccc" label="Gray" disabled={true} />
```

## Keyboard Interactions

- **Tab**: Moves focus to the swatch button
- **Enter / Space**: Activates the button (native button behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the swatch since it has no visible text content
- `aria-pressed={selected}` -- indicates whether the swatch is currently selected in a toggle context

## When to Use

- Use inside ColorPicker to represent one selectable colour swatch.
- Use in product customisation forms, theme builders, or palette UIs where users choose from a fixed set of colours.
- Use when each colour option needs an accessible label and pressed/selected state.

## When Not to Use

- Do not use outside a colour picker context -- use SegmentGroupItem or RadioInput for non-colour selections.
- Do not use for free-form colour selection -- use ColorPicker for 2D saturation/brightness picking or ColorInput for hex entry.

## Headless

This headless ColorPickerButton component provides a `<button>` with inline `style:background-color`, `aria-label` for the color name, `aria-pressed` for selected state, and `data-color` for CSS targeting. The consumer provides all visual styling including swatch size, border, selected-state ring or outline, hover effects, and layout within the palette.


## Styles

The consumer provides all CSS styling. The component renders with a `.color-picker-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `color-picker-button`
- Verify aria-label={label}` -- provides an accessible name for the swatch since it has no visible text content
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a visible border or ring to indicate the selected swatch. Ensure swatches are large enough to distinguish similar colors and meet touch target guidelines.
- **Developers**: Use the `data-color` attribute for CSS selectors and the `aria-pressed` state for selected styling. Group multiple ColorPickerButton components in a container for palette layout.

## Composition

ColorPickerButton is the child component in the ColorPicker/ColorPickerButton composition pattern. Multiple ColorPickerButton instances form a color palette. They can be combined with a ColorPicker for interfaces that offer both preset swatches and fine-grained 2D color selection.

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
