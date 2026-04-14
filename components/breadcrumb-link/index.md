# Breadcrumb Link

A breadcrumb link is a navigational anchor element representing one step in a breadcrumb trail. It renders as a semantic `<a>` element and is designed to be placed inside a BreadcrumbListItem within a BreadcrumbList and BreadcrumbNav structure.

## Implementation Notes

- Renders as a semantic `<a>` element for breadcrumb navigation
- Designed to be used inside a BreadcrumbListItem
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

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

- Tab: Focus the link
- Enter: Activate the link (browser default)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## When to Use

- Use inside BreadcrumbListItem to create a clickable link to an ancestor page
- Use to provide navigation to parent or grandparent pages in the site hierarchy

## When Not to Use

- Do not use for the current page -- the current page should not be a link in the breadcrumb trail
- Do not use outside of BreadcrumbListItem -- use ActionLink or a standard anchor for standalone links

## Headless

This component provides a semantic `<a>` element with optional `aria-label` override and zero visual styling. The consumer is responsible for all CSS including link color, underline style, hover effects, and focus indicators.

## Styles

The consumer provides all CSS styling. The component renders with a `.breadcrumb-link` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders an `<a>` element with class `breadcrumb-link`
- Verify `aria-label` is set from the `label` prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style breadcrumb links to be visually distinct from the current page text. Use consistent color and underline treatments across all breadcrumb links.
- **Developers**: Use the `label` prop to provide descriptive screen reader text when the visible text is abbreviated.

## Composition

BreadcrumbLink follows the Nav / List / ListItem composition pattern:

- **BreadcrumbNav** -- outer `<nav>` container providing the navigation landmark.
- **BreadcrumbList** -- `<ol>` list conveying the ordered hierarchy.
- **BreadcrumbListItem** -- individual `<li>` items.
- **BreadcrumbLink** -- `<a>` link inside a list item for navigable ancestor pages.

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
