# Grail Layout Bottom Footer

GrailLayoutBottomFooter is a headless container for the bottom footer section of a GrailLayout. It spans the full width of the layout and typically contains copyright, links, or site-wide footer content.

## Implementation Notes

- Renders a `<footer>` element for the bottom footer section
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


## Keyboard Interactions

- No keyboard interactions — this is a passive landmark container
- Focusable descendants follow native tab order

## ARIA

- Native `<footer>` exposes a `contentinfo` landmark when used as the top-level page footer so screen readers can navigate to it via landmark navigation
- Implicit `contentinfo` role from the `<footer>` element when used as a top-level landmark

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-bottom-footer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<footer>` element with class `grail-layout-bottom-footer`
- Verify pass-through attributes are applied

## Composition

GrailLayoutBottomFooter is used as a child of GrailLayout. Place a semantic `<footer>` element inside for proper accessibility.

## Related components

- `grail-layout` — a responsive web design structure with header, left aside, center main, right aside, footer
- `grail-layout-center-main` — grail layout center main content with <main> tag
- `grail-layout-left-aside` — grail layout left aside sidebar with <aside> tag
- `grail-layout-right-aside` — grail layout right aside sidebar with <aside> tag
- `grail-layout-top-header` — grail layout top header full width with <header> tag

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

---

Lily™ and Lily Design System™ are trademarks.
