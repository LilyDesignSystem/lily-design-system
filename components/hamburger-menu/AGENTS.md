# HamburgerMenu

## Metadata

- Component: hamburger-menu
- PascalCase: HamburgerMenu
- Description: a toggle button that opens a mobile navigation menu
- HTML tag: <button>
- CSS class: .hamburger-menu
- Interactive: yes

## Key Behaviors

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional navigation region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The navigation region uses `role="navigation"` with `aria-label` for landmark identification
- A unique `menuId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Supports two-way binding on the `open` prop
- Navigation content is conditionally rendered with conditional rendering, removing it from the DOM when closed
- Uses slot for the `children` prop

## ARIA

- `aria-label={label}` -- on the button, provides an accessible name for the toggle control
- `aria-expanded={open}` -- on the button, indicates whether the navigation panel is currently visible
- `aria-controls={menuId}` -- on the button, references the id of the navigation panel
- `role="navigation"` -- on the content container, identifies it as a navigation landmark
- `aria-label={label}` -- on the navigation container, provides an accessible name for the landmark

## Keyboard

- Enter: Toggles the menu open/closed when the button has focus (native button behavior)
- Space: Toggles the menu open/closed when the button has focus (native button behavior)
- Tab: Moves focus to/from the toggle button and into the navigation content when open

## Props

- `label`: string (default: "Menu") -- accessible name for the toggle button and the navigation region
- `open`: boolean (default: false) -- bindable boolean controlling whether the navigation panel is visible
- `children`: slot (required) -- navigation content rendered when the menu is open
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Acceptance Criteria

- [ ] Renders <button> element with class="hamburger-menu"
- [ ] Has aria-label attribute
- [ ] Has role="navigation"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hamburger-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hamburger-menu.html
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
