# Graphic Block

A graphic block is a wrapper for charts and graphics with title, description, notes, and ARIA description. Use it to provide semantic structure and accessible labeling around data visualizations, maps, and interactive graphics.

This headless component uses a `<figure>` element with `<figcaption>` to create a semantic graphic wrapper with visible captions and an `aria-label` for screen reader accessibility.

## Implementation Notes

- Uses `<figure>` element for semantic graphic wrapper
- Title and description appear above the graphic content inside `<figcaption>`
- Notes/source text appears below the graphic content inside `<figcaption>`
- `aria-label` provides a full text alternative describing the graphic for screen readers
- Consumer controls all visual presentation via CSS
- Inspired by Reuters Graphics GraphicBlock component

## Props

- `title`: string (optional) -- title displayed above the graphic
- `description`: string (optional) -- description text below the title
- `notes`: string (optional) -- notes/source text below the graphic
- `label`: string (required) -- accessible label describing the graphic for screen readers
- `children`: slot (required) -- the graphic/chart content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<GraphicBlock
  title="Global Temperature Anomaly"
  description="Average land-ocean temperature index, 1880-2025"
  notes="Source: NASA GISS"
  label="Line chart showing global temperature anomaly rising from -0.2°C in 1880 to +1.2°C in 2025"
>
  <canvas id="temperature-chart"></canvas>
</GraphicBlock>
```

```html
<GraphicBlock
  title="Population by Region"
  label="Bar chart showing population distribution across six world regions"
>
  <div id="population-chart"></div>
</GraphicBlock>
```

```html
<GraphicBlock
  title="Hospital Bed Occupancy"
  description="Daily occupancy rates for Q1 2026"
  notes="Source: NHS England"
  label="Area chart showing hospital bed occupancy rising from 82% in January to 94% in March 2026"
>
  <svg id="occupancy-chart"></svg>
</GraphicBlock>
```

## Keyboard Interactions

- None at the figure level -- interactive children handle their own keyboard interactions

## ARIA

- Implicit `figure` role from `<figure>` element
- `aria-label` -- provides a full text alternative describing the graphic for screen readers
- `<figcaption>` -- provides visible caption text for the graphic

## When to Use

- Use as a wrapper for data visualizations, charts, maps, and interactive graphics
- Use when a graphic needs a title, description, and source attribution
- Use to provide accessible labeling for visual content that cannot be understood from alt text alone

## When Not to Use

- Do not use for photos -- use FeaturePhoto
- Do not use for video -- use VideoPlayer
- Do not use for decorative images -- use plain `<img>` with empty alt

## Headless

This component provides a `<figure>` element with `aria-label` and `<figcaption>` for semantic structure, with zero visual styling. The consumer is responsible for all CSS including layout, spacing, typography, background, and responsive sizing of the graphic container.

## Styles

The consumer provides all CSS styling. The component renders with a `.graphic-block` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<figure>` element with class `graphic-block`
- Verify `aria-label` is applied to the `<figure>` element
- Verify title, description, and notes render inside `<figcaption>` when provided
- Verify child content slot is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep titles concise and descriptive. Place source attribution in the notes area. Ensure sufficient contrast between graphic content and background.
- **Developers**: Always provide a descriptive `label` prop that conveys the key insight or data trend shown in the graphic. The label should describe what the graphic shows, not just its type.

## Related components

- `figure` — a self-contained figure with optional caption

## References

- Reuters Graphics GraphicBlock component
- [HTML figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [HTML figcaption element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption)
