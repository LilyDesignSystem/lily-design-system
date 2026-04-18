# CheckListItem

## Overview

A single item within a CheckList. Renders as an <li> containing a
checkbox <input> and a <label> for the item text. Supports checked
and disabled states. Designed for use inside a CheckList <ol>.

## What it does

One check list item component with a checkbox.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<CheckListItem>Task one</CheckListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `checked` | boolean, default false | Whether the checkbox is checked. |
| `disabled` | boolean, default false | Whether the checkbox is disabled. |
| `children` | Snippet, required | The label content for this item. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Checked item -->
<CheckListItem checked>Create account</CheckListItem>

<!-- Disabled item -->
<CheckListItem disabled>Locked step</CheckListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CheckListItem from "$lib/components/CheckListItem/CheckListItem.svelte";
</script>

<CheckListItem>Task one</CheckListItem>
```

## Keyboard

- Space: toggles the checkbox when focused
- Tab: moves focus to the next focusable element

## Accessibility

- Native <input type="checkbox"> provides built-in accessibility
- <label> wraps the checkbox and text for a larger click target
- disabled attribute prevents interaction when set

## Internationalization

- Item text comes through children snippet; no hardcoded strings

## References

- MDN checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
