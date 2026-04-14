# Caption

A caption component provides supplementary text or explanations alongside images, videos, charts, or other media within an interface. It uses the semantic `<figcaption>` HTML element, which provides an implicit association with a parent `<figure>` element. Captions are commonly used in galleries, product pages, data visualizations, and educational content to clarify or add context to visual elements.

This headless component lets consumers control all visual presentation while ensuring correct semantic structure and accessibility for captioned media.

## Implementation Notes

- Renders as a semantic `<figcaption>` element
- Designed for use within a `<figure>` parent element for proper semantic association
- Can be referenced via `id` and `aria-describedby` from other elements
- Uses `slot` for children content
- Spreads `...restProps` on the root `<figcaption>` element for consumer customization

## Props

- `children`: slot (required) -- the caption text or content to display

## Usage

Caption inside a figure with an image:

```html
<Figure label="Sunset photograph">
  <Image src="sunset.jpg" alt="Sunset over the ocean with orange and purple sky" />
  <Caption>Photo of a sunset over the ocean.</Caption>
</Figure>
```

Caption with a numbered figure reference:

```html
<Figure label="Revenue growth chart">
  <svg><!-- chart SVG --></svg>
  <Caption id="chart-caption">Figure 1: Revenue growth over time, 2023-2025.</Caption>
</Figure>
```

Caption inside a figure with a data table:

```html
<Figure label="Patient demographics summary">
  <DataTable label="Patient demographics">
    <DataTableHead>
      <DataTableRow><DataTableCol>Age Group</DataTableCol><DataTableCol>Count</DataTableCol></DataTableRow>
    </DataTableHead>
    <DataTableBody>
      <DataTableRow><DataTableData>18-30</DataTableData><DataTableData>142</DataTableData></DataTableRow>
      <DataTableRow><DataTableData>31-50</DataTableData><DataTableData>287</DataTableData></DataTableRow>
    </DataTableBody>
  </DataTable>
  <Caption>Table 1: Patient demographics by age group.</Caption>
</Figure>
```

## Keyboard Interactions

None -- this component is a passive container for descriptive text.

## ARIA

- Implicit semantics from `<figcaption>` -- automatically associated with its parent `<figure>` element, providing an accessible caption without additional ARIA attributes

## When to Use

- Use inside a Figure element to provide a descriptive caption for images, videos, charts, or other media.
- Use to explain what the figure or table shows, such as "Figure 1: Revenue by quarter".
- Use when you need a semantic association between media content and its explanatory text.

## When Not to Use

- Do not use outside a Figure or Table element -- the semantic association requires a parent container.
- Do not use for headings -- use heading elements (`<h1>` through `<h6>`) instead.
- Do not use for standalone descriptive text -- use a paragraph element instead.

## Headless

This component provides a semantic `<figcaption>` element with automatic `<figure>` association and zero visual styling. The consumer is responsible for all CSS including font size, font style (e.g., italic), color, alignment, spacing relative to the media, and any border or background treatment.


## Styles

The consumer provides all CSS styling. The component renders with a `.caption` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<caption>` element with class `caption`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place captions directly below the media element. Use a smaller font size and muted color to establish visual hierarchy. Keep captions concise.
- **Developers**: Always place this component inside a `<figure>` element for proper semantic association. Use the `id` attribute if you need to reference the caption via `aria-describedby` from other elements.
