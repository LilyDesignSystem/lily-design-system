# ImageCropper

A container for cropping and resizing an image to a selected region.

## Canonical documentation

See [components/image-cropper/index.md](../../../components/image-cropper/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/image-cropper/macro.njk" import imageCropper %}

{% call imageCropper({ label: "Crop your profile photo" }) %}
  <img src="photo.jpg" alt="Photo to crop">
{% endcall %}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
