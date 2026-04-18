# TaskList

A task list is a UI/UX component that organizes and displays a series of tasks,
actions, or to-dos for users to complete. It is typically presented as a
CheckList, where each task can be marked as completed or remain pending. Task
lists are commonly used in project management tools, to-do apps, or onboarding
processes to guide users through a sequence of actions. They help improve
productivity by breaking down complex workflows into manageable steps, offering
clear progress tracking. Effective task list design includes features like task
prioritization, due dates, and visual indicators (such as checkboxes or progress
bars) to enhance user clarity and motivation.

This component renders as an ordered list (`<ol>`) with `role="list"` and an
accessible label. The explicit `role="list"` ensures screen readers announce the
list semantics even when CSS removes default list styling. The consumer provides
task items as `<li>` children through the children snippet.

## Implementation Notes

- Renders as `<ul role="list" aria-label={label}>` for task list semantics
- Explicit `role="list"` ensures list semantics when CSS removes default styling
- All task content provided through children snippet (should be `<li>` elements)
- Consumers can use checkboxes within `<li>` for completable tasks
- No hardcoded strings; all text content comes through props and children

## Props

- `label`: string (required) -- accessible label via aria-label
- `children`: Snippet -- task items (should be `<li>` elements)
- `...restProps`: Any additional HTML attributes spread onto the `<ul>`

## Usage

```svelte
<script>
  import TaskList from "./TaskList.svelte";
</script>

<TaskList label="Today's tasks">
  <li>Review pull requests</li>
  <li>Update documentation</li>
  <li>Deploy to staging</li>
</TaskList>
```

With checkboxes for completable tasks:

```svelte
<TaskList label="Onboarding CheckList">
  <li>
    <label>
      <input type="checkbox" /> Create account
    </label>
  </li>
  <li>
    <label>
      <input type="checkbox" /> Set up profile
    </label>
  </li>
  <li>
    <label>
      <input type="checkbox" /> Complete tutorial
    </label>
  </li>
</TaskList>
```

## Keyboard Interactions

- None directly -- standard list navigation by screen readers
- Tab moves focus between interactive elements (checkboxes, links) within task items

## ARIA

- `role="list"` explicitly marks as a list
- `aria-label` provides accessible name for the list
- Screen readers announce the list with its label and item count

## References

- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
