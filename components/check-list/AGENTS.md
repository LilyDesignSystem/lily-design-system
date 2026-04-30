# CheckList

## Metadata

- Component: check-list
- PascalCase: CheckList
- Description: an ordered list of check list item components
- HTML tag: <ol>
- CSS class: .check-list
- Interactive: no

## Composition

- Pattern: List/ListItem
- Children: check-list-item

## Key Behaviors

- Renders a semantic `<ul>` element with explicit `role="list"` to ensure list semantics are preserved across screen readers
- Supports an optional `aria-label` for an accessible name describing the checklist purpose
- Consumers provide `<li>` children with checkboxes or other controls
- Spreads `restProps` for consumer customization

## ARIA

- `role="list"` -- explicit list role on the `<ul>` ensures assistive technologies treat it as a list
- `aria-label` -- optional accessible name describing the purpose of the checklist

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- accessible name for the checklist via `aria-label`
- `children`: slot (required) -- list items to render inside the `<ul>`

## Acceptance Criteria

- [ ] Renders <ol> element with class="check-list"
- [ ] Has aria-label attribute
- [ ] Has role="list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .check-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/check-list.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
