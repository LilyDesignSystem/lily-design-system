# BreadcrumbNav

A breadcrumb nav is a navigation landmark that contains a breadcrumb trail showing the user's current location within a site hierarchy. It renders a `<nav>` element with an accessible label and contains a BreadcrumbList which holds BreadcrumbListItem children.

Breadcrumbs help users understand where they are in the site structure and allow quick navigation back to any ancestor page. They are especially useful in sites with deep hierarchies such as e-commerce catalogs, documentation sites, and content management systems.

## Implementation Notes

- Renders a `<nav>` element for the navigation landmark
- Uses `aria-label` to provide an accessible name
- Compound component: contains BreadcrumbList, which contains BreadcrumbListItem children
- Spreads `restProps` onto the `<nav>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the navigation landmark
- `children`: Snippet (required) -- BreadcrumbList element
- `...restProps`: unknown -- additional attributes spread onto the `<nav>`

## Usage

```svelte
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Widget</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

## Keyboard Interactions

- Tab: Focus moves between links in the breadcrumb trail
- Enter: Activates the focused breadcrumb link

## ARIA

- `<nav>` with `aria-label` creates a navigation landmark for the breadcrumb trail

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/breadcrumb/
- HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
