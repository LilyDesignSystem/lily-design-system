# GrailLayout

GrailLayout is a headless container that provides the classic "holy grail" web design structure with five sections: a full-width top header, a left sidebar, a center content area, a right sidebar, and a full-width bottom footer.

## Implementation Notes

- Renders a `<div>` element as the layout container
- Consumer provides GrailLayoutTopHeader, GrailLayoutLeftAside, GrailLayoutCenterMain, GrailLayoutRightAside, and GrailLayoutBottomFooter children
- Uses Svelte 5 `$props()` with TypeScript typing for all props
- No layout styles applied; consumers provide CSS Grid or Flexbox

## Props

- `children`: Snippet (required) -- layout section elements to render
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<GrailLayout>
  <GrailLayoutTopHeader>Header</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>Left sidebar</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>Main content</GrailLayoutCenterMain>
  <GrailLayoutRightAside>Right sidebar</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>Footer</GrailLayoutBottomFooter>
</GrailLayout>
```

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
