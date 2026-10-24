# ConvertIntoUnitDiv

The unit to convert into, such as a select box of currencies or lengths.

**Status:** beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows.

The unit to convert into: a plain wrapper for the consumer's own control, typically a labelled select box. The component decides no layout, performs no arithmetic, fetches no rates and carries no strings of its own.

## Implementation Notes

- Root element: `<div>` with the base class `convert-into-unit-div` first, then the consumer class
- Nothing else: no role, no `aria-label`, because a role-less `<div>` is not allowed an accessible name
- `restProps` spread onto the root; no internal state

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `children` | slot | — | The content |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<ConvertDiv label="Currency converter">
  <ConvertFromDiv>
    <ConvertFromValueDiv>
      <label for="from-value">Amount</label>
      <input id="from-value" type="text" inputmode="decimal" value="100" />
    </ConvertFromValueDiv>
    <ConvertFromUnitDiv>
      <label for="from-unit">From</label>
      <select id="from-unit"><option value="USD">US dollars</option><option value="EUR">Euros</option></select>
    </ConvertFromUnitDiv>
  </ConvertFromDiv>
  <ConvertIntoDiv>
    <ConvertIntoValueDiv>
      <label for="into-value">Converted</label>
      <input id="into-value" type="text" inputmode="decimal" value="92.10" readonly />
    </ConvertIntoValueDiv>
    <ConvertIntoUnitDiv>
      <label for="into-unit">Into</label>
      <select id="into-unit"><option value="EUR">Euros</option><option value="USD">US dollars</option></select>
    </ConvertIntoUnitDiv>
  </ConvertIntoDiv>
</ConvertDiv>
```

## Keyboard Interactions

- None of its own; Tab moves through the consumer's controls in source order

## ARIA

- No ARIA attributes of its own; the consumer's label and control inside it carry the name

## When to Use

- Giving CSS a stable hook for this part of a converter
- Keeping the label and control of this part together as one layout box

## When Not to Use

- Use `ConvertDiv` — for the whole converter, it carries the group role and name
- Use `Field` — for a single standalone form control outside a converter

## Headless

This component decides semantics only. It decides no layout (side by side, stacked, an arrow or equals sign between the sides), no colour, no number formatting and no motion.

## Styles

Target `.convert-into-unit-div`. No default styles are included.

## Testing

- Renders `<div>` with the base class `convert-into-unit-div` and appends the consumer class
- Has no `role` and no `aria-label`
- Children render; rest props reach the root

## Advice

Conversion belongs to the consumer: keep the rates, rounding and `Intl.NumberFormat` formatting in your own code, and give the converted value a live-region or `<output>` if it should be announced when it changes. Format and parse numbers with the user's locale; accept the decimal separator the locale uses.

## Related components

- `convert-into-div`
- `convert-from-unit-div`
- `select`

## References

- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
- [MDN `<output>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)

---

Lily™ and Lily Design System™ are trademarks.
