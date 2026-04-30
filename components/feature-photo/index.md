# Feature Photo

A feature photo is a responsive photo with lazy loading and alt text validation. Use it for editorial and feature photographs that need captions and photographer credits.

This headless component uses a `<figure>` element with `<img>` and optional `<figcaption>` to create a semantic photo wrapper with required alt text and native lazy loading.

## Implementation Notes

- Uses `<figure>` element with `<img>` and optional `<figcaption>`
- Native lazy loading via `loading="lazy"` attribute by default
- Alt text is required; implementation should warn when missing
- Caption and credit displayed in `<figcaption>`
- Width and height attributes prevent layout shift (CLS)
- Consumer controls all visual presentation via CSS
- Inspired by Reuters Graphics FeaturePhoto component

## Props

- `src`: string (required) -- image source URL
- `alt`: string (required) -- alt text describing the image
- `caption`: slot (optional) -- photo caption
- `credit`: slot (optional) -- photographer/source credit
- `loading`: "lazy" | "eager" (default: "lazy") -- image loading strategy
- `width`: number (optional) -- intrinsic image width for aspect ratio
- `height`: number (optional) -- intrinsic image height for aspect ratio
- `...restProps`: Any additional HTML attributes

## Usage

```html
<FeaturePhoto
  src="/images/city-skyline.jpg"
  alt="Downtown skyline at sunset with construction cranes visible"
  width={1200}
  height={800}
>
  <span slot="caption">The changing skyline of downtown</span>
  <span slot="credit">Photo: Jane Smith / Reuters</span>
</FeaturePhoto>
```

```html
<FeaturePhoto
  src="/images/nurse-ward.jpg"
  alt="Nurse checking patient vitals on a hospital ward"
  width={1600}
  height={1067}
>
  <span slot="caption">Frontline care during winter pressures</span>
  <span slot="credit">Photo: NHS England</span>
</FeaturePhoto>
```

```html
<FeaturePhoto
  src="/images/parliament.jpg"
  alt="Houses of Parliament viewed from across the Thames at dusk"
  loading="eager"
/>
```

## Keyboard Interactions

- None -- the photo is not interactive

## ARIA

- Implicit `figure` role from `<figure>` element
- `alt` on `<img>` -- provides text alternative for screen readers
- `<figcaption>` -- provides visible caption and credit text

## When to Use

- Use for editorial and feature photographs with captions and credits
- Use when photos need structured semantic markup with accessible alt text
- Use when lazy loading is needed for performance on image-heavy pages

## When Not to Use

- Do not use for decorative images -- use plain `<img>` with empty alt
- Do not use for charts or graphics -- use GraphicBlock
- Do not use for user avatars -- use Avatar

## Headless

This component provides a `<figure>` element with `<img>` and optional `<figcaption>` for semantic structure, with zero visual styling. The consumer is responsible for all CSS including image sizing, aspect ratio, caption typography, credit styling, responsive behavior, and object-fit settings.

## Styles

The consumer provides all CSS styling. The component renders with a `.feature-photo` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<figure>` element with class `feature-photo`
- Verify `<img>` has required `alt` attribute
- Verify `<img>` has `loading="lazy"` by default
- Verify `width` and `height` attributes are applied to `<img>` when provided
- Verify caption and credit slots render inside `<figcaption>` when provided
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure photos have sufficient contrast and are not relied upon as the sole source of information. Consider aspect ratios across breakpoints. Provide clear guidance on caption and credit placement.
- **Developers**: Always provide meaningful alt text that describes the image content. Set width and height attributes to prevent cumulative layout shift. Use `loading="eager"` only for above-the-fold images.

## Related components

- `image` — an image element with alt text
- `feature-card` — a large content card with a prominent image positioned alongside or above the text
- `hero` — a large box or image with a title and description

## References

- Reuters Graphics FeaturePhoto component
- [HTML img loading attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading)
- [HTML figure element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
- [Cumulative Layout Shift](https://web.dev/cls/)
