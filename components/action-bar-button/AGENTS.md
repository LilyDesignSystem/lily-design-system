# ActionBarButton

## Metadata

- Component: action-bar-button
- PascalCase: ActionBarButton
- Description: one action button inside an action bar
- HTML tag: <button>
- CSS class: .action-bar-button
- Interactive: yes

## Key Behaviors

- Uses native <button> element for inherent keyboard and accessibility support
- `label` prop is REQUIRED and renders as aria-label
- Defaults to type="button" to prevent accidental form submissions
- Native `disabled` attribute prevents click events automatically
- Children render the visual content (icon and/or text)

## ARIA

- Implicit `button` role from <button>
- `aria-label` is the accessible name (required)
- `aria-disabled` from native `disabled`

## Keyboard

- Tab: Focus the button
- Enter: Activate
- Space: Activate
- (Native <button> behavior)

## Props

- `label`: string (REQUIRED) -- aria-label
- `type`: "button" | "submit" | "reset" (default: "button")
- `disabled`: boolean (default: false)
- `onclick` / `onClick`: callback (optional)
- `children`: slot -- button content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="action-bar-button"
- [ ] aria-label is present and equals the label prop
- [ ] type defaults to "button"
- [ ] disabled attribute applied when disabled is true
- [ ] Click handler fires on Enter, Space, and click
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .action-bar-button in css-style-sheet-template.css
- Adobe Spectrum Action Bar: https://spectrum.adobe.com/page/action-bar/
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
