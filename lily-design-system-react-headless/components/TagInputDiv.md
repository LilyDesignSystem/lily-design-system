# TagInputDiv

TagInputDiv is a headless text input for adding tags to a collection. When the user types a value and presses Enter, the component calls the `onadd` callback with the trimmed text and automatically clears the input, providing a streamlined tag entry experience.

This component is commonly used alongside TagGroup to build tag management interfaces, such as adding skills to a profile, keywords to an article, or labels to an issue tracker. The input value is controlled, allowing the consumer to read or control the current text.

## Implementation Notes

- Renders a native `<input type="text">` element for tag entry
- Uses `aria-label` for accessible identification
- Handles Enter key via an `onKeyDown` handler that calls `onAdd` with the trimmed value and resets the input
- The `value` prop supports controlled component usage
- Supports `disabled` state to prevent interaction
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current input text; controlled with `value + onChange`
- `onAdd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```tsx
<TagInputDiv label="Add tag" value + onChange onAdd={(tag) => tags.push(tag)} />
```

## Keyboard Interactions

- Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onAdd` with the trimmed value, and clears the input

## ARIA

- `aria-label={label}` -- provides an accessible name for the text input

## References

- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox
