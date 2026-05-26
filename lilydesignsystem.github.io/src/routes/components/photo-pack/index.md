# Photo Pack

A photo pack is a collection of photos displayed together as a group. Use it for editorial photo essays, before/after comparisons, and event coverage galleries where multiple photos share a common theme.

This headless component uses a `<div>` element with `role="group"` and `aria-label` to create a semantically grouped collection of FeaturePhoto components.

## Implementation Notes

- Uses `<div>` element with `role="group"` for group semantics
- `aria-label` describes the photo collection for screen readers
- Groups multiple FeaturePhoto components together
- Consumer controls layout (grid, masonry, row) via CSS
- Consumer controls all visual presentation via CSS
- Inspired by Reuters Graphics PhotoPack component

## Props

- `label`: string (required) -- accessible label for the photo collection
- `children`: slot (required) -- FeaturePhoto components
- `...restProps`: Any additional HTML attributes

## Usage

```html
<PhotoPack label="Construction progress photos, March 2026">
  <FeaturePhoto src="/photo1.jpg" alt="Foundation work" />
  <FeaturePhoto src="/photo2.jpg" alt="Steel framework" />
  <FeaturePhoto src="/photo3.jpg" alt="Exterior cladding" />
</PhotoPack>
```

```html
<PhotoPack label="Before and after renovation">
  <FeaturePhoto
    src="/before.jpg"
    alt="Dilapidated ward with peeling paint and outdated equipment"
  >
    <span slot="caption">Before: Ward 7 in 2024</span>
  </FeaturePhoto>
  <FeaturePhoto
    src="/after.jpg"
    alt="Renovated ward with modern beds and bright lighting"
  >
    <span slot="caption">After: Ward 7 reopened in 2026</span>
  </FeaturePhoto>
</PhotoPack>
```

```html
<PhotoPack label="Staff award ceremony highlights">
  <FeaturePhoto src="/award1.jpg" alt="Dr. Patel receiving the innovation award" />
  <FeaturePhoto src="/award2.jpg" alt="Nursing team group photo on stage" />
  <FeaturePhoto src="/award3.jpg" alt="Chief executive addressing the audience" />
  <FeaturePhoto src="/award4.jpg" alt="Award recipients with certificates" />
</PhotoPack>
```

## Keyboard Interactions

- None -- child FeaturePhoto components are not interactive

## ARIA

- `role="group"` -- identifies the collection as a semantic group
- `aria-label` -- describes the photo collection for screen readers

## When to Use

- Use for editorial photo essays with multiple related photographs
- Use for before/after comparisons where photos are viewed together
- Use for event coverage galleries where photos share a common theme

## When Not to Use

- Do not use for scrollable galleries -- use a scrollable container with FeaturePhoto
- Do not use for single images -- use FeaturePhoto
- Do not use for image thumbnails in a selection interface -- use a grid of interactive elements

## Headless

This component provides a `<div>` element with `role="group"` and `aria-label` for semantic grouping, with zero visual styling. The consumer is responsible for all CSS including grid layout, gap spacing, masonry layout, responsive columns, and any container sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.photo-pack` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `photo-pack`
- Verify `role="group"` is applied
- Verify `aria-label` is applied
- Verify child content slot is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider consistent aspect ratios across photos in a pack. Plan responsive layouts that work from single-column mobile to multi-column desktop. Ensure captions remain readable at all sizes.
- **Developers**: Always provide a descriptive `label` prop that explains the collection theme. Use CSS Grid or Flexbox for layout. Consider lazy loading on individual FeaturePhoto components for performance.

## Related components

- `image` — an image element with alt text
- `carousel` — a slideshow for cycling through content items

## References

- Reuters Graphics PhotoPack component
- [WAI-ARIA group role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/group_role)
