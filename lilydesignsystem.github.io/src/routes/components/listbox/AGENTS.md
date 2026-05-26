# Listbox

## Metadata

- Component: listbox
- PascalCase: Listbox
- Description: a list of selectable options with keyboard navigation
- HTML tag: <div>
- CSS class: .listbox
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="listbox"` and an accessible label.
- Uses reactive state to track the `listRef` element reference for querying child options.
- Keyboard navigation queries all child elements with `[role='option']` to build the navigable item list.
- Arrow keys wrap around: pressing ArrowDown on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last option respectively.
- Spreads `restProps` onto the container for consumer customization.

## ARIA

- `role="listbox"` -- identifies the container as a listbox widget for selecting from a list of options.
- `aria-label` -- provides an accessible name describing the purpose of the listbox.
- Child elements should use `role="option"` and optionally `aria-selected` to indicate selection state.

## Keyboard

- ArrowDown: Moves focus to the next option, wrapping to the first option from the last.
- ArrowUp: Moves focus to the previous option, wrapping to the last option from the first.
- Home: Moves focus to the first option.
- End: Moves focus to the last option.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- option elements to render inside the listbox (should have `role="option"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Acceptance Criteria

- [ ] Renders <div> element with class="listbox"
- [ ] Has aria-label attribute
- [ ] Has role="listbox"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .listbox in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/listbox.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
