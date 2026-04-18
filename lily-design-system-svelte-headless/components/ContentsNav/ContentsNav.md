# ContentsNav

A contents list provides a table-of-contents-list navigation with ordered links to page sections. It helps users quickly scan and jump to different parts of a long page, improving navigation and content discoverability.

This component is commonly used at the top of documentation pages, articles, or forms with multiple sections. It renders a semantic `<nav>` landmark with an ordered list, making the hierarchical structure clear to both visual users and assistive technology. Use ContentsNavItem components or `<li>` elements as children.

## Implementation Notes

- Renders a `<nav>` element with `aria-label` for accessible landmark identification
- Contains an `<ol>` (ordered list) to convey the sequential nature of page sections
- Children snippet is rendered inside the ordered list
- Label prop is required for accessibility, distinguishing this navigation from others on the page
- Spreads `restProps` on the outer `<nav>` element
- This is a compound component; use with ContentsNavItem for individual entries

## Props

- `label`: string (required) -- accessible name for the navigation landmark (e.g., "Contents", "On this page")
- `children`: Snippet (required) -- list items, typically ContentsNavItem components or `<li>` elements with links
- `...restProps`: any additional HTML attributes spread onto the `<nav>` element

## Usage

```svelte
<ContentsNav label="Contents">
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#examples">Examples</a></li>
</ContentsNav>
```

## Keyboard Interactions

None -- this component is a passive navigation container. Keyboard navigation is handled natively by the anchor links within list items.

## ARIA

- `aria-label={label}` -- provides an accessible name for the `<nav>` landmark, distinguishing it from other navigation regions on the page

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
