# Option

An option component wraps the native HTML `<option>` element for use inside `<select>` elements. It accepts a value prop for the form submission value and renders children as the visible option label text.

The component supports `selected` for pre-selecting an option and `disabled` for preventing selection, both using native HTML attributes. All accessibility behavior is provided automatically by the browser's native `<option>` element within the parent `<select>`.

## Implementation Notes

- Wraps native `<option>` element with Svelte 5 runes
- Uses `children` Snippet for label text content
- Supports `selected` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<option>` element
- All text content comes through children and props for internationalization

## Props

- `value`: string (required) -- the option value submitted with the form
- `selected`: boolean (default: false) -- whether this option is pre-selected
- `disabled`: boolean (default: false) -- whether this option is disabled
- `children`: Snippet (required) -- option label text
- `...restProps`: Any additional HTML attributes passed to the `<option>` element

## Usage

```svelte
<select>
  <Option value="us">United States</Option>
  <Option value="uk">United Kingdom</Option>
</select>
```

## Keyboard Interactions

- Native `<option>` keyboard behavior (managed by parent `<select>`)

## ARIA

- Native `<option>` provides built-in accessibility via the parent `<select>` element
- Screen readers announce the option text and selected state automatically

## References

- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
