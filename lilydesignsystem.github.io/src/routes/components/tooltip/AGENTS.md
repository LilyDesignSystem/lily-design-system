# Tooltip

## Metadata

- Component: tooltip
- PascalCase: Tooltip
- Description: a small popup showing descriptive text on hover or focus
- HTML tag: <div>
- CSS class: .tooltip
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="tooltip"` when visible, removed from the DOM when hidden
- Uses conditional rendering, so the tooltip is fully removed from the DOM when not shown
- Supports two-way binding on the `visible` prop
- The consumer is responsible for managing visibility (e.g., on hover/focus of a trigger element)
- The `id` prop enables linking the tooltip to its trigger element via `aria-describedby`
- Spreads `restProps` onto the div element for consumer extensibility

## ARIA

- `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip

## Keyboard

- Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- The tooltip itself does not receive focus; it is a supplementary description for another element

## Props

- `label`: string (required) -- the tooltip text content
- `visible`: boolean (default: false) -- bindable boolean controlling whether the tooltip is shown
- `id`: string (default: undefined) -- optional id for linking to a trigger element via `aria-describedby`
- `...restProps`: unknown -- additional attributes spread onto the tooltip div

## Acceptance Criteria

- [ ] Renders <div> element with class="tooltip"
- [ ] Has role="tooltip"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tooltip in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tooltip.html
- WAI-ARIA Tooltip Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- MDN aria-describedby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby
