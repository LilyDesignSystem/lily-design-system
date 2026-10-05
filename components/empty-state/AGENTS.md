# EmptyState

## Metadata

- Component: empty-state
- PascalCase: EmptyState
- Description: a container for the nothing-here-yet state of a list, table, search or inbox
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <div>
- CSS class: .empty-state
- Interactive: no

## Key Behaviors

- Plain `<div class="empty-state">`; `role="group"` + `aria-label` only when `label` is given
- Children are consumer-supplied; no icon, no default text
- Not a live region

## ARIA

- `role="group"` and `aria-label={label}` -- only when `label` is provided
- No `aria-live`: use `info-state` (`role="status"`) when the state must be announced

## Keyboard

- None. Any action inside is a native control with its own keyboard behaviour

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (optional) -- accessible name; adds `role="group"`
- `children`: slot -- heading, text and action supplied by the consumer
- `...restProps`: unknown -- additional attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <div> with class="empty-state"
- [ ] Labelled group only when label is given
- [ ] Not a live region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .empty-state in css-style-sheet-template.css
