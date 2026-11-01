# Uruguay Cedula De Identidad View

UruguayCedulaDeIdentidadView is a headless read-only display of Uruguay's Cedula de Identidad Number, Uruguay's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to UruguayCedulaDeIdentidadInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
- Provides accessible name via the `label` prop
- Companion to UruguayCedulaDeIdentidadInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Cedula de Identidad Number">
    <UruguayCedulaDeIdentidadView
      label="Cedula de Identidad Number"
      value="{value}"
    />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Uruguay Cedula de Identidad Number read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `uruguay-cedula-de-identidad-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.uruguay-cedula-de-identidad-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).

**Where to find it:** Printed on the Cédula de Identidad issued by the Dirección Nacional de Identificación Civil, and asked for by health providers (ASSE and mutualistas), banks and government services.

## Related components

- `uruguay-cedula-de-identidad-input` — an input for entering Uruguay's Cedula de Identidad Number
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)

---

Lily™ and Lily Design System™ are trademarks.
