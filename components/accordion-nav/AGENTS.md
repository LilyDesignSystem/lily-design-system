# AccordionNav

## Metadata

- Component: accordion-nav
- PascalCase: AccordionNav
- Description: an accordion navigation area for collapsible accordion information
- HTML tag: <nav>
- CSS class: .accordion-nav
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Children: accordion-list, accordion-list-item

## ARIA

- `role="region"` -- identifies the accordion as a landmark region
- `aria-label` -- provides an accessible name for the region, allowing screen readers to announce it

## Props

| Prop           | Type            | Default    | Description                                               |
| -------------- | --------------- | ---------- | --------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name for the accordion region via `aria-label` |
| `children`     | `slot`       | (required) | Accordion content to render inside the container          |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the outer `<div>`       |

## Acceptance Criteria

- [ ] Renders <nav> element with class="accordion-nav"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .accordion-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/accordion-nav.html
- WAI-ARIA Accordion Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
