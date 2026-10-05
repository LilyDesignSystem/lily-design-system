# MultiSelectWithExtras

## Metadata

- Component: multi-select-with-extras
- PascalCase: MultiSelectWithExtras
- Description: a multiple-choice select with content before and after it
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <div>
- CSS class: .multi-select-with-extras
- Interactive: yes

## Key Behaviors

- Wrapper `<div>` with optional `before` and `after` slots around a native `<select multiple>`
- `aria-label` on the select; `restProps` on the wrapper
- `value` is a bindable `string[]`

## ARIA

- `aria-label={label}` -- on the `<select multiple>`, provides its accessible name

## Keyboard

- Native select keyboard behaviour only: Arrow keys move, Shift+Arrow extends selection, Tab moves focus
- Interactive content in `before` / `after` has its own native keyboard behaviour

## Props

- `className`: string (default: `""`) -- CSS class on the wrapper
- `label`: string (required) -- accessible name for the select
- `value`: string[] (default: `[]`) -- bindable selected values
- `size`: number (optional) -- visible rows
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `children`: slot (required) -- `Option` elements
- `before`: slot (optional) -- content before the select
- `after`: slot (optional) -- content after the select
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Acceptance Criteria

- [ ] Renders <div> wrapper with class="multi-select-with-extras" around a <select multiple>
- [ ] aria-label on the select
- [ ] before/after rendered only when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .multi-select-with-extras in css-style-sheet-template.css
