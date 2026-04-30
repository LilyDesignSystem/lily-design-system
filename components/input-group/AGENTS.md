# InputGroup

## Metadata

- Component: input-group
- PascalCase: InputGroup
- Description: a group wrapping an input with prefix and suffix addons
- HTML tag: <div>
- CSS class: .input-group
- Interactive: no (focusable controls inside slots manage their own behavior)

## Key Behaviors

- Renders `<div role="group" aria-label={label}>` with optional prefix/suffix spans
- Prefix renders inside `<span class="input-group-prefix">`
- Suffix renders inside `<span class="input-group-suffix">`
- Children render between prefix and suffix
- Inner input still needs its own accessible name

## ARIA

- `role="group"` on wrapper
- `aria-label` when label prop provided
- Inner input continues to require its own name

## Keyboard

- Inner input retains native keyboard behavior
- Focusable controls in slots follow their own keyboard behavior

## Props

- `label`: string (optional) -- aria-label for the group
- `prefix`: slot (optional) -- content before input
- `suffix`: slot (optional) -- content after input
- `children`: slot -- the input
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="input-group" and role="group"
- [ ] aria-label rendered when label prop provided
- [ ] Prefix renders inside <span class="input-group-prefix">
- [ ] Suffix renders inside <span class="input-group-suffix">
- [ ] Children render between prefix and suffix
- [ ] Focus order is prefix → input → suffix
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .input-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/input-group.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
