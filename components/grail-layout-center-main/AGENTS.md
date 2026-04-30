# GrailLayoutCenterMain

## Metadata

- Component: grail-layout-center-main
- PascalCase: GrailLayoutCenterMain
- Description: grail layout center main content with <main> tag
- HTML tag: <main>
- CSS class: .grail-layout-center-main
- Interactive: no

## Composition

- Pattern: GrailLayout
- Parent: grail-layout

## Key Behaviors

- Renders a `<div>` element for the center main content section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the center main section
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

## Acceptance Criteria

- [ ] Renders <main> element with class="grail-layout-center-main"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grail-layout-center-main in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grail-layout-center-main.html
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
