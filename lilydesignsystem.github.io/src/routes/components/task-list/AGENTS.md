# TaskList

## Metadata

- Component: task-list
- PascalCase: TaskList
- Description: an ordered list of task list items
- HTML tag: <ol>
- CSS class: .task-list
- Interactive: no

## Composition

- Pattern: List/ListItem
- Children: task-list-item

## Key Behaviors

- Renders as `<ul role="list" aria-label={label}>` for task list semantics
- Explicit `role="list"` ensures list semantics when CSS removes default styling
- All task content provided through children slot (should be `<li>` elements)
- Consumers can use checkboxes within `<li>` for completable tasks
- No hardcoded strings; all text content comes through props and children

## ARIA

- `role="list"` explicitly marks as a list
- `aria-label` provides accessible name for the list
- Screen readers announce the list with its label and item count

## Keyboard

- None directly -- standard list navigation by screen readers
- Tab moves focus between interactive elements (checkboxes, links) within task items

## Props

- `label`: string (required) -- accessible label via aria-label
- `children`: slot -- task items (should be `<li>` elements)
- `...restProps`: Any additional HTML attributes spread onto the `<ul>`

## Acceptance Criteria

- [ ] Renders <ol> element with class="task-list"
- [ ] Has aria-label attribute
- [ ] Has role="list"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .task-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/task-list.html
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
