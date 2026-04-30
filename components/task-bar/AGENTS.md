# TaskBar

## Metadata

- Component: task-bar
- PascalCase: TaskBar
- Description: a horizontal bar of task shortcuts or actions
- HTML tag: <div>
- CSS class: .task-bar
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Children: task-bar-button

## Key Behaviors

- Renders as a `<div>` element with `role="toolbar"` to identify it as a toolbar widget
- Accessible name is set via `aria-label` from the required `label` prop
- Content is provided through the children slot, typically TaskBarItem components or buttons
- Does not implement arrow key navigation itself; consumers can add keyboard navigation as needed
- Passes through all additional HTML attributes via `...restProps`
- Uses `slot` for children content

## ARIA

- `role="toolbar"` -- identifies the container as a toolbar widget, grouping related controls
- `aria-label` -- provides the accessible name for the toolbar, set from the `label` prop

## Keyboard

- Tab: Focus moves to the first focusable item within the toolbar (native browser behavior)

## Props

- `label`: string (required) -- accessible name for the toolbar via aria-label
- `children`: slot (required) -- task bar item elements

## Acceptance Criteria

- [ ] Renders <div> element with class="task-bar"
- [ ] Has aria-label attribute
- [ ] Has role="toolbar"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .task-bar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/task-bar.html
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
