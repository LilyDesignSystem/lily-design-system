# TaskListItem

## Metadata

- Component: task-list-item
- PascalCase: TaskListItem
- Description: one task item with a checkbox and label
- HTML tag: <li>
- CSS class: .task-list-item
- Interactive: no

## Composition

- Pattern: List/ListItem
- Parent: task-list

## Key Behaviors

- Renders as a semantic `<li>` element for use within a TaskList `<ul>`
- Sets `data-completed` attribute (`"true"` or `"false"`) for consumer CSS hooks
- Defaults `completed` to `false` when not specified
- All task content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- `data-completed` communicates task state for consumer styling hooks

## Keyboard

- None directly -- standard list item with no interactive behavior
- If the item contains interactive elements (checkboxes, links), they handle their own keyboard behavior

## Props

- `completed`: boolean (default: `false`) -- whether the task is completed
- `children`: slot (required) -- task content
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="task-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .task-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/task-list-item.html
- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
