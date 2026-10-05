# KbdShortcut

## Metadata

- Component: kbd-shortcut
- PascalCase: KbdShortcut
- Description: a multi-key keyboard shortcut shown as a row of key caps
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <kbd>
- CSS class: .kbd-shortcut
- Interactive: no

## Key Behaviors

- Outer `<kbd>` + one inner `<kbd>` per key
- Decorative `aria-hidden` separators between keys
- Optional `label` spoken form

## ARIA

- Separators are `aria-hidden="true"` so they are not read
- `aria-label={label}` -- optional spoken form on the root

## Keyboard

- None. KbdShortcut is a passive display element

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `keys`: string[] (required) -- the key names, in order
- `separator`: string (default: `"+"`) -- decorative separator between keys
- `label`: string (optional) -- spoken form, applied as `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <kbd> with class="kbd-shortcut"
- [ ] One kbd-shortcut-key per key; separators between only
- [ ] Separators are aria-hidden
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kbd-shortcut in css-style-sheet-template.css
