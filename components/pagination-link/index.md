# Pagination Link

A pagination link is a navigational anchor element representing one page link in a pagination trail. It renders as a semantic `<a>` element and is designed to be placed inside a PaginationListItem within a PaginationList and PaginationNav structure.

## Implementation Notes

- Renders as a semantic `<a>` element for pagination navigation
- Designed to be used inside a PaginationListItem
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Usage

Numbered page links with descriptive `label` props for screen readers:

```html
<PaginationNav label="Pagination">
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

Previous/next links with `rel` attributes for a content series:

```html
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
```

## Keyboard Interactions

- Tab: Focus the link
- Enter: Activate the link (browser default)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## When to Use

- Use inside PaginationListItem to create a clickable link to a page in the series
- Use with `rel="prev"` or `rel="next"` to indicate the direction for search engines and assistive technologies
- Use with `aria-current="page"` on the link representing the current page in numbered pagination

## When Not to Use

- Do not use for the current page in content-style pagination -- the current page should be plain text, not a link
- Do not use outside of PaginationListItem -- use ActionLink or a standard anchor for standalone links

## Headless

This component provides a semantic `<a>` element with optional `aria-label` override and zero visual styling. The consumer is responsible for all CSS including link color, underline style, hover effects, active page indicator, and focus indicators.

## Styles

The consumer provides all CSS styling. The component renders with a `.pagination-link` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders an `<a>` element with class `pagination-link`
- Verify `aria-label` is set from the `label` prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style pagination links to be visually distinct and easy to tap on mobile. Highlight the current page link differently from other page links.
- **Developers**: Use the `label` prop to provide descriptive screen reader text (e.g., "Page 3" instead of just "3").

## Composition

PaginationLink follows the Nav / List / ListItem composition pattern:

- **PaginationNav** -- outer `<nav>` container providing the navigation landmark.
- **PaginationList** -- `<ol>` list conveying the ordered page sequence.
- **PaginationListItem** -- individual `<li>` items.
- **PaginationLink** -- `<a>` link inside a list item for navigable pages.

```html
<PaginationNav label="Pagination">
  <PaginationList>
    <PaginationListItem>
      <PaginationLink href="/page/1" label="Page 1">1</PaginationLink>
    </PaginationListItem>
    <PaginationListItem>
      <PaginationLink href="/page/2" label="Page 2">2</PaginationLink>
    </PaginationListItem>
  </PaginationList>
</PaginationNav>
```

## References

- WAI-ARIA Navigation Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html
