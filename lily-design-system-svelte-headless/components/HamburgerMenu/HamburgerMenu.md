# HamburgerMenu

A hamburger menu is a headless toggle button that reveals or hides a navigation panel. It is commonly used on mobile layouts and compact interfaces to conserve screen space by hiding the primary navigation behind a toggle control.

When activated, the button toggles the visibility of a navigation region containing links, menus, or other navigational content provided by the consumer. The component manages ARIA attributes for accessibility, linking the toggle button to the navigation panel via `aria-controls` and communicating the open/closed state via `aria-expanded`.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<button>` toggle and a conditional navigation region
- The button uses `aria-expanded` and `aria-controls` to communicate state to assistive technologies
- The navigation region uses `role="navigation"` with `aria-label` for landmark identification
- A unique `menuId` is generated using `Math.random()` for the `aria-controls`/`id` link
- Uses Svelte 5 `$bindable()` for two-way binding on the `open` prop
- Navigation content is conditionally rendered with `{#if open}`, removing it from the DOM when closed
- Uses Svelte 5 Snippet for the `children` prop

## Props

- `label`: string (default: "Menu") -- accessible name for the toggle button and the navigation region
- `open`: boolean (default: false) -- bindable boolean controlling whether the navigation panel is visible
- `children`: Snippet (required) -- navigation content rendered when the menu is open
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>` wrapper

## Usage

```svelte
<HamburgerMenu label="Main menu" bind:open>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</HamburgerMenu>
```

```svelte
<HamburgerMenu bind:open={menuOpen}>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/settings">Settings</a></li>
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

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
