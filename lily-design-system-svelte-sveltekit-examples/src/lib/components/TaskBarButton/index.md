# TaskBarButton

## Overview

A single button item within a TaskBar. Renders as a native <button> element
with type="button" for proper keyboard and screen reader support. The
component avoids unintended form submissions and supports the disabled
attribute for disabling interaction. Content is provided through the
children snippet.

## What it does

One item in a task bar.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<TaskBarButton>New Task</TaskBarButton>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `children` | Snippet, required | Button content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Disabled task bar item -->
<TaskBarButton disabled>Delete</TaskBarButton>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TaskBarButton from "$lib/components/TaskBarButton/TaskBarButton.svelte";
</script>

<TaskBarButton>New Task</TaskBarButton>
```

## Keyboard

- Tab: focus the button
- Enter/Space: activate the button (native behavior)
- Button is skipped in tab order when disabled

## Accessibility

- Implicit button role from the <button> element
- disabled attribute communicates disabled state to assistive technology

## Internationalization

- All text is provided through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/toolbar/
