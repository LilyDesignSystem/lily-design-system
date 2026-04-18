# PaginationListItem

A pagination list item represents a single entry within a pagination navigation list. It renders as a semantic `<li>` element designed to be placed inside a PaginationList component (which provides the parent `<nav>` and `<ul>` structure). The item typically contains a link or button for a specific page number, previous/next controls, or an ellipsis indicator.

Consumers are responsible for adding `aria-current="page"` on the active page link and any additional ARIA attributes needed on the child elements.

## Implementation Notes

- Renders as a semantic `<li>` element for use inside a PaginationList `<ul>` / `<nav>` structure
- Content is provided through the children snippet, typically a link or button for a page number
- Passes through all additional HTML attributes via `...restProps`
- Uses Svelte 5 `Snippet` for children content

## Props

- `children`: Snippet (required) -- item content, typically a link (e.g., `<a href="/page/2">2</a>`) or button

## Usage

```svelte
<PaginationListItem><a href="/page/1">1</a></PaginationListItem>
```

## Keyboard Interactions

None directly -- keyboard interaction is handled by the contained links or buttons.

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- Consumer should set `aria-current="page"` on the active page link within the item
