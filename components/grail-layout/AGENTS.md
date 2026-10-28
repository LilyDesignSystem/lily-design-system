# GrailLayout

## Metadata

- Component: grail-layout
- PascalCase: GrailLayout
- Description: a responsive web design structure with header, left aside, center main, right aside, footer
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

## Collapse contract

As the window narrows, regions give up width in a fixed priority. The reference themes implement it; a consumer's CSS should do the same.

1. **Right aside first.** At `lg` (64rem) it drops below `main` and spans the full width.
2. **Left aside second.** At `md` (48rem) the layout is one column: header, left aside, main, right aside, footer.
3. **Header, main and footer never collapse.** `main` is always visible.

- **Source order is visual order.** The pattern's source order is header, left aside, main, right aside, footer, and every step stacks regions in exactly that order. Never reorder visually only (`order`, or `grid-template-areas` that differ from source order within a row), because reading order and tab order must equal what is seen (WCAG 1.3.2 Meaningful Sequence, 2.4.3 Focus Order). A consumer who wants `main` before the left aside on a phone puts `main` first in the source, and accepts that on a wide screen the reading order then differs from the left-to-right order.
- **Nothing is hidden.** A collapsed region is stacked, not `display: none`, so its content stays reachable by keyboard and screen reader. Offering a "show/hide" disclosure for an aside is the consumer's choice, not the default.
- **Viewport queries, not container queries.** The `grail-layout` root is not a container (only its regions are), and it is a page shell, which answers to the window ([AGENTS/responsive.md](../../AGENTS/responsive.md)).

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
