# Navigation Menu

A navigation menu provides a semantic `<nav>` landmark with an accessible label, containing navigation links or other interactive elements for site-wide or section-level navigation. It enables screen reader users to quickly locate and jump to the navigation area using landmark navigation, and it clearly communicates the purpose of the enclosed links.

This component is suitable for primary navigation bars, sidebar navigation, footer navigation, breadcrumb wrappers, and any grouped set of navigation links that benefit from landmark semantics.

## Implementation Notes

- Renders a native `<nav>` element, which is automatically recognized as a navigation landmark by screen readers.
- Uses `aria-label` to distinguish this navigation from other `<nav>` elements on the same page (e.g., "Main navigation" vs. "Footer navigation").
- Content is passed via the `children` slot, allowing any markup structure (links, lists, nested menus).
- Spreads `restProps` onto the `<nav>` for consumer customization.
- No internal state or keyboard handling; relies on native link and focus behavior.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` to distinguish this nav landmark.
- `children`: slot (required) -- navigation content to render inside the `<nav>` element.
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element.

## Usage

Primary site navigation with main section links:

```html
<NavigationMenu label="Main navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</NavigationMenu>
```

Footer navigation with legal and support links:

```html
<NavigationMenu label="Footer navigation">
    <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/contact">Contact Us</a></li>
    </ul>
</NavigationMenu>
```

Sidebar section navigation:

```html
<NavigationMenu label="Documentation sections">
    <ul>
        <li><a href="/docs/getting-started">Getting Started</a></li>
        <li><a href="/docs/components">Components</a></li>
        <li><a href="/docs/api">API Reference</a></li>
    </ul>
</NavigationMenu>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation links inside use standard Tab key focus and Enter/Space key activation provided by the browser.

## ARIA

- The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.

## When to Use

- Use for site-wide navigation with links to main sections.
- Use as the primary navigation component wrapping a group of navigation links.
- Use when screen reader users need to quickly locate and jump to a navigation region via landmark navigation.
- Use for footer navigation, sidebar navigation, or breadcrumb wrappers.
- Use when a semantic `<nav>` landmark is needed to group related links.

## When Not to Use

- Do not use for action menus -- use Menu or DropdownMenu instead.
- Do not use for hierarchical tree navigation -- use TreeNav instead.
- Do not use for command palettes -- use Command instead.

## Headless

This headless component provides a native `<nav>` element with `aria-label` for landmark identification, automatically recognized by assistive technologies. The consumer provides all visual styling, including link layout, responsive behavior, hover states, and active indicators.


## Styles

The consumer provides all CSS styling. The component renders with a `.navigation-menu` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<nav>` element with class `navigation-menu`
- Verify The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- Verify aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.
- Verify pass-through attributes are applied

## Advice

- **Designers**: Highlight the current page link in the navigation to orient users, and ensure the navigation is responsive across screen sizes.
- **Developers**: Use distinct `aria-label` values when multiple `<nav>` elements exist on the same page (e.g., "Main navigation" vs. "Footer navigation") so screen reader users can distinguish them.

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
