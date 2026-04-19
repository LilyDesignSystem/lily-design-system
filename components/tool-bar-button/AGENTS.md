# Tool Bar Button

## Metadata

- Component: tool-bar-button
- PascalCase: ToolBarButton
- Description: one action button in a tool bar
- HTML tag: <button>
- CSS class: .tool-bar-button
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Parent: tool-bar

## ARIA

- Implicit `button` role from the `<button>` element
- `disabled` attribute communicates disabled state to assistive technology

## Keyboard

- Tab: Focus the button (when not inside a ToolBar managing roving focus)
- Enter / Space: Activate the button (browser default)
- Arrow keys: Handled by parent ToolBar for roving focus navigation
- Button is skipped in tab order when `disabled` is true

## Acceptance Criteria

- [ ] Renders <button> element with class="tool-bar-button"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tool-bar-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tool-bar-button.html
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
