# MultiSelect

MultiSelect is a headless wrapper over the native `<select multiple>`. The bindable `value` is an array of the selected option values. It uses the browser's own listbox, keyboard and selection model.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders a native `<select multiple>` with `aria-label={label}`
- `value` is a `string[]` of selected option values, two-way bindable
- Optional `size` sets the number of visible rows
- Children are `Option` elements
- Supports `required` and `disabled`
- Spreads `restProps` onto the `<select>`

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `value`: string[] (default: `[]`) -- bindable selected values
- `size`: number (optional) -- visible rows
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `children`: slot (required) -- `Option` elements
- `...restProps`: unknown -- additional attributes spread onto the `<select>`

## Usage

```html
<MultiSelect label="Toppings" bind:value={toppings} size={4}>
  <Option value="cheese">Cheese</Option>
  <Option value="olives">Olives</Option>
  <Option value="onion">Onion</Option>
</MultiSelect>
```

## Keyboard Interactions

- Arrow Up / Arrow Down: moves the active option (native); Shift+Arrow extends the selection (native)
- Ctrl/Cmd+Click and Ctrl/Cmd+Space: toggle one option (native, platform-dependent)
- Native only: no keyboard handling is added

## ARIA

- `aria-label={label}` -- accessible name; the `<select multiple>` is exposed as a listbox with multiple selection

## When to Use

- Use when the user picks a handful of options from a known list and a native control is acceptable.
- Use for filters and tag assignment where searching is not needed.
- Use when you want native keyboard, form submission and mobile pickers.

## When Not to Use

- Do not use for a single choice -- use `select`.
- Do not use for two to five visible options where checkboxes are clearer -- use `checkbox-group`.
- Do not use when users must search a long list -- use `combobox`.

## Headless

This headless component renders a native `<select multiple>`. Selected-option appearance is largely controlled by the browser; the consumer styles the box and size.

## Styles

The consumer provides all CSS styling via the `.multi-select` class.

## Testing

- Verify the root is a `<select multiple>` with class `multi-select`
- Verify it is exposed as a listbox with the `label` name
- Verify an initial array `value` selects the matching options
- Verify several options can be selected
- Verify `size`, `required`, `disabled`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Native multi-selects are hard to discover (modifier keys). Add helper text, or prefer `checkbox-group` for short lists.
- **Developers**: The value is an array; serialise it for submission yourself or rely on repeated form fields with `name`.

## Related components

- `select` — single-choice native select
- `multi-select-with-extras` — the same control with content before and after
- `checkbox-group` — several visible checkboxes
- `combobox` — searchable choice

## References

- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

---

Lily™ and Lily Design System™ are trademarks.
