# TextAreaInput

A text-area-input is a headless component that wraps the native HTML `<textarea>` element, providing a multi-line text input area. It is commonly used in forms for comments, messages, descriptions, feedback, code input, and any scenario where users need to enter extended text content.

Unlike a single-line text input, a text-area-input provides a larger, scrollable text area that supports multiple lines. The component uses `aria-label` for accessible naming and supports two-way binding on the value via Svelte 5 `$bindable()`.

## Implementation Notes

- Renders a single `<textarea>` element with no wrapper
- Uses `aria-label` for accessible naming instead of a visible `<label>` element
- Uses Svelte 5 `$bindable()` for two-way binding on the `value` prop
- The `rows` prop controls the visible height of the text area
- Spreads `restProps` onto the text-area-input element for consumer extensibility

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- bindable text content of the text-area-input
- `rows`: number (default: undefined) -- number of visible text rows (browser default if unset)
- `required`: boolean (default: false) -- whether the text-area-input is required for form submission
- `disabled`: boolean (default: false) -- whether the text-area-input is disabled
- `...restProps`: unknown -- additional attributes spread onto the text-area-input element

## Usage

```svelte
<TextAreaInput label="Comments" bind:value rows={5} />
```

```svelte
<TextAreaInput label="Description" bind:value={description} required />
```

```svelte
<TextAreaInput label="Notes" bind:value disabled={isReadOnly} />
```

## Keyboard Interactions

- Tab: Moves focus to and from the text-area-input (native browser behavior)
- All standard text editing keys function normally within the text-area-input (native browser behavior)
- Enter: Inserts a new line (does not submit forms, unlike single-line inputs)

## ARIA

- `aria-label={label}` -- provides an accessible name for the text-area-input since there is no visible `<label>` element

## References

- MDN text-area-input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/text-area-input
