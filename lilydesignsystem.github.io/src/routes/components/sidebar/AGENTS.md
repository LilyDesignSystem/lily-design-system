# Sidebar

## Metadata

- Component: sidebar
- PascalCase: Sidebar
- Description: a side panel for navigation or supplementary content
- HTML tag: <aside>
- CSS class: .sidebar
- Interactive: no

## Key Behaviors

- Renders an `<aside>` element, which has an implicit `complementary` landmark role
- The `aria-label` attribute provides an accessible name to distinguish this sidebar from other landmarks
- Spreads `restProps` onto the aside for consumer customization
- No internal state management; this is a purely structural component

## ARIA

- Implicit `complementary` role via the `<aside>` element -- identifies the container as a complementary landmark
- `aria-label={label}` -- provides an accessible name so screen readers can distinguish this sidebar from other landmarks on the page

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible label for the sidebar region, applied via `aria-label`
- `children`: slot (required) -- content to render inside the sidebar
- `...restProps`: unknown -- additional attributes spread onto the `<aside>` element

## Acceptance Criteria

- [ ] Renders <aside> element with class="sidebar"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sidebar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/sidebar.html
- WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- HTML `<aside>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
