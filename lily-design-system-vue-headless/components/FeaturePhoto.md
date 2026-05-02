# FeaturePhoto

A responsive feature photo with required alt text and optional caption / credit. Renders a `<figure>` containing an `<img>` plus a `<figcaption>` when caption or credit is supplied.

## Props

- `src`: string (required) — image source URL
- `alt`: string (required) — alt text describing the image (use `""` for decorative photos)
- `loading`: `"lazy" | "eager"` (default `"lazy"`) — image loading strategy
- `width`: number (optional) — intrinsic image width for aspect-ratio reservation
- `height`: number (optional) — intrinsic image height for aspect-ratio reservation

## Slots

- `caption` — caption text
- `credit` — photographer / source credit

## Usage

```vue
<FeaturePhoto src="/sunset.jpg" alt="Sunset over the harbour" :width="1200" :height="800">
  <template #caption>Sunset over the harbour</template>
  <template #credit>Jane Photographer</template>
</FeaturePhoto>
```

For above-the-fold heroes, set `loading="eager"` so the photo isn't deferred.

## References

- HTML img loading attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading
- HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
