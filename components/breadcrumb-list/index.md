# Breadcrumb List

A breadcrumb nav list is an ordered list of breadcrumb navigation items that form a trail showing the user's current location within a site hierarchy. It renders as an `<ol>` element and is designed to be placed inside a BreadcrumbNav component (which provides the parent `<nav>` landmark). Each item in the list is a BreadcrumbListItem representing one level in the hierarchy.

Breadcrumb trails help users understand where they are in the site structure and allow quick navigation back to any ancestor page. The ordered list conveys the hierarchical relationship between items, with each item representing a progressively deeper level.

## Implementation Notes

- Renders as an `<ol>` element to convey the ordered hierarchical relationship of the breadcrumb trail
- Designed to be used inside a BreadcrumbNav, which provides the `<nav>` landmark and `aria-label`
- Consumer places BreadcrumbListItem components as children
- Separator characters (e.g., "/" or ">") between items should be added by the consumer via CSS or text
- Spreads `...restProps` onto the `<ol>` element for consumer customization

## Props

- `children`: slot (required) -- BreadcrumbListItem components forming the breadcrumb trail
- `...restProps`: any -- additional HTML attributes spread onto the `<ol>` element

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

- `<ol>` conveys the ordered hierarchical relationship of the breadcrumb trail
- Implicit `list` role from the semantic `<ol>` element
- The parent BreadcrumbNav provides the `<nav>` landmark with `aria-label`

## When to Use

- Use inside BreadcrumbNav to provide the ordered list of ancestor pages
- Use as a semantic `<ol>` to convey hierarchical order to assistive technologies

## When Not to Use

- Do not use outside of a BreadcrumbNav container -- it requires the nav landmark for accessibility
- Do not use for non-hierarchical lists -- use ContentsList or CheckList instead

## Headless

This component provides a semantic `<ol>` element for ordered list semantics with zero visual styling. The consumer is responsible for all CSS including list reset styles, horizontal layout (flexbox or inline), separator decorations between items, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.breadcrumb-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `breadcrumb-list`
- Verify The parent BreadcrumbNav provides the `<nav>` landmark with `aria-label
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Lay out breadcrumb items horizontally with clear separators. Ensure the list does not wrap awkwardly on small screens -- consider truncation or a responsive pattern.
- **Developers**: Use CSS to reset default list styling (list-style, padding, margin) and add separator characters between items via `::before` or `::after` pseudo-elements on list items.

## Composition

BreadcrumbList follows the Nav / List / ListItem composition pattern:

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
