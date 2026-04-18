# CheckList

## Overview

A headless semantic list container for CheckList items. Renders a <ul> with
role="list" for tracking and managing tasks, options, or steps. Consumers
provide <li> children with checkboxes or other interactive controls. Commonly
used in to-do lists, onboarding flows, forms, and progress tracking interfaces.

## What it does

An ordered list of check list item components.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CheckList label="Tasks">
  <CheckListItem>Task one</CheckListItem>
</CheckList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, optional | Accessible name for the CheckList via aria-label. |
| `children` | Snippet, required | List items to render inside the <ul>. |
| `...restProps` | additional HTML attributes spread onto the <ul> |  |

## Examples

```svelte
<!-- Onboarding CheckList -->
<CheckList label="Onboarding tasks">
  <CheckListItem checked>Create account</CheckListItem>
  <CheckListItem>Set up profile</CheckListItem>
  <CheckListItem>Invite team members</CheckListItem>
</CheckList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CheckList from "$lib/components/CheckList/CheckList.svelte";
</script>

<CheckList label="Tasks">
  <CheckListItem>Task one</CheckListItem>
</CheckList>
```

## Keyboard

- None — this is a passive container. Keyboard interactions are determined
- by the consumer-provided child elements (e.g., checkboxes respond to Space).

## Accessibility

- role="list" ensures assistive technologies treat it as a list
- aria-label provides an optional accessible name for the CheckList

## Internationalization

- Label text comes through the label prop; no hardcoded strings
- Item content is provided by the consumer

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/listbox/
