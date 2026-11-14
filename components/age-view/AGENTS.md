# AgeView

## Metadata

- Component: age-view
- PascalCase: AgeView
- Description: a read-only display of a person's age, in the units suited to it
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .age-view
- Interactive: no

## Key Behaviors

- Renders `<span class="age-view">` with the consumer's words
- `duration` is the same age as an ISO 8601 duration, rendered as `data-duration`
- Writes no words for units: the consumer formats `ageParts()` with `Intl.DurationFormat` or its own labels

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the age as the consumer writes it
- `duration`: string (optional) — the same age as an ISO 8601 duration, rendered as `data-duration`
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> with class="age-view"
- [x] The words and `data-duration` render
- [x] `ageParts()` returns the right units at every band boundary (shared tests)
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .age-view in css-style-sheet-template.css
- Intl.DurationFormat: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat
- Spec: spec/healthcare-ui/index.md
