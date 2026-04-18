# TaskListItem

A single task item within a task list, rendering a semantic `<li>` element containing a checkbox input and label. Supports checked and disabled states for to-do lists, CheckLists, and task trackers. The checked state is bindable for reactive completion tracking.

## Usage

```svelte
<script lang="ts">
    import TaskListItem from './TaskListItem.svelte';
    let termsAccepted = $state(false);
</script>

<ul aria-label="Today's tasks" role="list">
    <TaskListItem label="Review pull request" />
    <TaskListItem label="Update documentation" checked />
    <TaskListItem label="Deploy to staging" />
</ul>

<!-- Bindable checked state -->
<TaskListItem label="Accept terms" bind:checked={termsAccepted} />
```

## Props

| Prop           | Type            | Default  | Description                              |
| -------------- | --------------- | -------- | ---------------------------------------- |
| `label`        | `string`        | required | The task description text                |
| `checked`      | `boolean`       | `false`  | Whether the task is completed (bindable) |
| `disabled`     | `boolean`       | `false`  | Whether the checkbox is disabled         |
| `...restProps` | HTML attributes | —        | Spread onto the `<li>` element           |

## Data attributes

| Attribute       | Value                | Description                |
| --------------- | -------------------- | -------------------------- |
| `data-checked`  | `"true"` / `"false"` | Reflects checked state     |
| `data-disabled` | `"true"`             | Present only when disabled |

## Keyboard

- **Tab**: moves focus to the checkbox input
- **Space**: toggles the checkbox checked state

## Accessibility

- Native `<input type="checkbox">` provides full accessibility support
- `<label>` wraps the checkbox for click association
- Disabled state communicated via native `disabled` attribute
- Should be placed inside a `<ul>` or `<ol>` for valid HTML

## Styling

Consumer targets `[data-checked="true"]` and `[data-disabled]` for visual differentiation.
