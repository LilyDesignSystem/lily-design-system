# TagInput

TagInput is a headless text input for adding tags to a collection. When the user types a value and presses Enter, the component calls the `onadd` callback with the trimmed text and automatically clears the input, providing a streamlined tag entry experience.

This component is commonly used alongside TagGroup to build tag management interfaces, such as adding skills to a profile, keywords to an article, or labels to an issue tracker. The input value is bindable, allowing the consumer to read or control the current text.

## Implementation Notes

- Renders a native `<input type="text">` element for tag entry
- Uses `aria-label` for accessible identification
- Handles Enter key via an `onkeydown` handler that calls `onadd` with the trimmed value and resets the input
- Uses `$bindable("")` for the `value` prop, enabling two-way binding
- Supports `disabled` state to prevent interaction
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current input text; bindable with `bind:value`
- `onadd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```svelte
<TagInput label="Add tag" bind:value onadd={(tag) => tags.push(tag)} />
```

## Keyboard Interactions

- Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the input

## ARIA

- `aria-label={label}` -- provides an accessible name for the text input

## References

- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox
