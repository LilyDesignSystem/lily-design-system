# Grail Layout Bottom Footer

GrailLayoutBottomFooter is a headless container for the bottom footer section of a GrailLayout. It spans the full width of the layout and typically contains copyright, links, or site-wide footer content.

## Implementation Notes

- Renders a `<div>` element for the bottom footer section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the bottom footer section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the full-width bottom footer area.
- Use to contain copyright notices, site-wide links, or legal information.
- Use when the page layout requires a persistent footer spanning the full width below the sidebar and main content.

## When Not to Use

- Do not use outside GrailLayout -- use Footer for standalone page footers.
- Do not use for inline content summaries -- use a Panel or Card instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>
    <Footer />
  </GrailLayoutBottomFooter>
</GrailLayout>
```


## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-bottom-footer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<footer>` element with class `grail-layout-bottom-footer`
- Verify pass-through attributes are applied

## Composition

GrailLayoutBottomFooter is used as a child of GrailLayout. Place a semantic `<footer>` element inside for proper accessibility.

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
