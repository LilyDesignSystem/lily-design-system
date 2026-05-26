# CallToAction

## Metadata

- Component: call-to-action
- PascalCase: CallToAction
- Description: a prominent prompt encouraging user action
- HTML tag: <div>
- CSS class: .call-to-action
- Interactive: yes

## Key Behaviors

- Renders as `<a>` when `href` is provided, `<button type="button">` otherwise
- Dual-mode: link for navigation CTAs, button for action CTAs
- `disabled` only applies in button mode (links cannot be disabled natively)
- Optional `aria-label` for screen reader text override when visible text is insufficient
- Content is provided through child elements
- All user-facing text comes through props and children for internationalization

## ARIA

- Implicit `link` role when rendered as `<a>`
- Implicit `button` role when rendered as `<button>`
- Optional `aria-label` -- provides screen reader text when visible text alone is insufficient

## Keyboard

- Tab: Focus the element
- Enter: Activate the link or button
- Space: Activate the button (button mode only; links do not respond to Space)

## Props

- `href`: string (optional) -- if provided, renders as a link
- `label`: string (optional) -- `aria-label` override for screen readers
- `disabled`: boolean (default: false) -- disables the button (button mode only)
- `onclick`: (event: MouseEvent) => void (optional) -- click handler (button mode)
- `children`: slot (required) -- the CTA content
- `...restProps`: Any additional HTML attributes passed to the element

## Acceptance Criteria

- [ ] Renders <div> element with class="call-to-action"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .call-to-action in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/call-to-action.html
