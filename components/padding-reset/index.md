# Padding Reset

A container that resets padding inside fluid-width containers. PaddingReset uses negative margins to counteract parent padding, allowing content to extend edge-to-edge.

This headless component uses a `<div>` element as a presentational container with no ARIA semantics.

## Implementation Notes

- Resets horizontal padding when content needs to break out of a padded container
- Useful inside fluid-width ContentBlock elements
- Uses negative margins to counteract parent padding
- Inspired by Reuters Graphics PaddingReset component

## Props

- `children`: slot (required) -- content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ContentBlock width="fluid">
  <PaddingReset>
    <img src="full-bleed.jpg" alt="Full bleed image" />
  </PaddingReset>
</ContentBlock>
```

```html
<ArticleLayout>
  <ContentBlock width="fluid">
    <PaddingReset>
      <video src="hero-video.mp4" autoplay muted loop>
        Your browser does not support the video tag.
      </video>
    </PaddingReset>
  </ContentBlock>
</ArticleLayout>
```

## Keyboard Interactions

- None

## ARIA

- None -- presentational container

## When to Use

- Use inside fluid ContentBlock when content needs to extend edge-to-edge
- Use for full-bleed images, videos, or backgrounds within padded containers
- Use when you need to counteract inherited padding for specific content

## When Not to Use

- Do not use outside fluid containers
- Do not use when the parent container has no padding to reset
- Do not use as a general-purpose layout reset

## Headless

This component provides a `<div>` element for padding reset, with zero visual styling. The consumer is responsible for all CSS including negative margins, overflow handling, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.padding-reset` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `padding-reset`
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use PaddingReset sparingly for full-bleed content like hero images, maps, or edge-to-edge data visualizations.
- **Developers**: Set negative margins in your CSS to match the parent container's padding. Ensure overflow is handled correctly to prevent horizontal scrollbars.

## Related components

- `container` — a generic block-level content container

## References

- Reuters Graphics PaddingReset component
- Documentation: index.md
- CSS class: .padding-reset in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/padding-reset.html
