# Grail Layout Top Header

GrailLayoutTopHeader is a headless container for the top header section of a GrailLayout. It spans the full width of the layout and typically contains site branding, navigation, or a top bar.

## Implementation Notes

- Renders a `<header>` element for the top header section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the top header section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the full-width top header area.
- Use to contain site branding, top navigation, or a banner bar.
- Use when the page layout requires a persistent header spanning the full width above the sidebar and main content.

## When Not to Use

- Do not use outside GrailLayout -- use Header for standalone page headers.
- Do not use for inline section headings -- use a semantic `<h1>`-`<h6>` element instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>
    <Header label="Clinical Portal" />
  </GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```


## Keyboard Interactions

- No keyboard interactions — this is a passive landmark container
- Focusable descendants follow native tab order

## ARIA

- Native `<header>` exposes a `banner` landmark when used as the top-level page header so screen readers can navigate to it via landmark navigation
- Implicit `banner` role from the `<header>` element when used as a top-level landmark

## Headless

This headless component renders semantic HTML. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-top-header` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<header>` element with class `grail-layout-top-header`
- Verify pass-through attributes are applied

## Composition

GrailLayoutTopHeader is used as a child of GrailLayout. Place semantic `<header>` or `<nav>` elements inside for proper accessibility.

## Related components

- `grail-layout` — a responsive web design structure with header, left aside, center main, right aside, footer
- `grail-layout-bottom-footer` — grail layout bottom footer full width with <footer> tag
- `grail-layout-center-main` — grail layout center main content with <main> tag
- `grail-layout-left-aside` — grail layout left aside sidebar with <aside> tag
- `grail-layout-right-aside` — grail layout right aside sidebar with <aside> tag

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

---

Lily™ and Lily Design System™ are trademarks.
