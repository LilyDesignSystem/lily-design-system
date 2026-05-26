# Sparkline

A sparkline is a compact, minimalist component used to represent trends or variations in data within a small, simple graph, typically embedded within text or tables. Unlike full-scale charts, sparklines display data as tiny, unadorned line, bar, or win/loss charts, offering a quick at-a-glance view of patterns such as fluctuations in sales, stock prices, or performance over time.

This headless component provides a semantic container with `role="img"` and an accessible label. The consumer is responsible for providing the actual SVG, canvas, or other visualization content as children.

## Implementation Notes

- Renders a `<div>` with `role="img"` to semantically represent a graphical image
- Consumer provides all chart rendering (SVG, canvas, etc.) via the `children` slot
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state or effects -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing the sparkline data, applied via `aria-label`
- `children`: slot (required) -- the visualization content to render inside the container

## Usage

```html
<Sparkline label="Sales trend over past 7 days">
    <svg><!-- your sparkline SVG here --></svg>
</Sparkline>
```

## Keyboard Interactions

None -- this component is a passive container for data visualization.

## ARIA

- `role="img"` -- identifies the container as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing what the sparkline represents

## When to Use

- Use to display compact data trends inline within text, tables, or dashboards where a full chart would be too large.
- Use when a quick at-a-glance visual of data patterns (e.g., sales trends, stock movement, performance over time) is more useful than raw numbers.
- Avoid when users need to interact with or drill into the data; use a full chart or graph component instead.
- Consider providing the underlying data in a table or tooltip for accessibility.

## When Not to Use

- Do not use when users must interact with or drill into the data — use a full chart (`LineChart`, `BarChart`, `AreaChart`).
- Do not use when precise numeric values matter — pair the trend with a `Statistic` or include the values in a table or tooltip.
- Do not use as a single point reading of a value within a range — use `Meter` instead.
- Do not use when the chart needs axes, gridlines, or legends — that contradicts the inline-trend purpose of a sparkline.

## Headless

This headless component provides a semantic container with `role="img"` and `aria-label` to identify the visualization for assistive technologies. The consumer provides the actual chart rendering (SVG, canvas, or a charting library) as children, along with all visual styling, dimensions, and colors.


## Styles

The consumer provides all CSS styling. The component renders with a `.sparkline` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `sparkline`
- Verify role="img"` -- identifies the container as a graphical image to assistive technologies
- Verify aria-label={label}` -- provides an accessible name describing what the sparkline represents
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep sparklines small and unadorned -- omit axes, labels, and gridlines to maintain their compact nature. Use a consistent color and line weight across all sparklines in the same context.
- **Developers**: Write a descriptive `label` that conveys the data trend (e.g., "Sales up 12% over 7 days") rather than just a title. Ensure the SVG or canvas has appropriate dimensions and does not cause layout shift.

## Related components

- `statistic` — a numeric value display with title, prefix, and suffix
- `line-chart` — a line chart visualization connecting data points to display data
- `meter` — a gauge displaying a scalar value within a known range

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
