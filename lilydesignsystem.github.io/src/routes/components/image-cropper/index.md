# Image Cropper

An image cropper provides a headless container for cropping and resizing an image to a selected region, typically using mouse, touch, or stylus input to move and resize a crop rectangle. Commonly used in avatar and profile-photo editors, media upload workflows, document scanning, and content management systems, the image cropper brings the familiar drag-to-frame experience to digital interfaces.

The component serves as a semantic container that consumers populate with their preferred cropping implementation, whether an HTML image with an overlay, a canvas, SVG resize handles, or a third-party cropping library. It uses `role="application"` to support complex pointer interactions, along with an accessible label describing the cropping purpose.

## Implementation Notes

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction
- Requires an `aria-label` describing the cropping purpose for accessibility
- Consumers provide the actual image and crop overlay UI (image, canvas, SVG handles, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the image cropper via `aria-label`
- `children`: slot (required) -- the image and crop overlay surface (image, canvas, SVG, or cropping-library output)

## Usage

Basic image cropper with an image and overlay:

```html
<ImageCropper label="Crop your profile photo">
  <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
```

Image cropper in an avatar upload flow:

```html
<Form label="Update profile photo" onsubmit={handleUpload}>
  <Field label="Profile photo" required>
    <ImageCropper label="Crop your profile photo to a square">
      <img src={previewUrl} alt="Selected photo to crop" id="avatar-crop" />
    </ImageCropper>
  </Field>
  <div class="actions">
    <Button type="button" onclick={resetCrop}>Reset</Button>
    <Button type="submit">Save photo</Button>
  </div>
</Form>
```

Image cropper for a document scan:

```html
<ImageCropper label="Adjust the crop region around the document">
  <canvas width="600" height="800" id="scan-crop"></canvas>
</ImageCropper>
<p>Drag the corners to frame the document before saving.</p>
```

## Keyboard Interactions

None are baked in -- this component is a passive container. Pointer- and keyboard-based crop interactions are handled by the consumer-provided overlay surface.

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the image cropper purpose

## When to Use

- Use when a user must frame, crop, or resize an image before saving or uploading it, such as avatar editors and media workflows.
- Use when a fixed aspect ratio or focal region needs to be selected from a larger image.
- Use in content management and document-scanning flows where a region of an image must be isolated.
- Use when a drag-to-frame experience is more intuitive than numeric crop inputs.

## When Not to Use

- Do not use for simply selecting and previewing a file -- use ImageFileInput.
- Do not use for capturing a handwritten signature -- use SignaturePad.
- Do not use for displaying an image without editing -- use Image.
- Do not use for picking a colour from an image -- use ColorPicker.

## Headless

This headless component provides a semantic container with `role="application"` and `aria-label` for complex pointer interactions. The consumer provides the actual image, crop overlay, resize handles, and cropping logic (HTML/canvas/SVG or a third-party library) as children, along with all visual styling, gesture handling, and the resulting cropped-image output.

## Styles

The consumer provides all CSS styling. The component renders with an `.image-cropper` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `image-cropper`
- Verify `role="application"` is present
- Verify the `aria-label` attribute reflects the `label` prop
- Verify pass-through attributes are applied to the root

## Advice

- **Designers**: Show a clear crop boundary, dimmed overlay outside the selection, and visible resize handles. Communicate any fixed aspect ratio and provide reset and zoom controls alongside the cropper.
- **Developers**: Emit the cropped result as a canvas, blob, or data URL. Offer keyboard-accessible controls for moving and resizing the crop region, and respect the source image's intrinsic dimensions when exporting.

## Related components

- `image-file-input` — an input for selecting image files with preview
- `image` — an image element with alt text
- `signature-pad` — a drawing area for capturing a handwritten signature
- `field` — a form field wrapper with label, input, and error message

## References

- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
- Origin UI Angular — Cropper: https://www.originui-ng.com/
- MDN Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
