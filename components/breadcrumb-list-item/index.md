# Breadcrumb List Item

A breadcrumb list item represents a single step in a breadcrumb navigation trail. It renders as a semantic `<li>` element designed to be placed inside a BreadcrumbList component (which provides the parent `<nav>` and `<ol>` structure). The component supports `aria-current="page"` to indicate when the item represents the user's current location in the site hierarchy.

Typically, each breadcrumb list item contains a link for navigable ancestor pages, while the final item (current page) contains plain text and is marked with the `current` prop.

## Implementation Notes

- Renders as a semantic `<li>` element for use inside a breadcrumb `<nav>` / `<ol>` structure
- Supports `aria-current="page"` via the `current` prop to indicate the active page in the breadcrumb trail
- Content is provided through the children slot, typically an `<a>` link or plain text
- Passes through all additional HTML attributes via `...restProps`
- Uses `slot` for children content

## Props

- `current`: boolean (default: false) -- whether this item represents the current page in the breadcrumb trail
- `children`: slot (required) -- breadcrumb content, typically a link or text

## Usage

```html
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbListItem>
    <BreadcrumbListItem>
      <BreadcrumbLink href="/health-a-z">Health A to Z</BreadcrumbLink>
    </BreadcrumbListItem>
    <BreadcrumbListItem aria-current="page">
      Diabetes
    </BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

## Keyboard Interactions

None directly -- keyboard interaction is handled by the contained links.

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- `aria-current="page"` -- set when `current` is true, indicating the user's current location in the breadcrumb trail

## When to Use

- Use inside BreadcrumbList to represent one level in the breadcrumb trail
- Use with `aria-current="page"` on the last item to indicate the current page

## When Not to Use

- Do not use outside of BreadcrumbList -- it has no standalone meaning
- Do not include the current page as a link -- the H1 heading already communicates the current page

## Headless

This component provides a semantic `<li>` element with conditional `aria-current="page"` and zero visual styling. The consumer is responsible for all CSS including link styling, separator decorations, current-page visual treatment, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.breadcrumb-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `breadcrumb-list-item`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the current page item differently from linked items (e.g., bold text, no underline) to help users identify where they are in the hierarchy.
- **Developers**: Set the `current` prop to `true` only on the last item in the trail. Use plain text (not a link) for the current page content.

## Composition

BreadcrumbListItem follows the Nav / List / ListItem composition pattern:

- **BreadcrumbNav** -- outer `<nav>` container providing the navigation landmark.
- **BreadcrumbList** -- `<ol>` list conveying the ordered hierarchy.
- **BreadcrumbListItem** -- individual `<li>` items with links or current page text.

```html
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbListItem>
    <BreadcrumbListItem>
      <BreadcrumbLink href="/health-a-z">Health A to Z</BreadcrumbLink>
    </BreadcrumbListItem>
    <BreadcrumbListItem aria-current="page">
      Diabetes
    </BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/breadcrumb/
