# Option

An option component wraps the native HTML `<option>` element for use inside `<select>` elements. It accepts a value prop for the form submission value and renders children as the visible option label text.

The component supports `selected` for pre-selecting an option and `disabled` for preventing selection, both using native HTML attributes. All accessibility behavior is provided automatically by the browser's native `<option>` element within the parent `<select>`.

## Implementation Notes

- Wraps native `<option>` element with runes
- Uses `children` slot for label text content
- Supports `selected` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<option>` element
- All text content comes through children and props for internationalization

## Props

- `value`: string (required) -- the option value submitted with the form
- `selected`: boolean (default: false) -- whether this option is pre-selected
- `disabled`: boolean (default: false) -- whether this option is disabled
- `children`: slot (required) -- option label text
- `...restProps`: Any additional HTML attributes passed to the `<option>` element

## Usage

```html
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

## When to Use

- Use inside a `<select>` element to represent one selectable choice in a dropdown.
- Use when each option needs a distinct form submission value separate from its display text.
- Avoid using Option outside of a Select component; it depends on the parent `<select>` for semantics and keyboard behavior.

## When Not to Use

- Do not use outside of a `<select>` element — `Option` relies on the parent `<select>` for semantics and keyboard handling.
- Do not use when you need rich content in each option (icons, descriptions, multi-line text) — native `<option>` cannot render arbitrary HTML; use `Listbox` or `Combobox` for that.
- Do not use when you need autocomplete/typeahead filtering — use `Combobox` or `Autosuggest`.
- Do not use a single `Option` to represent something other than a discrete selectable value (e.g. a heading) — use `<optgroup>` for grouping.

## Headless

This headless component wraps the native `<option>` element with props for `value`, `selected`, and `disabled` states. Accessibility is provided automatically by the browser through the parent `<select>`. The consumer provides all visual styling via the parent Select component, as native `<option>` elements have limited styling capabilities.


## Styles

The consumer provides all CSS styling. The component renders with a `.option` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<option>` element with class `option`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep option text concise and scannable. For long lists, group related options using `<optgroup>` via the parent Select.
- **Developers**: Use the `value` prop for the form submission value and children for the display text. Native `<option>` styling is limited; for custom-styled dropdowns, consider Listbox or Combobox instead.

## Related components

- `select` — a dropdown select element for choosing one option
- `theme-select-option` — one option in a theme select dropdown

## References

- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

---

Lily™ and Lily Design System™ are trademarks.
