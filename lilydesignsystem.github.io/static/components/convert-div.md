# ConvertDiv

A group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.

**Status:** beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows.

The root of a converter: a labelled group holding a `ConvertFromDiv` (the value and unit to convert from) and a `ConvertIntoDiv` (the value and unit to convert into). The consumer does the arithmetic and supplies any rates. The component decides no layout, performs no arithmetic, fetches no rates and carries no strings of its own.

## Implementation Notes

- Root element: `<div role="group">` with the base class `convert-div` first, then the consumer class
- `label` is required: a group without a name is not announced usefully
- `restProps` spread onto the root; no internal state

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string | — (required) | Accessible name of the group, set as `aria-label` |
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

- `role="group"` with `aria-label` from `label`; the label names the whole converter, for example "Currency converter"

## When to Use

- A converter between two units of one kind: currency, length, mass, temperature, time zone
- A calculator-style form where one value is derived from another
- Anywhere the pair of value-and-unit controls must be announced as one group

## When Not to Use

- Use `Form` + `Field` — for ordinary input with no derived value
- Use `MeasurementInstanceInput` — for one measurement with its unit, nothing to convert into
- Use `Select` — for choosing a unit without any converted value

## Headless

This component decides semantics only. It decides no layout (side by side, stacked, an arrow or equals sign between the sides), no colour, no number formatting and no motion.

## Styles

Target `.convert-div`. No default styles are included.

## Testing

- Renders `<div>` with the base class `convert-div` and appends the consumer class
- `label` becomes `aria-label` and the root has `role="group"`
- Children render; rest props reach the root

## Advice

Conversion belongs to the consumer: keep the rates, rounding and `Intl.NumberFormat` formatting in your own code, and give the converted value a live-region or `<output>` if it should be announced when it changes. Format and parse numbers with the user's locale; accept the decimal separator the locale uses.

## Related components

- `convert-from-div`
- `convert-into-div`
- `form`
- `field`

## References

- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
- [MDN `<output>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)

---

Lily™ and Lily Design System™ are trademarks.
