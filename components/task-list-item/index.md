# Task List Item

A single item within a TaskList. Renders a semantic `<li>` element representing one task, action, or to-do. The `completed` prop controls a `data-completed` attribute for consumer styling, communicating task state to visual presentation.

This component is designed to be placed inside a TaskList `<ul>`. The consumer provides the task content through the children slot, and optionally marks items as completed for progress tracking.

## Implementation Notes

- Renders as a semantic `<li>` element for use within a TaskList `<ul>`
- Sets `data-completed` attribute (`"true"` or `"false"`) for consumer CSS hooks
- Defaults `completed` to `false` when not specified
- All task content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization

## Props

- `completed`: boolean (default: `false`) -- whether the task is completed
- `children`: slot (required) -- task content
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```html
<TaskList label="Today's tasks">
  <TaskListItem completed={true}>Review pull requests</TaskListItem>
  <TaskListItem>Update documentation</TaskListItem>
  <TaskListItem>Deploy to staging</TaskListItem>
</TaskList>
```

With checkboxes for interactive tasks:

```html
<TaskList label="Onboarding checklist">
  <TaskListItem completed={done1}>
    <label><input type="checkbox" checked={done1} /> Create account</label>
  </TaskListItem>
  <TaskListItem completed={done2}>
    <label><input type="checkbox" checked={done2} /> Set up profile</label>
  </TaskListItem>
</TaskList>
```

Consumer CSS example using `data-completed`:

```css
[data-completed="true"] {
  text-decoration: line-through;
  opacity: 0.6;
}
[data-completed="false"] {
  font-weight: normal;
}
```

## Keyboard Interactions

- None directly -- standard list item with no interactive behavior
- If the item contains interactive elements (checkboxes, links), they handle their own keyboard behavior

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- `data-completed` communicates task state for consumer styling hooks

## When to Use

- Use inside a TaskList to represent one task with its status and optional hint
- Use with an `href` to link to the task page when the task can be started
- Use when individual tasks need a `data-completed` attribute for CSS-driven visual state changes

## When Not to Use

- Do not use outside of a TaskList -- it has no standalone meaning as the `<li>` element requires a list parent
- Do not use for simple checkbox items without linked tasks -- use CheckListItem instead

## Headless

This headless component renders a semantic `<li>` element with a `data-completed` attribute for CSS hooks. It provides list item semantics and completion state signaling. The consumer provides all visual styling including completion indicators (strikethrough, opacity), checkboxes, and task content.


## Styles

The consumer provides all CSS styling. The component renders with a `.task-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `task-list-item`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use visual differentiation (e.g., strikethrough, reduced opacity, or a checkmark) for completed tasks so users can quickly distinguish them from pending items.
- **Developers**: Bind the `completed` prop to your task state and use the `data-completed` attribute in CSS selectors for styling (e.g., `[data-completed="true"] { text-decoration: line-through; }`).

## Composition

TaskListItem is designed to be used as a child of TaskList. The TaskList provides the outer `<ul>` container with `role="list"`, and each TaskListItem provides an individual `<li>` with completion tracking.

## References

- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
