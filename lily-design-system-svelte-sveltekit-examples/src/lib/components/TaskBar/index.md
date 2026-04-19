# TaskBar

## Overview

A headless task bar container using the ARIA toolbar role. It renders a <div>
with role="toolbar" and manages horizontal focus movement between action
buttons via ArrowLeft/ArrowRight keys. Commonly used for quick access to
frequently performed actions such as "New", "Open", "Save", or task-specific
operations.

## What it does

A horizontal bar of task shortcuts or actions.

## When to use

- Use when you need a horizontal bar of task shortcuts or actions.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TaskBar label="Tasks">
  <TaskBarButton>New</TaskBarButton>
</TaskBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the toolbar via aria-label. |
| `children` | Snippet, required | TaskBarButton elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Task bar with action buttons -->
<TaskBar label="Tasks">
  <TaskBarButton>New</TaskBarButton>
  <TaskBarButton>Open</TaskBarButton>
  <TaskBarButton>Save</TaskBarButton>
</TaskBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TaskBar from "$lib/components/TaskBar/TaskBar.svelte";
</script>

<TaskBar label="Tasks">
  <TaskBarButton>New</TaskBarButton>
</TaskBar>
```

## Keyboard

- ArrowRight: move focus to next item, wrapping from last to first
- ArrowLeft: move focus to previous item, wrapping from first to last
- Home: move focus to the first item
- End: move focus to the last item

## Accessibility

- role="toolbar" identifies the container as a toolbar widget
- aria-label provides the accessible name for the toolbar

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
