# TaskBarButton

## Metadata

- Component: task-bar-button
- PascalCase: TaskBarButton
- Description: one item in a task bar
- HTML tag: <button>
- CSS class: .task-bar-button
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Parent: task-bar

## Key Behaviors

- Renders as a `<button type="button">` element for native button semantics
- Supports a `disabled` prop to disable the button
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`
- Designed to be placed inside a TaskBar container

## ARIA

- Implicit `button` role from the `<button>` element
- `disabled` attribute communicates disabled state to assistive technology

## Keyboard

- Tab: Focus the button
- Enter / Space: Activate the button (browser default)
- Button is skipped in tab order when `disabled` is true

## Props

- `disabled`: boolean (default: false) -- whether the button is disabled
- `children`: slot (required) -- button content
- `...restProps`: Any additional HTML attributes passed to the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="task-bar-button"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .task-bar-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/task-bar-button.html
