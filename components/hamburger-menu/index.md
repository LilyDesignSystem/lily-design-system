# Hamburger Menu

A hamburger menu is a headless toggle button that reveals or hides a navigation panel. It is commonly used on mobile layouts and compact interfaces to conserve screen space by hiding the primary navigation behind a toggle control.

When activated, the button toggles the visibility of a navigation region containing links, menus, or other navigational content provided by the consumer. The component manages ARIA attributes for accessibility, linking the toggle button to the navigation panel via `aria-controls` and communicating the open/closed state via `aria-expanded`.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional navigation region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The navigation region uses `role="navigation"` with `aria-label` for landmark identification
- A unique `menuId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Supports two-way binding on the `open` prop
- Navigation content is conditionally rendered with conditional rendering, removing it from the DOM when closed
- Uses slot for the `children` prop

## Props

- `label`: string (default: "Menu") -- accessible name for the toggle button and the navigation region
- `open`: boolean (default: false) -- bindable boolean controlling whether the navigation panel is visible
- `children`: slot (required) -- navigation content rendered when the menu is open
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Usage

Mobile navigation with site links:

```html
<HamburgerMenu label="Main menu" open={menuOpen}>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</HamburgerMenu>
```

Dashboard navigation hidden behind hamburger toggle:

```html
<HamburgerMenu label="Dashboard menu" open={navOpen}>
    <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/logout">Log out</a></li>
    </ul>
</HamburgerMenu>
```

## Keyboard Interactions

- Enter: Toggles the menu open/closed when the button has focus (native button behavior)
- Space: Toggles the menu open/closed when the button has focus (native button behavior)
- Tab: Moves focus to/from the toggle button and into the navigation content when open

## ARIA

- `aria-label={label}` -- on the button, provides an accessible name for the toggle control
- `aria-expanded={open}` -- on the button, indicates whether the navigation panel is currently visible
- `aria-controls={menuId}` -- on the button, references the id of the navigation panel
- `role="navigation"` -- on the content container, identifies it as a navigation landmark
- `aria-label={label}` -- on the navigation container, provides an accessible name for the landmark

## When to Use

- Use as a toggle button that opens mobile navigation.
- Use when screen space is limited and the navigation panel should be hidden by default.
- Use on mobile layouts and compact interfaces to conserve screen space.
- Use for responsive designs where navigation collapses at smaller breakpoints.

## When Not to Use

- Do not use on desktop where there is space for full navigation -- use NavigationMenu or Header with navigation instead.
- Do not use for action menus -- use DropdownMenu or Menu instead.
- Do not use for content disclosure -- use Collapsible or Details instead.

## Headless

This headless component provides a `<button>` with `aria-expanded`, `aria-controls`, and a conditional navigation region with `role="navigation"`. The consumer provides all visual styling including the hamburger icon, animation, panel positioning, and overlay effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.hamburger-menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `hamburger-menu`
- Verify aria-label={label}` -- on the button, provides an accessible name for the toggle control
- Verify role="navigation"` -- on the content container, identifies it as a navigation landmark
- Verify aria-label={label}` -- on the navigation container, provides an accessible name for the landmark
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a universally recognized three-line (hamburger) icon. Animate the icon to an X when open to indicate the toggle state.
- **Developers**: Use two-way binding on `open` to synchronize menu state. Ensure the navigation content receives focus when opened for keyboard accessibility.

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
