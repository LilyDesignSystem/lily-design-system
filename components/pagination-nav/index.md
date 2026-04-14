# Pagination Nav

A pagination nav is a navigation container for page navigation links, allowing users to move between pages of content such as search results, product listings, or data tables. It renders as a `<nav>` element with an `aria-label`, providing a navigation landmark that can be identified by assistive technologies. The component contains a PaginationList with PaginationListItem children for individual page links.

## Implementation Notes

- Renders as a `<nav>` element to create a navigation landmark for pagination controls
- The `label` prop sets `aria-label` to distinguish this navigation region from other `<nav>` elements on the page
- Consumer provides a PaginationList with PaginationListItem children inside the nav
- Spreads `...restProps` onto the `<nav>` element for consumer customization
- No internal state -- purely a structural wrapper providing the navigation landmark

## Props

- `label`: string (required) -- accessible name for the navigation landmark via `aria-label`
- `children`: slot (required) -- PaginationList with page navigation items
- `...restProps`: any -- additional HTML attributes spread onto the `<nav>` element

## Usage

Previous/next style pagination for a series of related content pages, such as a multi-page health condition guide:

```html
<PaginationNav label="Pagination">
  <PaginationList>
    <PaginationListItem>
      <PaginationLink href="/conditions/diabetes/symptoms" rel="prev">
        Previous: Symptoms
      </PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/conditions/diabetes/treatment" rel="next">
        Next: Treatment
      </PaginationLink>
    </PaginationListItem>
  </PaginationList>
</PaginationNav>
```

Numbered pagination for search results, with `aria-current="page"` on the active page:

```html
<PaginationNav label="Search results pages">
  <PaginationList>
    <PaginationListItem>
      <PaginationLink href="/results?page=1" label="Page 1">1</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=2" label="Page 2" aria-current="page">2</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/results?page=3" label="Page 3">3</PaginationLink>
    </PaginationListItem>
  </PaginationList>
</PaginationNav>
```

## Keyboard Interactions

- Tab: Moves focus between pagination links within the navigation
- Enter: Activates the focused link to navigate to that page

## ARIA

- `<nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the pagination region
- Consumer applies `aria-current="page"` on the link representing the current page

## When to Use

- Use at the bottom of a page when content is split across multiple related pages to help users navigate forwards and backwards
- Use when showing all content on a single page would make it too long to load or read
- Use with ContentsNav at the top of the page as a mini-hub navigation pattern
- Use instead of infinite scroll, which creates problems for keyboard users

## When Not to Use

- Do not use for unrelated pages that are not part of a grouped series -- use standard navigation links instead
- Do not use for navigating through multi-page forms -- use Button ("Continue") with BackLink instead
- Do not use when there is only one page of content -- omit pagination entirely
- Do not use for in-page section navigation -- use ContentsNav instead

## Headless

This headless component provides a `<nav>` element with `aria-label` for navigation landmark identification. The consumer provides all visual styling, including layout, positioning, and responsive behavior of the pagination region.


## Styles

The consumer provides all CSS styling. The component renders with a `.pagination-nav` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<nav>` element with class `pagination-nav`
- Verify <nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the pagination region
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position pagination consistently (typically below the content it paginates) and ensure it is visible without scrolling.
- **Developers**: Use a unique `aria-label` (e.g., "Search results pages") to distinguish this navigation from other `<nav>` landmarks on the page. Nest PaginationList inside.

## Composition

PaginationNav is the outermost component in the pagination compound pattern. It contains PaginationList, which contains PaginationListItem children.

```
PaginationNav (nav) → PaginationList (nav + ul) → PaginationListItem (li)
```

## References

- WAI-ARIA Navigation Role: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Practices - Navigation: https://www.w3.org/WAI/ARIA/apd/patterns/navigation/
