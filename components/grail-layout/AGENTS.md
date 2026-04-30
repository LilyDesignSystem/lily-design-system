# GrailLayout

## Metadata

- Component: grail-layout
- PascalCase: GrailLayout
- Description: a responsive web design structure with header, left aside, center main, right aside, footer
- HTML tag: <div>
- CSS class: .grail-layout
- Interactive: no

## Composition

- Pattern: GrailLayout
- Children: grail-layout-top-header, grail-layout-left-aside, grail-layout-center-main, grail-layout-right-aside, grail-layout-bottom-footer

## Key Behaviors

- Renders a `<div>` element as the layout container
- Consumer provides GrailLayoutTopHeader, GrailLayoutLeftAside, GrailLayoutCenterMain, GrailLayoutRightAside, and GrailLayoutBottomFooter children
- Spreads `restProps` onto the div for consumer customization
- No layout styles applied; consumers provide CSS Grid or Flexbox for positioning

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- layout section elements to render inside the container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

### Grail layout pattern: GrailLayout → GrailLayoutTop, GrailLayoutLeft, GrailLayoutCenter, GrailLayoutRight, GrailLayoutBottom

```tsx
<GrailLayout>
  <GrailLayoutTopHeader>…</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>…</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>…</GrailLayoutCenterMain>
  <GrailLayoutRightAside>…</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>…</GrailLayoutBottomFooter>
</GrailLayout>
```

## ARIA

- Renders no implicit landmark — the wrapper is a generic container
- The contained `<header>`, `<aside>`, `<main>`, and `<footer>` elements provide page-level landmarks

## Acceptance Criteria

- [ ] Renders <div> element with class="grail-layout"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grail-layout in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grail-layout.html
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- Holy Grail Layout: https://en.wikipedia.org/wiki/Holy_grail_(web_design)
