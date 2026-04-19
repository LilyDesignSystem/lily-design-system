# TaskListItem

## Overview

A single task item within a task list, rendering a semantic <li> element
containing a checkbox input and label. Supports checked and disabled states,
making it suitable for to-do lists, CheckLists, and task trackers. The
checked state is bindable so consumers can reactively track completion.

## What it does

One task item with a checkbox and label.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<TaskListItem label="Buy groceries" />
<TaskListItem label="Clean house" checked />
<TaskListItem label="Archived task" checked disabled />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | The task description displayed as the checkbox label. |
| `checked` | boolean, default false, bindable | Whether the task is completed. |
| `disabled` | boolean, default false | Whether the checkbox is disabled. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Simple task list -->
<ul aria-label="Today's tasks" role="list">
  <TaskListItem label="Review pull request" />
  <TaskListItem label="Update documentation" checked />
  <TaskListItem label="Deploy to staging" />
</ul>

<!-- Bindable checked state -->
<TaskListItem label="Accept terms" bind:checked={termsAccepted} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TaskListItem from "$lib/components/TaskListItem/TaskListItem.svelte";
</script>

<TaskListItem label="Buy groceries" />
<TaskListItem label="Clean house" checked />
<TaskListItem label="Archived task" checked disabled />
```

## Keyboard

- Tab: moves focus to the checkbox input
- Space: toggles the checkbox checked state

## Accessibility

- Semantic <li> element provides list item semantics within the parent list
- Native <input type="checkbox"> provides full accessibility support
- <label> element is associated with the checkbox via wrapping
- aria-checked reflects the current state for assistive technology
- Disabled state communicated via the native disabled attribute

## Internationalization

- The label prop externalizes the task description for translation
- No hardcoded strings in the component

## References

- MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- WAI checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
