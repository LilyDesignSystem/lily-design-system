# GrailLayoutBottomFooter

## Metadata

- Component: grail-layout-bottom-footer
- PascalCase: GrailLayoutBottomFooter
- Description: grail layout bottom footer full width with <footer> tag
- HTML tag: <footer>
- CSS class: .grail-layout-bottom-footer
- Interactive: no

## Composition

- Pattern: GrailLayout
- Parent: grail-layout

## Key Behaviors

- Renders a `<footer>` landmark element for the bottom footer section
- Spreads `restProps` onto the `<footer>` element for consumer customization
- No styles applied; consumer provides all styling

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- content to render inside the bottom footer section
- `...restProps`: unknown -- additional attributes spread onto the `<footer>` element

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

- Native `<footer>` element exposes a contentinfo landmark when used as a top-level page footer
- Screen readers can navigate to the footer via landmark navigation

## Acceptance Criteria

- [ ] Renders <footer> element with class="grail-layout-bottom-footer"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .grail-layout-bottom-footer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/grail-layout-bottom-footer.html
- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
