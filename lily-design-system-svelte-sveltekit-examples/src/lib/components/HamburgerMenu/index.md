# HamburgerMenu

## Overview

A hamburger menu toggle button that reveals or hides a navigation panel. Commonly
used on mobile layouts and compact interfaces to conserve screen space by hiding
the primary navigation behind a toggle control. Manages ARIA attributes linking the
toggle button to the navigation panel via aria-controls and aria-expanded.

## What it does

A toggle button that opens a mobile navigation menu.

## When to use

- Use when offering a list of commands or options from a trigger.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<HamburgerMenu label="Main menu" bind:open>{children}</HamburgerMenu>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default "Menu" | Accessible name for the toggle button and navigation region. |
| `open` | boolean, default false | Bindable boolean controlling whether the navigation panel is visible. |
| `children` | Snippet, required | Navigation content rendered when the menu is open. |
| `...restProps` | additional HTML attributes spread onto the outer div wrapper |  |

## Examples

```svelte
<!-- Basic hamburger menu with navigation links -->
<HamburgerMenu label="Main menu" bind:open>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</HamburgerMenu>

<!-- Hamburger menu with external open state -->
<HamburgerMenu bind:open={menuOpen}>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/settings">Settings</a></li>
  </ul>
</HamburgerMenu>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import HamburgerMenu from "$lib/components/HamburgerMenu/HamburgerMenu.svelte";
</script>

<HamburgerMenu label="Main menu" bind:open>{children}</HamburgerMenu>
```

## Keyboard

- Enter: Toggles the menu open/closed when the button has focus
- Space: Toggles the menu open/closed when the button has focus
- Tab: Moves focus to/from the toggle button and into the navigation content when open

## Accessibility

- aria-label on the button provides an accessible name for the toggle control
- aria-expanded on the button indicates whether the navigation panel is visible
- aria-controls on the button references the id of the navigation panel
- role="navigation" on the content container identifies it as a navigation landmark
- aria-label on the navigation container provides an accessible name for the landmark

## Internationalization

- The label prop allows localized accessible names; default "Menu" should be overridden for non-English locales
- All content comes through the children snippet

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
