# GraphicBlock

A wrapper for charts and graphics that pairs the visual (default slot) with structural metadata: title, description, and notes/source. Renders a `<figure role="img">` with `aria-label`.

## Props

- `label`: string (required) — accessible label describing the graphic
- `title`: string (optional) — title displayed above the graphic
- `description`: string (optional) — description text below the title
- `notes`: string (optional) — notes/source text below the graphic

When any of `title` / `description` / `notes` is provided they are rendered together inside a single `<figcaption>`.

## Slots

- default — the graphic / chart content

## Usage

```vue
<GraphicBlock
  label="Quarterly sales 2026"
  title="Sales rebounded in Q3"
  description="Year-over-year growth across all regions"
  notes="Source: Internal sales reports, 2026"
>
  <BarChart label="Q3 sales" :categories="data" />
</GraphicBlock>
```

## References

- HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
