# BreadcrumbListItem

A breadcrumb list item represents a single step in a breadcrumb navigation trail. It renders as a semantic `<li>` element designed to be placed inside a BreadcrumbList component. The component supports `aria-current="page"` to indicate when the item represents the user's current location in the site hierarchy.

Typically, each breadcrumb list item contains a link for navigable ancestor pages, while the final item (current page) contains plain text and is marked with the `current` prop.

## Implementation Notes

- Renders as a semantic `<li>` element for use inside a BreadcrumbList `<ol>`
- Supports `aria-current="page"` via the `current` prop to indicate the active page
- Content is provided through the children snippet, typically an `<a>` link or plain text
- Passes through all additional HTML attributes via `...restProps`
- Compound component: must be used inside a BreadcrumbList

## Props

- `current`: boolean (default: false) -- whether this item represents the current page
- `children`: Snippet (required) -- breadcrumb content, typically a link or text
- `...restProps`: unknown -- additional attributes spread onto the `<li>`

## Usage

```svelte
<BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
<BreadcrumbListItem current>About</BreadcrumbListItem>
```

## Keyboard Interactions

None directly -- keyboard interaction is handled by the contained links.

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- `aria-current="page"` set when `current` is true, indicating the user's current location

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/breadcrumb/
