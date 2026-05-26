# Input Group

An input group wraps a form input together with optional prefix and suffix
addons (icons, units, currency symbols, action buttons) inside a single
ARIA group so that they are perceived and announced as one composite control.

Use it for currency fields with leading symbols, search fields with trailing
icon buttons, percentage fields with trailing units, and any input where
contextual addons clarify the value.

## Implementation Notes

- Renders a `<div>` with `role="group"` and `class="input-group"`
- Optional prefix renders inside `<span class="input-group-prefix">`
- Optional suffix renders inside `<span class="input-group-suffix">`
- Children (the actual input) sit between the prefix and suffix
- `aria-label` is rendered when the `label` prop is provided
- Does not modify the inner input — the consumer is responsible for label association on the input itself

## Props

- `label`: string (optional) -- aria-label for the group
- `prefix`: slot (optional) -- content rendered before the input
- `suffix`: slot (optional) -- content rendered after the input
- `children`: slot -- the input the consumer places inside
- `...restProps`: any additional HTML attributes

## Usage

Currency input with leading symbol:

```html
<InputGroup label="Amount">
  <span slot="prefix">$</span>
  <TextInput label="Amount" value={amount} onChange={setAmount} />
</InputGroup>
```

Search input with trailing icon button:

```html
<InputGroup label="Search">
  <SearchInput label="Search" value={query} onChange={setQuery} />
  <IconButton slot="suffix" label="Submit search" onclick={submit}>
    🔍
  </IconButton>
</InputGroup>
```

Percentage input with trailing unit:

```html
<InputGroup label="Discount">
  <NumberInput label="Discount" value={discount} onChange={setDiscount} />
  <span slot="suffix">%</span>
</InputGroup>
```

## Keyboard Interactions

- The wrapped input retains its native keyboard behavior.
- Focusable controls inside `prefix` / `suffix` slots (e.g., IconButton) follow their own keyboard behavior.

## ARIA

- `role="group"` on the wrapping `<div>` so assistive technology treats the addons and input as one unit
- `aria-label` rendered when `label` is provided
- The inner input still requires its own accessible name (label, aria-label, or aria-labelledby)

## When to Use

- Use to attach a prefix or suffix addon to a form input.
- Use for currency, percentage, and unit inputs.
- Use for search inputs with trailing action buttons.

## When Not to Use

- Do not use as a generic form layout (use Field for label/input/error composition).
- Do not omit a label on the inner input — the group's aria-label does not replace the input's accessible name.

## Headless

Provides only the structural wrapper, the prefix and suffix slot containers,
and the ARIA group semantics. Visual treatment such as connected borders,
addon backgrounds, and focus styling is entirely consumer-supplied.

## Styles

Consumer CSS targets `.input-group`, `.input-group-prefix`, and
`.input-group-suffix` to apply visual treatment such as shared borders,
addon backgrounds, and connected radii.

## Testing

- Verify the component renders a `<div>` element with class `input-group` and `role="group"`
- Verify `aria-label` is rendered when the `label` prop is provided
- Verify the prefix renders inside `<span class="input-group-prefix">` when provided
- Verify the suffix renders inside `<span class="input-group-suffix">` when provided
- Verify children render between prefix and suffix
- Verify focus order is prefix → input → suffix

## Advice

- **Designers**: Use prefix and suffix addons sparingly — overusing them clutters forms. Reserve them for unit symbols, currency markers, and trailing action buttons.
- **Developers**: Continue to apply a label on the inner input itself (via `<label>`, `aria-label`, or `aria-labelledby`); the group's `label` prop names the composite control, not the input.

## Related components

- `input` — a generic HTML input element
- `field` — a form field wrapper with label, input, and error message
- `form` — a form element for collecting and submitting user data

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
