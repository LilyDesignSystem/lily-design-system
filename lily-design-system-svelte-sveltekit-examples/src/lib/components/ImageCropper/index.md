# ImageCropper

## Overview

A headless container for cropping and resizing an image to a selected region,
typically using mouse, touch, or stylus input to move and resize a crop
rectangle. Renders a <div> with role="application" and an accessible label.
Commonly used in avatar and profile-photo editors, media upload workflows,
document scanning, and content management systems. The consumer provides the
actual cropping implementation (an HTML image with an overlay, a canvas, SVG
resize handles, or a third-party cropping library).

## What it does

A container for cropping and resizing an image to a selected region.

## When to use

- Use when you need a drag-to-frame area for cropping and resizing an image.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ImageCropper label="Crop your profile photo">
  <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible description of the image cropper via aria-label. |
| `children` | Snippet, required | The image and crop overlay surface (image, canvas, SVG, or cropping-library output). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Avatar upload flow -->
<ImageCropper label="Crop your profile photo to a square">
  <img src={previewUrl} alt="Selected photo to crop" />
</ImageCropper>

<!-- Document scan crop region -->
<ImageCropper label="Adjust the crop region around the document">
  <canvas width="600" height="800"></canvas>
</ImageCropper>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ImageCropper from "$lib/components/ImageCropper/ImageCropper.svelte";
</script>

<ImageCropper label="Crop your profile photo">
  <img src="/uploads/photo.jpg" alt="Photo to crop" />
</ImageCropper>
```

## Keyboard

- None — pointer- and keyboard-based crop interactions are handled by the consumer-provided overlay surface.

## Accessibility

- role="application" indicates a complex widget with custom pointer interactions
- aria-label provides an accessible description of the image cropper purpose
- Assistive technologies pass keyboard events through to the application

## Internationalization

- The label prop externalizes the accessible description for localization

## References

- WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application

---

Lily™ and Lily Design System™ are trademarks.
