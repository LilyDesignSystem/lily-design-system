# MultiSelectWithExtras

MultiSelectWithExtras wraps a native `<select multiple>` in a `<div>` with optional `before` and `after` slots, for adornments such as a label, count, or clear button. It mirrors `select-with-extras` for multiple selection.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders a wrapper `<div>` containing the optional `before` slot, a native `<select multiple>`, then the optional `after` slot
- `aria-label={label}` is on the `<select>`, not the wrapper
- `value` is a `string[]`, two-way bindable
- `before` / `after` render only when provided
- Supports `size`, `required`, `disabled` on the select
- Spreads `restProps` onto the wrapper `<div>`

## Props

- `className`: string (default: `""`) -- CSS class on the wrapper
- `label`: string (required) -- accessible name for the select
- `value`: string[] (default: `[]`) -- bindable selected values
- `size`: number (optional) -- visible rows
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `children`: slot (required) -- `Option` elements
- `before`: slot (optional) -- content before the select
- `after`: slot (optional) -- content after the select
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

```html
<MultiSelectWithExtras label="Departments" bind:value={departments} size={5}>
  {#snippet before()}<span>Filter by</span>{/snippet}
  <Option value="a">Cardiology</Option>
  <Option value="b">Neurology</Option>
  {#snippet after()}<button type="button">Clear</button>{/snippet}
</MultiSelectWithExtras>
```

## Keyboard Interactions

- Native select keyboard behaviour only: Arrow keys move, Shift+Arrow extends selection, Tab moves focus
- Interactive content in `before` / `after` has its own native keyboard behaviour

## ARIA

- `aria-label={label}` -- on the `<select multiple>`, provides its accessible name

## When to Use

- Use when a multiple-choice select needs an adjacent label, count, or action.
- Use for filter bars where the control sits with related buttons.
- Use when you want the native control but a stable wrapper element for layout.

## When Not to Use

- Do not use without extras -- use `multi-select`.
- Do not use for a single choice -- use `select-with-extras`.
- Do not use when users must search -- use `combobox`.

## Headless

This headless component renders a `<div>` wrapper and a native `<select multiple>`. The consumer decides layout and all appearance of the adornments.

## Styles

The consumer provides all CSS styling via the `.multi-select-with-extras` class on the wrapper.

## Testing

- Verify wrapper `<div>` with class `multi-select-with-extras` containing a `<select multiple>`
- Verify `aria-label` is on the select, not the wrapper
- Verify `before` and `after` render around the select in order
- Verify array `value` selects options
- Verify `size`, `required`, `disabled` reach the select
- Verify rest props land on the wrapper

## Advice

- **Designers**: Place extras so the control keeps a clear programmatic and visual label.
- **Developers**: Anything in `before`/`after` that acts as a label should be associated explicitly or the `label` prop kept as the accessible name.

## Related components

- `multi-select` — the control alone
- `select-with-extras` — single-choice equivalent
- `checkbox-group` — visible checkboxes

## References

- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

---

Lily™ and Lily Design System™ are trademarks.
