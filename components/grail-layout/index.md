# Grail Layout

GrailLayout is a headless container that provides the classic "holy grail" web design structure with five sections: a full-width header, a left aside, a main content area, a right aside, and a full-width footer.

Use GrailLayout as the outermost wrapper for pages that need a header, two sidebars flanking the main content, and a footer. The component renders a semantic `<div>` with no layout styles, allowing consumers to apply CSS Grid, Flexbox, or any layout system.

## Implementation Notes

- Renders a `<div>` element as the layout container
- Consumer provides GrailLayoutTopHeader, GrailLayoutLeftAside, GrailLayoutCenterMain, GrailLayoutRightAside, and GrailLayoutBottomFooter children
- Spreads `restProps` onto the div for consumer customization
- No layout styles applied; consumers provide CSS Grid or Flexbox for positioning

## Props

- `children`: slot (required) -- layout section elements to render inside the container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>
    <Header label="Clinical Portal" />
  </GrailLayoutTopHeader>
  <GrailLayoutLeftAside>
    <TreeNav label="Sections">...</TreeNav>
  </GrailLayoutLeftAside>
  <GrailLayoutCenterMain>
    <h1>Patient Dashboard</h1>
    <p>Main content area</p>
  </GrailLayoutCenterMain>
  <GrailLayoutRightAside>
    <h2>Quick links</h2>
    <ul><li><a href="/help">Help</a></li></ul>
  </GrailLayoutRightAside>
  <GrailLayoutBottomFooter>
    <Footer />
  </GrailLayoutBottomFooter>
</GrailLayout>
```

## Keyboard Interactions

None. This is a structural layout component with no interactive behavior.

## ARIA

No explicit ARIA attributes. Consumers should use semantic landmark elements within each section (e.g., `<header>` in GrailLayoutTopHeader, `<main>` in GrailLayoutCenterMain, `<nav>` or `<aside>` in sidebars, `<footer>` in GrailLayoutBottomFooter).

## When to Use

- Use for a responsive page structure with header, left sidebar, center main content, right sidebar, and footer.
- Use as the primary layout for content-heavy applications such as dashboards, admin panels, or documentation sites.
- Use when the page needs two sidebars flanking the main content area.
- Use for clinical portals or case management tools where navigation and contextual information surround the primary content.

## When Not to Use

- Do not use for simple single-column pages -- use a plain `<main>` element instead.
- Do not use for transactional forms -- keep the layout simple with no sidebars.
- Do not use for landing pages or marketing pages where a full-bleed layout is more appropriate.

## Headless

This headless component provides a `<div>` container with no layout styles. The consumer applies CSS Grid, Flexbox, or any layout system to position the five sections. Each section component (GrailLayoutTopHeader, GrailLayoutLeftAside, GrailLayoutCenterMain, GrailLayoutRightAside, GrailLayoutBottomFooter) renders a simple `<div>` with its own CSS class for targeting.

## Styles

The consumer provides all CSS styling. Common approaches include CSS Grid with named grid areas or Flexbox with wrapping. The component renders with a `.grail-layout` class for targeting.

## Testing

- Verify the component renders a `<div>` element with the `grail-layout` class
- Verify child content renders inside the container
- Verify pass-through attributes are applied to the div

## Advice

- **Designers**: Define clear visual hierarchy between sections. Ensure the layout degrades gracefully on smaller screens by stacking sections vertically.
- **Developers**: Use CSS Grid with `grid-template-areas` for the most readable layout implementation. Consider making sidebars collapsible on mobile viewports.

## Composition

GrailLayout is the container for GrailLayoutTopHeader, GrailLayoutLeftAside, GrailLayoutCenterMain, GrailLayoutRightAside, and GrailLayoutBottomFooter children. Each child section renders a `<div>` with its own CSS class.

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- Holy Grail Layout: https://en.wikipedia.org/wiki/Holy_grail_(web_design)
