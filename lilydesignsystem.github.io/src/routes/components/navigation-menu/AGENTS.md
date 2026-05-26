# NavigationMenu

## Metadata

- Component: navigation-menu
- PascalCase: NavigationMenu
- Description: a site-wide navigation menu with links
- HTML tag: <nav>
- CSS class: .navigation-menu
- Interactive: no

## Key Behaviors

- Renders a native `<nav>` element, which is automatically recognized as a navigation landmark by screen readers.
- Uses `aria-label` to distinguish this navigation from other `<nav>` elements on the same page (e.g., "Main navigation" vs. "Footer navigation").
- Content is passed via the `children` slot, allowing any markup structure (links, lists, nested menus).
- Spreads `restProps` onto the `<nav>` for consumer customization.
- No internal state or keyboard handling; relies on native link and focus behavior.

## ARIA

- The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name applied via `aria-label` to distinguish this nav landmark.
- `children`: slot (required) -- navigation content to render inside the `<nav>` element.
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element.

## Acceptance Criteria

- [ ] Renders <nav> element with class="navigation-menu"
- [ ] Has aria-label attribute
- [ ] Has role="navigation"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .navigation-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/navigation-menu.html
- WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
