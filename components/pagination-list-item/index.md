# Pagination List Item

A pagination list item represents a single entry within a pagination navigation list. It renders as a semantic `<li>` element designed to be placed inside a PaginationList component (which provides the parent `<nav>` and `<ul>` structure). The item typically contains a link or button for a specific page number, previous/next controls, or an ellipsis indicator.

Consumers are responsible for adding `aria-current="page"` on the active page link and any additional ARIA attributes needed on the child elements.

## Implementation Notes

- Renders as a semantic `<li>` element for use inside a PaginationList `<ul>` / `<nav>` structure
- Content is provided through the children slot, typically a link or button for a page number
- Passes through all additional HTML attributes via `...restProps`
- Uses `slot` for children content

## Props

- `children`: slot (required) -- item content, typically a link (e.g., `<a href="/page/2">2</a>`) or button

## Usage

A pagination list item containing a PaginationLink for a numbered page:

```html
<PaginationListItem>
  <PaginationLink href="/results?page=3" label="Page 3">3</PaginationLink>
</PaginationListItem>
```

A pagination list item for a previous/next navigation link:

```html
<PaginationListItem>
  <PaginationLink href="/conditions/diabetes/symptoms" rel="prev">
    Previous: Symptoms
  </PaginationLink>
</PaginationListItem>
```

## Keyboard Interactions

None directly -- keyboard interaction is handled by the contained links or buttons.

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- Consumer should set `aria-current="page"` on the active page link within the item

## When to Use

- Use inside PaginationList to represent one page link in the pagination sequence
- Use for both previous/next links and numbered page links
- Use when each pagination item needs semantic `<li>` structure within the parent list

## When Not to Use

- Do not use outside of PaginationList -- it has no standalone meaning without the parent list structure
- Do not use for non-pagination list items -- use ContentsListItem or BreadcrumbListItem for other navigation patterns

## Headless

This headless component renders a semantic `<li>` element with a children slot for page links or buttons. The consumer provides all visual styling, including link appearance, active-page highlighting, and spacing between items.


## Styles

The consumer provides all CSS styling. The component renders with a `.pagination-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `pagination-list-item`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure each page item has a large enough click/touch target and consistent spacing for easy navigation.
- **Developers**: Place `aria-current="page"` on the link or button within the active page item, not on the `<li>` itself.

## Composition

PaginationListItem is the leaf component in the PaginationNav compound pattern. It is placed inside PaginationList as an `<li>` element.

```
PaginationNav → PaginationList → PaginationListItem (li) → link or button
```
