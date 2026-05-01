# ToolBarButton

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

## Key Behaviors

- Renders a native `<button>` so it has an implicit `button` role and built-in Enter/Space activation
- Defaults to `type="button"` to avoid accidentally submitting a surrounding form
- When inside a `ToolBar` with roving focus, the parent manages tabindex and arrow-key navigation; standalone, the button picks up native tab focus
- The native `disabled` attribute removes the button from the focus order and prevents activation
- Spreads `restProps` onto the `<button>`

## ARIA

- Implicit `button` role from the `<button>` element
- `disabled` attribute communicates disabled state to assistive technology

## Keyboard

- Tab: Focus the button (when not inside a ToolBar managing roving focus)
- Enter / Space: Activate the button (browser default)
- Arrow keys: Handled by parent ToolBar for roving focus navigation
- Button is skipped in tab order when `disabled` is true

## Props

| Prop           | Type            | Default    | Description                                            |
| -------------- | --------------- | ---------- | ------------------------------------------------------ |
| `disabled`     | `boolean`       | `false`    | Whether the button is disabled                         |
| `children`     | `slot`       | (required) | Button content                                         |
| `...restProps` | HTML attributes |            | Additional attributes passed to the `<button>` element |

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
