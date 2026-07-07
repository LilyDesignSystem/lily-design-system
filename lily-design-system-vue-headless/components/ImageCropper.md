# ImageCropper

An image cropper provides a headless container for cropping and resizing an image to a selected region, typically using mouse, touch, or stylus input. Commonly used in avatar editors, media upload flows, and document scanning, the image cropper brings the familiar select-and-crop experience to digital interfaces.

The component serves as a semantic container that consumers populate with their preferred cropping implementation, whether an HTML image, canvas, SVG overlay, or a third-party cropping library. It uses `role="application"` to support complex pointer interactions, along with an accessible label describing the cropping purpose.

## Implementation Notes

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction
- Requires an `aria-label` describing the cropping purpose for accessibility
- Consumers provide the actual crop surface (image, canvas, SVG overlay, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the crop region via `aria-label`
- `children`: Snippet (required) -- crop surface (image, canvas, SVG overlay, or other mechanism)

## Usage

```svelte
<ImageCropper label="Crop your profile photo">
  <img src="avatar.jpg" alt="" />
</ImageCropper>
```

## Keyboard Interactions

None -- this component is a passive container. Pointer-based interactions are handled by the consumer-provided crop surface.

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the image cropper purpose

## References

- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
