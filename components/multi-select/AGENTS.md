# MultiSelect

## Metadata

- Component: multi-select
- PascalCase: MultiSelect
- Description: a native select that lets the user choose several options at once
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <select>
- CSS class: .multi-select
- Interactive: yes

## Key Behaviors

- Renders a native `<select multiple>` with `aria-label`
- `value` is a bindable `string[]`
- `size` sets the visible rows
- Native keyboard only

## ARIA

- `aria-label={label}` -- accessible name; the `<select multiple>` is exposed as a listbox with multiple selection

## Keyboard

- Arrow Up / Arrow Down: moves the active option (native); Shift+Arrow extends the selection (native)
- Ctrl/Cmd+Click and Ctrl/Cmd+Space: toggle one option (native, platform-dependent)
- Native only: no keyboard handling is added

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `value`: string[] (default: `[]`) -- bindable selected values
- `size`: number (optional) -- visible rows
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `children`: slot (required) -- `Option` elements
- `...restProps`: unknown -- additional attributes spread onto the `<select>`

## Acceptance Criteria

- [ ] Renders <select multiple> with class="multi-select"
- [ ] Has aria-label
- [ ] `value` array two-way binds
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .multi-select in css-style-sheet-template.css
