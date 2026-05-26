# GrailLayoutLeftAside

## Metadata

- Component: grail-layout-left-aside
- PascalCase: GrailLayoutLeftAside
- Description: grail layout left aside sidebar with <aside> tag
- HTML tag: <aside>
- CSS class: .grail-layout-left-aside
- Interactive: no

## Composition

- Pattern: GrailLayout
- Parent: grail-layout

## Key Behaviors

- Renders a `<div>` element for the left aside section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- content to render inside the left aside
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

- Native `<aside>` element exposes a complementary landmark
- Consumers should add `aria-label` (or `aria-labelledby`) to distinguish from other asides on the page

## Acceptance Criteria

- [ ] Renders <aside> element with class="grail-layout-left-aside"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grail-layout-left-aside in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grail-layout-left-aside.html
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
