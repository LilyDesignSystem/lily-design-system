# Breadcrumb Nav

A breadcrumb nav is a navigational component that displays a trail of links representing the user's current location within a site's hierarchy. Breadcrumbs help users understand where they are in the site structure and allow quick navigation back to any ancestor page. They are especially useful in sites with deep hierarchies such as e-commerce catalogs, documentation sites, and content management systems.

BreadcrumbNav is typically a compound component. It provides the parent container structure (a `<nav>`), while individual breadcrumb entries are rendered using the BreadcrumbListItem component. The parent provides the navigation landmark semantics, and each BreadcrumbListItem renders as an `<li>` with optional `aria-current="page"` for the current page.

## Implementation Notes

- Renders a `<nav>` element for the navigation landmark
- `aria-label` on the `<nav>` provides an accessible name (e.g. "Breadcrumb")
- Consumer places BreadcrumbList component and BreadcrumbListItem components as children
- Separator characters (e.g. "/" or ">") between items should be added by the consumer via CSS or text
- The final item typically uses the `current` prop and contains plain text instead of a link
- Spreads `restProps` onto the `<nav>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the navigation landmark
- `children`: slot (required) -- BreadcrumbListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

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

- Tab: Focus moves between links in the breadcrumb trail
- Enter: Activates the focused breadcrumb link

## ARIA

- `<nav>` with `aria-label` creates a navigation landmark for the breadcrumb trail
- `<ol>` conveys the ordered hierarchical relationship of the trail
- `aria-current="page"` on the BreadcrumbListItem for the current page
- Implicit `listitem` role from semantic `<li>` elements

## When to Use

- Use on content pages with a defined hierarchy to show users where they are in the site structure
- Use to let users navigate back or up a level when they cannot find what they need on the current page
- Use on information-heavy sites where users may arrive via search and need orientation

## When Not to Use

- Do not use in transactional journeys or multi-step forms -- breadcrumbs interfere with task completion; use BackLink instead
- Do not use alongside BackLink -- choose one navigation pattern
- Do not use on flat sites with no meaningful hierarchy -- use ContentsNav for in-page navigation instead

## Headless

This component provides a `<nav>` landmark with `aria-label` containing an `<ol>` for ordered hierarchy, with zero visual styling. The consumer is responsible for all CSS including separator characters between items, link styling, current page indicator styling, spacing, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.breadcrumb-nav` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<nav>` element with class `breadcrumb-nav`
- Verify <nav>`with`aria-label` creates a navigation landmark for the breadcrumb trail
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Add visual separators (such as "/" or ">") between breadcrumb items via CSS pseudo-elements. Ensure the current page item is visually distinct from the linked ancestors.
- **Developers**: Always provide a descriptive `label` prop (e.g., "Breadcrumb") for the navigation landmark. The last item should use the `current` prop and contain plain text rather than a link.

## Composition

BreadcrumbNav follows the Nav / List / ListItem composition pattern:

- **BreadcrumbNav** -- outer `<nav>` container providing the navigation landmark and accessible label.
- **BreadcrumbList** -- `<ol>` list conveying the ordered hierarchical relationship.
- **BreadcrumbListItem** -- individual `<li>` items, each containing a link or the current page text.

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
  umb/
