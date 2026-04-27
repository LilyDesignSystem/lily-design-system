# Statistic

A numeric value display with title, prefix, and suffix. Renders a `role="group"` container with a title and a composed value.

## Implementation Notes

- Headless: no CSS, no styles
- `title` and `value` are **required** and non-optional in the TypeScript interface
- Number formatting is the consumer's responsibility — pass a pre-formatted string
- Default `aria-label` is `"{title}: {value}"`, overridable via `label`

## Props

- `title`: string (**required**) — label/heading
- `value`: string (**required**) — pre-formatted value text
- `label`: string — aria-label override
- `prefix` slot — element rendered before the value
- `suffix` slot — element rendered after the value
- `...$attrs` — additional HTML attributes

## Usage

```vue
<Statistic title="Active users" value="12,345" />

<Statistic title="Revenue" value="1,234.56">
    <template #prefix>$</template>
</Statistic>

<Statistic title="Conversion" value="42">
    <template #suffix>%</template>
</Statistic>
```

## ARIA

- `role="group"`
- `aria-label` defaults to `"{title}: {value}"` so screen readers announce the statistic as a single unit

## When to Use

- Dashboard tiles, KPIs, summary cards

## When Not to Use

- Rich progress visualizations — use `Progress`, `Meter`, or `Sparkline`

## Headless

The component renders semantic HTML and exposes named slots for prefix/suffix. Consumers supply text and all visual styling.

## Testing

- Verify the root `statistic` class and `role="group"`
- Verify default and custom `aria-label`
- Verify title and value rendering
- Verify prefix/suffix slots render only when supplied

## References

- [Ant Design Statistic](https://ant.design/components/statistic)
