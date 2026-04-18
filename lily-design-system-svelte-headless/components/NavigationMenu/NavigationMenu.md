# NavigationMenu

A navigation menu provides a semantic `<nav>` landmark with an accessible label, containing navigation links or other interactive elements for site-wide or section-level navigation. It enables screen reader users to quickly locate and jump to the navigation area using landmark navigation, and it clearly communicates the purpose of the enclosed links.

This component is suitable for primary navigation bars, sidebar navigation, footer navigation, breadcrumb wrappers, and any grouped set of navigation links that benefit from landmark semantics.

## Implementation Notes

- Renders a native `<nav>` element, which is automatically recognized as a navigation landmark by screen readers.
- Uses `aria-label` to distinguish this navigation from other `<nav>` elements on the same page (e.g., "Main navigation" vs. "Footer navigation").
- Content is passed via the `children` snippet, allowing any markup structure (links, lists, nested menus).
- Spreads `restProps` onto the `<nav>` for consumer customization.
- No internal state or keyboard handling; relies on native link and focus behavior.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` to distinguish this nav landmark.
- `children`: Snippet (required) -- navigation content to render inside the `<nav>` element.
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element.

## Usage

```svelte
<NavigationMenu label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
</NavigationMenu>
```

```svelte
<NavigationMenu label="Footer navigation">
    <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/contact">Contact Us</a></li>
    </ul>
</NavigationMenu>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation links inside use standard Tab key focus and Enter/Space key activation provided by the browser.

## ARIA

- The `<nav>` element implicitly has `role="navigation"`, making it a navigation landmark.
- `aria-label` -- provides an accessible name to distinguish this navigation from other `<nav>` landmarks on the page.

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
