# Statistic

A statistic is a numeric value display with title, optional prefix, and
optional suffix. It groups the components into a single landmark with
`role="group"` and a synthesized `aria-label`.

Use it for dashboards, KPIs, summary cards, and any place a single
prominent number must be paired with a short label.

## Implementation Notes

- Renders a `<div class="statistic" role="group">` container
- `title` is **required** and renders in `<div class="statistic-title">`
- `value` is **required** and renders inside `<div class="statistic-value">`
- Optional `prefix` slot renders in `<span class="statistic-prefix">`
- Optional `suffix` slot renders in `<span class="statistic-suffix">`
- `aria-label` defaults to `"{title}: {value}"` and may be overridden via the `label` prop
- Consumer formats numeric values before passing them as `value`

## Props

- `title`: string (**required**) -- statistic label/heading
- `value`: string (**required**) -- pre-formatted value text
- `prefix`: slot (optional) -- element before the value (e.g., currency symbol)
- `suffix`: slot (optional) -- element after the value (e.g., unit or %)
- `label`: string (optional) -- aria-label override
- `...restProps`: any additional HTML attributes

## Usage

```html
<Statistic title="Active users" value="12,345" suffix="users" />
```

```html
<Statistic title="Revenue" value="2,400" prefix="$" suffix="K" />
```

```html
<Statistic
  title="Conversion"
  value="4.2"
  suffix="%"
  label="Conversion rate is 4.2 percent"
/>
```

## Keyboard Interactions

- None — passive display element.

## ARIA

- `role="group"` groups the title and value into a single labeled region
- `aria-label` provides the spoken summary, defaulting to `"{title}: {value}"`

## When to Use

- Use to highlight a single number with a label, especially on dashboards or summary cards.
- Use with prefix or suffix for currency, units, or percentages.

## When Not to Use

- Do not use for tabular data — use DataTable.
- Do not use for free-form text content — use BodyText.
- Do not use when the value needs to update with live screen-reader announcements — use a status region.

## Headless

Renders semantic group markup with no styling. Consumer formats the
value, sizes the type, and chooses any visual emphasis.

## Styles

Consumer CSS targets `statistic`, `statistic-title`, `statistic-value`,
`statistic-prefix`, and `statistic-suffix`. Use larger type and stronger
weight for the value than the title.

## Testing

- Verify the component renders a `<div>` element with class `statistic`
- Verify `role="group"` is set
- Verify `aria-label` defaults to `"{title}: {value}"` when `label` is not provided
- Verify `aria-label` equals the `label` prop when provided
- Verify the title renders inside `<div class="statistic-title">`
- Verify the value renders inside `<div class="statistic-value">`
- Verify the prefix renders inside `<span class="statistic-prefix">` only when provided
- Verify the suffix renders inside `<span class="statistic-suffix">` only when provided

## Advice

- **Designers**: Keep titles short and values pre-formatted. Use suffix/prefix for units rather than embedding them in `value`.
- **Developers**: Format numbers in the consumer (locale, separators, decimals) before passing as the `value` prop.

## Related components

- `meter` — a gauge displaying a scalar value within a known range
- `sparkline` — a small inline chart showing a data trend

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- Ant Design Statistic: https://ant.design/components/statistic

---

Lily™ and Lily Design System™ are trademarks.
