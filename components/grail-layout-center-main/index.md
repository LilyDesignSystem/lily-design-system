# Grail Layout Center Main

GrailLayoutCenterMain is a headless container for the center main content section of a GrailLayout. It holds the primary page content and is flanked by the left and right aside sections.

## Implementation Notes

- Renders a `<main>` element for the center main content section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the center main section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the primary content area.
- Use to hold the main page content that is flanked by the left and right aside sections.
- Use for the central focus of the page such as patient records, dashboards, or article content.

## When Not to Use

- Do not use outside GrailLayout -- use a `<main>` element directly.
- Do not use for sidebar content -- use GrailLayoutLeftAside or GrailLayoutRightAside instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>
    <h1>Patient Dashboard</h1>
    <p>Main content area with patient records, charts, and clinical notes.</p>
  </GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```


## Keyboard Interactions

- No keyboard interactions — this is a passive landmark container
- Focusable descendants follow native tab order

## ARIA

- Native `<main>` exposes a `main` landmark; there should be only one per page
- Implicit `main` role from the `<main>` element when used as a top-level landmark

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-center-main` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<main>` element with class `grail-layout-center-main`
- Verify pass-through attributes are applied

## Composition

GrailLayoutCenterMain is used as a child of GrailLayout. Place a semantic `<main>` element inside for proper accessibility.

## Related components

- `grail-layout` — a responsive web design structure with header, left aside, center main, right aside, footer
- `grail-layout-bottom-footer` — grail layout bottom footer full width with <footer> tag
- `grail-layout-left-aside` — grail layout left aside sidebar with <aside> tag
- `grail-layout-right-aside` — grail layout right aside sidebar with <aside> tag
- `grail-layout-top-header` — grail layout top header full width with <header> tag

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

---

Lily™ and Lily Design System™ are trademarks.
