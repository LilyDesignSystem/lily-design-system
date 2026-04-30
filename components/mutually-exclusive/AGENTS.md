# MutuallyExclusive

## Metadata

- Component: mutually-exclusive
- PascalCase: MutuallyExclusive
- Description: a container ensuring only one option can be selected from a group
- HTML tag: <div>
- CSS class: .mutually-exclusive
- Interactive: yes

## Key Behaviors

- Wraps a group of selectable controls (typically checkboxes) and enforces that only one can be checked at a time
- When the user checks one option, the previously-checked option is unchecked
- Behaves like a radio group but allows the user to *uncheck* the current selection (to leave the group with no selection)
- Renders `role="group"` with an `aria-label` so the constraint is communicated to assistive technology
- Children are passed via the `children` slot; the consumer composes the individual `CheckboxInput` controls

## ARIA

- `role="group"` + `aria-label` identifies the group
- Each child checkbox retains its own native semantics
- Consumers may also use `aria-describedby` to reference an explanation of the constraint

## Keyboard

- Tab moves focus through the child controls
- Space toggles the focused checkbox (native behaviour); the component handler then unchecks any other previously-checked option

## Props

- `label`: string (required) (default: —) — Accessible label for the group
- `value`: string | null (default: null) — Currently selected option's value, or null when none is selected; bindable
- `onChange`: (value: string | null) => void (default: —) — Fired when the selected value changes
- `children`: slot (required) (default: —) — The CheckboxInput controls that make up the group
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="mutually-exclusive"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.mutually-exclusive` in css-style-sheet-template.css
- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
