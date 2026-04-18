# AspectRatioContainer

An aspect ratio component is a layout utility that constrains its content to a specific width-to-height ratio. It ensures that images, videos, maps, and other embedded content maintain consistent proportions regardless of the container size. Common aspect ratios include 16:9 (widescreen video), 4:3 (traditional display), 1:1 (square, often for avatars or thumbnails), and 21:9 (ultrawide).

This component sets the CSS `aspect-ratio-container` property on a wrapper `<div>` element via the Svelte `style:` directive, allowing consumers to control sizing through their own stylesheets while the component guarantees the proportional constraint.

## Implementation Notes

- Pure layout utility -- no ARIA role needed
- Uses `style:aspect-ratio-container` Svelte directive for inline CSS
- `data-aspect-ratio-container` attribute exposed for consumer CSS selectors
- Ratio prop is a number (width/height), e.g., `16/9` evaluates to `1.777...`
- Content is provided through the Svelte 5 `children` Snippet

## Props

- `ratio`: number (default: 1) -- aspect ratio as width/height
- `children`: Snippet (required) -- content to display within the container
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Usage

```svelte
<AspectRatioContainer ratio={16/9}>
  <video src="video.mp4"></video>
</AspectRatioContainer>

<AspectRatioContainer ratio={1}>
  <img src="avatar.jpg" alt="User avatar" />
</AspectRatioContainer>
```

## Keyboard Interactions

- None -- this component is a passive layout container

## ARIA

- None -- transparent layout container; content within maintains its own accessibility semantics
