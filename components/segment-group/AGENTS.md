# SegmentGroup

## Metadata

- Component: segment-group
- PascalCase: SegmentGroup
- Description: a group of mutually exclusive segment options
- HTML tag: <div>
- CSS class: .segment-group
- Interactive: yes

## Composition

- Pattern: Group/GroupItem
- Children: segment-group-item

## Key Behaviors

- Renders a `<div>` element with `role="radiogroup"` for ARIA semantics
- The `aria-label` attribute provides an accessible name for the group
- Consumer provides segment button children, each with `role="radio"` and `aria-checked`
- Consumer is responsible for managing selection state (toggling `aria-checked` on children)
- Spreads `restProps` onto the div for consumer customization

## ARIA

- `role="radiogroup"` -- identifies the container as a group of mutually exclusive radio-like options
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce its purpose

## Keyboard

- Tab: Moves focus into the segment group
- Arrow Left / Arrow Right: Consumer should implement arrow key navigation between segments (following the radiogroup pattern)
- Space / Enter: Consumer should implement activation of the focused segment

## Props

- `label`: string (required) -- accessible label for the segment group, applied via `aria-label`
- `children`: slot (required) -- segment button elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="segment-group"
- [ ] Has aria-label attribute
- [ ] Has role="radiogroup"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .segment-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/segment-group.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- WAI-ARIA Authoring Practices - Toolbar: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
