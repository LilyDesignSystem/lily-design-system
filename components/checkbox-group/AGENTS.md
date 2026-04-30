# CheckboxGroup

## Metadata

- Component: checkbox-group
- PascalCase: CheckboxGroup
- Description: a group component that manages a collection of checkboxes with shared state
- HTML tag: <div>
- CSS class: .checkbox-group
- Interactive: yes

## Composition

- Pattern: Group
- Children: checkbox-input

## Key Behaviors

- Renders a `<fieldset>` element with `role="group"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides checkbox children (typically `<label>` elements wrapping `<input type="checkbox">`)
- Spreads `restProps` onto the fieldset for consumer customization
- No internal state management; checkbox selection is handled by native checkbox behavior
- Supports a "Select all" pattern where the consumer can add a checkbox that toggles all options, with automatic indeterminate state when some but not all options are selected

## ARIA

- `role="group"` -- identifies the fieldset as a group of related checkboxes
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose
- Native `<fieldset>` `disabled` attribute propagates disabled state to all child inputs

## Keyboard

- Tab: Moves focus between checkboxes within the group (native browser behavior)
- Space: Toggles the focused checkbox checked state (native browser behavior)

## Props

- `label`: string (required) -- accessible label for the checkbox group, applied via `aria-label`
- `children`: slot (required) -- checkbox elements to render inside the fieldset
- `disabled`: boolean (default: false) -- disables the entire group via the fieldset `disabled` attribute
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="checkbox-group"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .checkbox-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/checkbox-group.html
- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Authoring Practices - Checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
