# Cascader

## Metadata

- Component: cascader
- PascalCase: Cascader
- Description: a multi-level dropdown for selecting a value from a hierarchy
- HTML tag: <div>
- CSS class: .cascader
- Interactive: yes

## Key Behaviors

- Renders <div role="combobox" aria-haspopup="tree" aria-expanded aria-label> as container
- Trigger is a native <button class="cascader-trigger" type="button"> showing value or placeholder
- Panel is a <div class="cascader-panel"> toggled with the hidden attribute
- label prop is REQUIRED and sets aria-label on the combobox container
- disabled disables the trigger button
- Children populate the panel content

## ARIA

- role="combobox" on the container
- aria-haspopup="tree"
- aria-expanded reflects the expanded prop
- aria-label is the accessible name (required)

## Keyboard

- Tab: Focus the trigger
- Enter / Space: Toggle the panel (consumer handler)
- Arrow keys: Consumer-provided tree navigation
- Escape: Consumer-provided close + restore focus

## Props

- `label`: string (REQUIRED) -- aria-label
- `expanded`: boolean (default: false)
- `disabled`: boolean (default: false)
- `placeholder`: string (optional)
- `value`: string (optional)
- `onclick` / `onClick`: callback (optional)
- `children`: slot — panel content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="cascader"
- [ ] role="combobox" and aria-haspopup="tree" are present
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] Trigger button has type="button" and respects disabled
- [ ] Panel is hidden when expanded is false
- [ ] Children render inside the panel
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cascader in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/cascader.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Cascader: https://ant.design/components/cascader
