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
- `children`: ReactNode (required) -- list items, typically ContentsNavItem components or `<li>` elements with links
- `...restProps`: any additional HTML attributes spread onto the `<nav>` element

## Scrollspy

Set `spy` to mark the table-of-contents link for the section in view. The links are your own `<a href="#id">` elements.

```tsx
<ContentsNav label="On this page" spy offset={64} onActiveChange={(id) => console.log(id)}>
  <ContentsList>
    <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
    <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

Props: `spy`, `offset` (px, default 0), `root` (element, default the viewport), `current` (default `"true"`), `onActiveChange(id)`.

- **Which section is current:** the last one whose top has passed the activation line (`offset` px below the top of the
  scroller). At the bottom of the page the last section is current; above the first section, the first is.
- **What is set:** `aria-current` (default `"true"`) and `data-active` on that link, and `data-descendant-active` on each
  enclosing `<li>`. Style the highlight with more than colour (WCAG 1.4.1). There is no live region: scrolling announces nothing.
- **Clicks:** the clicked link becomes current at once and stays so until the scroll settles (`scrollend`, or 1 s).
- **Not done for you:** smooth scrolling (CSS `scroll-behavior` inside `prefers-reduced-motion: no-preference`), a fixed
  header's offset (`scroll-margin-top` on the targets plus the same `offset`), moving focus, and updating the URL.

## Usage

```tsx
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
