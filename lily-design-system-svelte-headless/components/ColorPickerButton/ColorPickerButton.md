# ColorPickerSwatchButton

A button representing a single predefined color choice within a ColorPicker. It allows users to select a color from a set of predefined options by clicking on a visually representative swatch. The component communicates selected state through `aria-pressed` and exposes `data-color` for consumer CSS targeting.

## Props

| Prop         | Type                        | Default   | Description                                                            |
| ------------ | --------------------------- | --------- | ---------------------------------------------------------------------- |
| color        | string                      | required  | CSS color value applied as background-color and exposed via data-color |
| label        | string                      | required  | Accessible name announced by screen readers (e.g., "Red")              |
| selected     | boolean                     | false     | Whether the swatch is currently selected; reflected in aria-pressed    |
| disabled     | boolean                     | false     | Whether the swatch is disabled                                         |
| onclick      | (event: MouseEvent) => void | undefined | Click handler for selection                                            |
| ...restProps | HTML attributes             | —         | Spread onto the `<button>`                                             |

## Usage

```svelte
<ColorPicker label="Choose a color">
  <ColorPickerSwatchButton color="#ff0000" label="Red" onclick={handleSelect} />
  <ColorPickerSwatchButton color="#0066cc" label="Blue" selected={true} onclick={handleSelect} />
  <ColorPickerSwatchButton color="#cccccc" label="Gray" disabled={true} />
</ColorPicker>
```

## Keyboard

- **Tab**: Moves focus to the swatch button
- **Enter / Space**: Activates the button (native button behavior)

## Accessibility

- `aria-label` provides an accessible name since the button has no visible text
- `aria-pressed` indicates whether the swatch is currently selected

## References

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apd/patterns/button/)
