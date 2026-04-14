# Accordion Nav

An accordion nav is a navigation container that organizes and displays content in a space-efficient, collapsible format. It consists of vertically stacked sections, each with a clickable header that expands or collapses its associated content. This design helps reduce visual clutter, allowing users to focus on one section at a time while keeping other content hidden until needed. Commonly used in FAQs, filters, or mobile menus, accordions enhance usability by streamlining content access and improving navigation on both desktop and mobile interfaces.

The AccordionNav component serves as the outer wrapper. Place an AccordionList inside it, containing AccordionListItem children for the individual collapsible sections.

## Help

Use AccordionNav as the outermost container for an accordion component. Common scenarios include FAQ sections, settings panels, filter groups, and mobile navigation menus. Pair with AccordionList, AccordionListItem, AccordionSummary, and AccordionDetails.

## Syntax

```html
<AccordionNav label="...">
  <!-- AccordionList with AccordionListItem children -->
</AccordionNav>
```

## Usage

```html
<AccordionNav label="Service categories">
  <AccordionList>
    <AccordionListItem heading="Mental health" expanded>
      <AccordionLink href="/services/anxiety">Anxiety</AccordionLink>
      <AccordionLink href="/services/depression">Depression</AccordionLink>
      <AccordionLink href="/services/stress">Stress management</AccordionLink>
    </AccordionListItem>
    <AccordionListItem heading="Physical health">
      <AccordionLink href="/services/back-pain">Back pain</AccordionLink>
      <AccordionLink href="/services/headaches">Headaches</AccordionLink>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Props

| Prop           | Type            | Default    | Description                                               |
| -------------- | --------------- | ---------- | --------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name for the accordion region via `aria-label` |
| `children`     | `slot`       | (required) | Accordion content to render inside the container          |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the outer `<div>`       |

## Examples

FAQ section:

```html
<AccordionNav label="Frequently asked questions">
  <AccordionList>
    <AccordionListItem summary="What is your return policy?">
      You can return items within 30 days.
    </AccordionListItem>
    <AccordionListItem summary="How do I contact support?">
      Email us at support@example.com.
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are handled by AccordionListItem children.

## ARIA

- `role="region"` -- identifies the accordion as a landmark region
- `aria-label` -- provides an accessible name for the region, allowing screen readers to announce it
## When to Use

- Use as a navigation landmark containing collapsible accordion sections, such as service category menus or grouped resource directories.
- Use when users need to browse and expand categories of navigation links without leaving the current page.
- Use with a descriptive `aria-label` to communicate the navigation purpose to screen reader users.
- Use when the number of navigation links is large enough that showing them all at once would overwhelm the page.
- Use in mobile navigation patterns where vertical space is limited and sections should be collapsed by default.

## When Not to Use

- Do not use for page content that expands and collapses -- use Details or Expander instead.
- Do not use for flat, single-level navigation -- use ContentsNav or BreadcrumbNav instead.
- Do not use for single-level menus triggered by a button -- use NavigationMenu instead.
- Do not use when users need to compare content across sections simultaneously -- use TabBar instead.

## Headless

This component provides a `<nav>` landmark with `role="region"` and `aria-label` for accessibility, with zero visual styling. The consumer is responsible for all CSS including container borders, background colors, spacing, and overall layout. Use the `data-*` attributes or element selectors as styling hooks.


## Styles

The consumer provides all CSS styling. The component renders with a `.accordion-nav` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<nav>` element with class `accordion-nav`
- Verify role="region"` -- identifies the accordion as a landmark region
- Verify aria-label` -- provides an accessible name for the region, allowing screen readers to announce it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the accordion has clear visual boundaries so users can distinguish it from surrounding content. Provide a visible label or heading above the accordion group.
- **Developers**: Always provide a meaningful `label` prop that describes the accordion's purpose for screen reader users navigating by landmarks.

## Composition

AccordionNav follows the Nav / List / ListItem composition pattern:

- **AccordionNav** -- outer `<nav>` container providing the landmark region and accessible label.
- **AccordionList** -- `<ol>` list grouping the collapsible items in order.
- **AccordionListItem** -- individual `<details>` / `<summary>` sections for each expandable item.

```html
<AccordionNav label="FAQ">
  <AccordionList>
    <AccordionListItem summary="Question 1">Answer 1</AccordionListItem>
    <AccordionListItem summary="Question 2">Answer 2</AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## References

- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/accordion/
