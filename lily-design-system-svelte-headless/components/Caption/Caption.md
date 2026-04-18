# Caption

A caption component provides supplementary text or explanations alongside images, videos, charts, or other media within an interface. It uses the semantic `<figcaption>` HTML element, which provides an implicit association with a parent `<figure>` element. Captions are commonly used in galleries, product pages, data visualizations, and educational content to clarify or add context to visual elements.

This headless component lets consumers control all visual presentation while ensuring correct semantic structure and accessibility for captioned media.

## Implementation Notes

- Renders as a semantic `<figcaption>` element
- Designed for use within a `<figure>` parent element for proper semantic association
- Can be referenced via `id` and `aria-describedby` from other elements
- Uses Svelte 5 `Snippet` for children content
- Spreads `...restProps` on the root `<figcaption>` element for consumer customization

## Props

- `children`: Snippet (required) -- the caption text or content to display

## Usage

```svelte
<Caption>Photo of a sunset over the ocean.</Caption>
<Caption id="chart-caption">Figure 1: Revenue growth over time.</Caption>
```

## Keyboard Interactions

None -- this component is a passive container for descriptive text.

## ARIA

- Implicit semantics from `<figcaption>` -- automatically associated with its parent `<figure>` element, providing an accessible caption without additional ARIA attributes
