# GrailLayoutTopHeader

## Metadata

- Component: grail-layout-top-header
- PascalCase: GrailLayoutTopHeader
- Description: grail layout top header full width with <header> tag
- HTML tag: <header>
- CSS class: .grail-layout-top-header
- Interactive: no

## Composition

- Pattern: GrailLayout
- Parent: grail-layout

## Key Behaviors

- Renders a `<div>` element for the top header section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- content to render inside the top header section
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

- Native `<header>` element exposes a banner landmark when used as a top-level page header
- Screen readers can navigate to the header via landmark navigation

## Acceptance Criteria

- [ ] Renders <header> element with class="grail-layout-top-header"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grail-layout-top-header in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grail-layout-top-header.html
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
