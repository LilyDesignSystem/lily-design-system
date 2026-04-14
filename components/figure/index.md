# Figure

A figure is a component used to visually represent data through graphical formats such as bar figures, line figures, pie figures, area figures, and scatter plots. Commonly used in dashboards, reports, analytics tools, and data-driven applications, figures transform raw numbers into visual patterns that make trends, comparisons, and distributions easier to understand at a glance.

This headless component renders a `<figure>` element with `role="img"` and an accessible label. The consumer provides their preferred visualization content (SVG, canvas, or a figureing library) as children. The figure element provides semantic grouping for the figure content.

## Implementation Notes

- Renders a `<figure>` element with `role="img"` for semantic figure representation
- The `<figure>` element provides a natural container for graphical content
- Consumer provides all figure rendering (SVG, canvas, D3, Figure.js, etc.) via the `children` slot
- Accepts `...restProps` for forwarding additional attributes to the figure element
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing what the figure represents, applied via `aria-label`
- `children`: slot (required) -- the figure visualization content

## Usage

Figure with an SVG chart:

```html
<Figure label="Monthly revenue for 2024">
  <svg><!-- bar chart SVG here --></svg>
</Figure>
```

Figure with a canvas visualization:

```html
<Figure label="User growth trend">
  <canvas><!-- canvas chart here --></canvas>
</Figure>
```

Figure with an image and a visible caption:

```html
<Figure label="System architecture diagram">
  <Image src="architecture.png" alt="System architecture showing frontend, API, and database layers" />
  <Caption>Figure 1: High-level system architecture for the patient portal.</Caption>
</Figure>
```

Figure with a code example:

```html
<Figure label="Example HTML form structure">
  <CodeBlock language="html">
    &lt;form&gt;
      &lt;label for="name"&gt;Name&lt;/label&gt;
      &lt;input type="text" id="name" /&gt;
    &lt;/form&gt;
  </CodeBlock>
  <Caption>Figure 2: Basic form with a labelled text input.</Caption>
</Figure>
```

## Keyboard Interactions

None -- this component is a passive container for data visualization.

## ARIA

- `role="img"` -- identifies the figure as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing the figure content

## When to Use

- Use to wrap self-contained graphical content such as charts, diagrams, illustrations, or data visualizations with an accessible label.
- Use when the graphical content needs semantic grouping and a descriptive name for screen readers.
- Use when the content can be referenced from the main flow, such as "see Figure 1".
- Use with a Caption child element when a visible caption is needed alongside the figure.

## When Not to Use

- Do not use for decorative images without captions -- use Image alone instead.
- Do not use for inline images that are part of the text flow -- use Image instead.
- Do not use for tabular data -- use DataTable instead.

## Headless

This headless component provides a `<figure>` element with `role="img"` and `aria-label` for accessible identification of graphical content. It serves as a semantic container. The consumer provides all visualization content (SVG, canvas, charting libraries) and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.figure` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<figure>` element with class `figure`
- Verify role="img"` -- identifies the figure as a graphical image to assistive technologies
- Verify aria-label={label}` -- provides an accessible name describing the figure content
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a visible caption or title near the figure so sighted users understand what it represents. Ensure the figure has sufficient contrast and is not the sole means of conveying critical data.
- **Developers**: Write a descriptive `label` that summarizes the figure's content and purpose, not just a generic title. For complex charts, consider providing a data table as an alternative.

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
