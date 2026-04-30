# IconButton

## Metadata

- Component: icon-button
- PascalCase: IconButton
- Description: a button containing only an icon with a required accessible label
- HTML tag: <button>
- CSS class: .icon-button
- Interactive: yes

## Key Behaviors

- Uses native `<button>` element for inherent keyboard and accessibility support
- `label` prop is REQUIRED and renders as aria-label
- Defaults to type="button" to prevent accidental form submissions
- `aria-pressed` rendered only when pressed prop is provided (toggle button pattern)
- Native disabled attribute prevents click events automatically
- Children render the icon content (decorative)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-label` is the entire accessible name (required)
- `aria-pressed` for toggle button state (when provided)
- `aria-disabled` from native disabled attribute

## Keyboard

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button
- (All handled natively by `<button>` element)

## Props

- `label`: string (REQUIRED) -- aria-label
- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `pressed`: boolean | undefined (default: undefined) -- toggle state
- `onclick` / `onClick`: callback (optional)
- `children`: slot -- icon content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="icon-button"
- [ ] aria-label is present and equals label prop
- [ ] type defaults to "button"
- [ ] aria-pressed is rendered only when pressed is provided
- [ ] disabled attribute applied when disabled is true
- [ ] Click handler fires on Enter, Space, and click
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .icon-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/icon-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
