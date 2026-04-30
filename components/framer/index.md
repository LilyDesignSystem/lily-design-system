# Framer

A container for framed content display with a decorative border, used to visually frame screenshots, artwork, or embedded content.

This headless component uses a `<div>` element with an optional `aria-label` for semantic framing of visual content.

## Implementation Notes

- Uses `<div>` element as a frame container
- Supports optional `aria-label` when the frame has semantic meaning
- Consumer provides frame styling (border, shadow, background)
- Can be used for screenshots, artwork, embedded content

## Props

- `label`: string (optional) -- accessible label for the framed content
- `children`: slot (required) -- framed content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Framer label="Screenshot of the application dashboard">
  <img src="screenshot.png" alt="Dashboard showing metrics" />
</Framer>
```

```html
<Framer label="Artwork: Sunset over the mountains">
  <img src="painting.jpg" alt="Oil painting of a sunset over a mountain range" />
</Framer>
```

```html
<Framer>
  <iframe src="https://example.com/embed" title="Interactive demo"></iframe>
</Framer>
```

## Keyboard Interactions

- None -- presentational wrapper; interactive children handle their own keyboard interactions

## ARIA

- Optional `aria-label` when frame has semantic meaning; otherwise presentational
- When `label` is provided, the container is labeled for assistive technology

## When to Use

- Use to visually frame screenshots, artwork, or embedded content
- Use to provide a consistent decorative border around visual media
- Use to group and visually distinguish embedded or quoted visual content from surrounding page content

## When Not to Use

- Do not use for photos with captions -- use Figure
- Do not use as a generic card -- use Card
- Do not use for layout containers -- use Panel or other layout components

## Headless

This component provides a `<div>` element with an optional `aria-label` for framing content, with zero visual styling. The consumer is responsible for all CSS including borders, shadows, padding, background color, and responsive sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.framer` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `framer`
- Verify `aria-label` is applied when `label` prop is provided
- Verify `aria-label` is omitted when `label` prop is not provided
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Design frame styles that complement the content without distracting from it. Consider using subtle borders and shadows. Ensure frame styling works well at different viewport sizes.
- **Developers**: Only provide a `label` prop when the frame adds semantic meaning beyond decoration. For purely decorative frames, omit the label to avoid unnecessary verbosity for screen reader users. Ensure framed images have their own `alt` text.

## Related components

- `card` — a grouped content container with header, body, and footer areas
- `panel` — a generic content panel with optional heading
- `aspect-ratio-container` — a container that maintains a fixed aspect ratio

## References

- [Reuters Graphics Framer component](https://github.com/reuters-graphics/graphics-components)
