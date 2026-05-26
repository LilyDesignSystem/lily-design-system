# Tour

## Metadata

- Component: tour
- PascalCase: Tour
- Description: a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.
- HTML tag: <div>
- CSS class: .tour
- Interactive: no

## Composition

- Pattern: Tour/List/ListItem
- Children: tour-list, tour-list-item

## Key Behaviors

- Renders a `<div>` element as the tour container
- Uses `aria-label` for an accessible name describing the tour
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<div>` element for consumer customization
- Children slot contains TourList with TourListItem steps

## ARIA

- `aria-label={label}` -- provides an accessible name for the tour container

## Keyboard

Standard keyboard interactions provided by child components. The Tour container itself is not interactive.

## Props

- `label`: string (required) -- accessible name for the tour via `aria-label`
- `className`: string (default: `""`) -- CSS class name for the container
- `children`: slot (required) -- tour content, typically a TourList
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="tour"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tour in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tour.html
- WAI-ARIA Practices: https://www.w3.org/WAI/ARIA/apg/
