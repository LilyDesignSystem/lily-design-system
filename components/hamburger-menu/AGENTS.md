# HamburgerMenu

## Metadata

- Component: hamburger-menu
- PascalCase: HamburgerMenu
- Description: a toggle button that opens a mobile navigation menu
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .hamburger-menu
- Interactive: yes

## Key Behaviors

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional navigation region; a `<button>` cannot hold the navigation it opens
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

- `label`: string (required) -- accessible name for the toggle button and the navigation region
- `open`: boolean (default: false) -- bindable boolean controlling whether the navigation panel is visible
- `children`: slot (required) -- navigation content rendered when the menu is open
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Native platform

- Decision: hand-rolled because a <summary> must sit inside its <details> directly before the panel, so the toggle cannot live in a header row apart from the nav
- Uses: native <button aria-expanded> + <nav>
- Could use: <details>/<summary>
- Notes: APG disclosure navigation; no overlay or top layer wanted.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="hamburger-menu", holding the <button> and the navigation region
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
