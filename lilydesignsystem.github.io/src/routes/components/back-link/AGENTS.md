# BackLink

## Metadata

- Component: back-link
- PascalCase: BackLink
- Description: a navigation link to return to a previous page
- HTML tag: <a>
- CSS class: .back-link
- Interactive: yes

## Key Behaviors

- Renders as a semantic `<a>` element for backward navigation
- Same HTML pattern as a standard link but semantically represents "going back"
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## Keyboard

- Tab: Focus the link
- Enter: Activate the link (browser default)

## Props

- `href`: string (required) -- the URL to navigate back to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="back-link"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .back-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/back-link.html
