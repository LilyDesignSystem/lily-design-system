# ImageCropper

A container for cropping and resizing an image to a selected region.

See `components/image-cropper/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `image-cropper`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ImageCropper Label="...">
    Content
</ImageCropper>
```
