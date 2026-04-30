# HoverCard

## Metadata

- Component: hover-card
- PascalCase: HoverCard
- Description: a card that appears on hover over a trigger element
- HTML tag: <div>
- CSS class: .hover-card
- Interactive: no

## Key Behaviors

- Conditionally renders a `<div>` with `role="tooltip"` when `open` is true
- Uses `aria-label` for an accessible name describing the card content
- Supports two-way binding on the `open` prop
- Accepts a `children` slot for flexible card content
- Spreads `restProps` onto the container for consumer customization
- The consumer is responsible for managing hover/focus events on the trigger element to toggle `open`

## ARIA

- `role="tooltip"` -- identifies the hover card as supplementary descriptive content
- `aria-label={label}` -- provides an accessible name describing the hover card content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the hover card via `aria-label`
- `open`: boolean (default: `false`) -- whether the hover card is currently visible; bindable with two-way `open` binding
- `children`: slot (required) -- content to display inside the hover card
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="hover-card"
- [ ] Has aria-label attribute
- [ ] Has role="tooltip"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hover-card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/hover-card.html
- WAI-ARIA tooltip role: https://www.w3.org/TR/wai-aria-1.2/#tooltip
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
