# Task List

A task list is a UI/UX component that organizes and displays a series of tasks,
actions, or to-dos for users to complete. It is typically presented as a
checklist, where each task can be marked as completed or remain pending. Task
lists are commonly used in project management tools, to-do apps, or onboarding
processes to guide users through a sequence of actions. They help improve
productivity by breaking down complex workflows into manageable steps, offering
clear progress tracking. Effective task list design includes features like task
prioritization, due dates, and visual indicators (such as checkboxes or progress
bars) to enhance user clarity and motivation.

This component renders as an unordered list (`<ul>`) with `role="list"` and an
accessible label. The explicit `role="list"` ensures screen readers announce the
list semantics even when CSS removes default list styling. The consumer provides
task items as `<li>` children through the children slot.

## Implementation Notes

- Renders as `<ul role="list" aria-label={label}>` for task list semantics
- Explicit `role="list"` ensures list semantics when CSS removes default styling
- All task content provided through children slot (should be `<li>` elements)
- Consumers can use checkboxes within `<li>` for completable tasks
- No hardcoded strings; all text content comes through props and children

## Props

- `label`: string (required) -- accessible label via aria-label
- `children`: slot -- task items (should be `<li>` elements)
- `...restProps`: Any additional HTML attributes spread onto the `<ul>`

## Usage

```html
<TaskList label="Your health assessment">
  <TaskListItem href="/your-health/exercise" status="completed">
    Exercise
  </TaskListItem>
  <TaskListItem href="/your-health/diet" status="incomplete">
    Diet and nutrition
  </TaskListItem>
  <TaskListItem href="/your-health/family-history" status="incomplete"
    hint="Details of your parents, brothers and sisters">
    Family health history
  </TaskListItem>
  <TaskListItem status="cannot-start-yet">
    Blood test
  </TaskListItem>
</TaskList>
```

## Keyboard Interactions

- None directly -- standard list navigation by screen readers
- Tab moves focus between interactive elements (checkboxes, links) within task items

## ARIA

- `role="list"` explicitly marks as a list
- `aria-label` provides accessible name for the list
- Screen readers announce the list with its label and item count

## When to Use

- Use to show all the tasks a user needs to complete for a lengthy or complex service
- Use when users need to complete tasks across multiple sessions and track their progress
- Use when users should be free to choose the order in which they complete tasks
- Use with status indicators (Completed, Incomplete, Cannot start yet) so users can plan their time

## When Not to Use

- Do not use when the service can be simplified to fewer steps -- simplify before reaching for a task list
- Do not use to display a user's submitted answers -- use SummaryList for the "check your answers" pattern
- Do not use for sequential wizard-style forms -- use multi-page forms with Button and BackLink
- Do not use for simple checklists without linked tasks -- use CheckList instead

## Headless

This headless component renders a `<ul>` with explicit `role="list"` and `aria-label` to ensure list semantics are preserved even when CSS removes default styling. The consumer provides all visual styling including layout, spacing, completion indicators, and any interactive elements within list items.


## Styles

The consumer provides all CSS styling. The component renders with a `.task-list` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<ol>` element with class `task-list`
- Verify role="list"` explicitly marks as a list
- Verify aria-label` provides accessible name for the list
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include clear completion indicators such as checkboxes or strikethrough text. Use visual hierarchy to distinguish completed tasks from pending ones.
- **Developers**: Use TaskListItem children for structured task items with completion state. The explicit `role="list"` ensures screen readers announce item counts even with `list-style: none` CSS.

## Composition

TaskList uses the List/ListItem composition pattern. Place TaskListItem components as children inside TaskList. The TaskList provides the outer `<ul>` container with accessible labeling, while each TaskListItem provides an individual `<li>` with completion state tracking via `data-completed`.

## References

- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
