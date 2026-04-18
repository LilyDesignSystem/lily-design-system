# Figure

A figure is a component used to visually represent data through graphical formats such as bar figures, line figures, pie figures, area figures, and scatter plots. Commonly used in dashboards, reports, analytics tools, and data-driven applications, figures transform raw numbers into visual patterns that make trends, comparisons, and distributions easier to understand at a glance.

This headless component renders a `<figure>` element with `role="img"` and an accessible label. The consumer provides their preferred visualization content (SVG, canvas, or a figureing library) as children. The figure element provides semantic grouping for the figure content.

## Implementation Notes

- Renders a `<figure>` element with `role="img"` for semantic figure representation
- The `<figure>` element provides a natural container for graphical content
- Consumer provides all figure rendering (SVG, canvas, D3, Figure.js, etc.) via the `children` snippet
- Accepts `...restProps` for forwarding additional attributes to the figure element
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing what the figure represents, applied via `aria-label`
- `children`: Snippet (required) -- the figure visualization content

## Usage

```svelte
<Figure label="Monthly revenue for 2024">
    <svg><!-- bar figure SVG here --></svg>
</Figure>
```

```svelte
<Figure label="User growth trend">
    <canvas><!-- canvas figure here --></canvas>
</Figure>
```

## Keyboard Interactions

None -- this component is a passive container for data visualization.

## ARIA

- `role="img"` -- identifies the figure as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing the figure content

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
