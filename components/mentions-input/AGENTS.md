# MentionsInput

## Metadata

- Component: mentions-input
- PascalCase: MentionsInput
- Description: a text input with at-mention autocomplete suggestions
- HTML tag: <div>
- CSS class: .mentions-input
- Interactive: yes

## Key Behaviors

- Renders <div class="mentions-input" data-trigger-char={triggerChar}> container
- Inner <input class="mentions-input-control" type="text" role="combobox"> with ARIA attrs
- Suggestions <div class="mentions-input-suggestions"> toggled with hidden attribute
- label prop is REQUIRED and applied as aria-label on the input
- triggerChar defaults to "@"
- disabled disables the input
- Consumer supplies listbox markup as children

## ARIA

- Input has role="combobox", aria-haspopup="listbox", aria-expanded, aria-autocomplete="list"
- aria-label is the input's accessible name (required)
- Consumer listbox uses role="listbox" with role="option" children

## Keyboard

- Tab: Focus the input
- Trigger character: Consumer opens suggestions
- Arrow Down / Up: Consumer moves active suggestion
- Enter: Consumer commits active suggestion
- Escape: Consumer closes suggestions panel

## Props

- `label`: string (REQUIRED)
- `value`: string (default: "")
- `triggerChar`: string (default: "@")
- `expanded`: boolean (default: false)
- `placeholder`: string (optional)
- `disabled`: boolean (default: false)
- `oninput` / `onInput`: callback (optional)
- `children`: slot — suggestions content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div class="mentions-input"> with data-trigger-char
- [ ] Inner <input> has class="mentions-input-control" and type="text"
- [ ] Input has role="combobox", aria-haspopup="listbox", aria-autocomplete="list"
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] Suggestions panel is hidden when expanded is false
- [ ] disabled attribute is applied to the input when disabled is true
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .mentions-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/mentions-input.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Mentions: https://ant.design/components/mentions
