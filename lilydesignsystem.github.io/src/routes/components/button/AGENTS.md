# Button

## Metadata

- Component: button
- PascalCase: Button
- Description: a generic clickable button element
- HTML tag: <button>
- CSS class: .button
- Interactive: yes

## Key Behaviors

- Uses native `<button>` element for inherent keyboard and accessibility support
- Defaults to `type="button"` (not "submit") to prevent accidental form submissions
- `aria-pressed` only rendered when `pressed` prop is provided (toggle button pattern)
- `aria-label` provides screen reader override when button text alone is insufficient
- Native disabled attribute prevents click events automatically

## ARIA

- Implicit `button` role from `<button>` element
- `aria-pressed` for toggle button state (when provided)
- `aria-label` for screen reader text override
- `aria-disabled` from native disabled attribute

## Keyboard

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## Props

- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `pressed`: boolean | undefined (default: undefined) -- toggle button state
- `label`: string (optional) -- accessible label override
- `onclick`: callback (optional) -- click handler
- `children`: slot -- button content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="button"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
