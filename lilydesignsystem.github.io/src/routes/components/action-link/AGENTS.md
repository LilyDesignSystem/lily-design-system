# ActionLink

## Metadata

- Component: action-link
- PascalCase: ActionLink
- Description: a hyperlink styled as an action trigger
- HTML tag: <a>
- CSS class: .action-link
- Interactive: yes

## Key Behaviors

- Renders as a simple semantic `<a>` element
- Supports `aria-label` override via the `label` prop for when the visible link text is insufficient for screen readers
- Uses `slot` for children content (text, mixed content, etc.)
- Passes through all additional HTML anchor attributes via `...restProps`
- No hardcoded user-facing strings; all text comes through children and props

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for screen reader text when the visible link text does not fully convey the action

## Keyboard

- Tab: Focus the link (native browser behavior)
- Enter: Activate the link (native browser behavior)

## Props

- `href`: string (required) -- the URL the link points to
- `label`: string (optional) -- accessible label override for screen readers via aria-label
- `children`: slot (required) -- the link content (text or mixed content)

## Acceptance Criteria

- [ ] Renders <a> element with class="action-link"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .action-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/action-link.html
- Inspired by NHS England action link pattern
- WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link
