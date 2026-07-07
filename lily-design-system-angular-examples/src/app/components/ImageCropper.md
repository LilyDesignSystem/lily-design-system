# ImageCropper

a container for cropping and resizing an image to a selected region

This is the Angular headless implementation. See `components/image-cropper/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-image-cropper label="Crop image"></lily-image-cropper>
```

## Files

- `ImageCropper.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `ImageCropper.spec.ts` — vitest + TestBed render test
