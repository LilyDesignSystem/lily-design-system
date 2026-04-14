# Pagination List

A pagination list is a navigation component that divides content into separate pages, allowing users to navigate through large sets of data or information one section at a time. The PaginationList component provides a headless wrapper using the semantic `<nav>` and `<ul>` elements, with an accessible label to identify the navigation purpose.

This component is commonly used in search results, product listings, and data tables where displaying all content at once would be impractical. The consumer provides pagination items (links or buttons) as `<li>` children, and can use `aria-current="page"` to indicate the currently active page.

## Implementation Notes

- Renders a `<nav>` element wrapping a `<ul>` list
- The `<nav>` element uses `aria-label` for identification by assistive technology
- The `label` prop is required to distinguish this navigation from other `<nav>` elements on the page
- Consumer provides `<li>` children containing page links or buttons
- Rest props are spread onto the `<nav>` element
- This is a compound component; see PaginationListItem for individual page items

## Props

- `label`: string (required) -- accessible name for the pagination navigation region via `aria-label`
- `children`: slot (required) -- pagination list items, typically `<li>` elements containing links or buttons
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

## Usage

Numbered pagination list with previous/next controls for search results:

```html
<PaginationNav label="Search results pages">
  <PaginationList>
    <PaginationListItem>
      <PaginationLink href="/results?page=1" rel="prev">Previous</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=1" label="Page 1">1</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=2" label="Page 2" aria-current="page">2</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=3" label="Page 3">3</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=3" rel="next">Next</PaginationLink>
    </PaginationListItem>
  </PaginationList>
</PaginationNav>
```

## Keyboard Interactions

- Tab: Moves focus between pagination links/buttons in the list
- Enter: Activates the focused link or button to navigate to that page

## ARIA

- `<nav aria-label="...">` -- identifies the pagination as a navigation landmark with a descriptive label
- `aria-current="page"` -- consumer applies this to the link representing the current page

## When to Use

- Use inside PaginationNav to contain the ordered list of pagination links
- Use as a semantic list to convey the sequence of pages to assistive technologies
- Use when paginating large data sets such as search results, product listings, or data tables

## When Not to Use

- Do not use outside of a PaginationNav container -- it requires the nav landmark for accessibility
- Do not use for general lists of links -- use ContentsList or a standard list instead

## Headless

This headless component provides a `<nav>` wrapping a `<ul>` with `aria-label` for landmark identification and proper list semantics for pagination items. The consumer provides all visual styling, including page link appearance, active-page highlighting, previous/next button styling, and responsive layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.pagination-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `pagination-list`
- Verify <nav aria-label="...">` -- identifies the pagination as a navigation landmark with a descriptive label
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Highlight the current page clearly and provide previous/next controls. Consider showing ellipsis for large page ranges to keep the pagination compact.
- **Developers**: Apply `aria-current="page"` to the link for the currently active page. Use PaginationListItem for each page entry to maintain consistent markup.

## Composition

PaginationList is part of the PaginationNav compound component. It renders inside PaginationNav and contains PaginationListItem children.

```
PaginationNav → PaginationList (nav + ul) → PaginationListItem (li)
```

## References

- WAI-ARIA Practices - Pagination: https://www.w3.org/WAI/ARIA/apd/patterns/navigation/
- WAI-ARIA navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
