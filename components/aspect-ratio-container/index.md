# Aspect Ratio Container

An aspect ratio component is a layout utility that constrains its content to a specific width-to-height ratio. It ensures that images, videos, maps, and other embedded content maintain consistent proportions regardless of the container size. Common aspect ratios include 16:9 (widescreen video), 4:3 (traditional display), 1:1 (square, often for avatars or thumbnails), and 21:9 (ultrawide).

This component sets the CSS `aspect-ratio` property on a wrapper `<div>` element via an inline style, allowing consumers to control sizing through their own stylesheets while the component guarantees the proportional constraint.

## Implementation Notes

- Pure layout utility -- no ARIA role needed
- Uses inline `aspect-ratio` CSS property
- `data-aspect-ratio` attribute exposed for consumer CSS selectors
- Ratio prop is a number (width/height), e.g., `16/9` evaluates to `1.777...`
- Content is provided through child elements

## Props

- `ratio`: number (default: 1) -- aspect ratio as width/height
- `children`: slot (required) -- content to display within the container
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Usage

Widescreen video container:

```html
<AspectRatioContainer ratio={16/9}>
  <video src="video.mp4" controls></video>
</AspectRatioContainer>
```

Square avatar container:

```html
<AspectRatioContainer ratio={1}>
  <img src="avatar.jpg" alt="User avatar" style="object-fit: cover; width: 100%; height: 100%;" />
</AspectRatioContainer>
```

Embedded map with a 4:3 ratio:

```html
<AspectRatioContainer ratio={4/3}>
  <iframe src="https://maps.example.com/embed?q=London" title="Map of London"></iframe>
</AspectRatioContainer>
```

Thumbnail grid with consistent proportions:

```html
<div class="thumbnail-grid">
  <AspectRatioContainer ratio={3/2}>
    <Image src="photo-1.jpg" alt="Beach at sunrise" />
  </AspectRatioContainer>
  <AspectRatioContainer ratio={3/2}>
    <Image src="photo-2.jpg" alt="Mountain landscape" />
  </AspectRatioContainer>
  <AspectRatioContainer ratio={3/2}>
    <Image src="photo-3.jpg" alt="City skyline at night" />
  </AspectRatioContainer>
</div>
```

## Keyboard Interactions

- None -- this component is a passive layout container

## ARIA

- None -- transparent layout container; content within maintains its own accessibility semantics

## When to Use

- Use for constraining images, videos, maps, or embedded content to a consistent aspect ratio regardless of viewport size.
- Use when you need responsive media containers that maintain proportional dimensions, such as 16:9 for video or 1:1 for avatars.
- Use for thumbnail grids where all items must have uniform dimensions.
- Use for embedded maps, iframes, or third-party widgets that need a fixed proportion.

## When Not to Use

- Do not use for text-only content where natural height should determine the layout.
- Do not use when native image sizing is sufficient -- use Image with intrinsic dimensions instead.
- Do not use for flexible containers that should adapt height to their content.

## Headless

This component provides a `<div>` wrapper with the CSS `aspect-ratio` property set via inline style and a `data-aspect-ratio` attribute for consumer selectors, with zero visual styling. The consumer is responsible for all CSS including overflow behavior, border radius, background, and how child content fills or fits within the container.


## Styles

The consumer provides all CSS styling. The component renders with a `.aspect-ratio-container` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `aspect-ratio-container`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Choose standard aspect ratios (16:9, 4:3, 1:1, 21:9) for consistency across the interface. Ensure fallback behavior for content that cannot fill the container.
- **Developers**: Use `ratio={16/9}` as a JavaScript expression rather than a string. Ensure child content uses `object-fit` or similar CSS to handle how it fills the container.
